"""
Transactional email helpers.

Provider priority:
  1. Gmail SMTP  — active if GMAIL_USER + GMAIL_APP_PASSWORD are set.
  2. Resend API  — active if RESEND_API_KEY is set.
  3. Mock (log)  — always the final fallback so the app stays functional.
"""

from __future__ import annotations

import asyncio
import logging
import os
import re
from email.message import EmailMessage
from typing import Any

import aiosmtplib
import resend

logger = logging.getLogger("hr-mediator.emails")

RESEND_API_KEY = os.environ.get("RESEND_API_KEY", "").strip()
GMAIL_USER = os.environ.get("GMAIL_USER", "").strip()
GMAIL_APP_PASSWORD = os.environ.get("GMAIL_APP_PASSWORD", "").strip().replace(" ", "")
SENDER_EMAIL = os.environ.get(
    "SENDER_EMAIL",
    f"HR — The Mediator <{GMAIL_USER or 'onboarding@resend.dev'}>",
)
BRAND_NAME = os.environ.get("BRAND_NAME", "HR — The Mediator")
BRAND_TAGLINE = os.environ.get("BRAND_TAGLINE", "Bangladesh concierge desk")
BRAND_PHONE = os.environ.get("BRAND_PHONE", "+880 1717-013150")

if RESEND_API_KEY:
    resend.api_key = RESEND_API_KEY


def _address_only(sender: str) -> str:
    """Extract the bare email from 'Name <a@b.com>' style sender strings."""
    m = re.search(r"<([^>]+)>", sender)
    return m.group(1) if m else sender


def _shell(preheader: str, headline: str, body_html: str, accent: str) -> str:
    return f"""<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#F3EEDF;font-family:'IBM Plex Sans',Segoe UI,Arial,sans-serif;color:#1E2A20;">
    <span style="display:none!important;visibility:hidden;opacity:0;color:transparent;height:0;width:0;">{preheader}</span>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#F3EEDF;padding:32px 12px;">
      <tr><td align="center">
        <table role="presentation" width="580" cellspacing="0" cellpadding="0" style="max-width:580px;width:100%;background:#FBF7EA;border:1px solid #DBD0AF;border-radius:14px;overflow:hidden;">
          <tr><td style="background:#17241C;padding:22px 28px;color:#DEE8DA;">
            <div style="font-family:'Newsreader',Georgia,serif;font-size:22px;letter-spacing:.2px;color:#ffffff;">{BRAND_NAME}</div>
            <div style="font-size:12px;letter-spacing:.18em;text-transform:uppercase;margin-top:4px;color:#9CAF97;">{BRAND_TAGLINE}</div>
          </td></tr>
          <tr><td style="height:6px;background:linear-gradient(90deg,#2F5D3F 0%,{accent} 100%);"></td></tr>
          <tr><td style="padding:34px 32px 8px 32px;">
            <div style="font-family:'Newsreader',Georgia,serif;font-size:26px;line-height:1.2;color:#17241C;">{headline}</div>
          </td></tr>
          <tr><td style="padding:12px 32px 28px 32px;font-size:15px;line-height:1.6;color:#4C5B49;">
            {body_html}
          </td></tr>
          <tr><td style="padding:0 32px 32px 32px;font-size:13px;color:#8A7A52;">
            Need us on the line? Call <a href="tel:{BRAND_PHONE.replace(' ', '')}" style="color:#A6402A;text-decoration:none;">{BRAND_PHONE}</a>.
          </td></tr>
          <tr><td style="background:#ECE3CB;padding:16px 32px;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#8A7A52;">
            Case file · Concierge desk · Dhaka
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>"""


def _detail_rows(request: dict[str, Any]) -> str:
    rows = [
        ("Ticket", request["ticket"]),
        ("Service", request["type"]),
        ("Summary", request["summary"]),
        ("Guest", request["name"]),
    ]
    if request.get("fee"):
        rows.append(("Fee due", f"৳ {int(request['fee']):,}"))
    inner = "".join(
        f"""<tr>
              <td style="padding:8px 0;color:#8A7A52;font-size:12px;letter-spacing:.14em;text-transform:uppercase;width:36%;">{label}</td>
              <td style="padding:8px 0;color:#1E2A20;font-size:14px;">{value}</td>
            </tr>"""
        for label, value in rows
    )
    return f"""<table role="presentation" width="100%" cellspacing="0" cellpadding="0"
              style="margin:18px 0 6px 0;border-top:1px dashed #CBBE96;border-bottom:1px dashed #CBBE96;">
              {inner}
            </table>"""


def approval_email(request: dict[str, Any]) -> tuple[str, str]:
    subject = f"Approved · {request['ticket']} — {BRAND_NAME}"
    fee_line = ""
    if request.get("fee"):
        fee_line = (
            "<p style='margin:0 0 14px 0;'>A service fee of "
            f"<strong>৳ {int(request['fee']):,}</strong> is due before we begin. "
            "You can settle it inside the tracker on our site — bKash, Nagad, or card.</p>"
        )
    body = f"""
        <p style="margin:0 0 14px 0;">Dear {request['name']},</p>
        <p style="margin:0 0 14px 0;">
          Good news — your case with {BRAND_NAME} has been reviewed and <strong style="color:#2F5D3F;">approved</strong>.
          A dedicated desk officer will now start work on it and reach out with next steps.
        </p>
        {_detail_rows(request)}
        {fee_line}
        <p style="margin:16px 0 0 0;">Save your ticket number above — you can check status any time from the tracker on our site.</p>
        <p style="margin:16px 0 0 0;">Warmly,<br/>The desk at {BRAND_NAME}</p>
    """
    return subject, _shell(
        preheader=f"Your request {request['ticket']} has been approved.",
        headline="Your case has been approved.",
        body_html=body,
        accent="#2F5D3F",
    )


def rejection_email(request: dict[str, Any], reason: str | None) -> tuple[str, str]:
    subject = f"Update · {request['ticket']} — {BRAND_NAME}"
    reason_block = ""
    if reason:
        reason_block = f"""
        <div style="margin:18px 0;padding:14px 16px;border-left:3px solid #A6402A;background:#F7E3DD;border-radius:4px;color:#5A2116;font-size:14px;line-height:1.5;">
          <div style="font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:#8A3B22;margin-bottom:6px;">Desk note</div>
          {reason}
        </div>"""
    body = f"""
        <p style="margin:0 0 14px 0;">Dear {request['name']},</p>
        <p style="margin:0 0 14px 0;">
          Thank you for reaching out to {BRAND_NAME}. After reviewing the details of your case, we're
          unable to move forward with this specific request at the moment.
        </p>
        {_detail_rows(request)}
        {reason_block}
        <p style="margin:16px 0 0 0;">
          You're welcome to submit a fresh request with adjusted details, or call the desk directly and we'll
          talk you through the options.
        </p>
        <p style="margin:16px 0 0 0;">Warmly,<br/>The desk at {BRAND_NAME}</p>
    """
    return subject, _shell(
        preheader=f"An update on your request {request['ticket']}.",
        headline="An update on your case.",
        body_html=body,
        accent="#A6402A",
    )


def invite_email(user: dict[str, Any], temp_password: str) -> tuple[str, str]:
    subject = f"You're on the desk · {BRAND_NAME}"
    body = f"""
        <p style="margin:0 0 14px 0;">Dear {user.get('name') or user.get('username')},</p>
        <p style="margin:0 0 14px 0;">
          Welcome to the {BRAND_NAME} desk. An administrator has provisioned an account for you
          with the role <strong>{user.get('role')}</strong>.
        </p>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0"
               style="margin:18px 0;border-top:1px dashed #CBBE96;border-bottom:1px dashed #CBBE96;">
          <tr>
            <td style="padding:10px 0;color:#8A7A52;font-size:12px;letter-spacing:.14em;text-transform:uppercase;width:44%;">Username</td>
            <td style="padding:10px 0;color:#1E2A20;font-size:14px;font-family:'IBM Plex Mono',ui-monospace,monospace;">{user.get('username')}</td>
          </tr>
          <tr>
            <td style="padding:10px 0;color:#8A7A52;font-size:12px;letter-spacing:.14em;text-transform:uppercase;">Temporary password</td>
            <td style="padding:10px 0;color:#1E2A20;font-size:14px;font-family:'IBM Plex Mono',ui-monospace,monospace;">{temp_password}</td>
          </tr>
        </table>
        <p style="margin:0 0 14px 0;">
          For safety, you will be asked to <strong>set your own password</strong> the moment you first
          sign in. This temporary password only works once.
        </p>
        <p style="margin:16px 0 0 0;">See you at the desk,<br/>The {BRAND_NAME} team</p>
    """
    return subject, _shell(
        preheader="Your desk account is ready.",
        headline=f"Welcome to {BRAND_NAME}.",
        body_html=body,
        accent="#2F5D3F",
    )


def digest_email(
    admin: dict[str, Any],
    metrics: dict[str, int],
    top_cases: list[dict[str, Any]],
    week_start: str,
    week_end: str,
) -> tuple[str, str]:
    subject = f"Weekly digest · {week_start} → {week_end} — {BRAND_NAME}"
    cells = "".join(
        f"""<td align="center" style="padding:12px 8px;background:#FBF7EA;border:1px solid #DBD0AF;border-radius:10px;">
              <div style="font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:#8A7A52;">{label}</div>
              <div style="font-family:'Newsreader',Georgia,serif;font-size:30px;color:#1E2A20;margin-top:4px;">{value}</div>
            </td>"""
        for label, value in metrics.items()
    )
    highlights = ""
    if top_cases:
        rows = "".join(
            f"""<tr>
                  <td style="padding:6px 10px;font-family:'IBM Plex Mono',monospace;font-size:12px;color:#8A7A52;">{c['ticket']}</td>
                  <td style="padding:6px 10px;font-size:13px;color:#1E2A20;">{c['type']}</td>
                  <td style="padding:6px 10px;font-size:13px;color:#4C5B49;">{c['summary']}</td>
                  <td style="padding:6px 10px;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#2F5D3F;">{c['status']}</td>
                </tr>"""
            for c in top_cases
        )
        highlights = f"""
        <p style="margin:18px 0 10px 0;font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:#8A7A52;">Recent decisions</p>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0"
               style="border-top:1px dashed #CBBE96;border-bottom:1px dashed #CBBE96;">
          {rows}
        </table>"""
    body = f"""
        <p style="margin:0 0 14px 0;">Dear {admin.get('name') or admin.get('username')},</p>
        <p style="margin:0 0 14px 0;">
          Here's how the desk moved between <strong>{week_start}</strong> and <strong>{week_end}</strong>.
        </p>
        <table role="presentation" width="100%" cellspacing="6" cellpadding="0" style="margin:16px 0;">
          <tr>{cells}</tr>
        </table>
        {highlights}
        <p style="margin:16px 0 0 0;">
          Everything above is also live in the dashboard's audit log.
        </p>
        <p style="margin:16px 0 0 0;">Warmly,<br/>The {BRAND_NAME} case bureau</p>
    """
    return subject, _shell(
        preheader=f"Weekly digest: {metrics.get('Approved', 0)} approved, {metrics.get('Pending', 0)} pending.",
        headline="Weekly digest",
        body_html=body,
        accent="#2F5D3F",
    )


async def _send_via_gmail(to: str, subject: str, html: str) -> None:
    """Send an HTML email through Gmail SMTP (submission port 587, STARTTLS)."""
    msg = EmailMessage()
    msg["From"] = SENDER_EMAIL
    msg["To"] = to
    msg["Subject"] = subject
    msg.set_content(re.sub(r"<[^>]+>", "", html))  # plain-text fallback
    msg.add_alternative(html, subtype="html")

    await aiosmtplib.send(
        msg,
        hostname="smtp.gmail.com",
        port=587,
        start_tls=True,
        username=GMAIL_USER,
        password=GMAIL_APP_PASSWORD,
        timeout=15,
    )


async def _send_via_resend(to: str, subject: str, html: str) -> Any:
    params = {"from": SENDER_EMAIL, "to": [to], "subject": subject, "html": html}
    return await asyncio.to_thread(resend.Emails.send, params)


async def send_html(to: str, subject: str, html: str) -> None:
    # 1) Gmail SMTP
    if GMAIL_USER and GMAIL_APP_PASSWORD:
        try:
            await _send_via_gmail(to, subject, html)
            logger.info("[email:gmail-sent] to=%s subject=%s", to, subject)
            return
        except Exception as e:  # noqa: BLE001
            # Common: 535 auth failure when a regular Gmail password is used
            # instead of a 16-char App Password.
            logger.error(
                "[email:gmail-error] to=%s err=%s -- falling back. If '535' or "
                "'Username and Password not accepted', generate an App Password "
                "at https://myaccount.google.com/apppasswords and set GMAIL_APP_PASSWORD.",
                to,
                e,
            )

    # 2) Resend
    if RESEND_API_KEY:
        try:
            result = await _send_via_resend(to, subject, html)
            logger.info(
                "[email:resend-sent] to=%s id=%s",
                to,
                result.get("id") if isinstance(result, dict) else result,
            )
            return
        except Exception as e:  # noqa: BLE001
            logger.error("[email:resend-error] to=%s err=%s -- falling back to mock.", to, e)

    # 3) Mock — the app keeps working even without a real provider.
    logger.info(
        "[email:mock] to=%s subject=%s (no provider configured or all failed; "
        "set GMAIL_APP_PASSWORD or RESEND_API_KEY to send for real)",
        to,
        subject,
    )
