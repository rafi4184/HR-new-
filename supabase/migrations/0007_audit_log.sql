-- HR — The Mediator: audit log.
-- Every consequential staff/admin/executive action (approve, reject,
-- complete, create/remove/reassign a staff account, reset a password)
-- gets a row here — who (by Staff ID), what, on what, and when. Admin-only
-- to read; nothing but SECURITY DEFINER functions can write to it, so a
-- compromised client session can't forge or erase history.

create table if not exists public.audit_log (
  id             bigint generated always as identity primary key,
  actor_user_id  uuid references auth.users (id) on delete set null,
  actor_staff_id text,
  action         text not null,
  entity         text not null,
  entity_id      text,
  metadata       jsonb not null default '{}'::jsonb,
  created_at     timestamptz not null default now()
);

alter table public.audit_log enable row level security;
revoke all on public.audit_log from anon, authenticated;

create index if not exists audit_log_created_at_idx on public.audit_log (created_at desc);

-- Internal helper — not granted to clients directly. Called from inside
-- the other SECURITY DEFINER functions below, which already run with
-- elevated rights, so no separate grant is needed for those calls to work.
create or replace function public.log_audit(
  p_action text,
  p_entity text,
  p_entity_id text,
  p_metadata jsonb default '{}'::jsonb
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.audit_log (actor_user_id, actor_staff_id, action, entity, entity_id, metadata)
  values (
    auth.uid(),
    (select staff_id from public.staff where user_id = auth.uid()),
    p_action, p_entity, p_entity_id, coalesce(p_metadata, '{}'::jsonb)
  );
end;
$$;

revoke execute on function public.log_audit from public, anon, authenticated;

create or replace function public.admin_list_audit_log(p_limit integer default 100, p_before timestamptz default null)
returns setof public.audit_log
language sql
security definer
set search_path = public
stable
as $$
  select * from public.audit_log
  where public.is_admin()
    and (p_before is null or created_at < p_before)
  order by created_at desc
  limit least(coalesce(p_limit, 100), 200);
$$;

revoke execute on function public.admin_list_audit_log from public, anon, authenticated;
grant execute on function public.admin_list_audit_log to authenticated;

-- ---------------------------------------------------------------------
-- Wire logging into the actions that actually matter.

create or replace function public.staff_approve_request(p_id bigint, p_fee integer default null)
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

  perform public.log_audit('approve_request', 'service_request', p_id::text, jsonb_build_object('ticket', v_row.ticket, 'fee', p_fee));

  return v_row;
end;
$$;

create or replace function public.staff_reject_request(p_id bigint, p_note text default null)
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

  perform public.log_audit('reject_request', 'service_request', p_id::text, jsonb_build_object('ticket', v_row.ticket, 'note', v_row.decision_note));

  return v_row;
end;
$$;

create or replace function public.staff_complete_request(p_id bigint)
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

  perform public.log_audit('complete_request', 'service_request', p_id::text, jsonb_build_object('ticket', v_row.ticket));

  return v_row;
end;
$$;

create or replace function public.admin_set_staff_role(
  p_user_id uuid,
  p_role text,
  p_manager_id uuid default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_old_role text;
  v_target_staff_id text;
begin
  if not public.is_admin() then
    raise exception 'Admin access required.';
  end if;
  if p_role not in ('admin', 'executive', 'staff') then
    raise exception 'Invalid role.';
  end if;
  if p_user_id = auth.uid() and p_role <> 'admin' then
    raise exception 'You can''t remove your own admin access.';
  end if;
  if p_role = 'staff' and p_manager_id is not null
     and not exists (select 1 from public.staff where user_id = p_manager_id and role = 'executive') then
    raise exception 'That manager is not an executive.';
  end if;

  select role, staff_id into v_old_role, v_target_staff_id from public.staff where user_id = p_user_id;

  update public.staff
    set role = p_role,
        is_admin = (p_role = 'admin'),
        manager_id = case when p_role = 'staff' then p_manager_id else null end
    where user_id = p_user_id;
  if not found then
    raise exception 'Staff member not found.';
  end if;

  perform public.log_audit('set_staff_role', 'staff', p_user_id::text, jsonb_build_object('staff_id', v_target_staff_id, 'from_role', v_old_role, 'to_role', p_role));
end;
$$;

create or replace function public.admin_remove_staff(p_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_target_staff_id text;
begin
  if not public.is_admin() then
    raise exception 'Admin access required.';
  end if;
  if p_user_id = auth.uid() then
    raise exception 'You can''t remove your own staff access.';
  end if;
  delete from public.staff where user_id = p_user_id returning staff_id into v_target_staff_id;

  if v_target_staff_id is not null then
    perform public.log_audit('remove_staff', 'staff', p_user_id::text, jsonb_build_object('staff_id', v_target_staff_id));
  end if;
end;
$$;

create or replace function public.executive_remove_staff(p_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_target_staff_id text;
begin
  if not public.is_executive() then
    raise exception 'Executive access required.';
  end if;
  delete from public.staff
    where user_id = p_user_id and manager_id = auth.uid() and role = 'staff'
    returning staff_id into v_target_staff_id;
  if v_target_staff_id is null then
    raise exception 'That staff member is not on your team.';
  end if;

  perform public.log_audit('remove_staff', 'staff', p_user_id::text, jsonb_build_object('staff_id', v_target_staff_id));
end;
$$;
