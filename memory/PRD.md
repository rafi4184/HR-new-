# HR — The Mediator

## Source
Cloned from https://github.com/rafi4184/HR-new-.git and adapted to run under this
environment's supervisor (React on port 3000, FastAPI on port 8001, MongoDB).

## What the app does
Bangladesh concierge desk: airport VIP reception, hotel & car booking, government-liaison
requests, and study-abroad / media / Gulf-employment programs. Public users submit a
request, get a ticket, can track it and pay simulated fees. Staff sign in with JWT to
approve requests and set fees.

## Architecture
- Frontend: `/app/frontend` (React 18 + TypeScript + Vite + Tailwind + framer-motion)
  - `yarn start` runs `vite --host 0.0.0.0 --port 3000`
  - Client calls relative `/api/...`, which the Kubernetes ingress routes to backend on 8001
- Backend: `/app/backend/server.py` (FastAPI, port of the original Express server)
  - Storage: MongoDB (`hr_mediator` db, `requests` + `counters` collections)
  - Auth: bcrypt + JWT (PyJWT) for staff routes, 8-hour expiry
  - Ticket ids: `HRM-100001, HRM-100002, ...` via an atomic Mongo counter

## API
- `GET /api/health`
- `POST /api/requests/{airport|hotel|government|program}`
- `GET /api/requests/track?ticket=&name=&dob=`
- `POST /api/requests/{id}/pay` — body `{method: bkash|nagad|card}`
- `POST /api/staff/login` — returns `{token}`
- `GET /api/staff/requests` — Bearer JWT
- `POST /api/staff/requests/{id}/approve` — body `{fee?}`

## Environment
- `/app/backend/.env`: MONGO_URL, DB_NAME=hr_mediator, JWT_SECRET, STAFF_USERNAME=desk, STAFF_PASSWORD=mediator123
- `/app/frontend/.env`: REACT_APP_BACKEND_URL (do not modify)

## Implemented
- 2026-01: Ported Express + SQLite backend to FastAPI + MongoDB. Migrated Vite client
  to /app/frontend. Verified health, staff login, and airport request submission
  end-to-end through the external URL.

## Backlog / Next
- Wire real payment gateway (bKash / Nagad / Stripe) into `/api/requests/{id}/pay`
- Rate limiting on submit/track/login (was `express-rate-limit` originally)
- Rich seed data for the staff dashboard demo
- Deploy production build via `vite build` + static serving
