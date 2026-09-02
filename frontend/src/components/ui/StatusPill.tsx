import { motion, AnimatePresence } from "framer-motion";
import type { RequestStatus } from "../../types";

const MAP: Record<string, { text: string; className: string }> = {
  received: { text: "Received — pending review", className: "bg-[#F4E7C9] text-[#8A6A12]" },
  approved: { text: "Approved", className: "bg-teal-pale text-teal" },
  approved_fee_due: { text: "Approved — fee due", className: "bg-teal-pale text-teal" },
  rejected: { text: "Not approved", className: "bg-[#F7E3DD] text-[#8A3B22]" },
  paid: { text: "Paid & confirmed", className: "bg-[#DCEEDC] text-[#2A6B2F]" },
};

export default function StatusPill({
  status,
  fee,
}: {
  status: RequestStatus;
  fee?: number | null;
}) {
  const key = status === "approved" && fee != null ? "approved_fee_due" : status;
  const entry = MAP[key] || MAP.received;
  const stamped = status === "approved" || status === "paid" || status === "rejected";

  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={key}
        initial={stamped ? { scale: 1.8, opacity: 0, rotate: -10 } : { scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={
          stamped
            ? { duration: 0.35, ease: [0.2, 0.8, 0.2, 1.3] }
            : { duration: 0.3, ease: [0.2, 0.9, 0.3, 1.3] }
        }
        data-testid={`status-pill-${status}`}
        className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full ${entry.className}`}
      >
        {entry.text}
      </motion.span>
    </AnimatePresence>
  );
}
