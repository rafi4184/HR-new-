import { Globe2, Users, Building2, GraduationCap, Plane } from "lucide-react";
import Reveal from "./ui/Reveal";

const GROUPS = [
  {
    icon: Globe2,
    title: "International Visitors",
    body: "Airport VIP reception, hotel and transport arrangements matched to your itinerary.",
  },
  {
    icon: Users,
    title: "Bangladeshi Families",
    body: "Government-request assistance, travel support, and a trusted point of contact.",
  },
  {
    icon: Building2,
    title: "Businesses & Organisations",
    body: "Manpower, security staffing, and coordinated logistics for delegations and teams.",
  },
  {
    icon: GraduationCap,
    title: "Students & Job Seekers",
    body: "Media training, study-abroad guidance, and Gulf career placement support.",
  },
  {
    icon: Plane,
    title: "Overseas Bangladeshis",
    body: "Airport reception on return visits, and government-request handling from abroad.",
  },
];

export default function WhoWeHelp() {
  return (
    <section className="px-5 md:px-10 py-16 md:py-20 bg-paper-panel">
      <div className="max-w-7xl mx-auto">
        <Reveal className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-[12px] font-medium mb-3 tracking-[0.2em] uppercase text-gold-deep">Who we help</div>
          <h2 className="font-display text-3xl md:text-4xl text-navy">Support for Every Kind of Client</h2>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {GROUPS.map((g, i) => (
            <Reveal key={g.title} delay={i * 0.06}>
              <div className="rounded-2xl bg-white border border-border p-6 h-full shadow-card">
                <div className="w-11 h-11 rounded-xl bg-navy/5 flex items-center justify-center mb-4 text-navy">
                  <g.icon size={20} />
                </div>
                <h3 className="font-display text-[16px] text-navy mb-2">{g.title}</h3>
                <p className="text-[13px] text-ink-muted leading-relaxed">{g.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
