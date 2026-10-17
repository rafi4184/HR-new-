import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useDict } from "../lib/i18n";
import { serviceReel, hero } from "../lib/translations";
import type { BookingTab } from "../types";

export default function ServiceVideoHero({ onRequest }: { onRequest?: (tab: BookingTab | null) => void }) {
  const T = useDict({
    eyebrow: serviceReel.eyebrow,
    h2: serviceReel.h2,
    requestCta: hero.requestService,
    exploreServices: hero.exploreServices,
  });

  return (
    <section className="relative overflow-hidden bg-brand-gradient">
      <motion.div
        aria-hidden="true"
        className="absolute -top-20 -left-20 w-[380px] h-[380px] rounded-full blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(198,161,91,0.18), transparent 70%)" }}
        animate={{ x: [0, 40, 0], y: [0, 24, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden="true"
        className="absolute -bottom-24 -right-16 w-[420px] h-[420px] rounded-full blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(255,255,255,0.06), transparent 70%)" }}
        animate={{ x: [0, -30, 0], y: [0, -18, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative max-w-6xl mx-auto px-5 md:px-10 py-14 md:py-20">
        <div className="text-center max-w-2xl mx-auto mb-8 md:mb-10">
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

        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
          className="relative mx-auto max-w-4xl rounded-2xl overflow-hidden border border-white/15 shadow-card-hover"
        >
          <video
            className="w-full h-auto block aspect-video"
            poster="/videos/story-hero-poster.jpg"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-label="HR — The Mediator story reel: an arriving traveller met at the gate, fast-tracked through immigration, baggage assistance, a private car to the hotel and the same care on departure; a student and jobseeker guided through admission and placement abroad; a trainee coached into confident on-air delivery; and a resident's government paperwork resolved end to end."
          >
            <source src="/videos/story-hero.webm" type="video/webm" />
            <source src="/videos/story-hero.mp4" type="video/mp4" />
          </video>
        </motion.div>

        <div className="flex flex-wrap items-center justify-center gap-3 mt-10">
          <button
            type="button"
            onClick={() => onRequest?.(null)}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-medium text-[14px] tracking-wide uppercase bg-gold text-navy-deep hover:bg-white transition-colors"
          >
            {T.requestCta}
          </button>
          <a
            href="/#services"
            className="group inline-flex items-center gap-1.5 px-7 py-3.5 rounded-full font-medium text-[14px] tracking-wide uppercase border border-white/30 text-white hover:border-white hover:bg-white/10 transition-colors"
          >
            {T.exploreServices}
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </section>
  );
}
