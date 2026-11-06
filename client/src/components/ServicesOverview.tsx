import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Reveal from "./ui/Reveal";
import { SERVICES } from "../lib/services";

export default function ServicesOverview() {
  return (
    <section id="services" className="px-5 md:px-10 py-16 md:py-20 max-w-6xl mx-auto">
      <Reveal className="text-center max-w-2xl mx-auto mb-12">
        <div className="text-[12px] font-medium mb-3 tracking-[0.2em] uppercase text-gold-deep">What we offer</div>
        <h2 className="font-display text-3xl md:text-4xl text-navy">Three Services, One Team</h2>
      </Reveal>

      <div className="grid sm:grid-cols-3 gap-5">
        {SERVICES.map((s, i) => (
          <Reveal key={s.id} delay={i * 0.06}>
            <Link
              to={s.path}
              className="group flex flex-col h-full rounded-2xl bg-white border border-border p-6 shadow-card hover:border-gold hover:shadow-card-hover transition-all"
            >
              <div className="w-11 h-11 rounded-xl bg-gold-pale flex items-center justify-center mb-4 text-gold-deep">
                <s.icon size={20} />
              </div>
              <h3 className="font-display text-[16px] text-navy mb-2">{s.title}</h3>
              <p className="text-[13px] text-ink-muted leading-relaxed">{s.summary}</p>
              <span className="mt-auto pt-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-gold-deep group-hover:gap-2.5 transition-all">
                {s.cta}
                <ArrowRight size={13} />
              </span>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
