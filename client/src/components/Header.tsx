import { useEffect, useState } from "react";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";
import { Phone, Menu, X } from "lucide-react";
import LogoMark from "./ui/Logo";
import type { BookingTab } from "../types";

const LINKS = [
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Why Us", href: "#process" },
  { label: "Contact", href: "#contact" },
];

export default function Header({
  onBook,
  onTrack,
}: {
  onBook: (tab: BookingTab, program?: string) => void;
  onTrack: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 25, restDelta: 0.001 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-500 ${
        scrolled ? "bg-navy/85 backdrop-blur-md border-b border-white/10" : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="h-[2px] w-full bg-white/[0.05]">
        <motion.div className="h-full bg-gradient-to-r from-teal to-gold origin-left" style={{ scaleX: progress }} />
      </div>
      <div
        className={`flex items-center justify-between px-5 md:px-10 transition-all duration-500 ${
          scrolled ? "py-3" : "py-5"
        }`}
      >
        <a href="#top" className="flex items-center gap-2.5">
          <motion.div
            className="shrink-0"
            whileHover={{ rotate: 8, scale: 1.08 }}
            transition={{ type: "spring", stiffness: 300, damping: 12 }}
          >
            <LogoMark size={36} />
          </motion.div>
          <div>
            <div className="text-white font-display text-[17px] leading-none">HR — The Mediator</div>
            <div className="text-[10px] leading-none mt-1 tracking-wide text-mist-soft">Private concierge desk</div>
          </div>
        </a>

        <nav className="hidden md:flex items-center gap-8 text-[13px] tracking-wide text-mist-faint">
          {LINKS.map((l) => (
            <a key={l.label} href={l.href} className="group relative py-1 hover:text-white transition-colors">
              {l.label}
              <span className="absolute left-0 -bottom-0.5 h-px w-full origin-left scale-x-0 bg-gold transition-transform duration-300 group-hover:scale-x-100" />
            </a>
          ))}
          <button onClick={onTrack} className="group relative py-1 hover:text-white transition-colors">
            My Request
            <span className="absolute left-0 -bottom-0.5 h-px w-full origin-left scale-x-0 bg-gold transition-transform duration-300 group-hover:scale-x-100" />
          </button>
        </nav>

        <div className="flex items-center gap-2">
          <motion.button
            onClick={() => onBook("airport")}
            className="hidden sm:flex items-center gap-2 text-[12px] tracking-wide uppercase px-4 py-2.5 rounded-full font-medium bg-gold text-white active:scale-[0.97]"
            whileHover={{ y: -1, boxShadow: "0 10px 26px rgba(166,64,42,0.35)" }}
          >
            <Phone size={13} /> Speak With Our Desk
          </motion.button>
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
            initial={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
            exit={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
            className="md:hidden fixed inset-0 top-0 h-[100svh] bg-navy flex flex-col justify-center px-8 gap-1"
          >
            {LINKS.map((l, i) => (
              <motion.a
                key={l.label}
                href={l.href}
                onClick={() => setOpen(false)}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.06 }}
                className="font-display text-white text-4xl py-3 border-b border-white/10"
              >
                {l.label}
              </motion.a>
            ))}
            <motion.button
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + LINKS.length * 0.06 }}
              onClick={() => {
                setOpen(false);
                onTrack();
              }}
              className="font-display text-white text-4xl py-3 border-b border-white/10 text-left"
            >
              My Request
            </motion.button>
            <motion.button
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + (LINKS.length + 1) * 0.06 }}
              onClick={() => {
                setOpen(false);
                onBook("airport");
              }}
              className="mt-8 flex items-center justify-center gap-2 text-[13px] tracking-wide uppercase px-6 py-4 rounded-full font-medium bg-gold text-white active:scale-[0.97]"
            >
              <Phone size={14} /> Speak With Our Desk
            </motion.button>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
