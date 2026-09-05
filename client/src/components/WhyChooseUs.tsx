import { motion } from "framer-motion";
import { MapPin, UserCheck, ClipboardCheck, MessageSquare } from "lucide-react";
import Reveal from "./ui/Reveal";
import AmbientGlow from "./ui/AmbientGlow";
import { useDict } from "../lib/i18n";
import { whyChooseUs } from "../lib/translations";

const ICONS = [MapPin, UserCheck, ClipboardCheck, MessageSquare];

export default function WhyChooseUs() {
  const T = useDict({ eyebrow: whyChooseUs.eyebrow, h2: whyChooseUs.h2 });
  const reasons = whyChooseUs.reasons.map((r, i) => ({ icon: ICONS[i], title: r.title, body: r.body }));

  return (
    <section className="relative px-5 md:px-10 py-16 md:py-20 max-w-7xl mx-auto overflow-hidden">
      <AmbientGlow variant="light" />
      <div className="relative">
        <Reveal className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-[12px] font-medium mb-3 tracking-[0.2em] uppercase text-gold-deep">{T.eyebrow}</div>
          <h2 className="font-display text-3xl md:text-4xl text-navy">{T.h2}</h2>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {reasons.map((r, i) => (
            <Reveal key={i} delay={i * 0.07}>
              <div className="text-center px-3">
                <motion.div
                  className="w-14 h-14 rounded-2xl bg-gold-pale text-gold-deep flex items-center justify-center mx-auto mb-4"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.25 }}
                >
                  <r.icon size={24} />
                </motion.div>
                <ReasonText title={r.title} body={r.body} />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ReasonText({ title, body }: { title: { en: string; bn: string }; body: { en: string; bn: string } }) {
  const t = useDict({ title, body });
  return (
    <>
      <h3 className="font-display text-[16px] text-navy mb-2">{t.title}</h3>
      <p className="text-[13.5px] text-ink-muted leading-relaxed">{t.body}</p>
    </>
  );
}
