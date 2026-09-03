-- HR — The Mediator: admin content management
-- Adds an admin tier above plain staff, self-service editable contacts,
-- an events/media system (Supabase Storage), and admin-managed staff
-- accounts. Same pattern as 0001: every table is RLS-locked with zero
-- grants, all access goes through SECURITY DEFINER RPCs.

-- ---------------------------------------------------------------------
-- Admins are staff with a flag. Existing staff row(s) stay plain staff
-- unless promoted below.
-- ---------------------------------------------------------------------

alter table public.staff add column if not exists is_admin boolean not null default false;

update public.staff s
set is_admin = true
from auth.users u
where u.id = s.user_id and u.email = 'hrthemediator@gmail.com';

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (select 1 from public.staff where user_id = auth.uid() and is_admin);
$$;

revoke execute on function public.is_admin from public, anon, authenticated;

-- Tells the client who's signed in without a separate "am I admin" round trip.
create or replace function public.whoami()
returns table (user_id uuid, email text, is_admin boolean)
language sql
security definer
set search_path = public
stable
as $$
  select u.id, u.email::text, coalesce(s.is_admin, false)
  from auth.users u
  left join public.staff s on s.user_id = u.id
  where u.id = auth.uid();
$$;

revoke execute on function public.whoami from public, anon, authenticated;
grant execute on function public.whoami to authenticated;

-- ---------------------------------------------------------------------
-- Contacts (the "Reach the desk" / "Find us" block) — admin-editable.
-- ---------------------------------------------------------------------

create table if not exists public.contacts (
  id          bigint generated always as identity primary key,
  label       text not null,
  phone       text,
  email       text,
  address     text,
  whatsapp    text,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.contacts enable row level security;
revoke all on public.contacts from anon, authenticated;

create or replace function public.list_contacts()
returns setof public.contacts
language sql
security definer
set search_path = public
stable
as $$
  select * from public.contacts order by sort_order, id;
$$;

revoke execute on function public.list_contacts from public, anon, authenticated;
grant execute on function public.list_contacts to anon, authenticated;

create or replace function public.admin_upsert_contact(
  p_id bigint,
  p_label text,
  p_phone text,
  p_email text,
  p_address text,
  p_whatsapp text,
  p_sort_order integer default 0
)
returns public.contacts
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.contacts;
begin
  if not public.is_admin() then
    raise exception 'Admin access required.';
  end if;
  if coalesce(trim(p_label), '') = '' then
    raise exception 'Label is required.';
  end if;

  if p_id is null then
    insert into public.contacts (label, phone, email, address, whatsapp, sort_order)
    values (trim(p_label), nullif(trim(p_phone), ''), nullif(trim(p_email), ''), nullif(trim(p_address), ''), nullif(trim(p_whatsapp), ''), coalesce(p_sort_order, 0))
    returning * into v_row;
  else
    update public.contacts
      set label = trim(p_label), phone = nullif(trim(p_phone), ''), email = nullif(trim(p_email), ''),
          address = nullif(trim(p_address), ''), whatsapp = nullif(trim(p_whatsapp), ''),
          sort_order = coalesce(p_sort_order, 0), updated_at = now()
      where id = p_id
      returning * into v_row;
    if not found then
      raise exception 'Contact not found.';
    end if;
  end if;

  return v_row;
end;
$$;

revoke execute on function public.admin_upsert_contact from public, anon, authenticated;
grant execute on function public.admin_upsert_contact to authenticated;

create or replace function public.admin_delete_contact(p_id bigint)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'Admin access required.';
  end if;
  delete from public.contacts where id = p_id;
end;
$$;

revoke execute on function public.admin_delete_contact from public, anon, authenticated;
grant execute on function public.admin_delete_contact to authenticated;

-- ---------------------------------------------------------------------
-- Events + media (photos/video), stored in Supabase Storage.
-- ---------------------------------------------------------------------

create table if not exists public.events (
  id            bigint generated always as identity primary key,
  title         text not null,
  description   text,
  event_date    date,
  location      text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create table if not exists public.event_media (
  id            bigint generated always as identity primary key,
  event_id      bigint not null references public.events (id) on delete cascade,
  media_type    text not null check (media_type in ('image', 'video')),
  storage_path  text not null,
  sort_order    integer not null default 0,
  created_at    timestamptz not null default now()
);

create index if not exists idx_event_media_event_id on public.event_media (event_id);

alter table public.events enable row level security;
alter table public.event_media enable row level security;
revoke all on public.events from anon, authenticated;
revoke all on public.event_media from anon, authenticated;

create or replace function public.list_events()
returns table (
  id bigint, title text, description text, event_date date, location text,
  created_at timestamptz, updated_at timestamptz, media jsonb
)
language sql
security definer
set search_path = public
stable
as $$
  select e.id, e.title, e.description, e.event_date, e.location, e.created_at, e.updated_at,
    coalesce(
      (select jsonb_agg(jsonb_build_object('id', m.id, 'mediaType', m.media_type, 'storagePath', m.storage_path) order by m.sort_order, m.id)
       from public.event_media m where m.event_id = e.id),
      '[]'::jsonb
    ) as media
  from public.events e
  order by e.event_date desc nulls last, e.id desc;
$$;

revoke execute on function public.list_events from public, anon, authenticated;
grant execute on function public.list_events to anon, authenticated;

create or replace function public.admin_upsert_event(
  p_id bigint,
  p_title text,
  p_description text,
  p_event_date date,
  p_location text
)
returns public.events
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.events;
begin
  if not public.is_admin() then
    raise exception 'Admin access required.';
  end if;
  if coalesce(trim(p_title), '') = '' then
    raise exception 'Title is required.';
  end if;

  if p_id is null then
    insert into public.events (title, description, event_date, location)
    values (trim(p_title), nullif(trim(p_description), ''), p_event_date, nullif(trim(p_location), ''))
    returning * into v_row;
  else
    update public.events
      set title = trim(p_title), description = nullif(trim(p_description), ''),
          event_date = p_event_date, location = nullif(trim(p_location), ''), updated_at = now()
      where id = p_id
      returning * into v_row;
    if not found then
      raise exception 'Event not found.';
    end if;
  end if;

  return v_row;
end;
$$;

revoke execute on function public.admin_upsert_event from public, anon, authenticated;
grant execute on function public.admin_upsert_event to authenticated;

create or replace function public.admin_delete_event(p_id bigint)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'Admin access required.';
  end if;
  delete from public.events where id = p_id;
end;
$$;

revoke execute on function public.admin_delete_event from public, anon, authenticated;
grant execute on function public.admin_delete_event to authenticated;

create or replace function public.admin_add_event_media(
  p_event_id bigint,
  p_media_type text,
  p_storage_path text,
  p_sort_order integer default 0
)
returns public.event_media
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.event_media;
begin
  if not public.is_admin() then
    raise exception 'Admin access required.';
  end if;
  if p_media_type not in ('image', 'video') then
    raise exception 'Invalid media type.';
  end if;

  insert into public.event_media (event_id, media_type, storage_path, sort_order)
  values (p_event_id, p_media_type, p_storage_path, coalesce(p_sort_order, 0))
  returning * into v_row;

  return v_row;
end;
$$;

revoke execute on function public.admin_add_event_media from public, anon, authenticated;
grant execute on function public.admin_add_event_media to authenticated;

create or replace function public.admin_delete_event_media(p_id bigint)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_path text;
begin
  if not public.is_admin() then
    raise exception 'Admin access required.';
  end if;
  select storage_path into v_path from public.event_media where id = p_id;
  delete from public.event_media where id = p_id;
  if v_path is not null then
    delete from storage.objects where bucket_id = 'event-media' and name = v_path;
  end if;
end;
$$;

revoke execute on function public.admin_delete_event_media from public, anon, authenticated;
grant execute on function public.admin_delete_event_media to authenticated;

-- ---------------------------------------------------------------------
-- Storage bucket for event photos/video. Public read (so the site can
-- show them to visitors with no auth); writes are admin-only.
-- ---------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('event-media', 'event-media', true)
on conflict (id) do nothing;

drop policy if exists "event-media public read" on storage.objects;
create policy "event-media public read"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'event-media');

drop policy if exists "event-media admin write" on storage.objects;
create policy "event-media admin write"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'event-media' and public.is_admin());

drop policy if exists "event-media admin update" on storage.objects;
create policy "event-media admin update"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'event-media' and public.is_admin())
  with check (bucket_id = 'event-media' and public.is_admin());

drop policy if exists "event-media admin delete" on storage.objects;
create policy "event-media admin delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'event-media' and public.is_admin());

-- ---------------------------------------------------------------------
-- Admin staff management. Creating an auth user needs the service_role
-- key, which SQL can't hold — that part is a separate Edge Function
-- (admin-create-staff). These RPCs cover the rest: listing, promoting,
-- and removing staff access.
-- ---------------------------------------------------------------------

create or replace function public.admin_list_staff()
returns table (user_id uuid, email text, is_admin boolean, created_at timestamptz)
language sql
security definer
set search_path = public
stable
as $$
  select s.user_id, u.email::text, s.is_admin, s.created_at
  from public.staff s
  join auth.users u on u.id = s.user_id
  where public.is_admin()
  order by s.created_at;
$$;

revoke execute on function public.admin_list_staff from public, anon, authenticated;
grant execute on function public.admin_list_staff to authenticated;

create or replace function public.admin_set_staff_admin(p_user_id uuid, p_is_admin boolean)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'Admin access required.';
  end if;
  if p_user_id = auth.uid() and not p_is_admin then
    raise exception 'You can''t remove your own admin access.';
  end if;
  update public.staff set is_admin = p_is_admin where user_id = p_user_id;
  if not found then
    raise exception 'Staff member not found.';
  end if;
end;
$$;

revoke execute on function public.admin_set_staff_admin from public, anon, authenticated;
grant execute on function public.admin_set_staff_admin to authenticated;

create or replace function public.admin_remove_staff(p_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'Admin access required.';
  end if;
  if p_user_id = auth.uid() then
    raise exception 'You can''t remove your own staff access.';
  end if;
  delete from public.staff where user_id = p_user_id;
end;
$$;

revoke execute on function public.admin_remove_staff from public, anon, authenticated;
grant execute on function public.admin_remove_staff to authenticated;
