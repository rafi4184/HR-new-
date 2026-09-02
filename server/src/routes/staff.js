import { Router } from "express";
import rateLimit from "express-rate-limit";
import bcrypt from "bcryptjs";
import { db } from "../db/index.js";
import { requireStaff, signStaffToken } from "../middleware/auth.js";
import { serializeRequest } from "../lib/serialize.js";
import { notifyDecision } from "../lib/notify.js";

const router = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many sign-in attempts. Please wait a few minutes and try again." },
});

let staffPasswordHash = null;
function getStaffPasswordHash() {
  if (!staffPasswordHash) {
    staffPasswordHash = bcrypt.hashSync(process.env.STAFF_PASSWORD, 10);
  }
  return staffPasswordHash;
}

router.post("/login", loginLimiter, (req, res) => {
  const { username, password } = req.body ?? {};
  const expectedUsername = process.env.STAFF_USERNAME;

  if (
    typeof username !== "string" ||
    typeof password !== "string" ||
    username !== expectedUsername ||
    !bcrypt.compareSync(password, getStaffPasswordHash())
  ) {
    return res.status(401).json({ error: "Incorrect username or password." });
  }

  res.json({ token: signStaffToken() });
});

router.get("/requests", requireStaff, (_req, res) => {
  const rows = db.prepare("SELECT * FROM requests ORDER BY id DESC").all();
  res.json(rows.map(serializeRequest));
});

router.post("/requests/:id/approve", requireStaff, async (req, res) => {
  const id = Number(req.params.id);
  const row = db.prepare("SELECT * FROM requests WHERE id = ?").get(id);
  if (!row) return res.status(404).json({ error: "Request not found." });
  if (row.status !== "received") {
    return res.status(409).json({ error: "This request has already been reviewed." });
  }

  let fee = null;
  if (req.body && req.body.fee !== undefined && req.body.fee !== null && req.body.fee !== "") {
    fee = Math.max(0, Math.round(Number(req.body.fee)));
    if (Number.isNaN(fee)) return res.status(400).json({ error: "Fee must be a number." });
  }

  const now = new Date().toISOString();
  db.prepare("UPDATE requests SET status = 'approved', fee = ?, updated_at = ? WHERE id = ?").run(fee, now, id);

  const updated = db.prepare("SELECT * FROM requests WHERE id = ?").get(id);
  const serialized = serializeRequest(updated);
  await notifyDecision(serialized, "approved");
  db.prepare("UPDATE requests SET notified_at = ? WHERE id = ?").run(new Date().toISOString(), id);

  res.json(serializeRequest(db.prepare("SELECT * FROM requests WHERE id = ?").get(id)));
});

router.post("/requests/:id/reject", requireStaff, async (req, res) => {
  const id = Number(req.params.id);
  const row = db.prepare("SELECT * FROM requests WHERE id = ?").get(id);
  if (!row) return res.status(404).json({ error: "Request not found." });
  if (row.status !== "received") {
    return res.status(409).json({ error: "This request has already been reviewed." });
  }

  const note = typeof req.body?.note === "string" ? req.body.note.trim().slice(0, 500) : null;
  const now = new Date().toISOString();
  db.prepare("UPDATE requests SET status = 'rejected', decision_note = ?, updated_at = ? WHERE id = ?").run(
    note || null,
    now,
    id
  );

  const updated = db.prepare("SELECT * FROM requests WHERE id = ?").get(id);
  const serialized = serializeRequest(updated);
  await notifyDecision(serialized, "rejected");
  db.prepare("UPDATE requests SET notified_at = ? WHERE id = ?").run(new Date().toISOString(), id);

  res.json(serializeRequest(db.prepare("SELECT * FROM requests WHERE id = ?").get(id)));
});

router.post("/requests/:id/complete", requireStaff, async (req, res) => {
  const id = Number(req.params.id);
  const row = db.prepare("SELECT * FROM requests WHERE id = ?").get(id);
  if (!row) return res.status(404).json({ error: "Request not found." });

  const canComplete = row.status === "paid" || (row.status === "approved" && row.fee == null);
  if (!canComplete) {
    return res.status(409).json({
      error:
        row.status === "approved"
          ? "This request has a fee due — it can be marked complete once the customer has paid."
          : "Only approved or paid requests can be marked complete.",
    });
  }

  const now = new Date().toISOString();
  db.prepare("UPDATE requests SET status = 'completed', completed_at = ?, updated_at = ? WHERE id = ?").run(
    now,
    now,
    id
  );

  const updated = db.prepare("SELECT * FROM requests WHERE id = ?").get(id);
  const serialized = serializeRequest(updated);
  await notifyDecision(serialized, "completed");
  db.prepare("UPDATE requests SET notified_at = ? WHERE id = ?").run(new Date().toISOString(), id);

  res.json(serializeRequest(db.prepare("SELECT * FROM requests WHERE id = ?").get(id)));
});

export default router;
