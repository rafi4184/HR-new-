# HR — The Mediator

Bangladesh concierge desk cloned from https://github.com/rafi4184/HR-new-.git and adapted
to run under this environment (React/Vite + FastAPI + MongoDB).

## Product goal
Give customers a single, calm concierge desk for airport VIP reception, hotel & car booking,
government liaison, and career/employment programs — with a staff bureau that reviews,
approves, or declines each request and auto-emails the customer.

## Personas
- **Customer** — submits requests, tracks status via ticket + name + DOB, sees rejection
  reasons directly in the tracker.
- **Staff** — signs in, reviews the case queue, and can approve / reject / delete pending
  cases. Cannot manage users.
- **Admin** — everything staff can do, plus add/delete staff & admin accounts and delete
  non-pending cases.

## Architecture
- Frontend `/app/frontend`: React 18 + TypeScript + Vite + Tailwind + Framer Motion.
- Backend `/app/backend/server.py`: FastAPI + Motor (MongoDB).
- MongoDB collections: `requests` (bookings), `counters` (ticket sequencing), `users` (RBAC).
- Auth: bcrypt-hashed passwords + JWT (`sub`, `username`, `role`, 8h expiry).
- Emails: Resend via `emails.py` (falls back to console-logged mock when `RESEND_API_KEY` is empty).

## API
### Public
- `GET  /api/health`
- `POST /api/requests/{airport|hotel|government|program}`
- `GET  /api/requests/track?ticket=&name=&dob=`
- `POST /api/requests/{id}/pay`  body `{method: bkash|nagad|card}`
### Auth
- `POST /api/auth/login`  → `{token, user}`
- `GET  /api/auth/me`
- `POST /api/staff/login` (legacy alias of `/api/auth/login`)
### Staff (any signed-in user)
- `GET    /api/staff/requests`
- `POST   /api/staff/requests/{id}/approve`  body `{fee?}` → email
- `POST   /api/staff/requests/{id}/reject`   body `{reason}` → email
- `DELETE /api/staff/requests/{id}`          (pending only unless admin)
### Admin-only
- `GET    /api/staff/users`
- `POST   /api/staff/users`  body `{username, password, name, role}`
- `DELETE /api/staff/users/{id}`  (cannot delete self; cannot delete last admin)

## Frontend surface
- **Home** hero, Services, HowItWorks, MediaPartners, Programs.
- **Signature** — animated counters + testimonial rail + house-rules panel (dark forest hero-inverse).
- **Booking** — 4 tabbed forms with layout-id indicator.
- **Track your request** — ticket + name + DOB lookup, shows rejection reason on decline.
- **Staff dashboard** — sign-in modal, animated stat cards, tabbed layout with:
  - **Case queue**: Approve / Reject / Delete controls, live remove animation on delete.
  - **Users** (admin only): avatar list, add-staff modal, delete guard for self/last admin.

## Environment
- `/app/backend/.env`: `MONGO_URL`, `DB_NAME=hr_mediator`, `JWT_SECRET`, `STAFF_USERNAME=admin`,
  `STAFF_PASSWORD=admin@2026`, `RESEND_API_KEY` (empty → mocked emails), `SENDER_EMAIL`, brand vars.
- `/app/frontend/.env`: `REACT_APP_BACKEND_URL` (protected).

## Implemented (rolling log)
- **2026-01 (turn 1)** — Ported Express+SQLite backend to FastAPI+MongoDB; migrated Vite client
  to `/app/frontend`; verified health + submit + staff login e2e.
- **2026-01 (turn 2)** — Resend email integration with branded HTML templates + fallback logger;
  reject endpoint with reason; TrackRequest shows rejection reason; StaffDashboard reworked with
  approve/reject modals, stats, and confirmation UX.
- **2026-01 (turn 3)** — Full RBAC: `users` collection, bootstrap admin seeded on startup,
  admin-only user management endpoints & UI (add / delete), staff & admin delete-pending,
  animated Signature section (counters, testimonial rail, house rules).
- **2026-01 (turn 4)** — Forced first-login password reset, audit-log endpoint + tab,
  MediaPartners → "As seen on air" section with BTV feature card.
- **2026-01 (turn 5)** — Live pending badge, self-service password change, invite emails,
  audit filters, new news-desk portrait.
- **2026-01 (turn 6)** — Rate limits (slowapi), bulk approve/reject, case search,
  glowing tracker timeline.
- **2026-01 (turn 7)** —
  - **Ticket autoformat** in the tracker input — types digits, live-morphs to `HRM-100002`,
    green ring when the format is valid, red border while incomplete. Paste is normalised too.
  - **Live queue** polling — the same 15s loop now also pulls `staffListRequests`, diffs by
    id/status/updatedAt, and hot-swaps the queue only when server state actually moved.
  - **Weekly digest** — APScheduler `AsyncIOScheduler` cron job at Mon 03:00 UTC (~09:00 BD)
    dispatches a branded HTML summary of the last 7 days (Approved / Declined / Settled / Pending
    counts + 6 recent decisions) to every admin with a valid email. Admin-only test route
    `POST /api/staff/digest/test` verified: dispatched to 1 admin (mock log until Resend key set).

## Backlog / P0-P2
- **P0**: Set a real `RESEND_API_KEY` in `.env` — emails are still mocked to logs.
- **P0**: Save-to-GitHub — user asked to "push"; must be done through the platform's
  **Save to Github** button, not via CLI.
- **P1**: Rate limiting on submit / track / login.
- **P1**: Audit log filters (by actor, action, date-range) + CSV export.
- **P2**: Real-time queue counter via SSE / websocket, so pending badge updates without refresh.
- **P2**: Rich seed data + demo mode toggle.
- **P2**: `vite build` production output served by FastAPI for single-process deploy.
