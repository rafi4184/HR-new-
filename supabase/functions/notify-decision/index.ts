// Supabase Edge Function: sends the automatic customer confirmation email
// for a request's lifecycle — received on submission, then approve /
// reject / complete. Invoked by trg_notify_received (AFTER INSERT) and
// trg_notify_decision (AFTER UPDATE) — never called directly by the
// browser. Kept as one function/one Resend integration rather than
// splitting "received" into its own function.
//
// Sends a real email via Resend when RESEND_API_KEY (and optionally
// NOTIFY_FROM_EMAIL) are set as function secrets; otherwise logs what would
// have been sent, so the flow is testable before email is wired up:
//
//   supabase secrets set RESEND_API_KEY=re_xxx NOTIFY_FROM_EMAIL="HR — The Mediator <concierge@hrthemediator.com>"

interface DecisionPayload {
  decision: "received" | "approved" | "rejected" | "completed";
  ticket: string;
  type: string;
  summary: string;
  name: string;
  email: string;
  fee: number | null;
  decisionNote: string | null;
}

function subjectFor(p: DecisionPayload) {
  switch (p.decision) {
    case "received":
      return `We've received your request — ${p.ticket}`;
    case "approved":
      return `Your request ${p.ticket} has been approved`;
    case "rejected":
      return `Update on your request ${p.ticket}`;
    case "completed":
      return `Your request ${p.ticket} is complete`;
  }
}

function bodyFor(p: DecisionPayload) {
  switch (p.decision) {
    case "received":
      return (
        `Hi ${p.name},\n\nThanks — we've received your ${p.type} request.\n\n` +
        `Ticket number: ${p.ticket}\nRequest: ${p.summary}\n\n` +
        `Save this ticket number — you'll need it along with your name and date of birth to track ` +
        `the status of this request. Our desk will review it and be in touch.\n\n— HR — The Mediator`
      );
    case "approved":
      return (
        `Hi ${p.name},\n\nYour ${p.type} request (${p.ticket}) has been approved by the desk.` +
        (p.fee != null ? `\n\nA fee of ৳${p.fee.toLocaleString()} is due — you can pay it from the tracking page.` : "") +
        `\n\n— HR — The Mediator`
      );
    case "rejected":
      return (
        `Hi ${p.name},\n\nYour ${p.type} request (${p.ticket}) could not be approved.` +
        (p.decisionNote ? `\n\nNote from the desk: ${p.decisionNote}` : "") +
        `\n\nPlease contact us if you'd like to discuss this.\n\n— HR — The Mediator`
      );
    case "completed":
      return `Hi ${p.name},\n\nYour ${p.type} request (${p.ticket}) has been completed. Thank you for using HR — The Mediator.\n\n— HR — The Mediator`;
  }
}

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const payload = (await req.json()) as DecisionPayload;
  const subject = subjectFor(payload);
  const body = bodyFor(payload);

  const resendKey = Deno.env.get("RESEND_API_KEY");
  const fromEmail = Deno.env.get("NOTIFY_FROM_EMAIL") ?? "HR — The Mediator <onboarding@resend.dev>";

  if (!resendKey) {
    console.log(`[notification simulated] To: ${payload.email} | Subject: ${subject}\n${body}`);
    return new Response(JSON.stringify({ simulated: true }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: payload.email,
        subject,
        text: body,
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      console.error("Resend send failed:", res.status, detail);
      return new Response(JSON.stringify({ simulated: true, error: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ simulated: false }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Failed to send confirmation email:", err);
    return new Response(JSON.stringify({ simulated: true, error: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
});
