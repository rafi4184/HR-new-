-- HR — The Mediator: Supabase schema
-- Replaces the Express + SQLite backend. Everything the client needs goes
-- through the RPC functions below — the `requests` table itself is locked
-- down with RLS and is never queried directly by the browser.

create extension if not exists pg_net;

-- ---------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------

create table if not exists public.requests (
  id              bigint generated always as identity (start with 100001) primary key,
  ticket          text generated always as ('HRM-' || id::text) stored unique,
  type            text not null check (type in ('airport', 'hotel', 'government', 'program')),
  type_label      text not null,
  summary         text not null,
  name            text not null,
  dob             date not null,
  phone           text not null,
  email           text not null,
  status          text not null default 'received'
                    check (status in ('received', 'approved', 'rejected', 'paid', 'completed')),
  fee             integer,
  service_label   text,
  payment_method  text,
  decision_note   text,
  notified_at     timestamptz,
  completed_at    timestamptz,
  details         jsonb not null default '{}'::jsonb,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists idx_requests_name_dob on public.requests (lower(name), dob);

-- Staff allowlist: a row here (referencing a real Supabase Auth user) is what
-- makes someone "staff" — created manually per person, never self-service.
create table if not exists public.staff (
  user_id     uuid primary key references auth.users (id) on delete cascade,
  created_at  timestamptz not null default now()
);

alter table public.requests enable row level security;
alter table public.staff enable row level security;
-- No policies are defined for either table, and there is no anon/authenticated
-- grant on them — every access path goes through a SECURITY DEFINER function
-- below, so "no policy" here correctly means "no direct access, ever."

revoke all on public.requests from anon, authenticated;
revoke all on public.staff from anon, authenticated;

-- ---------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------

-- Internal-only helpers: nobody should call these directly via RPC — they're
-- only ever invoked from inside other SECURITY DEFINER functions, which run
-- as the owner, so revoking EXECUTE here doesn't break those internal calls.
create or replace function public.is_staff()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (select 1 from public.staff where user_id = auth.uid());
$$;

revoke execute on function public.is_staff from public, anon, authenticated;

create or replace function public.request_type_label(p_type text)
returns text
language sql
immutable
set search_path = public
as $$
  select case p_type
    when 'airport' then 'Airport VIP'
    when 'hotel' then 'Hotel & Car'
    when 'government' then 'Government Request'
    when 'program' then 'Program Enrollment'
  end;
$$;

revoke execute on function public.request_type_label from public, anon, authenticated;

-- ---------------------------------------------------------------------
-- Customer-facing RPCs (anon)
-- ---------------------------------------------------------------------

-- Submit a request. p_fields holds only the type-specific fields (flight,
-- city, service, program, ...); identity fields are explicit parameters so
-- they're always required. Returns the new row.
create or replace function public.submit_request(
  p_type text,
  p_name text,
  p_dob date,
  p_phone text,
  p_email text,
  p_fields jsonb
)
returns public.requests
language plpgsql
security definer
set search_path = public
as $$
declare
  v_summary text;
  v_service_label text;
  v_row public.requests;
begin
  if p_type not in ('airport', 'hotel', 'government', 'program') then
    raise exception 'Unknown request type.';
  end if;
  if coalesce(trim(p_name), '') = '' then
    raise exception 'Full name is required.';
  end if;
  if coalesce(trim(p_phone), '') = '' then
    raise exception 'Phone number is required.';
  end if;
  if p_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then
    raise exception 'Enter a valid email address.';
  end if;

  v_summary := case p_type
    when 'airport' then format('%s arriving %s', p_fields->>'flight', p_fields->>'date')
    when 'hotel' then format('%s, %s → %s', p_fields->>'city', p_fields->>'checkin', p_fields->>'checkout')
    when 'government' then p_fields->>'service'
    when 'program' then case p_fields->>'program'
      when 'study' then 'Study Abroad Consultation'
      when 'media' then 'Media & Public Speaking Academy'
      when 'gulf' then 'Gulf & Overseas Employment'
      else p_fields->>'program'
    end
  end;

  if v_summary is null or trim(v_summary) = '' then
    raise exception 'Missing required details for this request type.';
  end if;

  if p_type = 'government' then
    v_service_label := p_fields->>'service';
  end if;

  insert into public.requests (type, type_label, summary, name, dob, phone, email, service_label, details)
  values (p_type, public.request_type_label(p_type), v_summary, trim(p_name), p_dob, trim(p_phone), trim(p_email), v_service_label, p_fields)
  returning * into v_row;

  return v_row;
end;
$$;

revoke execute on function public.submit_request from public, anon, authenticated;
grant execute on function public.submit_request to anon, authenticated;

-- Track a request. Must match ticket + name + dob exactly, mirroring the
-- old /api/requests/track behavior. Returns zero or one row.
create or replace function public.track_request(
  p_ticket text,
  p_name text,
  p_dob date
)
returns setof public.requests
language sql
security definer
set search_path = public
stable
as $$
  select *
  from public.requests
  where upper(ticket) = upper(trim(p_ticket))
    and lower(trim(name)) = lower(trim(p_name))
    and dob = p_dob;
$$;

revoke execute on function public.track_request from public, anon, authenticated;
grant execute on function public.track_request to anon, authenticated;

-- Pay an approved government-service fee. Demo-only, same as the old
-- /api/requests/:id/pay — wire to a real gateway before launch.
create or replace function public.pay_request(
  p_id bigint,
  p_method text
)
returns public.requests
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.requests;
begin
  if p_method not in ('bkash', 'nagad', 'card') then
    raise exception 'Choose a valid payment method.';
  end if;

  select * into v_row from public.requests where id = p_id;
  if not found then
    raise exception 'Request not found.';
  end if;
  if v_row.status <> 'approved' or v_row.fee is null then
    raise exception 'This request isn''t awaiting payment.';
  end if;

  update public.requests
    set status = 'paid', payment_method = p_method, updated_at = now()
    where id = p_id
    returning * into v_row;

  return v_row;
end;
$$;

revoke execute on function public.pay_request from public, anon, authenticated;
grant execute on function public.pay_request to anon, authenticated;

-- ---------------------------------------------------------------------
-- Staff-only RPCs (authenticated + must be in public.staff)
-- ---------------------------------------------------------------------

create or replace function public.staff_list_requests()
returns setof public.requests
language sql
security definer
set search_path = public
stable
as $$
  select * from public.requests
  where public.is_staff()
  order by id desc;
$$;

revoke execute on function public.staff_list_requests from public, anon, authenticated;
grant execute on function public.staff_list_requests to authenticated;

create or replace function public.staff_approve_request(
  p_id bigint,
  p_fee integer default null
)
returns public.requests
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.requests;
begin
  if not public.is_staff() then
    raise exception 'Staff access required.';
  end if;

  select * into v_row from public.requests where id = p_id;
  if not found then
    raise exception 'Request not found.';
  end if;
  if v_row.status <> 'received' then
    raise exception 'This request has already been reviewed.';
  end if;

  update public.requests
    set status = 'approved', fee = p_fee, updated_at = now()
    where id = p_id
    returning * into v_row;

  return v_row;
end;
$$;

revoke execute on function public.staff_approve_request from public, anon, authenticated;
grant execute on function public.staff_approve_request to authenticated;

create or replace function public.staff_reject_request(
  p_id bigint,
  p_note text default null
)
returns public.requests
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.requests;
begin
  if not public.is_staff() then
    raise exception 'Staff access required.';
  end if;

  select * into v_row from public.requests where id = p_id;
  if not found then
    raise exception 'Request not found.';
  end if;
  if v_row.status <> 'received' then
    raise exception 'This request has already been reviewed.';
  end if;

  update public.requests
    set status = 'rejected', decision_note = nullif(trim(p_note), ''), updated_at = now()
    where id = p_id
    returning * into v_row;

  return v_row;
end;
$$;

revoke execute on function public.staff_reject_request from public, anon, authenticated;
grant execute on function public.staff_reject_request to authenticated;

create or replace function public.staff_complete_request(
  p_id bigint
)
returns public.requests
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.requests;
begin
  if not public.is_staff() then
    raise exception 'Staff access required.';
  end if;

  select * into v_row from public.requests where id = p_id;
  if not found then
    raise exception 'Request not found.';
  end if;
  if not (v_row.status = 'paid' or (v_row.status = 'approved' and v_row.fee is null)) then
    raise exception 'Only approved (no fee) or paid requests can be marked complete.';
  end if;

  update public.requests
    set status = 'completed', completed_at = now(), updated_at = now()
    where id = p_id
    returning * into v_row;

  return v_row;
end;
$$;

revoke execute on function public.staff_complete_request from public, anon, authenticated;
grant execute on function public.staff_complete_request to authenticated;

-- ---------------------------------------------------------------------
-- Automatic customer confirmation: fire the notify-decision Edge Function
-- whenever a decision lands (approved / rejected / completed). This is what
-- makes "customer gets notified automatically" true at the database level,
-- independent of which client made the call.
-- ---------------------------------------------------------------------

-- The project URL and anon key below are hardcoded rather than read via
-- current_setting()/ALTER DATABASE ... SET: Supabase's managed `postgres`
-- role doesn't have permission to set database-level GUCs (`ALTER DATABASE
-- ... SET` fails with "permission denied to set parameter"), so a
-- session-config approach doesn't work on hosted Supabase. Both values are
-- public by design (the anon key is the same one the browser already ships
-- with) — replace them if this project is ever forked/recreated.
create or replace function public.trigger_notify_decision()
returns trigger
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_decision text;
  v_project_url constant text := 'https://dgxmouzxgbiigzmtalwo.supabase.co';
  v_anon_key constant text := 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRneG1vdXp4Z2JpaWd6bXRhbHdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgzMjk2NTksImV4cCI6MjEwMzkwNTY1OX0.FyXfnuch7I9aUA9-T09fpiUubV84cl6q4VFURswJPrU';
begin
  if new.status = old.status then
    return new;
  end if;

  v_decision := case new.status
    when 'approved' then 'approved'
    when 'rejected' then 'rejected'
    when 'completed' then 'completed'
    else null
  end;

  if v_decision is null then
    return new;
  end if;

  perform net.http_post(
    url := v_project_url || '/functions/v1/notify-decision',
    headers := jsonb_build_object('Content-Type', 'application/json', 'Authorization', 'Bearer ' || v_anon_key),
    body := jsonb_build_object(
      'decision', v_decision,
      'ticket', new.ticket,
      'type', new.type_label,
      'summary', new.summary,
      'name', new.name,
      'email', new.email,
      'fee', new.fee,
      'decisionNote', new.decision_note
    )
  );

  update public.requests set notified_at = now() where id = new.id;

  return new;
end;
$$;

revoke execute on function public.trigger_notify_decision from public, anon, authenticated;

drop trigger if exists trg_notify_decision on public.requests;
create trigger trg_notify_decision
  after update on public.requests
  for each row
  execute function public.trigger_notify_decision();
