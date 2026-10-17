import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Pause, Play } from "lucide-react";
import { useDict, useT } from "../lib/i18n";
import { SERVICES } from "../lib/services";
import { servicesList, serviceReel } from "../lib/translations";
import type { BookingTab } from "../types";

const SLIDE_MS = 3200;
const ease = [0.2, 0.8, 0.2, 1] as const;

export default function ServiceVideoHero({ onRequest }: { onRequest?: (tab: BookingTab | null) => void }) {
  const T = useDict({
    eyebrow: serviceReel.eyebrow,
    h2: serviceReel.h2,
    requestCta: serviceReel.requestCta,
    play: serviceReel.play,
    pause: serviceReel.pause,
  });
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [hovering, setHovering] = useState(false);
  const [cycle, setCycle] = useState(0);

  const running = playing && !hovering;
  const active = SERVICES[index];

  useEffect(() => {
    if (!running) return;
    const t = setTimeout(() => {
      setIndex((i) => (i + 1) % SERVICES.length);
      setCycle((c) => c + 1);
    }, SLIDE_MS);
    return () => clearTimeout(t);
  }, [index, running]);

  const goTo = (i: number) => {
    setIndex(i);
    setCycle((c) => c + 1);
  };

  return (
    <section
      className="relative overflow-hidden bg-brand-gradient"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {/* Ambient light sweeps — keep the frame alive even on a static slide */}
      <motion.div
        aria-hidden="true"
        className="absolute -top-20 -left-20 w-[380px] h-[380px] rounded-full blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(198,161,91,0.22), transparent 70%)" }}
        animate={{ x: [0, 40, 0], y: [0, 24, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden="true"
        className="absolute -bottom-24 -right-16 w-[420px] h-[420px] rounded-full blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(255,255,255,0.08), transparent 70%)" }}
        animate={{ x: [0, -30, 0], y: [0, -18, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{ background: "linear-gradient(120deg, transparent 20%, rgba(255,255,255,0.05) 45%, transparent 70%)" }}
        animate={{ backgroundPositionX: ["0%", "100%"] }}
        transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
      />

      <div className="relative max-w-6xl mx-auto px-5 md:px-10 py-14 md:py-20">
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-14">
          <div className="flex items-center justify-center gap-2 mb-3 text-[12px] tracking-[0.2em] uppercase text-gold font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-gold" />
            </span>
            {T.eyebrow}
          </div>
          <h2 className="font-display text-white text-3xl md:text-4xl" style={{ textWrap: "balance" }}>
            {T.h2}
          </h2>
        </div>

        <div className="grid md:grid-cols-[auto,1fr] gap-8 md:gap-14 items-center min-h-[220px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={{ opacity: 0, scale: 0.8, rotate: -6 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.8, rotate: 6 }}
              transition={{ duration: 0.4, ease: [0.2, 0.9, 0.3, 1.3] }}
              className="relative mx-auto shrink-0 w-32 h-32 md:w-40 md:h-40"
            >
              <motion.span
                aria-hidden="true"
                className="absolute inset-0 rounded-[28px]"
                style={{
                  background:
                    "conic-gradient(from 0deg, rgba(198,161,91,0.9), transparent 35%, transparent 65%, rgba(198,161,91,0.9))",
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              />
              <div className="absolute inset-[3px] rounded-[26px] bg-navy-deep flex items-center justify-center">
                <motion.div
                  className="text-gold"
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <active.icon size={56} strokeWidth={1.4} />
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.4, ease }}
              className="text-center md:text-left"
            >
              <h3 className="font-display text-white text-2xl md:text-[2rem] mb-2.5">
                <ReelText field="title" index={index} />
              </h3>
              <p className="text-[14.5px] md:text-[15px] text-white/75 leading-relaxed mb-6 max-w-lg mx-auto md:mx-0">
                <ReelText field="summary" index={index} />
              </p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                <button
                  type="button"
                  onClick={() => onRequest?.(active.bookTab)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-medium text-[13.5px] tracking-wide uppercase bg-gold text-navy-deep hover:bg-white transition-colors"
                >
                  {T.requestCta}
                </button>
                <Link
                  to={active.path}
                  className="group inline-flex items-center gap-1.5 px-6 py-3 rounded-full font-medium text-[13.5px] tracking-wide uppercase border border-white/30 text-white hover:border-white hover:bg-white/10 transition-colors"
                >
                  <ReelText field="cta" index={index} />
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-center gap-2.5 mt-10 md:mt-14">
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? T.pause : T.play}
            title={playing ? T.pause : T.play}
            className="flex items-center justify-center w-7 h-7 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors shrink-0"
          >
            {playing ? <Pause size={13} /> : <Play size={13} />}
          </button>
          {SERVICES.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => goTo(i)}
              aria-label={servicesList[i].title.en}
              className="relative h-1.5 w-10 md:w-14 rounded-full bg-white/15 overflow-hidden cursor-pointer"
            >
              {i < index && <span className="absolute inset-0 bg-gold/70" />}
              {i === index && (
                <motion.span
                  key={cycle}
                  className="absolute inset-y-0 left-0 bg-gold"
                  initial={{ width: "0%" }}
                  animate={{ width: running ? "100%" : "0%" }}
                  transition={{ duration: SLIDE_MS / 1000, ease: "linear" }}
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function ReelText({ field, index }: { field: "title" | "summary" | "cta"; index: number }) {
  const pair = servicesList[index][field];
  return <>{useT(pair)}</>;
}
