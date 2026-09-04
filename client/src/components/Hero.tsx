import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowDown, Plane } from "lucide-react";
import CinematicBackground from "./ui/CinematicBackground";
import MagneticButton from "./ui/MagneticButton";
import { SERVICES } from "../lib/services";
import type { BookingTab } from "../types";

const HEADLINE_WORDS = ["Your", "Access.", "Handled."];

// Slow-drifting dust motes for ambient depth — purely decorative, so
// fixed positions/delays are fine (no need for per-render randomness).
const PARTICLES = [
  { left: "12%", top: "70%", size: 3, delay: 0 },
  { left: "22%", top: "30%", size: 2, delay: 1.4 },
  { left: "38%", top: "58%", size: 2.5, delay: 2.8 },
  { left: "58%", top: "22%", size: 2, delay: 0.6 },
  { left: "72%", top: "62%", size: 3, delay: 3.6 },
  { left: "85%", top: "38%", size: 2, delay: 1.9 },
  { left: "48%", top: "78%", size: 2.5, delay: 4.4 },
];

export default function Hero({
  onBook,
  onContact,
}: {
  onBook: (tab: BookingTab) => void;
  onContact: () => void;
}) {
  const heroEase = [0.2, 0.8, 0.2, 1] as const;
  const [sceneIdx, setSceneIdx] = useState(0);
  const reduceMotion = useMemo(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  useEffect(() => {
    const iv = setInterval(() => setSceneIdx((i) => (i + 1) % SERVICES.length), 6000);
    return () => clearInterval(iv);
  }, []);

  return (
    <section className="relative h-[100svh] min-h-[640px] overflow-hidden bg-navy">
      <CinematicBackground video="/videos/hero.mp4" scene={SERVICES[sceneIdx].scene} premium />

      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(15,22,17,0.78) 0%, rgba(15,22,17,0.52) 38%, rgba(15,22,17,0.8) 78%, rgba(15,22,17,0.97) 100%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(100deg, rgba(15,22,17,0.6) 0%, rgba(15,22,17,0.12) 55%, transparent 80%)" }}
      />
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(60% 45% at 50% 38%, rgba(217,164,65,0.08), transparent 70%)" }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0"
        style={{ boxShadow: "inset 0 0 18vw rgba(15,22,17,0.55)" }}
        aria-hidden="true"
      />
      <div className="grain absolute inset-0 opacity-40" aria-hidden="true" />

      {!reduceMotion && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          {PARTICLES.map((p, i) => (
            <motion.span
              key={i}
              className="absolute rounded-full bg-gold/50"
              style={{ left: p.left, top: p.top, width: p.size, height: p.size }}
              animate={{ y: [0, -26, 0], opacity: [0, 0.7, 0] }}
              transition={{ duration: 7 + (i % 3), repeat: Infinity, delay: p.delay, ease: "easeInOut" }}
            />
          ))}
        </div>
      )}

      <div className="relative h-full flex flex-col items-center justify-center px-5 md:px-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex items-center gap-2 mb-6 text-[12px] tracking-[0.28em] uppercase text-mist-soft"
        >
          <span className="w-6 h-px bg-gold" />
          Bangladesh &middot; Private Concierge Desk
          <span className="w-6 h-px bg-gold" />
        </motion.div>

        <h1 className="relative font-display text-white text-[3rem] sm:text-[4.5rem] md:text-[6rem] leading-[0.98] mb-7 max-w-5xl">
          {HEADLINE_WORDS.map((word, i) => (
            <motion.span
              key={word}
              initial={{ opacity: 0, y: 34, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.95, delay: 0.25 + i * 0.12, ease: heroEase }}
              className={`relative inline-block mr-4 last:mr-0 ${
                i === HEADLINE_WORDS.length - 1
                  ? "italic bg-gradient-to-br from-gold via-gold to-[#D9A441] bg-clip-text text-transparent"
                  : ""
              }`}
            >
              {word}
              {i === HEADLINE_WORDS.length - 1 && (
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.7, delay: 1.05, ease: heroEase }}
                  className="absolute left-0 right-0 -bottom-1 md:-bottom-2 h-[3px] bg-gradient-to-r from-gold via-[#D9A441] to-transparent origin-left"
                  aria-hidden="true"
                />
              )}
            </motion.span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.65, ease: heroEase }}
          className="text-[16px] md:text-[18px] max-w-xl mb-10 text-mist leading-relaxed"
        >
          One desk coordinates the arrival, the stay, the government errand, and the workforce
          behind it — so you operate in Bangladesh with someone else standing in the queue.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.8, ease: heroEase }}
          className="relative flex flex-wrap items-center justify-center gap-4"
        >
          <div
            className="absolute -inset-x-10 -inset-y-6 -z-10 rounded-full blur-2xl opacity-60"
            style={{ background: "radial-gradient(closest-side, rgba(166,64,42,0.22), transparent 75%)" }}
            aria-hidden="true"
          />
          <MagneticButton
            onClick={() => onBook("airport")}
            strength={0.25}
            className="relative overflow-hidden flex items-center gap-2 px-7 py-3.5 rounded-full font-medium text-[14px] tracking-wide uppercase bg-gold text-white transition-shadow hover:shadow-[0_14px_34px_rgba(166,64,42,0.4)] active:scale-[0.97]"
          >
            <span className="relative z-10 flex items-center gap-2">
              <Plane size={15} /> Explore Our Services
            </span>
            <span className="absolute inset-0 overflow-hidden">
              <span className="absolute inset-y-0 left-0 w-1/3 bg-white/25 blur-md animate-shimmerSweep" />
            </span>
          </MagneticButton>
          <MagneticButton
            onClick={onContact}
            strength={0.35}
            className="px-7 py-3.5 rounded-full font-medium text-[14px] tracking-wide uppercase border border-white/30 text-white active:scale-[0.97] hover:bg-white/10 transition-colors"
          >
            Talk to Our Desk
          </MagneticButton>
        </motion.div>
      </div>

      <motion.button
        onClick={onContact}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{ opacity: { delay: 1.4, duration: 0.6 }, y: { delay: 2, duration: 2, repeat: Infinity, ease: "easeInOut" } }}
        className="absolute bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-mist-soft hover:text-white transition-colors"
        aria-label="Scroll to explore"
      >
        <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <ArrowDown size={15} />
      </motion.button>
    </section>
  );
}
