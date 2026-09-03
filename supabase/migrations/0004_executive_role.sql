-- HR — The Mediator: Admin > Executive > Staff hierarchy.
-- Executives are a new tier between plain staff and full admins: an admin
-- assigns which executive a staff member reports to at creation time, and
-- that executive can then manage (reset password / remove access) only the
-- staff assigned to them — never other executives' staff, and never the
-- site's contacts/events content, which stays admin-only.

alter table public.staff
  add column if not exists role text not null default 'staff'
    check (role in ('admin', 'executive', 'staff')),
  add column if not exists manager_id uuid references public.staff (user_id) on delete set null;

-- Backfill: existing admins keep their role, everyone else is plain staff.
update public.staff set role = 'admin' where is_admin and role <> 'admin';

create index if not exists staff_manager_id_idx on public.staff (manager_id);

create or replace function public.is_executive()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (select 1 from public.staff where user_id = auth.uid() and role = 'executive');
$$;

revoke execute on function public.is_executive from public, anon, authenticated;

drop function if exists public.whoami();

-- whoami() now also tells the client the caller's role and (for staff) who
-- their executive is, so the UI can decide which panel to render.
create function public.whoami()
returns table (user_id uuid, email text, is_admin boolean, role text, manager_id uuid)
language sql
security definer
set search_path = public
stable
as $$
  select u.id, u.email::text, coalesce(s.is_admin, false), coalesce(s.role, 'staff'), s.manager_id
  from auth.users u
  left join public.staff s on s.user_id = u.id
  where u.id = auth.uid();
$$;

revoke execute on function public.whoami from public, anon, authenticated;
grant execute on function public.whoami to authenticated;

drop function if exists public.admin_list_staff();

-- admin_list_staff() now also surfaces role and who each staff member
-- reports to (by email, so the UI doesn't need a second round trip).
create function public.admin_list_staff()
returns table (
  user_id uuid, email text, is_admin boolean, role text,
  manager_id uuid, manager_email text, created_at timestamptz
)
language sql
security definer
set search_path = public
stable
as $$
  select s.user_id, u.email::text, s.is_admin, s.role, s.manager_id, m.email::text, s.created_at
  from public.staff s
  join auth.users u on u.id = s.user_id
  left join public.staff ms on ms.user_id = s.manager_id
  left join auth.users m on m.id = ms.user_id
  where public.is_admin()
  order by s.created_at;
$$;

revoke execute on function public.admin_list_staff from public, anon, authenticated;
grant execute on function public.admin_list_staff to authenticated;

-- Lets an admin change someone's role and (for staff) reassign who they
-- report to, in one call. Replaces the old admin-only-toggles-is_admin
-- flow with the full three-tier model.
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

  update public.staff
    set role = p_role,
        is_admin = (p_role = 'admin'),
        manager_id = case when p_role = 'staff' then p_manager_id else null end
    where user_id = p_user_id;
  if not found then
    raise exception 'Staff member not found.';
  end if;
end;
$$;

revoke execute on function public.admin_set_staff_role from public, anon, authenticated;
grant execute on function public.admin_set_staff_role to authenticated;

-- An executive's own scoped view of their team — only the staff rows
-- where manager_id points back at them.
create or replace function public.executive_list_staff()
returns table (user_id uuid, email text, created_at timestamptz)
language sql
security definer
set search_path = public
stable
as $$
  select s.user_id, u.email::text, s.created_at
  from public.staff s
  join auth.users u on u.id = s.user_id
  where public.is_executive() and s.manager_id = auth.uid()
  order by s.created_at;
$$;

revoke execute on function public.executive_list_staff from public, anon, authenticated;
grant execute on function public.executive_list_staff to authenticated;

-- An executive can drop staff access for their own team only — never for
-- another executive's staff, and never for another executive or admin.
create or replace function public.executive_remove_staff(p_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_executive() then
    raise exception 'Executive access required.';
  end if;
  delete from public.staff
    where user_id = p_user_id and manager_id = auth.uid() and role = 'staff';
  if not found then
    raise exception 'That staff member is not on your team.';
  end if;
end;
$$;

revoke execute on function public.executive_remove_staff from public, anon, authenticated;
grant execute on function public.executive_remove_staff to authenticated;
