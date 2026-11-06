import { Link } from "react-router-dom";
import { ArrowRight, Layers, MapPin, ShieldCheck } from "lucide-react";
import { useSeo } from "../lib/useSeo";
import Reveal from "../components/ui/Reveal";
import ServicesOverview from "../components/ServicesOverview";
import { useDict, useT } from "../lib/i18n";
import { aboutPageT, aboutCredibility } from "../lib/translations";
import { useSiteText } from "../lib/siteContent";

const CREDIBILITY_ICONS = [Layers, MapPin, ShieldCheck];

export default function AboutPage() {
  useSeo({
    title: "About Us | ARK Property Solution",
    description:
      "ARK Property Solution is a Sydney-based real estate agency covering real estate sales, property management and buyer's agency services across NSW.",
    path: "/about-us",
  });

  const T = useDict(aboutPageT);
  const para1 = useSiteText("about.para1");
  const para2 = useSiteText("about.para2");

  return (
    <div>
      <section className="px-5 md:px-10 py-14 md:py-20 bg-paper-soft text-center">
        <div className="max-w-3xl mx-auto">
          <div className="text-[12px] font-medium mb-3 tracking-[0.2em] uppercase text-gold-deep">{T.eyebrow}</div>
          <h1 className="font-display text-3xl md:text-5xl text-navy mb-5">{T.h1}</h1>
          <p className="text-[16px] text-ink-muted leading-relaxed">{T.intro}</p>
        </div>
      </section>

      <section className="px-5 md:px-10 py-14 max-w-3xl mx-auto">
        <Reveal>
          <p className="text-[14.5px] text-ink-muted leading-relaxed mb-4">{para1}</p>
          <p className="text-[14.5px] text-ink-muted leading-relaxed">{para2}</p>
        </Reveal>
      </section>

      <section className="px-5 md:px-10 py-14 max-w-5xl mx-auto">
        <Reveal className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="font-display text-2xl md:text-3xl text-navy mb-3">{T.meaningH2}</h2>
          <p className="text-[14.5px] text-ink-muted leading-relaxed">{T.meaningBody}</p>
        </Reveal>
        <div className="grid sm:grid-cols-3 gap-5">
          {aboutCredibility.map((c, i) => {
            const Icon = CREDIBILITY_ICONS[i];
            return <CredibilityCard key={c.heading.en} icon={Icon} heading={c.heading} body={c.body} delay={i * 0.07} />;
          })}
        </div>
      </section>

      <ServicesOverview />

      <section className="px-5 md:px-10 py-14 bg-paper-panel text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-display text-2xl md:text-3xl text-navy mb-4">{T.exploreH2}</h2>
          <p className="text-ink-muted mb-8">{T.exploreBody}</p>
          <Link
            to="/#services"
            className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-medium text-[14px] tracking-wide uppercase bg-gold text-white hover:bg-gold-deep hover:scale-105 active:scale-95 transition-all"
          >
            {T.viewAllServices}
            <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    </div>
  );
}

function CredibilityCard({
  icon: Icon,
  heading,
  body,
  delay,
}: {
  icon: typeof ShieldCheck;
  heading: { en: string; bn: string };
  body: { en: string; bn: string };
  delay: number;
}) {
  const h = useT(heading);
  const b = useT(body);
  return (
    <Reveal delay={delay} className="rounded-xl border border-border bg-white p-5 flex gap-4">
      <div className="w-10 h-10 rounded-lg bg-gold-pale flex items-center justify-center text-gold-deep shrink-0">
        <Icon size={18} />
      </div>
      <div>
        <div className="text-[15px] font-medium text-navy mb-1">{h}</div>
        <div className="text-[13.5px] text-ink-muted leading-relaxed">{b}</div>
      </div>
    </Reveal>
  );
}
