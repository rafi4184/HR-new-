# HR — The Mediator

A Bangladesh concierge desk: airport VIP reception, hotel & car booking, government-liaison
requests, and study-abroad / media / Gulf-employment programs — with real ticket tracking, a
staff approval dashboard, and simulated payments.

- **Client** — React 18 + TypeScript + Vite, Tailwind CSS, Framer Motion, lucide-react
- **Backend** — [Supabase](https://supabase.com/docs): Postgres + Row Level Security, database
  functions (RPCs) the client calls directly, Supabase Auth for staff sign-in, and an Edge
  Function for automatic confirmation emails. No server process to host — the client talks
  straight to Supabase, which is what makes it deployable as a static site (Vercel, Netlify, ...).

## Project layout

```
client/     React front end (Vite) — the only thing you deploy
supabase/
  migrations/0001_init.sql   Schema, RLS, RPC functions, notification trigger
  functions/notify-decision  Edge Function that sends the confirmation email
server/     Legacy Express + SQLite backend, kept for local reference only —
            not used by the deployed app anymore. Safe to ignore or delete.
```

## One-time Supabase setup

1. **Create a project** at [supabase.com](https://supabase.com) (free tier is enough).
2. **Run the migration**: Dashboard → SQL Editor → paste the contents of
   `supabase/migrations/0001_init.sql` → Run. This creates the `requests` table (RLS-locked,
   never queried directly) and every RPC function the client calls.
3. **Set the two trigger settings** (also in the SQL Editor — the automatic notification trigger
   reads these to know where to call; find your project ref and anon key under
   Settings → API):
   ```sql
   alter database postgres set app.settings.project_url = 'https://<project-ref>.supabase.co';
   alter database postgres set app.settings.notify_key = '<anon-public-key>';
   ```
4. **Create your staff account(s)**: Dashboard → Authentication → Users → Add user (set a real
   email + password — this is what staff sign in with on the site, no more shared PIN). Copy the
   new user's UUID, then in the SQL Editor:
   ```sql
   insert into public.staff (user_id) values ('<the-uuid-you-copied>');
   ```
   Only rows in `public.staff` can call the staff RPCs — inserting here is what makes someone
   staff. Repeat for each staff member.
5. **Deploy the notify-decision Edge Function**: `supabase functions deploy notify-decision`
   (needs the [Supabase CLI](https://supabase.com/docs/guides/cli), `supabase link`ed to your
   project first).
6. **(Optional) Turn on real email**: without this, confirmations are just logged in the Edge
   Function's logs — useful for testing, not for customers. Sign up at
   [resend.com](https://resend.com) (no 2FA required, just an API key), then:
   ```bash
   supabase secrets set RESEND_API_KEY=re_your_key NOTIFY_FROM_EMAIL="HR — The Mediator <concierge@hrthemediator.com>"
   ```
   Sending "from" your own domain (once you verify it with Resend) lands in inboxes far more
   reliably than trying to relay through a personal Gmail address.

## Local development

```bash
cd client
npm install
cp .env.example .env
# fill in VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY from Settings → API
npm run dev
```

Open http://localhost:5173 — the app talks straight to your Supabase project, no local backend
needed. `VITE_SUPABASE_ANON_KEY` is the public "anon" key: safe to ship in the browser bundle
(that's the point of Row Level Security) — never use the `service_role` key here.

### Staff dashboard

Sign in with the email + password of a user you added to `public.staff` above. Sessions are
managed by Supabase Auth.

## Deploying (Vercel)

1. Push this repo to GitHub (already done if you're reading this from the repo).
2. Vercel → New Project → import the repo → set **Root Directory** to `client`.
3. Build command: `npm run build` · Output directory: `dist` (Vercel's Vite preset detects both
   automatically once Root Directory is set).
4. Environment variables (Project Settings → Environment Variables): `VITE_SUPABASE_URL` and
   `VITE_SUPABASE_ANON_KEY`, same values as your local `.env`.
5. Deploy. Point hrthemediator.com's DNS at the Vercel deployment (Vercel → Domains → add
   `hrthemediator.com`, follow its DNS instructions) once you're happy with it.

## Request lifecycle

```
received ──approve──▶ approved ──(if a fee was set)──▶ paid ──▶ completed
   │                      │
   │                      └─(no fee set)──────────────────────▶ completed
   └──reject──▶ rejected
```

- **received** — a customer just submitted a request.
- Staff **approve** it (optionally setting a fee for government cases) or **reject** it with an
  optional note — either action fires the automatic customer confirmation (via the Postgres
  trigger → Edge Function → Resend) and the result is visible the moment the customer checks
  their ticket.
- If a fee was set, the customer **pays** from the tracking page before the request can be marked
  complete.
- Staff **mark the request complete** once the service has actually been delivered — a separate
  step from approval/payment, and it fires its own confirmation too.

## Database functions (RPCs) the client calls

| Function | Purpose | Callable by |
| --- | --- | --- |
| `submit_request(type, name, dob, phone, email, fields)` | Create a request | anyone |
| `track_request(ticket, name, dob)` | Look up one request | anyone (must match all three) |
| `pay_request(id, method)` | Simulate paying an approved fee | anyone (still gated by request state) |
| `staff_list_requests()` | List every request, full contact details | staff only |
| `staff_approve_request(id, fee)` | Approve, optionally setting a fee | staff only |
| `staff_reject_request(id, note)` | Reject with an optional note | staff only |
| `staff_complete_request(id)` | Mark an approved/paid request done | staff only |

The `requests` table itself has no policies and no grants — every read and write goes through
one of these `SECURITY DEFINER` functions, which enforce the same rules the old Express routes
did (state transitions, staff membership, required fields).

Payments are simulated for demo purposes — wire `pay_request` to a real gateway (SSLCommerz,
bKash, Stripe) before taking this live.

## Legacy server/ (not used in production anymore)

The original build used Node/Express + SQLite (`server/`) as a real, working backend — it's kept
in the repo for reference and still runs standalone (`cd server && npm install && npm run dev`)
if you ever want to compare behavior locally, but the deployed site now talks to Supabase
directly and no longer depends on it.
