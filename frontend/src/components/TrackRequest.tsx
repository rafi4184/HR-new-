import { forwardRef, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShieldAlert, CheckCircle2, CreditCard } from "lucide-react";
import { Field, inputClass } from "./ui/Field";
import StatusPill from "./ui/StatusPill";
import type { ServiceRequest } from "../types";

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
            <input name="ticket" required placeholder="HRM-100..." className={inputClass} />
          </Field>
          <Field label="Full name" required>
            <input name="name" required className={inputClass} />
          </Field>
          <Field label="Date of birth" required>
            <input name="dob" type="date" required className={inputClass} />
          </Field>
        </div>
        <button
          type="submit"
          disabled={loading}
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
            key={result.status + String(result.fee)}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="rounded-lg border border-border p-5 bg-white"
          >
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="text-[11px] font-medium text-ink-faint">
                {result.ticket} · {result.type}
              </span>
              <StatusPill status={result.status} fee={result.fee} />
            </div>
            <div className="text-[15px] mb-3">{result.summary}</div>
            {result.type === "Government Request" && result.status === "approved" && result.fee != null && (
              <button
                onClick={() => onPay(result)}
                className="flex items-center gap-2 text-[13px] font-medium px-4 py-2.5 rounded-md bg-teal text-white active:scale-[0.97] transition-transform"
              >
                <CreditCard size={14} /> Pay ৳{result.fee.toLocaleString()}
              </button>
            )}
            {result.status === "rejected" && (
              <div className="mt-2 rounded-md px-4 py-3 bg-[#F7E3DD] text-[#8A3B22] text-[13px] leading-relaxed">
                <div className="text-[11px] font-mono uppercase tracking-widest mb-1">Desk note</div>
                {result.rejectionReason || "We're unable to move forward with this specific request. Please call the desk to talk through your options."}
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
