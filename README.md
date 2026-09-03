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
| `whoami()` | Who's signed in, and are they an admin | any staff |
| `list_contacts()` / `list_events()` | Public content shown in the Footer / Events section | anyone |
| `admin_upsert_contact` / `admin_delete_contact` | Edit the site's contact list | admin only |
| `admin_upsert_event` / `admin_delete_event` | Create/edit/delete events | admin only |
| `admin_add_event_media` / `admin_delete_event_media` | Attach or remove a photo/video on an event | admin only |
| `admin_list_staff` / `admin_set_staff_role` / `admin_remove_staff` | Manage who has staff/executive/admin access, and who staff report to | admin only |
| `executive_list_staff` / `executive_remove_staff` | An executive's view of, and control over, only their own team | executive only |
| `admin_list_audit_log(limit, before)` | Read the audit trail — who did what, on what, and when | admin only |

The `requests` table itself has no policies and no grants — every read and write goes through
one of these `SECURITY DEFINER` functions, which enforce the same rules the old Express routes
did (state transitions, staff membership, required fields).

Payments are simulated for demo purposes — wire `pay_request` to a real gateway (SSLCommerz,
bKash, Stripe) before taking this live.

## Admin panel

Staff never use an email to sign in — every account (admin, executive, or staff) is identified
by a **Staff ID** the admin picks when creating it. Supabase Auth still needs *some* email
internally, so `admin-create-staff` generates a random, never-shown, unguessable placeholder in
a fake domain (`@staff.hrthemediator.internal`) purely to satisfy that — nobody logs in with it.
Sign-in goes through the `staff-login` Edge Function instead: it takes a Staff ID + password,
resolves the ID to the right account server-side (using the `service_role` key, so the mapping
is never exposed to the browser), and signs in on the caller's behalf, handing back a normal
Supabase session. Both this function and the login form use one generic error — "Invalid Staff
ID or password" — for a wrong ID or a wrong password alike, so failed attempts can't be used to
discover which Staff IDs exist.

Anyone signed in as staff can change their own password (top of the Staff dashboard). Staff
accounts have one of three roles, an org chart baked into `public.staff` (`role` + `manager_id`):

- **Admin** — full control: contacts, events, and every staff account (create, change anyone's
  role, reset any password, remove access).
- **Executive** — no contacts/events access. Sees only the staff assigned to them (`manager_id`
  points at the executive) and can reset that team's passwords or remove their access — never
  another executive's team, never another executive or admin.
- **Staff** — no admin panel at all, just the request queue and their own password.

Only an admin creates accounts — when adding a **staff** account, the admin picks which executive
they report to (or leaves them unassigned) from the "Add staff account" form; an admin can change
anyone's role and manager later from "Change role." Creating an account and resetting a password
each call their own Edge Function (`admin-create-staff`, `admin-reset-staff-password`, both
gated so an executive can only touch their own team), since both need the `service_role` key,
which only an Edge Function can hold securely. Nobody — not even an admin — can ever *see*
someone's current password, only set a new one.

Your original admin account (created before Staff ID login existed) got a Staff ID backfilled
from the local part of its real email, so it kept working with no changes needed. Everyone you
add from the panel afterward gets whatever role and Staff ID you pick — no email involved at all.

**One gotcha to know:** creating a user directly from the Supabase dashboard (Authentication →
Users → Add user) makes an account that can log in but has *no* row in `public.staff` — no
Staff ID, no role — so it won't get an admin/executive/staff panel at all, and `staff-login` won't
find it either. Always create staff/executive/admin accounts from the site's own "Add staff
account" form instead; if an account already exists without a `staff` row, an existing admin has
to add one for it directly in the database once.

## Audit log

Every consequential action — approve/reject/complete a request, create or remove a staff
account, change someone's role, reset a password — writes a row to `public.audit_log` from
*inside* the same `SECURITY DEFINER` function or Edge Function that does the work, recording who
(by Staff ID), what, on what, and when. It's write-only from the client's perspective (nothing
but those functions can insert into it, and only admins can read it via `admin_list_audit_log`),
so it can't be forged or quietly skipped by a compromised session. Visible to admins under the
**Audit log** tab.

## Legacy server/ (not used in production anymore)

The original build used Node/Express + SQLite (`server/`) as a real, working backend — it's kept
in the repo for reference and still runs standalone (`cd server && npm install && npm run dev`)
if you ever want to compare behavior locally, but the deployed site now talks to Supabase
directly and no longer depends on it.
