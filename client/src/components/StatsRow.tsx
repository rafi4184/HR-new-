import Reveal from "./ui/Reveal";
import AnimatedCounter from "./ui/AnimatedCounter";
import AmbientGlow from "./ui/AmbientGlow";

const STATS = [
  { value: 5, label: "Core Services" },
  { value: 1, label: "Trusted Point of Contact" },
  { value: 4, label: "Customer Groups We Serve" },
];

export default function StatsRow() {
  return (
    <section className="relative px-5 md:px-10 py-14 bg-navy overflow-hidden">
      <AmbientGlow variant="dark" />
      <div className="relative max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
        {STATS.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.08}>
            <div className="font-display text-4xl md:text-5xl text-gold mb-2">
              <AnimatedCounter value={s.value} />
            </div>
            <div className="text-[13px] text-mist uppercase tracking-wide">{s.label}</div>
          </Reveal>
        ))}
        <Reveal delay={0.24}>
          <div className="font-display text-3xl md:text-5xl text-gold mb-2">Bangladesh</div>
          <div className="text-[13px] text-mist uppercase tracking-wide">Our Home</div>
        </Reveal>
      </div>
    </section>
  );
}
