import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Reveal from "./ui/Reveal";
import { SERVICES } from "../lib/services";
import { useT, useDict } from "../lib/i18n";
import { servicesGrid, servicesList } from "../lib/translations";

export default function ServicesOverview() {
  const T = useDict({ eyebrow: servicesGrid.eyebrow, h2: servicesGrid.h2 });

  return (
    <section id="services" className="px-5 md:px-10 py-16 md:py-20 max-w-6xl mx-auto">
      <Reveal className="text-center max-w-2xl mx-auto mb-12">
        <div className="text-[12px] font-medium mb-3 tracking-[0.2em] uppercase text-gold-deep">{T.eyebrow}</div>
        <h2 className="font-display text-3xl md:text-4xl text-navy">{T.h2}</h2>
      </Reveal>

      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5">
        {SERVICES.map((s, i) => (
          <Reveal key={s.id} delay={i * 0.06}>
            <Link
              to={s.path}
              className="group flex flex-col h-full rounded-2xl bg-white border border-border p-6 shadow-card hover:border-gold hover:shadow-card-hover transition-all"
            >
              <div className="w-11 h-11 rounded-xl bg-gold-pale flex items-center justify-center mb-4 text-gold-deep">
                <s.icon size={20} />
              </div>
              <CardText index={i} fallbackTitle={s.title} fallbackSummary={s.summary} fallbackCta={s.cta} />
              <span className="mt-auto pt-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-gold-deep group-hover:gap-2.5 transition-all">
                <CtaText index={i} fallback={s.cta} />
                <ArrowRight size={13} />
              </span>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function CardText({
  index,
  fallbackTitle,
  fallbackSummary,
}: {
  index: number;
  fallbackTitle: string;
  fallbackSummary: string;
  fallbackCta: string;
}) {
  const entry = servicesList[index];
  const title = useT(entry?.title ?? { en: fallbackTitle, bn: fallbackTitle });
  const summary = useT(entry?.summary ?? { en: fallbackSummary, bn: fallbackSummary });
  return (
    <>
      <h3 className="font-display text-[16px] text-navy mb-2">{title}</h3>
      <p className="text-[13px] text-ink-muted leading-relaxed">{summary}</p>
    </>
  );
}

function CtaText({ index, fallback }: { index: number; fallback: string }) {
  const entry = servicesList[index];
  return <>{useT(entry?.cta ?? { en: fallback, bn: fallback })}</>;
}
