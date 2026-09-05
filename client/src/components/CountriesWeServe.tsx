import Reveal from "./ui/Reveal";
import AmbientGlow from "./ui/AmbientGlow";
import { useDict, useLanguage } from "../lib/i18n";
import { countriesWeServe } from "../lib/translations";

export default function CountriesWeServe() {
  const T = useDict({
    eyebrow: countriesWeServe.eyebrow,
    h2: countriesWeServe.h2,
    intro: countriesWeServe.intro,
  });
  const { lang } = useLanguage();

  return (
    <section className="relative px-5 md:px-10 py-16 md:py-20 bg-white overflow-hidden">
      <AmbientGlow variant="light" />
      <div className="relative max-w-5xl mx-auto">
        <Reveal className="text-center max-w-2xl mx-auto mb-10">
          <div className="text-[12px] font-medium mb-3 tracking-[0.2em] uppercase text-gold-deep">{T.eyebrow}</div>
          <h2 className="font-display text-3xl md:text-4xl text-navy mb-3">{T.h2}</h2>
          <p className="text-[14px] text-ink-muted leading-relaxed">{T.intro}</p>
        </Reveal>

        <div className="flex flex-wrap justify-center gap-3">
          {countriesWeServe.countries.map((c, i) => (
            <Reveal key={c.name.en} delay={i * 0.04}>
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-border bg-paper-soft">
                <span className="text-[18px] leading-none">{c.flag}</span>
                <span className="text-[13px] font-medium text-navy whitespace-nowrap">{c.name[lang]}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
