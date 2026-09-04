import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Reveal from "./ui/Reveal";
import { SERVICES } from "../lib/services";

export default function ServicesGrid() {
  return (
    <section id="services" className="px-5 md:px-10 py-16 md:py-20 max-w-7xl mx-auto">
      <Reveal className="text-center max-w-2xl mx-auto mb-12">
        <div className="text-[12px] font-medium mb-3 tracking-[0.2em] uppercase text-gold-deep">
          What we offer
        </div>
        <h2 className="font-display text-3xl md:text-4xl text-navy">How Can We Help You?</h2>
      </Reveal>

      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5">
        {SERVICES.map((s, i) => (
          <Reveal key={s.id} delay={i * 0.06} className="lg:col-span-1 sm:[&:last-child]:col-span-2 lg:[&:last-child]:col-span-1">
            <Link
              to={s.path}
              className="group flex flex-col h-full rounded-2xl border border-border bg-white p-6 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-gold-pale flex items-center justify-center mb-5 group-hover:bg-gold group-hover:text-white transition-colors text-gold-deep">
                <s.icon size={22} />
              </div>
              <h3 className="font-display text-lg text-navy mb-2">{s.title}</h3>
              <p className="text-[13.5px] text-ink-muted leading-relaxed mb-5 flex-1">{s.summary}</p>
              <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-gold-deep group-hover:gap-2.5 transition-all">
                {s.cta} <ArrowRight size={14} />
              </span>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
