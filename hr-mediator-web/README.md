# HR — The Mediator · Website

A clean, fast public website for HR — The Mediator, built with **Next.js** (App Router) + **Tailwind CSS**,
deployed on **Vercel**, with live data from the existing **Supabase** project.

## Pages

| Route | What it shows | Data source |
| --- | --- | --- |
| `/` | Hero, services, how it works, upcoming events | `list_events()` |
| `/services` | All services | static (`src/lib/services.ts`) |
| `/events` | Upcoming & past events with photos | `list_events()` + `event-media` storage |
| `/contact` | Phone, WhatsApp, email, address | `list_contacts()` |
| `/request` | Submit a service request → ticket number | `submit_request()` (server action) |
| `/track` | Look up a ticket by number + name + date of birth | `track_request()` (server action) |

Public pages are statically rendered and refreshed from Supabase every 5 minutes (ISR), so edits staff
make in the admin panel show up automatically. Requests submitted here land in the same queue as before —
the staff/admin dashboard is unchanged and stays on the existing site.

## Local development

```bash
npm install
cp .env.example .env.local   # optional — defaults point at the production project
npm run dev
```

## Environment variables

| Name | Value |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://<project-ref>.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | the public **anon** key (never the `service_role` key) |

## Deploy

Push to `main` — Vercel builds and deploys automatically.
