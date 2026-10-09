import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Check, Plane, Landmark, Users, GraduationCap } from "lucide-react";
import Reveal from "./ui/Reveal";
import AmbientGlow from "./ui/AmbientGlow";
import { SERVICES } from "../lib/services";
import { useDict, useT } from "../lib/i18n";
import { servicesGrid, servicesList, serviceStory } from "../lib/translations";

const INTENTS = [
  { id: "travel", key: "travel", icon: Plane, matches: ["airport", "hotel"] },
  { id: "local", key: "local", icon: Landmark, matches: ["government"] },
  { id: "people", key: "people", icon: Users, matches: ["manpower"] },
  { id: "abroad", key: "abroad", icon: GraduationCap, matches: ["courses"] },
] as const;

const ease = [0.2, 0.8, 0.2, 1] as const;

export default function ServicesGrid() {
  const T = useDict({
    eyebrow: servicesGrid.eyebrow,
    h2: servicesGrid.h2,
    highlightNote: servicesGrid.highlightNote,
  });
  const storyT = useDict({ eyebrow: serviceStory.eyebrow, h2: serviceStory.h2, intro: serviceStory.intro });
  const intentsT = useDict(servicesGrid.intents);
  const [intent, setIntent] = useState<(typeof INTENTS)[number]["id"] | null>(null);
  const activeMatches = INTENTS.find((i) => i.id === intent)?.matches as readonly string[] | undefined;

  const spineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: spineRef, offset: ["start center", "end center"] });
  const spineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section id="services" className="relative px-5 md:px-10 py-16 md:py-20 max-w-7xl mx-auto overflow-hidden">
      <AmbientGlow variant="light" />
      <div className="relative">
        <Reveal className="text-center max-w-2xl mx-auto mb-10">
          <div className="text-[12px] font-medium mb-3 tracking-[0.2em] uppercase text-gold-deep">{T.eyebrow}</div>
          <h2 className="font-display text-3xl md:text-4xl text-navy">{T.h2}</h2>
        </Reveal>

        <Reveal delay={0.05} className="flex flex-wrap justify-center gap-2.5 mb-16">
          {INTENTS.map((i) => (
            <button
              key={i.id}
              onClick={() => setIntent((cur) => (cur === i.id ? null : i.id))}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-[13.5px] font-medium border transition-colors ${
                intent === i.id
                  ? "bg-navy text-white border-navy"
                  : "bg-white text-ink-soft border-border hover:border-navy hover:text-navy"
              }`}
            >
              <i.icon size={15} />
              {intentsT[i.key]}
            </button>
          ))}
        </Reveal>

        <AnimatePresence>
          {intent && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="text-center text-[13px] text-ink-faint -mt-10 mb-10"
            >
              {T.highlightNote}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Storytelling spine: a vertical journey from Terminal 3 arrival
            through every service, one chapter per scroll stop. */}
        <Reveal className="text-center max-w-xl mx-auto mb-14">
          <div className="text-[11px] font-medium mb-2 tracking-[0.2em] uppercase text-gold-deep">
            {storyT.eyebrow}
          </div>
          <h3 className="font-display text-2xl text-navy mb-2">{storyT.h2}</h3>
          <p className="text-[14px] text-ink-muted">{storyT.intro}</p>
        </Reveal>

        <div ref={spineRef} className="relative">
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-border" />
          <motion.div
            aria-hidden="true"
            className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-brand-gradient origin-top"
            style={{ scaleY: spineScale }}
          />

          <div className="flex flex-col gap-10 lg:gap-6">
            {SERVICES.map((s, i) => {
              const isMatch = !activeMatches || activeMatches.includes(s.id);
              const reversed = i % 2 === 1;
              return (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, x: reversed ? 40 : -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.35 }}
                  animate={{ opacity: isMatch ? 1 : 0.4 }}
                  transition={{ duration: 0.7, ease }}
                  className="relative grid lg:grid-cols-2 gap-6 lg:gap-16 items-center"
                >
                  {/* Spine dot */}
                  <motion.div
                    aria-hidden="true"
                    className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white border-2 border-gold items-center justify-center z-10"
                    initial={{ scale: 0.6 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true, amount: 0.6 }}
                    transition={{ duration: 0.4, ease: [0.2, 0.9, 0.3, 1.3] }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-gold-deep" />
                  </motion.div>

                  <div className={`${reversed ? "lg:order-2 lg:pl-10" : "lg:pr-10 lg:text-right"}`}>
                    <div className={`flex items-center gap-3 mb-3 ${reversed ? "" : "lg:justify-end"}`}>
                      <span className="font-display text-3xl text-gold/70">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="w-10 h-10 rounded-xl bg-gold-pale flex items-center justify-center text-gold-deep">
                        <s.icon size={18} />
                      </span>
                    </div>
                    <Link to={s.path} className="group inline-block">
                      <h4 className="font-display text-xl md:text-2xl text-navy mb-2.5 group-hover:text-gold-deep transition-colors">
                        <ServiceText field="title" index={i} fallback={s.title} />
                      </h4>
                    </Link>
                    <p className={`text-[14.5px] text-ink-muted leading-relaxed mb-4 max-w-md ${reversed ? "" : "lg:ml-auto"}`}>
                      <ServiceText field="story" index={i} fallback={s.summary} />
                    </p>
                    <ul className={`flex flex-col gap-1.5 mb-5 text-[13px] text-ink-soft ${reversed ? "" : "lg:items-end"}`}>
                      {(servicesList[i]?.highlights ?? []).map((h, hi) => (
                        <li key={hi} className={`flex items-center gap-2 ${reversed ? "" : "lg:flex-row-reverse"}`}>
                          <Check size={13} className="text-gold-deep shrink-0" />
                          <ServiceHighlight pair={h} />
                        </li>
                      ))}
                    </ul>
                    <Link
                      to={s.path}
                      className={`inline-flex items-center gap-1.5 text-[13px] font-medium text-gold-deep hover:gap-2.5 transition-all ${
                        isMatch && activeMatches ? "underline underline-offset-4" : ""
                      }`}
                    >
                      <ServiceText field="cta" index={i} fallback={s.cta} /> <ArrowRight size={14} />
                    </Link>
                  </div>

                  <div className={`hidden lg:flex ${reversed ? "lg:order-1 lg:justify-end lg:pr-10" : "lg:pl-10"}`}>
                    <motion.div
                      className="relative w-full max-w-[220px] aspect-square rounded-[28px] bg-brand-gradient-soft border border-border flex items-center justify-center overflow-hidden"
                      initial={{ opacity: 0, scale: 0.85 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true, amount: 0.4 }}
                      transition={{ duration: 0.6, delay: 0.1, ease: [0.2, 0.9, 0.3, 1.3] }}
                    >
                      <motion.div
                        aria-hidden="true"
                        className="absolute w-32 h-32 rounded-full bg-gold/20 blur-2xl"
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      />
                      <motion.div
                        className="relative text-navy"
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <s.icon size={64} strokeWidth={1.3} />
                      </motion.div>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function ServiceText({
  field,
  index,
  fallback,
}: {
  field: "title" | "summary" | "cta" | "story";
  index: number;
  fallback: string;
}) {
  const entry = servicesList[index];
  const pair = entry?.[field] ?? { en: fallback, bn: fallback };
  const value = useT(pair);
  return <>{value}</>;
}

function ServiceHighlight({ pair }: { pair: { en: string; bn: string } }) {
  return <>{useT(pair)}</>;
}
