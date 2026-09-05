import Reveal from "./ui/Reveal";
import AnimatedCounter from "./ui/AnimatedCounter";
import AmbientGlow from "./ui/AmbientGlow";
import { useDict } from "../lib/i18n";
import { statsRow } from "../lib/translations";

export default function StatsRow() {
  const T = useDict(statsRow);
  const stats = [
    { value: 5, label: T.coreServices },
    { value: 1, label: T.trustedPoint },
    { value: 4, label: T.customerGroups },
  ];

  return (
    <section className="relative px-5 md:px-10 py-14 bg-navy overflow-hidden">
      <AmbientGlow variant="dark" />
      <div className="relative max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
        {stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.08}>
            <div className="font-display text-4xl md:text-5xl text-gold mb-2">
              <AnimatedCounter value={s.value} />
            </div>
            <div className="text-[13px] text-mist uppercase tracking-wide">{s.label}</div>
          </Reveal>
        ))}
        <Reveal delay={0.24}>
          <div className="font-display text-3xl md:text-5xl text-gold mb-2">{T.bangladesh}</div>
          <div className="text-[13px] text-mist uppercase tracking-wide">{T.ourHome}</div>
        </Reveal>
      </div>
    </section>
  );
}
