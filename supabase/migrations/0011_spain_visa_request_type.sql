-- HR — The Mediator: add a "spain-visa" request type so visitors can
-- request a Spain visa consultation (Digital Nomad, Student, Permanent
-- Residency, Work) through the same request/ticket system as every other
-- service, as part of repositioning the site around Spain visa consulting.

alter table public.requests drop constraint requests_type_check;
alter table public.requests add constraint requests_type_check
  check (type in ('airport', 'hotel', 'government', 'program', 'spain-visa'));

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
    when 'spain-visa' then 'Spain Visa Consultation'
  end;
$$;

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
  if p_type not in ('airport', 'hotel', 'government', 'program', 'spain-visa') then
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
    when 'spain-visa' then p_fields->>'visaType'
  end;

  if v_summary is null or trim(v_summary) = '' then
    raise exception 'Missing required details for this request type.';
  end if;

  if p_type = 'government' then
    v_service_label := p_fields->>'service';
  elsif p_type = 'spain-visa' then
    v_service_label := p_fields->>'visaType';
  end if;

  insert into public.requests (type, type_label, summary, name, dob, phone, email, service_label, details)
  values (p_type, public.request_type_label(p_type), v_summary, trim(p_name), p_dob, trim(p_phone), trim(p_email), v_service_label, p_fields)
  returning * into v_row;

  return v_row;
end;
$$;
