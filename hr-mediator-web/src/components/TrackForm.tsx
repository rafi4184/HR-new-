"use client";

import { useActionState } from "react";
import { trackRequest, type TrackState } from "@/app/actions";
import type { RequestStatus } from "@/lib/types";

const STEPS: { status: RequestStatus; label: string }[] = [
  { status: "received", label: "Received" },
  { status: "approved", label: "Approved" },
  { status: "paid", label: "Paid" },
  { status: "completed", label: "Completed" },
];

const MESSAGES: Record<RequestStatus, string> = {
  received: "We've got your request and our desk is reviewing it.",
  approved: "Your request is approved. We'll be in touch with next steps.",
  paid: "Payment received — we're working on it.",
  rejected: "We weren't able to take on this request.",
  completed: "All done. Thank you for choosing HR — The Mediator.",
};

export default function TrackForm() {
  const [state, action, pending] = useActionState<TrackState, FormData>(trackRequest, {});
  const r = state.request;

  return (
    <div className="space-y-8">
      <form action={action} className="grid gap-5 rounded-2xl border border-line bg-white p-6 sm:grid-cols-3 sm:p-8">
        <label className="block">
          <span className="label">Ticket number</span>
          <input name="ticket" required className="input font-mono uppercase" placeholder="HR-…" />
        </label>
        <label className="block">
          <span className="label">Full name</span>
          <input name="name" required className="input" autoComplete="name" />
        </label>
        <label className="block">
          <span className="label">Date of birth</span>
          <input name="dob" type="date" required className="input" />
        </label>
        <div className="flex items-center justify-between gap-4 sm:col-span-3">
          {state.error ? <p role="alert" className="text-sm text-red-700">{state.error}</p> : <span />}
          <button type="submit" disabled={pending} className="btn-primary px-6 py-3">
            {pending ? "Looking up…" : "Track request"}
          </button>
        </div>
      </form>

      {r && (
        <div className="rounded-2xl border border-line bg-white p-6 sm:p-8" aria-live="polite">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="font-mono text-sm text-muted">{r.ticket}</p>
              <h2 className="mt-1 font-display text-2xl text-navy">{r.typeLabel}</h2>
              <p className="mt-1 text-sm text-muted">{r.summary}</p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
                r.status === "rejected" ? "bg-red-50 text-red-700" : r.status === "completed" ? "bg-emerald-50 text-emerald-700" : "bg-gold-pale text-gold-deep"
              }`}
            >
              {r.status}
            </span>
          </div>

          {r.status !== "rejected" && (
            <ol className="mt-8 grid grid-cols-4 gap-2">
              {STEPS.filter((s) => s.status !== "paid" || r.fee != null).map((s, i, arr) => {
                const reached = arr.findIndex((x) => x.status === r.status) >= i;
                return (
                  <li key={s.status} className="text-center">
                    <div className={`h-1.5 rounded-full ${reached ? "bg-navy" : "bg-line"}`} />
                    <p className={`mt-2 text-xs ${reached ? "text-navy" : "text-muted"}`}>{s.label}</p>
                  </li>
                );
              })}
            </ol>
          )}

          <p className="mt-6 text-sm text-ink">{MESSAGES[r.status]}</p>
          {r.fee != null && r.status === "approved" && (
            <p className="mt-2 text-sm text-ink">
              Fee: <strong>৳{r.fee.toLocaleString("en-US")}</strong> — our desk will share payment details with you.
            </p>
          )}
          {r.decisionNote && <p className="mt-2 rounded-lg bg-paper px-4 py-3 text-sm text-muted">{r.decisionNote}</p>}
          <p className="mt-6 text-xs text-muted">
            Submitted {new Date(r.createdAt).toLocaleDateString("en-GB", { timeZone: "Asia/Dhaka" })} · Last updated{" "}
            {new Date(r.updatedAt).toLocaleDateString("en-GB", { timeZone: "Asia/Dhaka" })}
          </p>
        </div>
      )}
    </div>
  );
}
