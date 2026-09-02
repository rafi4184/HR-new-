import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, "..", "..", "data");
fs.mkdirSync(dataDir, { recursive: true });

export const db = new Database(path.join(dataDir, "hr_mediator.db"));
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

db.exec(`
  CREATE TABLE IF NOT EXISTS requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ticket TEXT NOT NULL UNIQUE,
    type TEXT NOT NULL,
    summary TEXT NOT NULL,
    name TEXT NOT NULL,
    dob TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'received',
    fee INTEGER,
    service_label TEXT,
    payment_method TEXT,
    details TEXT NOT NULL DEFAULT '{}',
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_requests_name_dob ON requests (name, dob);
`);

// Seed the starting id so ticket numbers look like the production system
// (HRM-100000 style) instead of starting at HRM-1 on a fresh database.
const { count } = db.prepare("SELECT COUNT(*) AS count FROM requests").get();
if (count === 0) {
  db.prepare(
    "INSERT INTO requests (id, ticket, type, summary, name, dob, phone, email, status, fee, service_label, details, created_at, updated_at) VALUES (100000, '__seed__', 'seed', '', '', '', '', '', 'paid', NULL, NULL, '{}', datetime('now'), datetime('now'))"
  ).run();
  db.prepare("DELETE FROM requests WHERE ticket = '__seed__'").run();
}

export function ticketOf(id) {
  return `HRM-${id}`;
}
