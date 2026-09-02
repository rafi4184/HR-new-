import { useState } from "react";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";
import { Users, Phone, Menu, X } from "lucide-react";
import type { BookingTab } from "../types";

export default function Header({
  onBook,
  onTrack,
}: {
  onBook: (tab: BookingTab, program?: string) => void;
  onTrack: () => void;
}) {
  const [open, setOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 25, restDelta: 0.001 });

  const links = [
    { label: "Services", href: "#services" },
    { label: "Programs", href: "#programs" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-navy border-b border-white/10">
      <div className="h-[3px] w-full bg-white/[0.06]">
        <motion.div
          className="h-full bg-gradient-to-r from-teal to-gold origin-left"
          style={{ scaleX: progress }}
        />
      </div>
      <div className="flex items-center justify-between px-5 md:px-10 py-3.5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full flex items-center justify-center bg-gradient-to-br from-teal to-teal-soft">
            <Users size={18} color="#fff" strokeWidth={2.2} />
          </div>
          <div>
            <div className="text-white font-display text-lg leading-none">HR — The Mediator</div>
            <div className="text-[11px] leading-none mt-1 text-mist-soft">Bangladesh concierge desk</div>
          </div>
        </div>
        <nav className="hidden md:flex items-center gap-7 text-sm text-mist-faint">
          {links.map((l) => (
            <a key={l.label} href={l.href} className="hover:text-white transition-colors">
              {l.label}
            </a>
          ))}
          <button onClick={() => onBook("airport")} className="hover:text-white transition-colors">
            Book
          </button>
          <button onClick={onTrack} className="hover:text-white transition-colors">
            My Request
          </button>
          <a href="#contact" className="hover:text-white transition-colors">
            Contact
          </a>
        </nav>
        <div className="flex items-center gap-2">
          <a
            href="tel:+8801717013150"
            className="hidden sm:flex items-center gap-2 text-sm px-4 py-2 rounded-full font-medium bg-gold text-navy transition-shadow hover:shadow-[0_10px_26px_rgba(201,162,39,0.35)] hover:-translate-y-px active:scale-[0.97]"
          >
            <Phone size={14} /> +880 1717‑013150
          </a>
          <button
            onClick={() => setOpen((v) => !v)}
            className="md:hidden w-9 h-9 rounded-full flex items-center justify-center bg-white/[0.08] transition-colors hover:bg-white/[0.14]"
            aria-label="Menu"
          >
            {open ? <X size={18} color="#fff" /> : <Menu size={18} color="#fff" />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden flex flex-col px-5 pb-4 text-sm text-mist-faint overflow-hidden"
          >
            {links.map((l) => (
              <a key={l.label} href={l.href} onClick={() => setOpen(false)} className="py-2.5 border-t border-white/10">
                {l.label}
              </a>
            ))}
            <button onClick={() => { setOpen(false); onBook("airport"); }} className="py-2.5 border-t border-white/10 text-left">
              Book
            </button>
            <button onClick={() => { setOpen(false); onTrack(); }} className="py-2.5 border-t border-white/10 text-left">
              My Request
            </button>
            <a href="#contact" onClick={() => setOpen(false)} className="py-2.5 border-t border-white/10">
              Contact
            </a>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
