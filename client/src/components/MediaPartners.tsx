import { motion } from "framer-motion";
import { Tv } from "lucide-react";
import { MEDIA_PARTNERS } from "../lib/constants";
import { useT } from "../lib/i18n";
import { mediaPartners } from "../lib/translations";

export default function MediaPartners() {
  const loop = [...MEDIA_PARTNERS, ...MEDIA_PARTNERS];
  const appearsOn = useT(mediaPartners.appearsOn);

  return (
    <section className="py-8 bg-paper-soft border-y border-border overflow-hidden">
      <div className="max-w-6xl mx-auto px-5 md:px-10 flex flex-col sm:flex-row items-center gap-5 sm:gap-10">
        <span className="flex items-center gap-2 text-[12px] font-medium shrink-0 text-ink-faint uppercase tracking-wide">
          <Tv size={14} className="text-gold-deep" />
          {appearsOn}
        </span>
        <div className="relative w-full overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-paper-soft to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-paper-soft to-transparent z-10" />
          <motion.div
            className="flex items-center gap-x-12 whitespace-nowrap"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          >
            {loop.map((m, i) => (
              <span
                key={`${m}-${i}`}
                className="font-display text-[15px] text-ink-soft px-4 py-1.5 rounded-full border border-border bg-white"
              >
                {m}
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
