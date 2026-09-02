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
          <motion.div
            className="w-9 h-9 rounded-full flex items-center justify-center bg-gradient-to-br from-teal to-teal-soft"
            whileHover={{ rotate: 12, scale: 1.08 }}
            transition={{ type: "spring", stiffness: 300, damping: 12 }}
          >
            <Users size={18} color="#fff" strokeWidth={2.2} />
          </motion.div>
          <div>
            <div className="text-white font-display text-lg leading-none">HR — The Mediator</div>
            <div className="text-[11px] leading-none mt-1 text-mist-soft">Bangladesh concierge desk</div>
          </div>
        </div>
        <nav className="hidden md:flex items-center gap-7 text-sm text-mist-faint">
          {links.map((l) => (
            <a key={l.label} href={l.href} className="group relative py-1 hover:text-white transition-colors">
              {l.label}
              <span className="absolute left-0 -bottom-0.5 h-px w-full origin-left scale-x-0 bg-gold transition-transform duration-300 group-hover:scale-x-100" />
            </a>
          ))}
          <button onClick={() => onBook("airport")} className="group relative py-1 hover:text-white transition-colors">
            Book
            <span className="absolute left-0 -bottom-0.5 h-px w-full origin-left scale-x-0 bg-gold transition-transform duration-300 group-hover:scale-x-100" />
          </button>
          <button onClick={onTrack} className="group relative py-1 hover:text-white transition-colors">
            My Request
            <span className="absolute left-0 -bottom-0.5 h-px w-full origin-left scale-x-0 bg-gold transition-transform duration-300 group-hover:scale-x-100" />
          </button>
          <a href="#contact" className="group relative py-1 hover:text-white transition-colors">
            Contact
            <span className="absolute left-0 -bottom-0.5 h-px w-full origin-left scale-x-0 bg-gold transition-transform duration-300 group-hover:scale-x-100" />
          </a>
        </nav>
        <div className="flex items-center gap-2">
          <motion.a
            href="tel:+8801717013150"
            className="hidden sm:flex items-center gap-2 text-sm px-4 py-2 rounded-full font-medium bg-gold text-white active:scale-[0.97]"
            animate={{
              boxShadow: [
                "0 0 0 0px rgba(166,64,42,0.35)",
                "0 0 0 8px rgba(166,64,42,0)",
                "0 0 0 0px rgba(166,64,42,0)",
              ],
            }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
            whileHover={{ y: -1, boxShadow: "0 10px 26px rgba(166,64,42,0.35)" }}
          >
            <Phone size={14} /> +880 1717‑013150
          </motion.a>
          <button
            onClick={() => setOpen((v) => !v)}
            className="md:hidden w-9 h-9 rounded-full flex items-center justify-center bg-white/[0.08] transition-colors hover:bg-white/[0.14]"
            aria-label="Menu"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={open ? "close" : "open"}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex"
              >
                {open ? <X size={18} color="#fff" /> : <Menu size={18} color="#fff" />}
              </motion.span>
            </AnimatePresence>
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
