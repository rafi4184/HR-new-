import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Reveal from "./ui/Reveal";

const STEPS = [
  { n: "01", title: "Choose Your Service", body: "Select the service you need." },
  { n: "02", title: "Submit Your Request", body: "Tell us what you need and when you need it." },
  { n: "03", title: "We Coordinate", body: "Our team coordinates the appropriate service and support." },
  { n: "04", title: "Get Assistance", body: "Receive professional support from start to finish." },
];

export default function HowItWorks() {
  return (
    <section className="px-5 md:px-10 py-16 md:py-20 max-w-7xl mx-auto">
      <Reveal className="text-center max-w-2xl mx-auto mb-12">
        <div className="text-[12px] font-medium mb-3 tracking-[0.2em] uppercase text-gold-deep">Simple process</div>
        <h2 className="font-display text-3xl md:text-4xl text-navy">How HR — The Mediator Works</h2>
      </Reveal>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {STEPS.map((s, i) => (
          <Reveal key={s.n} delay={i * 0.08}>
            <div className="rounded-2xl border border-border bg-white p-6 h-full shadow-card">
              <div className="font-display text-3xl text-gold-deep mb-3">{s.n}</div>
              <h3 className="font-display text-lg text-navy mb-2">{s.title}</h3>
              <p className="text-[13.5px] text-ink-muted leading-relaxed">{s.body}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal className="text-center">
        <Link
          to="/#request-service"
          className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-medium text-[14px] tracking-wide uppercase bg-navy text-white hover:bg-navy-soft transition-colors"
        >
          Request a Service
          <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </Reveal>
    </section>
  );
}
