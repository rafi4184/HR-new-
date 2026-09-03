-- HR — The Mediator: staff sign in with a Staff ID, not an email.
-- Supabase Auth still requires *an* email under the hood for every
-- account, but nobody using this app ever needs to see or type one:
-- admin picks a Staff ID + password when creating an account, and the
-- staff-login Edge Function resolves that ID to the right account
-- server-side and signs in on their behalf. Existing accounts (which do
-- have real emails) get a staff_id backfilled from their email's local
-- part so they keep working exactly as before.

alter table public.staff add column if not exists staff_id text;

update public.staff s
set staff_id = lower(split_part(u.email, '@', 1))
from auth.users u
where u.id = s.user_id and s.staff_id is null;

alter table public.staff alter column staff_id set not null;
create unique index if not exists staff_staff_id_idx on public.staff (staff_id);

drop function if exists public.whoami();

create function public.whoami()
returns table (user_id uuid, email text, is_admin boolean, role text, manager_id uuid, staff_id text)
language sql
security definer
set search_path = public
stable
as $$
  select u.id, u.email::text, coalesce(s.is_admin, false), coalesce(s.role, 'staff'), s.manager_id, s.staff_id
  from auth.users u
  left join public.staff s on s.user_id = u.id
  where u.id = auth.uid();
$$;

revoke execute on function public.whoami from public, anon, authenticated;
grant execute on function public.whoami to authenticated;

drop function if exists public.admin_list_staff();

create function public.admin_list_staff()
returns table (
  user_id uuid, email text, is_admin boolean, role text,
  manager_id uuid, manager_email text, staff_id text, created_at timestamptz
)
language sql
security definer
set search_path = public
stable
as $$
  select s.user_id, u.email::text, s.is_admin, s.role, s.manager_id, m.email::text, s.staff_id, s.created_at
  from public.staff s
  join auth.users u on u.id = s.user_id
  left join public.staff ms on ms.user_id = s.manager_id
  left join auth.users m on m.id = ms.user_id
  where public.is_admin()
  order by s.created_at;
$$;

revoke execute on function public.admin_list_staff from public, anon, authenticated;
grant execute on function public.admin_list_staff to authenticated;

drop function if exists public.executive_list_staff();

create function public.executive_list_staff()
returns table (user_id uuid, email text, staff_id text, created_at timestamptz)
language sql
security definer
set search_path = public
stable
as $$
  select s.user_id, u.email::text, s.staff_id, s.created_at
  from public.staff s
  join auth.users u on u.id = s.user_id
  where public.is_executive() and s.manager_id = auth.uid()
  order by s.created_at;
$$;

revoke execute on function public.executive_list_staff from public, anon, authenticated;
grant execute on function public.executive_list_staff to authenticated;
