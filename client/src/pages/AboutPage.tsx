import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useSeo } from "../lib/useSeo";
import Reveal from "../components/ui/Reveal";
import { HASANUR_PHOTO } from "../lib/constants";
import { useDict } from "../lib/i18n";
import { aboutPageT } from "../lib/translations";

export default function AboutPage() {
  useSeo({
    title: "About Us | HR — The Mediator",
    description:
      "HR — The Mediator is a registered manpower, security and consultancy company based in Bangladesh, running a concierge desk, media training academy and Gulf employment placement.",
    path: "/about-us",
  });

  const T = useDict(aboutPageT);

  return (
    <div>
      <section className="px-5 md:px-10 py-14 md:py-20 bg-paper-soft text-center">
        <div className="max-w-3xl mx-auto">
          <div className="text-[12px] font-medium mb-3 tracking-[0.2em] uppercase text-gold-deep">{T.eyebrow}</div>
          <h1 className="font-display text-3xl md:text-5xl text-navy mb-5">{T.h1}</h1>
          <p className="text-[16px] text-ink-muted leading-relaxed">{T.intro}</p>
        </div>
      </section>

      <section className="px-5 md:px-10 py-14 max-w-4xl mx-auto grid md:grid-cols-[1fr_1.4fr] gap-10 items-center">
        <Reveal>
          <div className="rounded-2xl overflow-hidden shadow-card-hover">
            <img src={HASANUR_PHOTO} alt="Md. Hasanur Rahman, News Presenter" className="w-full h-full object-cover" />
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="font-display text-2xl text-navy mb-3">Md. Hasanur Rahman</h2>
          <p className="text-[13px] text-gold-deep font-medium mb-4 uppercase tracking-wide">{T.founderRole}</p>
          <p className="text-[14.5px] text-ink-muted leading-relaxed mb-4">{T.para1}</p>
          <p className="text-[14.5px] text-ink-muted leading-relaxed">{T.para2}</p>
        </Reveal>
      </section>

      <section className="px-5 md:px-10 py-14 bg-paper-panel text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-display text-2xl md:text-3xl text-navy mb-4">{T.exploreH2}</h2>
          <p className="text-ink-muted mb-8">{T.exploreBody}</p>
          <Link
            to="/#services"
            className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-medium text-[14px] tracking-wide uppercase bg-gradient-to-r from-gold to-[#E0B563] text-navy hover:from-gold-deep hover:to-gold-deep hover:text-white transition-colors"
          >
            {T.viewAllServices}
            <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    </div>
  );
}
