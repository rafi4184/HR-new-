import { motion } from "framer-motion";
import Reveal from "./ui/Reveal";
import AmbientGlow from "./ui/AmbientGlow";
import { useDict, useLanguage, useT } from "../lib/i18n";
import { countriesWeServe } from "../lib/translations";

const REGION_ORDER = ["gulf", "europe", "americasOceania", "asiaPacific"] as const;

export default function CountriesWeServe() {
  const T = useDict({
    eyebrow: countriesWeServe.eyebrow,
    h2: countriesWeServe.h2,
    intro: countriesWeServe.intro,
  });
  const { lang } = useLanguage();

  const regions = Array.from(new Set(countriesWeServe.countries.map((c) => c.region))).sort(
    (a, b) => REGION_ORDER.indexOf(a as (typeof REGION_ORDER)[number]) - REGION_ORDER.indexOf(b as (typeof REGION_ORDER)[number])
  );

  return (
    <section className="relative px-5 md:px-10 py-16 md:py-20 bg-white overflow-hidden">
      <AmbientGlow variant="light" />
      <div className="relative max-w-5xl mx-auto">
        <Reveal className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-[12px] font-medium mb-3 tracking-[0.2em] uppercase text-gold-deep">{T.eyebrow}</div>
          <h2 className="font-display text-3xl md:text-4xl text-navy mb-3">{T.h2}</h2>
          <p className="text-[14px] text-ink-muted leading-relaxed">{T.intro}</p>
        </Reveal>

        <div className="space-y-8">
          {regions.map((region) => (
            <RegionGroup key={region} region={region as keyof typeof countriesWeServe.regionLabels} lang={lang} />
          ))}
        </div>
      </div>
    </section>
  );
}

function RegionGroup({ region, lang }: { region: keyof typeof countriesWeServe.regionLabels; lang: "en" | "bn" }) {
  const label = useT(countriesWeServe.regionLabels[region]);
  const items = countriesWeServe.countries.filter((c) => c.region === region);

  return (
    <Reveal>
      <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-faint mb-3 text-center sm:text-left">
        {label}
      </div>
      <div className="flex flex-wrap justify-center sm:justify-start gap-2.5">
        {items.map((c, i) => (
          <motion.div
            key={c.name.en}
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.4, delay: i * 0.025, ease: [0.2, 0.9, 0.3, 1.3] }}
            whileHover={{ y: -3, scale: 1.05 }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-border bg-paper-soft hover:border-gold hover:bg-gold-pale transition-colors cursor-default"
          >
            <motion.span
              className="text-[18px] leading-none"
              animate={{ rotate: [0, -8, 8, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 4 + i * 0.3, ease: "easeInOut" }}
            >
              {c.flag}
            </motion.span>
            <span className="text-[13px] font-medium text-navy whitespace-nowrap">{c.name[lang]}</span>
          </motion.div>
        ))}
      </div>
    </Reveal>
  );
}
