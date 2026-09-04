import { motion } from "framer-motion";
import { MEDIA_PARTNERS } from "../lib/constants";

export default function MediaPartners() {
  const loop = [...MEDIA_PARTNERS, ...MEDIA_PARTNERS];

  return (
    <section className="py-8 bg-paper-soft border-y border-border overflow-hidden">
      <div className="max-w-6xl mx-auto px-5 md:px-10 flex flex-col sm:flex-row items-center gap-5 sm:gap-10">
        <span className="text-[12px] font-medium shrink-0 text-ink-faint">
          Our news-presenter trainer appears on
        </span>
        <div className="relative w-full overflow-hidden">
          <motion.div
            className="flex items-center gap-x-12 whitespace-nowrap"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          >
            {loop.map((m, i) => (
              <span key={`${m}-${i}`} className="font-display text-[15px] text-ink-soft">
                {m}
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
