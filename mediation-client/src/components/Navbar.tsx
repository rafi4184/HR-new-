import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Scale } from "lucide-react";

export default function Navbar({ onBook }: { onBook: () => void }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 inset-x-0 z-50 flex justify-center px-4"
    >
      <motion.div
        animate={{
          marginTop: scrolled ? 12 : 0,
          paddingInline: scrolled ? 20 : 28,
          paddingBlock: scrolled ? 10 : 18,
          borderRadius: scrolled ? 999 : 0,
          width: scrolled ? "min(760px, 92vw)" : "100%",
        }}
        transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
        className={`flex items-center justify-between max-w-6xl ${
          scrolled ? "backdrop-blur-xl2 bg-obsidian-900/70 border border-white/10 shadow-card" : "bg-transparent"
        }`}
      >
        <div className="flex items-center gap-2 text-white">
          <Scale size={18} className="text-gild" />
          <span className="font-display text-[17px] tracking-tight">HR the Mediator</span>
        </div>

        <nav className="hidden md:flex items-center gap-7 text-[13px] text-white/60">
          <a href="#process" className="hover:text-white transition-colors">
            Process
          </a>
          <a href="#pillars" className="hover:text-white transition-colors">
            Services
          </a>
        </nav>

        <button
          onClick={onBook}
          className="text-[13px] font-medium px-4 py-2 rounded-full text-obsidian-950 bg-gradient-to-r from-gild-bright to-gild-soft active:scale-[0.97] transition-transform"
        >
          Book Intake
        </button>
      </motion.div>
    </motion.header>
  );
}
