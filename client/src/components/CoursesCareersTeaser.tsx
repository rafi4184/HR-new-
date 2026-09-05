import { Link } from "react-router-dom";
import { ArrowRight, Radio, Globe2 } from "lucide-react";
import Reveal from "./ui/Reveal";
import { IMG_STUDENTS, IMG_DUBAI } from "../lib/constants";
import { useDict } from "../lib/i18n";
import { coursesCareersTeaser } from "../lib/translations";

export default function CoursesCareersTeaser() {
  const T = useDict(coursesCareersTeaser);
  return (
    <section className="px-5 md:px-10 py-16 md:py-20 bg-paper-panel">
      <div className="max-w-7xl mx-auto">
        <Reveal className="max-w-2xl mb-12">
          <div className="text-[12px] font-medium mb-3 tracking-[0.2em] uppercase text-gold-deep">{T.eyebrow}</div>
          <h2 className="font-display text-3xl md:text-4xl text-navy mb-3" style={{ textWrap: "balance" }}>
            {T.h2}
          </h2>
          <p className="text-ink-muted">{T.subtitle}</p>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-6">
          <Reveal>
            <Link
              to="/media-public-speaking"
              className="group flex flex-col h-full rounded-2xl overflow-hidden border border-border bg-white shadow-card hover:shadow-card-hover transition-shadow"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={IMG_STUDENTS}
                  alt="Media and public speaking training"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-7">
                <div className="flex items-center gap-2 mb-3 text-gold-deep">
                  <Radio size={17} />
                  <span className="text-[13px] font-medium uppercase tracking-wide">{T.trackOneLabel}</span>
                </div>
                <h3 className="font-display text-xl text-navy mb-2">{T.trackOneTitle}</h3>
                <p className="text-[14px] text-ink-muted leading-relaxed mb-5">{T.trackOneBody}</p>
                <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-gold-deep group-hover:gap-2.5 transition-all">
                  {T.trackOneCta} <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          </Reveal>

          <Reveal delay={0.08}>
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
              <div className="p-7">
                <div className="flex items-center gap-2 mb-3 text-gold-deep">
                  <Globe2 size={17} />
                  <span className="text-[13px] font-medium uppercase tracking-wide">{T.trackTwoLabel}</span>
                </div>
                <h3 className="font-display text-xl text-navy mb-2">{T.trackTwoTitle}</h3>
                <p className="text-[14px] text-ink-muted leading-relaxed mb-5">{T.trackTwoBody}</p>
                <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-gold-deep group-hover:gap-2.5 transition-all">
                  {T.trackTwoCta} <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
