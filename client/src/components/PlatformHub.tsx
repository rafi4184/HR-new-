import { motion } from "framer-motion";
import { PlaneTakeoff, Landmark, ShieldCheck, GraduationCap } from "lucide-react";
import Reveal from "./ui/Reveal";
import LogoMark from "./ui/Logo";
import { useDict, useLanguage } from "../lib/i18n";
import { platformHub } from "../lib/translations";

const ICONS = [PlaneTakeoff, Landmark, ShieldCheck, GraduationCap];
const POSITIONS = [
  { top: "6%", left: "8%" },
  { top: "6%", right: "8%" },
  { bottom: "4%", left: "8%" },
  { bottom: "4%", right: "8%" },
];
const LINES = [
  { x2: 22, y2: 12 },
  { x2: 78, y2: 12 },
  { x2: 22, y2: 88 },
  { x2: 78, y2: 88 },
];

export default function PlatformHub() {
  const T = useDict({ eyebrow: platformHub.eyebrow, h2: platformHub.h2 });
  const { lang } = useLanguage();
  const branches = platformHub.branches.map((b, i) => ({
    id: b.label.en,
    label: b.label[lang],
    items: b.items.map((it) => it[lang]),
    icon: ICONS[i],
    pos: POSITIONS[i],
    line: LINES[i],
  }));

  return (
    <section className="px-5 md:px-10 py-16 md:py-24 bg-paper-panel overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <Reveal className="text-center max-w-2xl mx-auto mb-14">
          <div className="text-[12px] font-medium mb-3 tracking-[0.2em] uppercase text-gold-deep">{T.eyebrow}</div>
          <h2 className="font-display text-3xl md:text-4xl text-navy">{T.h2}</h2>
        </Reveal>

        {/* Desktop: radial hub layout */}
        <div className="hidden lg:block relative mx-auto" style={{ width: "100%", maxWidth: 680, height: 520 }}>
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
            {branches.map((b, i) => (
              <motion.line
                key={b.id}
                x1={50}
                y1={50}
                x2={b.line.x2}
                y2={b.line.y2}
                stroke="#D3DBE6"
                strokeWidth={0.5}
                vectorEffect="non-scaling-stroke"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.7, delay: 0.15 + i * 0.1, ease: [0.2, 0.8, 0.2, 1] }}
              />
            ))}
          </svg>

          <motion.div
            aria-hidden="true"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-gold/25 pointer-events-none"
            animate={{ scale: [1, 1.45, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, ease: [0.2, 0.9, 0.3, 1.3] }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-navy flex items-center justify-center shadow-card-hover z-10"
          >
            <LogoMark size={40} className="text-white" />
          </motion.div>

          {branches.map((b, i) => (
            <motion.div
              key={b.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, delay: 0.35 + i * 0.1, ease: [0.2, 0.8, 0.2, 1] }}
              style={b.pos}
              className="absolute w-52 rounded-xl bg-white border border-border shadow-card p-4"
            >
              <div className="flex items-center gap-2 mb-2 text-gold-deep">
                <b.icon size={17} />
                <span className="font-display text-[15px] text-navy">{b.label}</span>
              </div>
              <div className="text-[12.5px] text-ink-muted leading-relaxed">{b.items.join(" · ")}</div>
            </motion.div>
          ))}
        </div>

        {/* Mobile / tablet: vertical stacked list */}
        <div className="lg:hidden relative pl-8">
          <div className="absolute left-[11px] top-2 bottom-2 w-px bg-border" />
          <div className="flex flex-col gap-6">
            {branches.map((b, i) => (
              <Reveal key={b.id} delay={i * 0.08}>
                <div className="relative">
                  <div className="absolute -left-8 top-0.5 w-[22px] h-[22px] rounded-full bg-navy flex items-center justify-center">
                    <b.icon size={12} color="#fff" />
                  </div>
                  <div className="font-display text-[16px] text-navy mb-1">{b.label}</div>
                  <div className="text-[13.5px] text-ink-muted">{b.items.join(" · ")}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
