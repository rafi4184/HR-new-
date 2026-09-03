-- HR — The Mediator: automatic "we've received your request" email.
-- Mirrors trg_notify_decision (0001_init.sql), but fires once on INSERT
-- instead of on a status change, and always sends decision = 'received'.
-- Same notify-decision Edge Function handles both, using pg_net so the
-- request submission itself doesn't wait on email delivery.

create or replace function public.trigger_notify_received()
returns trigger
language plpgsql
security definer
set search_path = 'public', 'extensions'
as $$
declare
  v_project_url constant text := 'https://dgxmouzxgbiigzmtalwo.supabase.co';
  v_anon_key constant text := 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRneG1vdXp4Z2JpaWd6bXRhbHdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgzMjk2NTksImV4cCI6MjEwMzkwNTY1OX0.FyXfnuch7I9aUA9-T09fpiUubV84cl6q4VFURswJPrU';
begin
  perform net.http_post(
    url := v_project_url || '/functions/v1/notify-decision',
    headers := jsonb_build_object('Content-Type', 'application/json', 'Authorization', 'Bearer ' || v_anon_key),
    body := jsonb_build_object(
      'decision', 'received',
      'ticket', new.ticket,
      'type', new.type_label,
      'summary', new.summary,
      'name', new.name,
      'email', new.email,
      'fee', new.fee,
      'decisionNote', new.decision_note
    )
  );

  return new;
end;
$$;

drop trigger if exists trg_notify_received on public.requests;
create trigger trg_notify_received
  after insert on public.requests
  for each row execute function public.trigger_notify_received();
