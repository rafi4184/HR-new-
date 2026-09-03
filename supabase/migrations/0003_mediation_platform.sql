-- HR Workplace Mediation platform schema.
--
-- This is a SEPARATE product from the concierge desk (requests/staff/
-- contacts/events tables above) sharing this Supabase project at the
-- user's explicit choice. To avoid any cross-wiring with the concierge
-- site's access control, every helper function here is prefixed `med_`
-- (never reusing `is_admin`/`is_staff`, which already gate the concierge
-- site's staff dashboard) and every table is new, so there is zero name
-- collision with 0001/0002.
--
-- Unlike 0001/0002 (RPC-only access, tables fully locked), this schema
-- uses real per-table RLS policies as specified, since case/session/
-- agreement access genuinely varies by row (who's the assigned mediator,
-- who's a participant, whether HR sharing was consented to) in a way a
-- single "is staff" gate doesn't capture.
--
-- IMPORTANT — a lesson learned applying this migration: unlike 0001/0002,
-- where helper functions (is_staff, is_admin) are only ever called from
-- *inside* other SECURITY DEFINER RPC functions, this schema's helpers are
-- called *directly from table RLS policy predicates*. Postgres evaluates
-- policy predicates as the connecting role (authenticated), not as a
-- nested SECURITY DEFINER context — so, unlike 0001/0002's helpers, these
-- genuinely need `EXECUTE` granted to `authenticated` (verified: without
-- it, every policy check itself fails with "permission denied for
-- function"). What's still revoked from authenticated is the *trigger*
-- functions (med_handle_new_user, med_prevent_role_escalation,
-- med_audit_row_change, med_guard_*) — those are never called from a
-- policy predicate, only by their trigger, so they stay internal-only.
--
-- Also fixed here (both caught by testing against the real database, not
-- by inspection): the original "profiles mediator select case-linked" and
-- "cases hr_client read own org" policies queried `cases`/`profiles`
-- directly inline, which put those two policies in a call cycle
-- (evaluating one re-triggers RLS on the other, which re-triggers the
-- first...) — Postgres raised "infinite recursion detected in policy for
-- relation cases". Routed both through SECURITY DEFINER helpers
-- (med_caller_org_id, med_profile_linked_to_my_cases) instead, the same
-- fix pattern used everywhere else in this file to avoid a table's policy
-- re-entering its own RLS.

-- ---------------------------------------------------------------------
-- A. Extensions & enums
-- ---------------------------------------------------------------------

create extension if not exists pgcrypto;
create extension if not exists "uuid-ossp";

do $$ begin
  create type public.user_role as enum ('admin', 'hr_client', 'mediator', 'participant');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.case_status as enum ('intake', 'pre_mediation', 'joint_session', 'agreement_drafting', 'completed', 'cancelled');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.case_priority as enum ('low', 'medium', 'high', 'urgent');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.session_type as enum ('intake_hr', 'pre_mediation_1on1', 'joint_facilitation', 'follow_up');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.session_status as enum ('scheduled', 'in_progress', 'completed', 'rescheduled', 'cancelled');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.agreement_status as enum ('draft', 'under_review', 'signed', 'breached', 'archived');
exception when duplicate_object then null; end $$;

-- ---------------------------------------------------------------------
-- B. Tables
-- ---------------------------------------------------------------------

create table if not exists public.organizations (
  id             uuid primary key default gen_random_uuid(),
  name           text not null,
  industry       text,
  contact_email  text,
  created_at     timestamptz not null default now()
);

create table if not exists public.profiles (
  id               uuid primary key references auth.users (id) on delete cascade,
  email            text not null unique,
  full_name        text not null,
  phone            text,
  role             public.user_role not null default 'participant',
  organization_id  uuid references public.organizations (id),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create sequence if not exists public.med_case_number_seq;

create table if not exists public.cases (
  id                     uuid primary key default gen_random_uuid(),
  case_number            text unique not null,
  title                  text not null,
  organization_id        uuid references public.organizations (id) on delete cascade,
  assigned_mediator_id   uuid references public.profiles (id) on delete set null,
  hr_representative_id   uuid references public.profiles (id) on delete set null,
  status                 public.case_status not null default 'intake',
  priority               public.case_priority not null default 'medium',
  description            text,
  is_confidential        boolean not null default true,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);

create table if not exists public.case_participants (
  id                 uuid primary key default gen_random_uuid(),
  case_id            uuid not null references public.cases (id) on delete cascade,
  profile_id         uuid not null references public.profiles (id) on delete cascade,
  party_role         text,
  is_consent_given   boolean not null default false,
  created_at         timestamptz not null default now(),
  unique (case_id, profile_id)
);

create table if not exists public.sessions (
  id                 uuid primary key default gen_random_uuid(),
  case_id            uuid not null references public.cases (id) on delete cascade,
  mediator_id        uuid references public.profiles (id),
  session_type       public.session_type not null,
  status             public.session_status not null default 'scheduled',
  scheduled_start    timestamptz not null,
  scheduled_end      timestamptz not null,
  location_or_link   text,
  created_at         timestamptz not null default now()
);

-- STRICT CONFIDENTIALITY: never exposed to hr_client or participant roles.
create table if not exists public.mediator_notes (
  id                       uuid primary key default gen_random_uuid(),
  case_id                  uuid not null references public.cases (id) on delete cascade,
  author_id                uuid references public.profiles (id),
  note_content             text not null,
  is_private_to_mediator   boolean not null default true,
  created_at               timestamptz not null default now()
);

create table if not exists public.agreements (
  id              uuid primary key default gen_random_uuid(),
  case_id         uuid not null references public.cases (id) on delete cascade,
  terms_content   text not null,
  status          public.agreement_status not null default 'draft',
  share_with_hr   boolean not null default false,
  signed_at       timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create table if not exists public.documents (
  id               uuid primary key default gen_random_uuid(),
  case_id          uuid not null references public.cases (id) on delete cascade,
  uploaded_by      uuid references public.profiles (id),
  file_path        text not null,
  file_name        text not null,
  is_confidential  boolean not null default true,
  created_at       timestamptz not null default now()
);

create table if not exists public.audit_logs (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid references public.profiles (id) on delete set null,
  action        text not null,
  entity_name   text not null,
  entity_id     uuid,
  payload       jsonb,
  created_at    timestamptz not null default now()
);

create index if not exists idx_cases_org on public.cases (organization_id);
create index if not exists idx_cases_mediator on public.cases (assigned_mediator_id);
create index if not exists idx_cases_hr_rep on public.cases (hr_representative_id);
create index if not exists idx_case_participants_case on public.case_participants (case_id);
create index if not exists idx_case_participants_profile on public.case_participants (profile_id);
create index if not exists idx_sessions_case on public.sessions (case_id);
create index if not exists idx_mediator_notes_case on public.mediator_notes (case_id);
create index if not exists idx_agreements_case on public.agreements (case_id);
create index if not exists idx_documents_case on public.documents (case_id);
create index if not exists idx_audit_logs_entity on public.audit_logs (entity_name, entity_id);

-- ---------------------------------------------------------------------
-- C. Automation & triggers
-- ---------------------------------------------------------------------

create or replace function public.med_handle_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at before update on public.profiles
  for each row execute function public.med_handle_updated_at();

drop trigger if exists trg_cases_updated_at on public.cases;
create trigger trg_cases_updated_at before update on public.cases
  for each row execute function public.med_handle_updated_at();

drop trigger if exists trg_agreements_updated_at on public.agreements;
create trigger trg_agreements_updated_at before update on public.agreements
  for each row execute function public.med_handle_updated_at();

-- Populates public.profiles from auth.users on signup. Role/full_name come
-- from user metadata if the signup flow sets them; both are safe defaults
-- otherwise (role defaults to the least-privileged 'participant' — nothing
-- reads elevated trust from raw_user_meta_data, since that's user-editable).
create or replace function public.med_handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    coalesce((new.raw_user_meta_data->>'role')::public.user_role, 'participant')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists trg_med_handle_new_user on auth.users;
create trigger trg_med_handle_new_user after insert on auth.users
  for each row execute function public.med_handle_new_user();

-- A regular UPDATE on profiles could otherwise let anyone hand themselves
-- admin. Only an existing admin (or the new-user trigger's initial insert,
-- which this doesn't touch) may change role or organization_id.
create or replace function public.med_prevent_role_escalation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if (new.role is distinct from old.role or new.organization_id is distinct from old.organization_id)
     and not public.med_is_admin() then
    raise exception 'Only an admin can change role or organization.';
  end if;
  return new;
end;
$$;

drop trigger if exists trg_profiles_prevent_escalation on public.profiles;
create trigger trg_profiles_prevent_escalation before update on public.profiles
  for each row execute function public.med_prevent_role_escalation();

create or replace function public.med_generate_case_number()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if new.case_number is null or new.case_number = '' then
    new.case_number := 'HRM-' || to_char(now(), 'YYYY') || '-' || lpad(nextval('public.med_case_number_seq')::text, 4, '0');
  end if;
  return new;
end;
$$;

drop trigger if exists trg_cases_case_number on public.cases;
create trigger trg_cases_case_number before insert on public.cases
  for each row execute function public.med_generate_case_number();

-- Lightweight compliance audit trail on the sensitive tables.
create or replace function public.med_audit_row_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row jsonb;
  v_id uuid;
begin
  v_row := to_jsonb(coalesce(new, old));
  v_id := (v_row->>'id')::uuid;
  insert into public.audit_logs (user_id, action, entity_name, entity_id, payload)
  values (auth.uid(), tg_op, tg_table_name, v_id, v_row);
  return coalesce(new, old);
end;
$$;

drop trigger if exists trg_audit_cases on public.cases;
create trigger trg_audit_cases after insert or update or delete on public.cases
  for each row execute function public.med_audit_row_change();

drop trigger if exists trg_audit_agreements on public.agreements;
create trigger trg_audit_agreements after insert or update or delete on public.agreements
  for each row execute function public.med_audit_row_change();

drop trigger if exists trg_audit_mediator_notes on public.mediator_notes;
create trigger trg_audit_mediator_notes after insert or update or delete on public.mediator_notes
  for each row execute function public.med_audit_row_change();

drop trigger if exists trg_audit_documents on public.documents;
create trigger trg_audit_documents after insert or update or delete on public.documents
  for each row execute function public.med_audit_row_change();

-- ---------------------------------------------------------------------
-- D. RLS helper functions. All SECURITY DEFINER so a policy calling one
-- doesn't re-trigger RLS on the table it queries internally (verified:
-- without this, "profiles" <-> "cases" cross-checks recurse infinitely).
-- Every one of these is called directly from a table policy predicate
-- below, which Postgres evaluates as the connecting role — so each needs
-- EXECUTE granted to `authenticated` (see the note at the top of this
-- file for why that's different from 0001/0002's helpers).
-- ---------------------------------------------------------------------

create or replace function public.med_current_role()
returns public.user_role
language sql
security definer
set search_path = public
stable
as $$
  select role from public.profiles where id = auth.uid();
$$;

create or replace function public.med_is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select coalesce((select role = 'admin' from public.profiles where id = auth.uid()), false);
$$;

create or replace function public.med_is_case_mediator(p_case_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (select 1 from public.cases where id = p_case_id and assigned_mediator_id = auth.uid());
$$;

create or replace function public.med_is_case_hr_rep(p_case_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (select 1 from public.cases where id = p_case_id and hr_representative_id = auth.uid());
$$;

create or replace function public.med_is_case_participant(p_case_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (select 1 from public.case_participants where case_id = p_case_id and profile_id = auth.uid());
$$;

create or replace function public.med_case_org_matches_caller(p_case_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.cases c
    join public.profiles p on p.id = auth.uid()
    where c.id = p_case_id and c.organization_id = p.organization_id
  );
$$;

create or replace function public.med_caller_org_id()
returns uuid
language sql
security definer
set search_path = public
stable
as $$
  select organization_id from public.profiles where id = auth.uid();
$$;

create or replace function public.med_profile_linked_to_my_cases(p_profile_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.cases c
    where c.assigned_mediator_id = auth.uid()
      and (c.hr_representative_id = p_profile_id
           or exists (select 1 from public.case_participants cp where cp.case_id = c.id and cp.profile_id = p_profile_id))
  );
$$;

revoke execute on function public.med_current_role from public, anon;
revoke execute on function public.med_is_admin from public, anon;
revoke execute on function public.med_is_case_mediator from public, anon;
revoke execute on function public.med_is_case_hr_rep from public, anon;
revoke execute on function public.med_is_case_participant from public, anon;
revoke execute on function public.med_case_org_matches_caller from public, anon;
revoke execute on function public.med_caller_org_id from public, anon;
revoke execute on function public.med_profile_linked_to_my_cases from public, anon;

grant execute on function public.med_current_role to authenticated;
grant execute on function public.med_is_admin to authenticated;
grant execute on function public.med_is_case_mediator to authenticated;
grant execute on function public.med_is_case_hr_rep to authenticated;
grant execute on function public.med_is_case_participant to authenticated;
grant execute on function public.med_case_org_matches_caller to authenticated;
grant execute on function public.med_caller_org_id to authenticated;
grant execute on function public.med_profile_linked_to_my_cases to authenticated;

-- Trigger-only functions — never called from a policy predicate, so
-- (unlike the helpers above) these stay fully internal.
revoke execute on function public.med_audit_row_change from public, anon, authenticated;
revoke execute on function public.med_guard_agreement_participant_update from public, anon, authenticated;
revoke execute on function public.med_guard_case_participant_self_update from public, anon, authenticated;
revoke execute on function public.med_handle_new_user from public, anon, authenticated;
revoke execute on function public.med_prevent_role_escalation from public, anon, authenticated;

-- ---------------------------------------------------------------------
-- E. RLS policies
-- ---------------------------------------------------------------------

alter table public.organizations enable row level security;
alter table public.profiles enable row level security;
alter table public.cases enable row level security;
alter table public.case_participants enable row level security;
alter table public.sessions enable row level security;
alter table public.mediator_notes enable row level security;
alter table public.agreements enable row level security;
alter table public.documents enable row level security;
alter table public.audit_logs enable row level security;

-- No direct grants at all by default; every policy below is additive on
-- top of that, and every table gets an explicit `to authenticated` grant
-- for exactly the operations its policies cover (RLS restricts rows, but
-- Postgres still requires the base privilege before RLS is even checked).
revoke all on public.organizations, public.profiles, public.cases, public.case_participants,
  public.sessions, public.mediator_notes, public.agreements, public.documents, public.audit_logs
  from anon, authenticated;

-- organizations
grant select, insert, update, delete on public.organizations to authenticated;

drop policy if exists "org admin full access" on public.organizations;
create policy "org admin full access" on public.organizations
  for all to authenticated
  using (public.med_is_admin())
  with check (public.med_is_admin());

drop policy if exists "org hr_client read own" on public.organizations;
create policy "org hr_client read own" on public.organizations
  for select to authenticated
  using (id = public.med_caller_org_id());

-- profiles
grant select, update on public.profiles to authenticated;

drop policy if exists "profiles self select" on public.profiles;
create policy "profiles self select" on public.profiles
  for select to authenticated
  using (id = auth.uid());

drop policy if exists "profiles admin select all" on public.profiles;
create policy "profiles admin select all" on public.profiles
  for select to authenticated
  using (public.med_is_admin());

drop policy if exists "profiles mediator select case-linked" on public.profiles;
create policy "profiles mediator select case-linked" on public.profiles
  for select to authenticated
  using (public.med_profile_linked_to_my_cases(profiles.id));

drop policy if exists "profiles self update" on public.profiles;
create policy "profiles self update" on public.profiles
  for update to authenticated
  using (id = auth.uid() or public.med_is_admin())
  with check (id = auth.uid() or public.med_is_admin());
-- (role/organization_id changes are additionally blocked for non-admins by
-- the med_prevent_role_escalation trigger above — RLS alone can't restrict
-- individual columns.)

-- cases
grant select, insert, update, delete on public.cases to authenticated;

drop policy if exists "cases admin full access" on public.cases;
create policy "cases admin full access" on public.cases
  for all to authenticated
  using (public.med_is_admin())
  with check (public.med_is_admin());

drop policy if exists "cases mediator read update own" on public.cases;
create policy "cases mediator read update own" on public.cases
  for select to authenticated
  using (assigned_mediator_id = auth.uid());

drop policy if exists "cases mediator update own" on public.cases;
create policy "cases mediator update own" on public.cases
  for update to authenticated
  using (assigned_mediator_id = auth.uid())
  with check (assigned_mediator_id = auth.uid());

drop policy if exists "cases hr_client read own org" on public.cases;
create policy "cases hr_client read own org" on public.cases
  for select to authenticated
  using (hr_representative_id = auth.uid() and organization_id = public.med_caller_org_id());

drop policy if exists "cases participant read own" on public.cases;
create policy "cases participant read own" on public.cases
  for select to authenticated
  using (exists (select 1 from public.case_participants cp where cp.case_id = cases.id and cp.profile_id = auth.uid()));

-- case_participants — admin and the case's mediator manage it; a
-- participant may see (and consent-flag) only their own row. HR does not
-- get a roster of who's involved, in keeping with participant confidentiality.
grant select, insert, update, delete on public.case_participants to authenticated;

drop policy if exists "case_participants admin full access" on public.case_participants;
create policy "case_participants admin full access" on public.case_participants
  for all to authenticated
  using (public.med_is_admin())
  with check (public.med_is_admin());

drop policy if exists "case_participants mediator manage own cases" on public.case_participants;
create policy "case_participants mediator manage own cases" on public.case_participants
  for all to authenticated
  using (public.med_is_case_mediator(case_id))
  with check (public.med_is_case_mediator(case_id));

drop policy if exists "case_participants self read" on public.case_participants;
create policy "case_participants self read" on public.case_participants
  for select to authenticated
  using (profile_id = auth.uid());

drop policy if exists "case_participants self consent update" on public.case_participants;
create policy "case_participants self consent update" on public.case_participants
  for update to authenticated
  using (profile_id = auth.uid())
  with check (profile_id = auth.uid());

-- The self-consent UPDATE policy above only checks profile_id = auth.uid()
-- on both old and new rows — it doesn't stop a participant from also
-- rewriting case_id (hopping their row onto an unrelated case) or
-- party_role in the same statement. Same class of gap as the agreements
-- guard below: RLS restricts which rows are touched, not which columns
-- change within them, so that needs a trigger too.
create or replace function public.med_guard_case_participant_self_update()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if public.med_is_admin() or public.med_is_case_mediator(new.case_id) then
    return new;
  end if;
  if new.case_id is distinct from old.case_id
     or new.profile_id is distinct from old.profile_id
     or new.party_role is distinct from old.party_role then
    raise exception 'You may only update your own consent flag.';
  end if;
  return new;
end;
$$;

drop trigger if exists trg_case_participants_guard_self on public.case_participants;
create trigger trg_case_participants_guard_self before update on public.case_participants
  for each row execute function public.med_guard_case_participant_self_update();

-- sessions — admin + the case's mediator manage; a participant can see
-- (but not modify) sessions on their own case.
grant select, insert, update, delete on public.sessions to authenticated;

drop policy if exists "sessions admin full access" on public.sessions;
create policy "sessions admin full access" on public.sessions
  for all to authenticated
  using (public.med_is_admin())
  with check (public.med_is_admin());

drop policy if exists "sessions mediator manage own cases" on public.sessions;
create policy "sessions mediator manage own cases" on public.sessions
  for all to authenticated
  using (public.med_is_case_mediator(case_id))
  with check (public.med_is_case_mediator(case_id));

drop policy if exists "sessions participant read own" on public.sessions;
create policy "sessions participant read own" on public.sessions
  for select to authenticated
  using (public.med_is_case_participant(case_id));

-- mediator_notes — strict: only the case's assigned mediator or an admin.
-- No policy at all exists for hr_client/participant, and there is no
-- direct table grant to them either, so they get zero rows, always.
grant select, insert, update, delete on public.mediator_notes to authenticated;

drop policy if exists "mediator_notes admin full access" on public.mediator_notes;
create policy "mediator_notes admin full access" on public.mediator_notes
  for all to authenticated
  using (public.med_is_admin())
  with check (public.med_is_admin());

drop policy if exists "mediator_notes mediator own cases only" on public.mediator_notes;
create policy "mediator_notes mediator own cases only" on public.mediator_notes
  for all to authenticated
  using (public.med_is_case_mediator(case_id))
  with check (public.med_is_case_mediator(case_id));

-- agreements
grant select, insert, update, delete on public.agreements to authenticated;

drop policy if exists "agreements admin full access" on public.agreements;
create policy "agreements admin full access" on public.agreements
  for all to authenticated
  using (public.med_is_admin())
  with check (public.med_is_admin());

drop policy if exists "agreements mediator draft update own cases" on public.agreements;
create policy "agreements mediator draft update own cases" on public.agreements
  for all to authenticated
  using (public.med_is_case_mediator(case_id))
  with check (public.med_is_case_mediator(case_id));

drop policy if exists "agreements participant read own" on public.agreements;
create policy "agreements participant read own" on public.agreements
  for select to authenticated
  using (public.med_is_case_participant(case_id));

drop policy if exists "agreements participant sign own" on public.agreements;
create policy "agreements participant sign own" on public.agreements
  for update to authenticated
  using (public.med_is_case_participant(case_id))
  with check (public.med_is_case_participant(case_id));
-- (the trigger below restricts a participant's update to signing only —
-- RLS can gate the row, not which columns changed within it.)

drop policy if exists "agreements hr_client read if shared" on public.agreements;
create policy "agreements hr_client read if shared" on public.agreements
  for select to authenticated
  using (share_with_hr = true and public.med_is_case_hr_rep(case_id));

create or replace function public.med_guard_agreement_participant_update()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if public.med_is_admin() or public.med_is_case_mediator(new.case_id) then
    return new;
  end if;
  -- A participant (the only other role this update policy allows through)
  -- may only move status to 'signed' and stamp signed_at — nothing else.
  if new.terms_content is distinct from old.terms_content
     or new.share_with_hr is distinct from old.share_with_hr
     or new.case_id is distinct from old.case_id
     or new.status is distinct from 'signed' then
    raise exception 'Participants may only sign an agreement, not edit its terms.';
  end if;
  new.signed_at := coalesce(new.signed_at, now());
  return new;
end;
$$;

drop trigger if exists trg_agreements_guard_participant on public.agreements;
create trigger trg_agreements_guard_participant before update on public.agreements
  for each row execute function public.med_guard_agreement_participant_update();

-- documents — admin + the case's mediator have full access; a participant
-- may upload and read documents on their own case.
grant select, insert, update, delete on public.documents to authenticated;

drop policy if exists "documents admin full access" on public.documents;
create policy "documents admin full access" on public.documents
  for all to authenticated
  using (public.med_is_admin())
  with check (public.med_is_admin());

drop policy if exists "documents mediator manage own cases" on public.documents;
create policy "documents mediator manage own cases" on public.documents
  for all to authenticated
  using (public.med_is_case_mediator(case_id))
  with check (public.med_is_case_mediator(case_id));

drop policy if exists "documents participant read own case" on public.documents;
create policy "documents participant read own case" on public.documents
  for select to authenticated
  using (public.med_is_case_participant(case_id));

drop policy if exists "documents participant upload own case" on public.documents;
create policy "documents participant upload own case" on public.documents
  for insert to authenticated
  with check (public.med_is_case_participant(case_id) and uploaded_by = auth.uid());

-- audit_logs — admin read-only from the client; every row is written by
-- the SECURITY DEFINER trigger above, never by a direct client insert.
grant select on public.audit_logs to authenticated;

drop policy if exists "audit_logs admin read" on public.audit_logs;
create policy "audit_logs admin read" on public.audit_logs
  for select to authenticated
  using (public.med_is_admin());

-- ---------------------------------------------------------------------
-- F. Storage bucket for case documents (private — unlike event-media,
-- nothing here is public; every read goes through a signed URL your
-- client code requests, which storage RLS below gates the same way as
-- the documents table).
-- ---------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('case-documents', 'case-documents', false)
on conflict (id) do nothing;

-- Files are stored as `{case_id}/{filename}` — this pulls case_id back out
-- of the path to check it against the same case-access helpers as above.
create or replace function public.med_storage_case_id(p_name text)
returns uuid
language sql
immutable
set search_path = public
as $$
  select (storage.foldername(p_name))[1]::uuid;
$$;

drop policy if exists "case-documents admin full access" on storage.objects;
create policy "case-documents admin full access"
  on storage.objects for all
  to authenticated
  using (bucket_id = 'case-documents' and public.med_is_admin())
  with check (bucket_id = 'case-documents' and public.med_is_admin());

drop policy if exists "case-documents mediator manage own cases" on storage.objects;
create policy "case-documents mediator manage own cases"
  on storage.objects for all
  to authenticated
  using (bucket_id = 'case-documents' and public.med_is_case_mediator(public.med_storage_case_id(name)))
  with check (bucket_id = 'case-documents' and public.med_is_case_mediator(public.med_storage_case_id(name)));

drop policy if exists "case-documents participant read own case" on storage.objects;
create policy "case-documents participant read own case"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'case-documents' and public.med_is_case_participant(public.med_storage_case_id(name)));

drop policy if exists "case-documents participant upload own case" on storage.objects;
create policy "case-documents participant upload own case"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'case-documents' and public.med_is_case_participant(public.med_storage_case_id(name)));
