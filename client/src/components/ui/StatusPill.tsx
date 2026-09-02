import type { RequestStatus } from "../../types";

const MAP: Record<string, { text: string; className: string }> = {
  received: { text: "Received — pending review", className: "bg-[#F4E7C9] text-[#8A6A12]" },
  approved: { text: "Approved", className: "bg-teal-pale text-teal" },
  approved_fee_due: { text: "Approved — fee due", className: "bg-teal-pale text-teal" },
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
  return (
    <span className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full ${entry.className}`}>
      {entry.text}
    </span>
  );
}
