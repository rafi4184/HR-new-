import { Router } from "express";
import rateLimit from "express-rate-limit";
import { db, ticketOf } from "../db/index.js";
import { requestSchemas, summaryFor, typeLabels } from "../lib/validation.js";
import { serializeRequest } from "../lib/serialize.js";

const router = Router();

const submitLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests submitted from this connection. Please try again later." },
});

const trackLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 40,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many tracking attempts. Please wait a few minutes and try again." },
});

const insertStmt = db.prepare(`
  INSERT INTO requests (ticket, type, summary, name, dob, phone, email, status, fee, service_label, details, created_at, updated_at)
  VALUES (@ticket, @type, @summary, @name, @dob, @phone, @email, 'received', NULL, @serviceLabel, @details, @now, @now)
`);
const setTicketStmt = db.prepare("UPDATE requests SET ticket = ? WHERE id = ?");

router.post("/:type", submitLimiter, (req, res) => {
  const { type } = req.params;
  const schema = requestSchemas[type];
  if (!schema) {
    return res.status(404).json({ error: "Unknown request type." });
  }

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid submission." });
  }

  const fields = parsed.data;
  const { name, dob, phone, email, ...rest } = fields;
  const now = new Date().toISOString();

  const tx = db.transaction(() => {
    const info = insertStmt.run({
      ticket: `PENDING-${now}`,
      type: typeLabels[type],
      summary: summaryFor(type, fields),
      name,
      dob,
      phone,
      email,
      serviceLabel: type === "government" ? fields.service : null,
      details: JSON.stringify(rest),
      now,
    });
    setTicketStmt.run(ticketOf(info.lastInsertRowid), info.lastInsertRowid);
    return info.lastInsertRowid;
  });

  const id = tx();
  const row = db.prepare("SELECT * FROM requests WHERE id = ?").get(id);
  res.status(201).json(serializeRequest(row));
});

router.get("/track", trackLimiter, (req, res) => {
  const ticket = String(req.query.ticket || "").trim().toUpperCase();
  const name = String(req.query.name || "").trim().toLowerCase();
  const dob = String(req.query.dob || "").trim();

  if (!ticket || !name || !dob) {
    return res.status(400).json({ error: "Ticket number, name, and date of birth are all required." });
  }

  const row = db.prepare("SELECT * FROM requests WHERE upper(ticket) = ?").get(ticket);
  if (!row || row.name.trim().toLowerCase() !== name || row.dob !== dob) {
    return res.status(404).json({ error: "No matching request. Double-check the ticket number, name, and date of birth." });
  }

  res.json(serializeRequest(row));
});

router.post("/:id/pay", (req, res) => {
  const id = Number(req.params.id);
  const method = String(req.body?.method || "").trim();
  if (!["bkash", "nagad", "card"].includes(method)) {
    return res.status(400).json({ error: "Choose a valid payment method." });
  }

  const row = db.prepare("SELECT * FROM requests WHERE id = ?").get(id);
  if (!row) return res.status(404).json({ error: "Request not found." });
  if (row.status !== "approved" || row.fee == null) {
    return res.status(409).json({ error: "This request isn't awaiting payment." });
  }

  db.prepare("UPDATE requests SET status = 'paid', payment_method = ?, updated_at = ? WHERE id = ?").run(
    method,
    new Date().toISOString(),
    id
  );

  const updated = db.prepare("SELECT * FROM requests WHERE id = ?").get(id);
  res.json(serializeRequest(updated));
});

export default router;
