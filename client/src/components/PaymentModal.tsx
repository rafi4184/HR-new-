import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { inputClass } from "./ui/Field";
import { payRequest, ApiError } from "../lib/api";
import type { ServiceRequest } from "../types";

type Stage = "form" | "processing" | "success";

export default function PaymentModal({
  request,
  onClose,
  onPaid,
}: {
  request: ServiceRequest | null;
  onClose: () => void;
  onPaid: (updated: ServiceRequest) => void;
}) {
  const [method, setMethod] = useState("bkash");
  const [stage, setStage] = useState<Stage>("form");
  const [error, setError] = useState<string | null>(null);

  const close = () => {
    if (stage !== "form") return;
    setError(null);
    onClose();
  };

  const confirm = async () => {
    if (!request) return;
    setError(null);
    setStage("processing");
    await new Promise((r) => setTimeout(r, 900));
    try {
      const updated = await payRequest(request.id, method);
      setStage("success");
      setTimeout(() => {
        onPaid(updated);
        setStage("form");
      }, 1300);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Payment failed. Please try again.");
      setStage("form");
    }
  };

  return (
    <AnimatePresence>
      {request && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/60"
          onClick={close}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45, ease: [0.2, 0.9, 0.3, 1.3] }}
            className="w-full max-w-sm rounded-xl overflow-hidden bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 bg-navy">
              <span className="text-white font-display text-lg">
                {stage === "success" ? "Payment confirmed" : "Complete payment"}
              </span>
              {stage === "form" && (
                <button onClick={close} aria-label="Close">
                  <X size={18} color="#fff" />
                </button>
              )}
            </div>

            {stage === "success" ? (
              <div className="p-8 flex flex-col items-center text-center">
                <svg width="56" height="56" viewBox="0 0 56 56" className="mb-4">
                  <circle cx="28" cy="28" r="26" fill="#DCEEDC" />
                  <motion.path
                    d="M17 29l7 7 15-15"
                    fill="none"
                    stroke="#2A6B2F"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, delay: 0.15 }}
                  />
                </svg>
                <div className="font-display text-xl mb-1">৳{(request.fee ?? 0).toLocaleString()} paid</div>
                <div className="text-[13px] text-ink-faint">
                  {request.ticket} is settled and moving to fulfillment.
                </div>
              </div>
            ) : (
              <div className="p-5">
                {error && <div className="text-[13px] text-[#8A3B22] mb-3">{error}</div>}
                <div className="text-[13px] mb-1 text-ink-faint">
                  {request.serviceLabel || request.summary} · {request.ticket}
                </div>
                <div className="font-display text-3xl mb-5">৳{(request.fee ?? 0).toLocaleString()}</div>
                <div className="flex gap-2 mb-5">
                  {["bkash", "nagad", "card"].map((m) => (
                    <button
                      key={m}
                      disabled={stage === "processing"}
                      onClick={() => setMethod(m)}
                      className={`flex-1 text-[13px] font-medium py-2 rounded-md capitalize transition-colors ${
                        method === m ? "bg-teal text-white" : "bg-cream-panel text-ink-soft"
                      }`}
                    >
                      {m === "bkash" ? "bKash" : m === "nagad" ? "Nagad" : "Card"}
                    </button>
                  ))}
                </div>
                {method === "card" ? (
                  <div className="space-y-3 mb-5">
                    <input disabled={stage === "processing"} placeholder="Card number" className={inputClass} />
                    <div className="flex gap-3">
                      <input disabled={stage === "processing"} placeholder="MM/YY" className={inputClass} />
                      <input disabled={stage === "processing"} placeholder="CVC" className={inputClass} />
                    </div>
                  </div>
                ) : (
                  <input
                    disabled={stage === "processing"}
                    placeholder={`${method === "bkash" ? "bKash" : "Nagad"} account number`}
                    className={`${inputClass} mb-5`}
                  />
                )}
                <button
                  onClick={confirm}
                  disabled={stage === "processing"}
                  className="w-full py-3 rounded-md font-medium text-[15px] flex items-center justify-center gap-2 bg-gold text-navy active:scale-[0.97] transition-transform disabled:opacity-85"
                >
                  {stage === "processing" ? (
                    <>
                      <motion.span
                        className="inline-block w-4 h-4 rounded-full border-2"
                        style={{ borderColor: "#0B1B2E transparent #0B1B2E #0B1B2E" }}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                      />
                      Processing…
                    </>
                  ) : (
                    <>Pay ৳{(request.fee ?? 0).toLocaleString()}</>
                  )}
                </button>
                <div className="text-[11px] text-center mt-3 text-ink-faint">
                  Demo checkout — wire to a live gateway (SSLCommerz / bKash / Stripe) before launch.
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
