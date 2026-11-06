-- ARK Property Solution rebrand: the site has pivoted from a Bangladesh
-- concierge/visa consultancy to a Sydney, NSW real estate agency. Add the
-- new enquiry types (sales, property management, buyer's agency, general)
-- alongside the existing ones (kept for historical record, not removed),
-- and rename the generated ticket prefix from "HRM-" to "ARK-" for new rows.

alter table public.requests drop constraint requests_type_check;
alter table public.requests add constraint requests_type_check
  check (type in ('airport', 'hotel', 'government', 'program', 'spain-visa',
                   'property-sales', 'property-management', 'buyers-agency', 'general-enquiry'));

-- Generated columns can't have their expression altered in place — drop and
-- recreate. Existing rows keep their already-computed "HRM-..." value
-- (ticket is `generated ... stored`, so past values are preserved in
-- storage); only the expression used for *new* rows changes.
alter table public.requests drop column ticket;
alter table public.requests add column ticket text generated always as ('ARK-' || id::text) stored unique;

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
    when 'property-sales' then 'Real Estate Sales Enquiry'
    when 'property-management' then 'Property Management Enquiry'
    when 'buyers-agency' then 'Buyer''s Agency Enquiry'
    when 'general-enquiry' then 'General Enquiry'
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
  if p_type not in ('airport', 'hotel', 'government', 'program', 'spain-visa',
                     'property-sales', 'property-management', 'buyers-agency', 'general-enquiry') then
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
    when 'program' then p_fields->>'program'
    when 'spain-visa' then p_fields->>'visaType'
    when 'property-sales' then p_fields->>'propertyAddress'
    when 'property-management' then p_fields->>'propertyAddress'
    when 'buyers-agency' then p_fields->>'areaOfInterest'
    when 'general-enquiry' then coalesce(p_fields->>'enquiryType', 'General enquiry')
  end;

  if v_summary is null or trim(v_summary) = '' then
    raise exception 'Missing required details for this request type.';
  end if;

  v_service_label := case p_type
    when 'government' then p_fields->>'service'
    when 'spain-visa' then p_fields->>'visaType'
    when 'property-sales' then p_fields->>'propertyType'
    when 'property-management' then p_fields->>'propertyType'
    when 'buyers-agency' then p_fields->>'propertyType'
    else null
  end;

  insert into public.requests (type, type_label, summary, name, dob, phone, email, service_label, details)
  values (p_type, public.request_type_label(p_type), v_summary, trim(p_name), p_dob, trim(p_phone), trim(p_email), v_service_label, p_fields)
  returning * into v_row;

  return v_row;
end;
$$;
