import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Plane, Landmark, Users, GraduationCap } from "lucide-react";
import Reveal from "./ui/Reveal";
import { SERVICES } from "../lib/services";

const INTENTS = [
  { id: "travel", label: "I am travelling", icon: Plane, matches: ["airport", "hotel"] },
  { id: "local", label: "I need local assistance", icon: Landmark, matches: ["government"] },
  { id: "people", label: "I need people or security", icon: Users, matches: ["manpower"] },
  { id: "abroad", label: "I want to study or work abroad", icon: GraduationCap, matches: ["courses"] },
] as const;

export default function ServicesGrid() {
  const [intent, setIntent] = useState<(typeof INTENTS)[number]["id"] | null>(null);
  const activeMatches = INTENTS.find((i) => i.id === intent)?.matches as readonly string[] | undefined;

  return (
    <section id="services" className="px-5 md:px-10 py-16 md:py-20 max-w-7xl mx-auto">
      <Reveal className="text-center max-w-2xl mx-auto mb-10">
        <div className="text-[12px] font-medium mb-3 tracking-[0.2em] uppercase text-gold-deep">
          What we offer
        </div>
        <h2 className="font-display text-3xl md:text-4xl text-navy">What Do You Need Help With?</h2>
      </Reveal>

      <Reveal delay={0.05} className="flex flex-wrap justify-center gap-2.5 mb-12">
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
            {i.label}
          </button>
        ))}
      </Reveal>

      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5">
        {SERVICES.map((s, i) => {
          const isMatch = !activeMatches || activeMatches.includes(s.id);
          return (
            <Reveal key={s.id} delay={i * 0.06} className="lg:col-span-1 sm:[&:last-child]:col-span-2 lg:[&:last-child]:col-span-1">
              <motion.div
                animate={{ opacity: isMatch ? 1 : 0.4, scale: isMatch && activeMatches ? 1.03 : 1 }}
                transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
              >
                <Link
                  to={s.path}
                  className={`group flex flex-col h-full rounded-2xl border bg-white p-6 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all ${
                    isMatch && activeMatches ? "border-gold" : "border-border"
                  }`}
                >
                  <motion.div
                    className="w-12 h-12 rounded-xl bg-gold-pale flex items-center justify-center mb-5 group-hover:bg-gold group-hover:text-white transition-colors text-gold-deep"
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.25 }}
                  >
                    <s.icon size={22} />
                  </motion.div>
                  <h3 className="font-display text-lg text-navy mb-2">{s.title}</h3>
                  <p className="text-[13.5px] text-ink-muted leading-relaxed mb-5 flex-1">{s.summary}</p>
                  <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-gold-deep group-hover:gap-2.5 transition-all">
                    {s.cta} <ArrowRight size={14} />
                  </span>
                </Link>
              </motion.div>
            </Reveal>
          );
        })}
      </div>

      <AnimatePresence>
        {intent && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="text-center text-[13px] text-ink-faint mt-6"
          >
            Highlighted above — the services that best match what you told us.
          </motion.p>
        )}
      </AnimatePresence>
    </section>
  );
}
