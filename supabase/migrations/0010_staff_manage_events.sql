-- HR — The Mediator: let any staff account (not just admins) manage
-- events — post recent success stories/seminars with photos, edit them,
-- and delete them — while keeping it off-limits to the public. Contacts
-- and staff-management stay admin-only; this widens events specifically
-- per the business owner's request that both admin and regular staff can
-- post updates that everyone visiting the site can then see.

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
  if not public.is_staff() then
    raise exception 'Staff access required.';
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

create or replace function public.admin_delete_event(p_id bigint)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_staff() then
    raise exception 'Staff access required.';
  end if;
  delete from public.events where id = p_id;
end;
$$;

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
  if not public.is_staff() then
    raise exception 'Staff access required.';
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

create or replace function public.admin_delete_event_media(p_id bigint)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_path text;
begin
  if not public.is_staff() then
    raise exception 'Staff access required.';
  end if;
  select storage_path into v_path from public.event_media where id = p_id;
  delete from public.event_media where id = p_id;
  if v_path is not null then
    delete from storage.objects where bucket_id = 'event-media' and name = v_path;
  end if;
end;
$$;

-- Storage policies: any staff account (not just admins) may upload/replace/
-- remove event media; public read stays unchanged.
drop policy if exists "event-media admin write" on storage.objects;
drop policy if exists "event-media staff write" on storage.objects;
create policy "event-media staff write"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'event-media' and public.is_staff());

drop policy if exists "event-media admin update" on storage.objects;
drop policy if exists "event-media staff update" on storage.objects;
create policy "event-media staff update"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'event-media' and public.is_staff())
  with check (bucket_id = 'event-media' and public.is_staff());

drop policy if exists "event-media admin delete" on storage.objects;
drop policy if exists "event-media staff delete" on storage.objects;
create policy "event-media staff delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'event-media' and public.is_staff());
