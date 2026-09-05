import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Radio, GraduationCap, Briefcase } from "lucide-react";
import Reveal from "./ui/Reveal";
import AmbientGlow from "./ui/AmbientGlow";
import { IMG_STUDENTS, IMG_DUBAI } from "../lib/constants";
import { useDict } from "../lib/i18n";
import { coursesCareersTeaser } from "../lib/translations";

export default function CoursesCareersTeaser() {
  const T = useDict(coursesCareersTeaser);
  return (
    <section className="relative px-5 md:px-10 py-16 md:py-20 bg-paper-panel overflow-hidden">
      <AmbientGlow variant="light" />
      <div className="relative max-w-7xl mx-auto">
        <Reveal className="max-w-2xl mb-12">
          <div className="text-[12px] font-medium mb-3 tracking-[0.2em] uppercase text-gold-deep">{T.eyebrow}</div>
          <h2 className="font-display text-3xl md:text-4xl text-navy mb-3" style={{ textWrap: "balance" }}>
            {T.h2}
          </h2>
          <p className="text-ink-muted">{T.subtitle}</p>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-6">
          <Reveal>
            <Link
              to="/media-public-speaking"
              className="group flex flex-col h-full rounded-2xl overflow-hidden border border-border bg-gradient-to-br from-navy to-navy-soft shadow-card hover:shadow-card-hover transition-shadow"
            >
              <div className="h-48 flex items-center justify-center">
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                  className="w-20 h-20 rounded-2xl bg-white/10 flex items-center justify-center text-gold"
                >
                  <Radio size={34} />
                </motion.div>
              </div>
              <div className="p-7 flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-3 text-gold">
                  <Radio size={17} />
                  <span className="text-[13px] font-medium uppercase tracking-wide">{T.trackOneLabel}</span>
                </div>
                <h3 className="font-display text-xl text-white mb-2">{T.trackOneTitle}</h3>
                <p className="text-[14px] text-mist leading-relaxed mb-5 flex-1">{T.trackOneBody}</p>
                <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-gold group-hover:gap-2.5 transition-all">
                  {T.trackOneCta} <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          </Reveal>

          <Reveal delay={0.06}>
            <Link
              to="/study-work-gulf"
              className="group flex flex-col h-full rounded-2xl overflow-hidden border border-border bg-white shadow-card hover:shadow-card-hover transition-shadow"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={IMG_STUDENTS}
                  alt="Students preparing to study abroad"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-7 flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-3 text-gold-deep">
                  <GraduationCap size={17} />
                  <span className="text-[13px] font-medium uppercase tracking-wide">{T.trackTwoLabel}</span>
                </div>
                <h3 className="font-display text-xl text-navy mb-2">{T.trackTwoTitle}</h3>
                <p className="text-[14px] text-ink-muted leading-relaxed mb-5 flex-1">{T.trackTwoBody}</p>
                <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-gold-deep group-hover:gap-2.5 transition-all">
                  {T.trackTwoCta} <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          </Reveal>

          <Reveal delay={0.12}>
            <Link
              to="/study-work-gulf"
              className="group flex flex-col h-full rounded-2xl overflow-hidden border border-border bg-white shadow-card hover:shadow-card-hover transition-shadow"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={IMG_DUBAI}
                  alt="Gulf city skyline"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-7 flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-3 text-gold-deep">
                  <Briefcase size={17} />
                  <span className="text-[13px] font-medium uppercase tracking-wide">{T.trackThreeLabel}</span>
                </div>
                <h3 className="font-display text-xl text-navy mb-2">{T.trackThreeTitle}</h3>
                <p className="text-[14px] text-ink-muted leading-relaxed mb-5 flex-1">{T.trackThreeBody}</p>
                <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-gold-deep group-hover:gap-2.5 transition-all">
                  {T.trackThreeCta} <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
