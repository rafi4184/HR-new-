import { MapPin, UserCheck, ClipboardCheck, MessageSquare } from "lucide-react";
import Reveal from "./ui/Reveal";

const REASONS = [
  {
    icon: MapPin,
    title: "Local Expertise",
    body: "Years of experience coordinating services on the ground across Bangladesh.",
  },
  {
    icon: UserCheck,
    title: "One Trusted Point of Contact",
    body: "A single desk coordinates every service, so you're never passed between departments.",
  },
  {
    icon: ClipboardCheck,
    title: "Professional Coordination",
    body: "Every case is reviewed individually and handled by our team from start to finish.",
  },
  {
    icon: MessageSquare,
    title: "Transparent Communication",
    body: "Clear updates by phone, so you always know the status of your request.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="px-5 md:px-10 py-16 md:py-20 max-w-7xl mx-auto">
      <Reveal className="text-center max-w-2xl mx-auto mb-12">
        <div className="text-[12px] font-medium mb-3 tracking-[0.2em] uppercase text-gold-deep">Why choose us</div>
        <h2 className="font-display text-3xl md:text-4xl text-navy">Built on Trust and Coordination</h2>
      </Reveal>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {REASONS.map((r, i) => (
          <Reveal key={r.title} delay={i * 0.07}>
            <div className="text-center px-3">
              <div className="w-14 h-14 rounded-2xl bg-gold-pale text-gold-deep flex items-center justify-center mx-auto mb-4">
                <r.icon size={24} />
              </div>
              <h3 className="font-display text-[16px] text-navy mb-2">{r.title}</h3>
              <p className="text-[13.5px] text-ink-muted leading-relaxed">{r.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
