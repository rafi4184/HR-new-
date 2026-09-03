-- Show a staff member's manager by Staff ID, not by their (placeholder,
-- never-meant-to-be-seen) auth email — keeps the admin panel free of
-- email entirely, matching staff-id based login.

drop function if exists public.admin_list_staff();

create function public.admin_list_staff()
returns table (
  user_id uuid, is_admin boolean, role text,
  manager_id uuid, manager_staff_id text, staff_id text, created_at timestamptz
)
language sql
security definer
set search_path = public
stable
as $$
  select s.user_id, s.is_admin, s.role, s.manager_id, ms.staff_id, s.staff_id, s.created_at
  from public.staff s
  left join public.staff ms on ms.user_id = s.manager_id
  where public.is_admin()
  order by s.created_at;
$$;

revoke execute on function public.admin_list_staff from public, anon, authenticated;
grant execute on function public.admin_list_staff to authenticated;

drop function if exists public.executive_list_staff();

create function public.executive_list_staff()
returns table (user_id uuid, staff_id text, created_at timestamptz)
language sql
security definer
set search_path = public
stable
as $$
  select s.user_id, s.staff_id, s.created_at
  from public.staff s
  where public.is_executive() and s.manager_id = auth.uid()
  order by s.created_at;
$$;

revoke execute on function public.executive_list_staff from public, anon, authenticated;
grant execute on function public.executive_list_staff to authenticated;
