# HR Workplace Mediation platform — schema notes

This is a **separate product** from the concierge desk (hrthemediator.com) sharing the same
Supabase project (`dgxmouzxgbiigzmtalwo`) at the site owner's explicit choice. Nothing here is
wired into the concierge site's frontend — this is schema-only, applied and verified directly
against the live database. There is no application code for it yet.

## What's here

- `migrations/0003_mediation_platform.sql` — the full schema: `organizations`, `profiles`,
  `cases`, `case_participants`, `sessions`, `mediator_notes`, `agreements`, `documents`,
  `audit_logs`, plus every enum, trigger, RLS policy, and the `case-documents` Storage bucket.
- `functions/` — no Edge Function needed for this schema; `profiles` populates itself from
  `auth.users` via a database trigger on signup (`med_handle_new_user`).
- `../types/supabase.ts` — generated TypeScript types for the whole project (both products).

## Access model at a glance

| Role | Cases | Mediator notes | Agreements | Case roster |
| --- | --- | --- | --- | --- |
| `admin` | full CRUD | full CRUD | full CRUD | full CRUD |
| `mediator` | read/update their assigned cases | full CRUD on their cases | draft/update on their cases | manage on their cases |
| `hr_client` | read cases where they're the HR rep, in their org | **zero access, always** | read only if `share_with_hr = true` | **zero access** (participant identities stay private from HR) |
| `participant` | read cases they're listed on | **zero access, always** | read their case's agreements; can sign (not edit terms) | read/update only their own row's consent flag |

Every "zero access" above is enforced at two layers: no RLS policy grants those rows to that
role, *and* two extra triggers stop a technically-permitted UPDATE from smuggling changes through
columns RLS can't restrict (`med_guard_agreement_participant_update` limits a participant's
agreement update to signing only; `med_guard_case_participant_self_update` limits their
`case_participants` update to the consent flag only). A third trigger,
`med_prevent_role_escalation`, stops anyone from granting themselves `admin` via a normal profile
update — only an existing admin can change `role` or `organization_id`.

All of this was verified against the live database with real role-simulated queries (not just
read from the SQL), including a caught-and-fixed infinite-recursion bug between the `profiles`
and `cases` policies — see the comment block at the top of the migration file for what that was
and how it was fixed, if you're extending this schema later.

## Creating your first users

There's no admin UI for this yet. To get started:

```sql
-- After someone signs up (via your app's normal Supabase Auth signup, or
-- Dashboard → Authentication → Users → Add user), promote them:
update public.profiles set role = 'admin' where email = 'you@example.com';
```

Do this from the Supabase SQL Editor (as the `postgres` role) — a client-side call would hit the
same role-escalation trigger everyone else does.

## Applying schema changes with the Supabase CLI

This migration was applied directly via the Supabase MCP server's `apply_migration` (the same
tool this whole project's migrations went through), which is equivalent to running it through the
CLI. To manage it with the CLI going forward:

```bash
# One-time: link your local checkout to the project
supabase login
supabase link --project-ref dgxmouzxgbiigzmtalwo

# Create a new migration file for your next change
supabase migration new add_something_to_mediation_platform
# → edit the generated file in supabase/migrations/

# Push it to the real project
supabase db push

# Regenerate the TypeScript types after any schema change
supabase gen types typescript --project-id dgxmouzxgbiigzmtalwo > types/supabase.ts
```

If you ever want to test changes locally before pushing: `supabase start` runs a local Postgres +
Auth stack, and `supabase db reset` replays every migration in `supabase/migrations/` (including
`0001`/`0002` for the concierge site) against it from scratch.
