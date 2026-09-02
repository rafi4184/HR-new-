import nodemailer from "nodemailer";

const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, FROM_EMAIL } = process.env;
const smtpConfigured = Boolean(SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS);

let transporter = null;
function getTransporter() {
  if (!smtpConfigured) return null;
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: Number(SMTP_PORT) === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });
  }
  return transporter;
}

const SUBJECTS = {
  approved: (r) => `Your request ${r.ticket} has been approved`,
  rejected: (r) => `Update on your request ${r.ticket}`,
  completed: (r) => `Your request ${r.ticket} is complete`,
};

const BODIES = {
  approved: (r) =>
    `Hi ${r.name},\n\nYour ${r.type} request (${r.ticket}) has been approved by the desk.` +
    (r.fee != null ? `\n\nA fee of ৳${r.fee.toLocaleString()} is due — you can pay it from the tracking page.` : "") +
    `\n\n— HR — The Mediator`,
  rejected: (r) =>
    `Hi ${r.name},\n\nYour ${r.type} request (${r.ticket}) could not be approved.` +
    (r.decisionNote ? `\n\nNote from the desk: ${r.decisionNote}` : "") +
    `\n\nPlease contact us if you'd like to discuss this.\n\n— HR — The Mediator`,
  completed: (r) =>
    `Hi ${r.name},\n\nYour ${r.type} request (${r.ticket}) has been completed. Thank you for using HR — The Mediator.\n\n— HR — The Mediator`,
};

/**
 * Fires the automatic customer confirmation for a staff decision. Sends a real
 * email when SMTP_* env vars are configured; otherwise logs what would have
 * been sent, so the confirmation trigger is still visible and testable.
 */
export async function notifyDecision(request, decision) {
  const subject = SUBJECTS[decision](request);
  const body = BODIES[decision](request);

  const tx = getTransporter();
  if (!tx) {
    console.log(`[notification simulated] To: ${request.email} | Subject: ${subject}\n${body}\n`);
    return { simulated: true };
  }

  try {
    await tx.sendMail({ from: FROM_EMAIL || SMTP_USER, to: request.email, subject, text: body });
    return { simulated: false };
  } catch (err) {
    console.error("Failed to send confirmation email:", err.message);
    return { simulated: true, error: true };
  }
}
