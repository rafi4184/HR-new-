-- HR — The Mediator: let an admin delete a service request.
-- Soft delete (deleted_at), not a hard DELETE — keeps the row for audit/
-- compliance purposes (this is a government-liaison business; customer
-- case records shouldn't just vanish) while removing it from every staff
-- view. Logged to audit_log like every other consequential action.

alter table public.requests add column if not exists deleted_at timestamptz;

create or replace function public.track_request(p_ticket text, p_name text, p_dob date)
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
    and dob = p_dob
    and deleted_at is null;
$$;

create or replace function public.staff_list_requests()
returns setof public.requests
language sql
security definer
set search_path = public
stable
as $$
  select * from public.requests
  where public.is_staff() and deleted_at is null
  order by id desc;
$$;

create or replace function public.admin_delete_request(p_id bigint)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ticket text;
begin
  if not public.is_admin() then
    raise exception 'Admin access required.';
  end if;

  update public.requests set deleted_at = now()
    where id = p_id and deleted_at is null
    returning ticket into v_ticket;

  if v_ticket is null then
    raise exception 'Request not found.';
  end if;

  perform public.log_audit('delete_request', 'service_request', p_id::text, jsonb_build_object('ticket', v_ticket));
end;
$$;

revoke execute on function public.admin_delete_request from public, anon, authenticated;
grant execute on function public.admin_delete_request to authenticated;
