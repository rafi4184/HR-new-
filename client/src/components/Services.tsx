import { motion } from "framer-motion";
import { Plane, Building2, Landmark, ShieldCheck, ChevronRight } from "lucide-react";
import Reveal from "./ui/Reveal";
import type { BookingTab } from "../types";

const SERVICES = [
  {
    icon: Plane,
    title: "Airport VIP reception",
    body: "Fast-track immigration, baggage assistance, lounge access, and a car waiting at the curb.",
    tab: "airport" as BookingTab,
  },
  {
    icon: Building2,
    title: "Hotel & car booking",
    body: "We shortlist and reserve the stay and the vehicle to match your itinerary and budget.",
    tab: "hotel" as BookingTab,
  },
  {
    icon: Landmark,
    title: "Government liaison",
    body: "Passport, visa, land records, attestation — someone stands in the queue on your behalf.",
    tab: "government" as BookingTab,
  },
  {
    icon: ShieldCheck,
    title: "Manpower & security",
    body: "Our core practice: staffing, security personnel, and outsourced workforce for organizations.",
    tab: null,
  },
];

export default function Services({ onBook }: { onBook: (tab: BookingTab) => void }) {
  return (
    <section id="services" className="px-5 md:px-10 py-16 max-w-6xl mx-auto">
      <Reveal>
        <h2 className="font-display text-3xl mb-2" style={{ textWrap: "balance" }}>
          What the desk handles
        </h2>
        <p className="max-w-lg mb-10 text-ink-muted">
          Four services, one point of contact — from the runway to the registry office.
        </p>
      </Reveal>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {SERVICES.map(({ icon: Icon, title, body, tab }, i) => (
          <Reveal key={title} delay={i * 0.06}>
            <motion.div
              whileHover={{ y: -4, boxShadow: "0 14px 28px rgba(11,27,46,0.1)" }}
              transition={{ duration: 0.2 }}
              className="rounded-xl p-6 border border-border bg-cream-card flex flex-col h-full hover:border-teal"
            >
              <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4 bg-teal-tint">
                <Icon size={19} color="#146B60" />
              </div>
              <h3 className="font-display text-lg mb-2">{title}</h3>
              <p className="text-[14px] flex-1 text-ink-muted">{body}</p>
              {tab && (
                <button
                  onClick={() => onBook(tab)}
                  className="mt-4 flex items-center gap-1 text-[13px] font-medium text-teal"
                >
                  Request this <ChevronRight size={14} />
                </button>
              )}
            </motion.div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
