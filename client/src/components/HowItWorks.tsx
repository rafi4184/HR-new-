import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Reveal from "./ui/Reveal";
import { useDict } from "../lib/i18n";
import { howItWorks } from "../lib/translations";

export default function HowItWorks() {
  const T = useDict({ eyebrow: howItWorks.eyebrow, h2: howItWorks.h2, cta: howItWorks.cta });
  const steps = howItWorks.steps;

  return (
    <section className="px-5 md:px-10 py-16 md:py-20 max-w-7xl mx-auto">
      <Reveal className="text-center max-w-2xl mx-auto mb-14">
        <div className="text-[12px] font-medium mb-3 tracking-[0.2em] uppercase text-gold-deep">{T.eyebrow}</div>
        <h2 className="font-display text-3xl md:text-4xl text-navy">{T.h2}</h2>
      </Reveal>

      <div className="relative grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <motion.div
          className="hidden lg:block absolute top-[38px] left-0 right-0 h-px bg-border-strong origin-left"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1, ease: [0.2, 0.8, 0.2, 1], delay: 0.1 }}
        />
        {steps.map((s, i) => (
          <Reveal key={i} delay={i * 0.1}>
            <div className="relative rounded-2xl border border-border bg-white p-6 h-full shadow-card">
              <motion.div
                className="relative z-10 inline-flex items-center justify-center w-11 h-11 rounded-full font-display text-[15px] mb-4 bg-navy text-white"
                initial={{ scale: 0.5, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.45, delay: i * 0.1 + 0.15, ease: [0.2, 0.9, 0.3, 1.3] }}
              >
                {String(i + 1).padStart(2, "0")}
              </motion.div>
              <StepText title={s.title} body={s.body} />
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal className="text-center">
        <Link
          to="/#request-service"
          className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-medium text-[14px] tracking-wide uppercase bg-gradient-to-r from-navy to-navy-soft text-white hover:from-navy-soft hover:to-navy transition-colors"
        >
          {T.cta}
          <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </Reveal>
    </section>
  );
}

function StepText({ title, body }: { title: { en: string; bn: string }; body: { en: string; bn: string } }) {
  const t = useDict({ title, body });
  return (
    <>
      <h3 className="font-display text-lg text-navy mb-2">{t.title}</h3>
      <p className="text-[13.5px] text-ink-muted leading-relaxed">{t.body}</p>
    </>
  );
}
