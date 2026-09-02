import { forwardRef, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShieldAlert, CheckCircle2, CreditCard, Clock, Check, X } from "lucide-react";
import { Field, inputClass } from "./ui/Field";
import StatusPill from "./ui/StatusPill";
import type { RequestStatus, ServiceRequest } from "../types";

type StepKey = "submitted" | "review" | "final";

interface Step {
  key: StepKey;
  label: string;
  hint: string;
}

const STEPS: Step[] = [
  { key: "submitted", label: "Submitted", hint: "We've got your case on file." },
  { key: "review", label: "In review", hint: "A desk officer is looking it over." },
  { key: "final", label: "Confirmed", hint: "The decision is in — see the note below." },
];

function activeFor(status: RequestStatus): StepKey {
  if (status === "received") return "review";
  return "final"; // approved, paid, rejected all land on step 3
}

function toneFor(status: RequestStatus, step: StepKey): {
  ring: string;
  bg: string;
  icon: React.ReactNode;
  glow: string;
} {
  const done = { ring: "border-teal", bg: "bg-teal text-white", icon: <Check size={13} strokeWidth={3} />, glow: "shadow-[0_0_0_6px_rgba(47,93,63,0.14)]" };
  const active = { ring: "border-gold", bg: "bg-gold text-white", icon: <Clock size={13} strokeWidth={2.5} />, glow: "shadow-[0_0_0_6px_rgba(166,64,42,0.18)]" };
  const idle = { ring: "border-border-strong", bg: "bg-cream-card text-ink-faint", icon: <span className="w-1.5 h-1.5 rounded-full bg-ink-faint" />, glow: "" };
  const rejected = { ring: "border-[#A6402A]", bg: "bg-[#A6402A] text-white", icon: <X size={13} strokeWidth={3} />, glow: "shadow-[0_0_0_6px_rgba(166,64,42,0.16)]" };

  const active_step = activeFor(status);
  const stepOrder: StepKey[] = ["submitted", "review", "final"];
  const currentIdx = stepOrder.indexOf(active_step);
  const stepIdx = stepOrder.indexOf(step);

  if (step === "final" && stepIdx <= currentIdx) {
    if (status === "rejected") return rejected;
    if (status === "approved" || status === "paid") return done;
  }
  if (stepIdx < currentIdx) return done;
  if (stepIdx === currentIdx) return active;
  return idle;
}

const TrackRequest = forwardRef<
  HTMLElement,
  {
    loading: boolean;
    result: ServiceRequest | "notfound" | null;
    onSubmit: (ticket: string, name: string, dob: string) => void;
    onPay: (req: ServiceRequest) => void;
  }
>(function TrackRequest({ loading, result, onSubmit, onPay }, ref) {
  const runTrack = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget).entries()) as Record<string, string>;
    onSubmit(data.ticket, data.name, data.dob);
  };

  return (
    <section id="track" ref={ref} className="px-5 md:px-10 py-16 max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7 }}
      >
        <h2 className="font-display text-3xl mb-2">Track your request</h2>
        <p className="mb-8 text-ink-muted">
          Enter your ticket number, full name, and date of birth exactly as submitted.
        </p>
      </motion.div>

      <form onSubmit={runTrack} className="rounded-xl border border-border p-6 md:p-8 mb-6 bg-cream-card">
        <div className="grid sm:grid-cols-3 gap-x-5">
          <Field label="Ticket number" required>
            <input
              name="ticket"
              required
              placeholder="HRM-100..."
              data-testid="track-ticket"
              className={inputClass}
            />
          </Field>
          <Field label="Full name" required>
            <input name="name" required data-testid="track-name" className={inputClass} />
          </Field>
          <Field label="Date of birth" required>
            <input name="dob" type="date" required data-testid="track-dob" className={inputClass} />
          </Field>
        </div>
        <button
          type="submit"
          disabled={loading}
          data-testid="track-submit"
          className="flex items-center gap-2 px-6 py-3 rounded-md font-medium text-[15px] bg-teal text-white active:scale-[0.97] transition-transform disabled:opacity-60"
        >
          <Search size={16} /> Check status
        </button>
      </form>

      <AnimatePresence mode="wait">
        {loading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="shimmer rounded-lg h-24 mb-6 animate-shimmer"
          />
        )}

        {result === "notfound" && !loading && (
          <motion.div
            key="notfound"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-lg px-5 py-4 flex items-start gap-3 bg-[#F7E3DD] text-[#8A3B22]"
          >
            <ShieldAlert size={18} className="shrink-0 mt-0.5" />
            <div className="text-[14px]">
              No matching request. Double-check the ticket number, name, and date of birth exactly
              as submitted.
            </div>
          </motion.div>
        )}

        {result && result !== "notfound" && !loading && (
          <motion.div
            layoutId="tracker-card"
            key={result.status + String(result.fee)}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35 }}
            data-testid="tracker-result"
            className="rounded-2xl border border-border p-6 md:p-7 bg-white shadow-[0_20px_50px_-20px_rgba(23,36,28,0.20)]"
          >
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <span className="text-[11px] font-mono uppercase tracking-widest text-ink-faint">
                {result.ticket} · {result.type}
              </span>
              <StatusPill status={result.status} fee={result.fee} />
            </div>
            <div className="font-display text-xl md:text-2xl mb-6 text-ink">
              {result.summary}
            </div>

            {/* --- Glowing status timeline ----------------------------- */}
            <div className="relative mb-6">
              <div className="hidden sm:block absolute top-4 left-4 right-4 h-px bg-border" />
              <div className="grid grid-cols-3 gap-3 relative">
                {STEPS.map((s, i) => {
                  const t = toneFor(result.status, s.key);
                  return (
                    <motion.div
                      key={s.key}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 * i, duration: 0.4 }}
                      className="relative flex flex-col items-start"
                    >
                      <motion.div
                        layoutId={`step-${s.key}`}
                        className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 ${t.ring} ${t.bg} ${t.glow} transition-all`}
                      >
                        {t.icon}
                      </motion.div>
                      <div className="mt-3 text-[13px] font-medium text-ink">{s.label}</div>
                      <div className="text-[11.5px] text-ink-faint leading-snug mt-0.5">
                        {s.key === "final" && result.status === "rejected"
                          ? "Case declined — see note."
                          : s.key === "final" && result.status === "paid"
                          ? "Settled — thank you."
                          : s.key === "final" && result.status === "approved"
                          ? "Approved — next steps below."
                          : s.hint}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {result.type === "Government Request" &&
              result.status === "approved" &&
              result.fee != null && (
                <motion.button
                  onClick={() => onPay(result)}
                  data-testid="pay-btn"
                  whileHover={{ y: -1 }}
                  className="flex items-center gap-2 text-[13px] font-medium px-5 py-2.5 rounded-md bg-teal text-white active:scale-[0.97] transition-transform hover:shadow-[0_10px_24px_rgba(47,93,63,0.35)]"
                >
                  <CreditCard size={14} /> Pay ৳{result.fee.toLocaleString()}
                </motion.button>
              )}
            {result.status === "rejected" && (
              <div className="rounded-lg px-4 py-3 bg-[#F7E3DD] text-[#8A3B22] text-[13px] leading-relaxed">
                <div className="text-[11px] font-mono uppercase tracking-widest mb-1">
                  Desk note
                </div>
                {result.rejectionReason ||
                  "We're unable to move forward with this specific request. Please call the desk to talk through your options."}
              </div>
            )}
            {result.status === "paid" && (
              <span className="flex items-center gap-1.5 text-[13px] text-[#2A6B2F]">
                <CheckCircle2 size={15} /> Settled
              </span>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
});

export default TrackRequest;
