import { motion } from "framer-motion";
import { ArrowRight, Laptop2, CalendarCheck, Globe2, ChevronDown } from "lucide-react";
import MagneticButton from "./ui/MagneticButton";
import { useDict } from "../lib/i18n";
import { spainHero } from "../lib/translations";

const ease = [0.2, 0.8, 0.2, 1] as const;

const FACTS = [
  { Icon: Laptop2, key: "income" as const, value: "€2,849/mo", label: "Min. income, single applicant" },
  { Icon: CalendarCheck, key: "duration" as const, value: "Up to 5 yrs", label: "Renewable residence" },
  { Icon: Globe2, key: "schengen" as const, value: "29 countries", label: "Visa-free Schengen travel" },
];

export default function SpainHero() {
  const T = useDict(spainHero);

  return (
    <section className="relative px-5 md:px-10 pt-14 pb-16 md:pt-20 md:pb-24 bg-white overflow-hidden">
      <motion.div
        aria-hidden="true"
        className="absolute -top-24 -right-24 w-[460px] h-[460px] rounded-full blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(169,121,45,0.12), transparent 70%)" }}
        animate={{ x: [0, -24, 0], y: [0, 18, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden="true"
        className="absolute -bottom-28 -left-16 w-[420px] h-[420px] rounded-full blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(12,35,64,0.07), transparent 70%)" }}
        animate={{ x: [0, 20, 0], y: [0, -16, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-2 mb-5 text-[12px] tracking-[0.2em] uppercase text-gold-deep font-medium"
          >
            <span className="w-6 h-px bg-gold-deep" />
            {T.eyebrow}
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease }}
            className="font-display text-navy text-[2.5rem] sm:text-[3.4rem] leading-[1.08] mb-6"
            style={{ textWrap: "balance" }}
          >
            {T.h1}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease }}
            className="text-[16px] md:text-[18px] text-ink-muted leading-relaxed mb-5 max-w-xl"
          >
            {T.paragraph}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25, ease }}
            className="text-[13px] text-ink-faint leading-relaxed mb-9 max-w-xl"
          >
            {T.otherServicesNote}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease }}
            className="flex flex-wrap items-center gap-4"
          >
            <MagneticButton
              as="link"
              to="/spain-visa"
              strength={0.3}
              className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-medium text-[14px] tracking-wide uppercase bg-gold text-white hover:bg-gold-deep transition-colors"
            >
              {T.ctaExplore}
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
            </MagneticButton>
            <MagneticButton
              as="link"
              to="/#request-service"
              strength={0.3}
              className="px-7 py-3.5 rounded-full font-medium text-[14px] tracking-wide uppercase border border-navy text-navy hover:bg-navy hover:text-white transition-colors"
            >
              {T.ctaConsult}
            </MagneticButton>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.15, ease }}
          className="relative mx-4 sm:mx-8 lg:mx-2"
        >
          <div className="absolute -inset-3 rounded-[28px] bg-gradient-to-br from-gold/40 via-transparent to-navy/20 blur-md pointer-events-none" />
          <div className="relative rounded-2xl overflow-hidden shadow-card-hover border border-white/60 bg-navy">
            {/* Spain flag-colour accent stripe — a restrained nod to the
                country focus without relying on a sourced stock photo. */}
            <div className="h-2 w-full flex">
              <div className="flex-1 bg-spainRed" />
              <div className="flex-[2] bg-[#F1BF00]" />
              <div className="flex-1 bg-spainRed" />
            </div>

            <div className="p-7 sm:p-9">
              <div className="flex items-center gap-1.5 mb-4">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-gold" />
                </span>
                <span className="text-[9.5px] font-medium tracking-[0.14em] uppercase text-gold-pale">{T.badgeTag}</span>
              </div>

              <div className="text-[20px] sm:text-[24px] font-display text-white leading-snug mb-7">{T.badgeTitle}</div>

              <div className="space-y-4">
                {FACTS.map(({ Icon, key, value, label }, i) => (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
                    className="flex items-center gap-3.5 rounded-xl bg-white/[0.07] border border-white/10 px-4 py-3"
                  >
                    <div className="w-9 h-9 rounded-lg bg-gold/20 flex items-center justify-center text-gold shrink-0">
                      <Icon size={17} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[15px] font-semibold text-white leading-tight">{value}</div>
                      <div className="text-[11.5px] text-white/60 leading-tight">{label}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        className="relative mt-10 flex justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.6 }}
      >
        <a href="/#spain-visas" aria-label="Scroll to Spain visa types" className="text-ink-faint hover:text-gold-deep transition-colors cursor-pointer">
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}>
            <ChevronDown size={20} />
          </motion.div>
        </a>
      </motion.div>
    </section>
  );
}
