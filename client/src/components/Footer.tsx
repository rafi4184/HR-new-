import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Facebook, Instagram, Briefcase, MessageCircle } from "lucide-react";
import Reveal from "./ui/Reveal";
import LogoMark from "./ui/Logo";
import { listContacts } from "../lib/api";
import type { Contact } from "../types";

const FALLBACK_CONTACTS: Contact[] = [
  {
    id: -1,
    label: "Reach the desk",
    phone: "01682343364",
    email: "hrthemediator@gmail.com",
    address: null,
    whatsapp: null,
    sortOrder: 0,
  },
  {
    id: -2,
    label: "Find us",
    phone: null,
    email: null,
    address: "The Meditor, 4th floor, Green Chayera Manzil, Greater Road Mosque, Kadirganj, Rajshahi",
    whatsapp: null,
    sortOrder: 1,
  },
];

// Tailwind's JIT needs complete class strings in the source to generate them —
// a template-interpolated `sm:grid-cols-${n}` produces no CSS at all. Since the
// column count only ranges over a few values, list them literally instead.
const GRID_COLS_CLASS: Record<number, string> = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-3",
  4: "sm:grid-cols-4",
};

export default function Footer() {
  const [contacts, setContacts] = useState<Contact[]>(FALLBACK_CONTACTS);

  useEffect(() => {
    listContacts()
      .then((rows) => {
        if (rows.length > 0) setContacts(rows);
      })
      .catch(() => {});
  }, []);

  return (
    <footer id="contact" className="grain relative px-5 md:px-10 pt-16 pb-10 bg-navy text-mist overflow-hidden">
      <div
        className={`max-w-6xl mx-auto grid gap-10 mb-8 ${GRID_COLS_CLASS[Math.min(contacts.length + 1, 4)] ?? GRID_COLS_CLASS[4]}`}
      >
        <Reveal>
          <div className="flex items-center gap-2.5 mb-3">
            <LogoMark size={28} />
            <div className="font-display text-white text-xl">HR — The Mediator</div>
          </div>
          <p className="text-[14px] leading-relaxed">
            Registered manpower, security &amp; consultancy company, Dhaka — running a concierge
            desk, a media training academy, and Gulf employment placement for Bangladesh&apos;s
            travellers, students and jobseekers.
          </p>
        </Reveal>
        {contacts.map((c, i) => (
          <Reveal key={c.id} delay={0.08 * (i + 1)}>
            <div className="text-white text-sm font-medium mb-3">{c.label}</div>
            <div className="space-y-2 text-[14px]">
              {c.phone && (
                <div className="flex items-center gap-2">
                  <Phone size={14} /> {c.phone}
                </div>
              )}
              {c.whatsapp && (
                <div className="flex items-center gap-2">
                  <MessageCircle size={14} /> {c.whatsapp}
                </div>
              )}
              {c.email && (
                <div className="flex items-center gap-2">
                  <Mail size={14} /> {c.email}
                </div>
              )}
              {c.address && (
                <div className="flex items-start gap-2">
                  <MapPin size={14} className="mt-0.5 shrink-0" /> {c.address}
                </div>
              )}
            </div>
          </Reveal>
        ))}
      </div>
      <div className="max-w-6xl mx-auto mb-8 flex items-center gap-3">
        <motion.a
          href="https://www.facebook.com/hrmediator"
          target="_blank"
          rel="noreferrer"
          aria-label="Facebook"
          whileHover={{ y: -3, scale: 1.15, color: "#A6402A" }}
          transition={{ type: "spring", stiffness: 350, damping: 12 }}
        >
          <Facebook size={18} />
        </motion.a>
        <motion.a
          href="https://www.instagram.com/hr.themediator"
          target="_blank"
          rel="noreferrer"
          aria-label="Instagram"
          whileHover={{ y: -3, scale: 1.15, color: "#A6402A" }}
          transition={{ type: "spring", stiffness: 350, damping: 12 }}
        >
          <Instagram size={18} />
        </motion.a>
      </div>
      <div className="max-w-6xl mx-auto pt-6 text-[12px] flex flex-col sm:flex-row justify-between gap-2 border-t border-white/10">
        <span>© {new Date().getFullYear()} HR — The Mediator Limited</span>
        <span className="flex items-center gap-1.5">
          <Briefcase size={13} /> A Rajshahi University Readers&apos; Forum affiliate
        </span>
      </div>
    </footer>
  );
}
