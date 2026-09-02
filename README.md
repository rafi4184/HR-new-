# HR — The Mediator

A Bangladesh concierge desk: airport VIP reception, hotel & car booking, government-liaison
requests, and study-abroad / media / Gulf-employment programs — with real ticket tracking, a
staff approval dashboard, and simulated payments.

- **Client** — React 18 + TypeScript + Vite, Tailwind CSS, Framer Motion, lucide-react
- **Server** — Node.js + Express, SQLite (via `better-sqlite3`), JWT-authenticated staff routes

## Project layout

```
client/   React front end (Vite)
server/   Express API + SQLite database
```

## Getting started

```bash
npm install          # installs both workspaces
cp server/.env.example server/.env
# then edit server/.env — set a real JWT_SECRET and STAFF_PASSWORD

npm run dev           # runs the API on :4000 and the client on :5173, together
```

Open http://localhost:5173. The Vite dev server proxies `/api` to the Express server, so no
extra CORS setup is needed in development.

### Staff dashboard

Sign in on the "Staff dashboard" section with the `STAFF_USERNAME` / `STAFF_PASSWORD` you set in
`server/.env`. Staff sessions are JWTs valid for 8 hours.

## Production build

```bash
npm run build   # builds the client, then type-checks the server-facing build
npm start        # serves the API and the built client from one process, on $PORT
```

`npm start` runs only the Express server; it serves the compiled `client/dist` directly, so a
single process is enough to deploy the whole site.

## Environment variables (`server/.env`)

| Variable | Description |
| --- | --- |
| `PORT` | API port (default `4000`) |
| `CLIENT_ORIGIN` | Allowed CORS origin for the dev client (default `http://localhost:5173`) |
| `JWT_SECRET` | Secret used to sign staff session tokens — set a long random value |
| `STAFF_USERNAME` | Staff dashboard sign-in username |
| `STAFF_PASSWORD` | Staff dashboard sign-in password |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` / `FROM_EMAIL` | Optional — sends real confirmation emails on approve/reject/complete. Leave unset and the confirmation is just logged to the server console instead of sent. |

The SQLite database file is created automatically at `server/data/hr_mediator.db` on first run.

## Request lifecycle

```
received ──approve──▶ approved ──(if a fee was set)──▶ paid ──▶ completed
   │                      │
   │                      └─(no fee set)──────────────────────▶ completed
   └──reject──▶ rejected
```

- **received** — a customer just submitted a request.
- Staff **approve** it (optionally setting a fee for government cases) or **reject** it with an
  optional note — either action fires an automatic customer confirmation (email if SMTP is
  configured, otherwise logged) and the result is visible the moment the customer checks their
  ticket.
- If a fee was set, the customer **pays** from the tracking page before the request can be marked
  complete.
- Staff **mark the request complete** once the service has actually been delivered — this is a
  separate step from approval/payment, and fires its own confirmation.

## API overview

| Method & path | Purpose |
| --- | --- |
| `POST /api/requests/:type` | Submit a request (`airport`, `hotel`, `government`, `program`) |
| `GET /api/requests/track` | Track a request by ticket, name, and date of birth |
| `POST /api/requests/:id/pay` | Simulate paying an approved government-service fee |
| `POST /api/staff/login` | Staff sign-in, returns a JWT |
| `GET /api/staff/requests` | List every request, full contact details included (staff only) |
| `POST /api/staff/requests/:id/approve` | Approve a request, optionally setting a fee (staff only) |
| `POST /api/staff/requests/:id/reject` | Reject a request with an optional note (staff only) |
| `POST /api/staff/requests/:id/complete` | Mark an approved/paid request as done (staff only) |

Payments are simulated for demo purposes — wire `POST /api/requests/:id/pay` to a real gateway
(SSLCommerz, bKash, Stripe) before taking this live.
