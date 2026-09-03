import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import CinematicBackground from "./ui/CinematicBackground";
import Reveal from "./ui/Reveal";
import { ScrollTrigger } from "../lib/smoothScroll";
import { SERVICES } from "../lib/services";
import type { BookingTab } from "../types";

export default function Services({ onBook }: { onBook: (tab: BookingTab) => void }) {
  const [active, setActive] = useState(0);
  const service = SERVICES[active];
  const stageRef = useRef<HTMLDivElement>(null);

  // Turn the four-service stage into a scroll-driven chapter sequence:
  // pin it for (N-1) viewport-heights of scroll and let scroll position
  // — not just clicks — advance the active chapter. Skipped under
  // prefers-reduced-motion so the section behaves like a normal, static
  // block instead of hijacking the scrollbar.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = stageRef.current;
    if (!el) return;

    const st = ScrollTrigger.create({
      trigger: el,
      start: "top top",
      end: () => `+=${window.innerHeight * (SERVICES.length - 1)}`,
      pin: true,
      scrub: 0.6,
      onUpdate: (self) => {
        const idx = Math.round(self.progress * (SERVICES.length - 1));
        setActive((current) => (current === idx ? current : idx));
      },
    });

    return () => st.kill();
  }, []);

  return (
    <section id="services" className="relative bg-navy">
      <div className="px-5 md:px-10 pt-20 pb-10 max-w-6xl mx-auto">
        <Reveal>
          <div className="text-[12px] font-medium mb-3 tracking-[0.28em] uppercase text-gold">What the desk handles</div>
          <h2 className="font-display text-white text-3xl md:text-5xl max-w-2xl" style={{ textWrap: "balance" }}>
            Four services, one point of contact.
          </h2>
        </Reveal>
      </div>

      <div ref={stageRef} className="relative h-[560px] md:h-[620px] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={service.id}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <CinematicBackground video={service.video} poster={service.poster} images={service.images} />
          </motion.div>
        </AnimatePresence>
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(15,22,17,0.94) 0%, rgba(15,22,17,0.72) 42%, rgba(15,22,17,0.3) 75%, rgba(15,22,17,0.1) 100%)",
          }}
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(15,22,17,0.85), transparent 40%)" }} />

        <div className="relative h-full flex items-end md:items-center px-5 md:px-10 pb-10 md:pb-0">
          <div className="max-w-lg">
            <AnimatePresence mode="wait">
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
              >
                <div className="font-mono text-gold text-sm mb-3 tracking-wide">{service.number}</div>
                <h3 className="font-display text-white text-3xl md:text-4xl mb-3" style={{ textWrap: "balance" }}>
                  {service.title}
                </h3>
                <p className="text-mist text-[15px] mb-5 italic">{service.tagline}</p>
                <p className="text-mist-soft text-[14px] leading-relaxed mb-6">{service.description}</p>
                <ul className="space-y-2 mb-7">
                  {service.benefits.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-[13px] text-mist">
                      <Check size={14} className="text-teal-soft mt-0.5 shrink-0" />
                      {b}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => service.bookTab && onBook(service.bookTab)}
                  disabled={!service.bookTab}
                  className="group flex items-center gap-2 text-[13px] font-medium tracking-wide uppercase px-6 py-3 rounded-full bg-gold text-white active:scale-[0.97] disabled:opacity-60 disabled:cursor-default transition-transform"
                >
                  {service.bookTab ? "Request this" : "Speak to the desk"}
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </button>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="absolute right-5 md:right-10 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-3">
          {SERVICES.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setActive(i)}
              className={`w-11 h-11 rounded-full flex items-center justify-center font-mono text-[12px] border transition-all ${
                i === active
                  ? "bg-gold border-gold text-white scale-110"
                  : "border-white/25 text-white/60 hover:border-white/60 hover:text-white"
              }`}
              aria-label={s.title}
            >
              {s.number}
            </button>
          ))}
        </div>

        <div className="absolute bottom-5 inset-x-5 lg:hidden flex gap-2 justify-center">
          {SERVICES.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setActive(i)}
              className={`h-1.5 rounded-full transition-all ${i === active ? "w-8 bg-gold" : "w-4 bg-white/30"}`}
              aria-label={s.title}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 border-t border-white/10">
        {SERVICES.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setActive(i)}
            className={`px-4 py-4 text-left border-r border-white/10 last:border-r-0 transition-colors ${
              i === active ? "bg-white/[0.06]" : "hover:bg-white/[0.03]"
            }`}
          >
            <div className="font-mono text-[11px] text-gold mb-1">{s.number}</div>
            <div className="text-[13px] text-white/85 font-medium">{s.shortTitle}</div>
          </button>
        ))}
      </div>
    </section>
  );
}
