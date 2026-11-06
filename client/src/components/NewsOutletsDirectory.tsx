import { ExternalLink } from "lucide-react";
import Reveal from "./ui/Reveal";
import { BD_NEWS_OUTLET_GROUPS } from "../data/bdNewsOutlets";
import { useDict } from "../lib/i18n";
import { newsDirectoryT, newsDirectoryGroupLabels } from "../lib/translations";

export default function NewsOutletsDirectory() {
  const T = useDict(newsDirectoryT);
  const groupLabels = useDict(newsDirectoryGroupLabels);

  return (
    <section className="px-5 md:px-10 py-14 md:py-20 bg-paper-soft border-t border-border">
      <div className="max-w-6xl mx-auto">
        <Reveal className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="font-display text-navy text-2xl sm:text-3xl md:text-4xl mb-4" style={{ textWrap: "balance" }}>
            {T.heading}
          </h2>
          <p className="text-[14.5px] text-ink-muted leading-relaxed">{T.intro}</p>
        </Reveal>

        <div className="grid sm:grid-cols-2 gap-8 md:gap-10">
          {BD_NEWS_OUTLET_GROUPS.map((group, gi) => (
            <Reveal key={group.key} delay={gi * 0.05}>
              <div className="rounded-2xl bg-white border border-border p-5 md:p-6 h-full">
                <h3 className="font-display text-navy text-[15px] font-semibold uppercase tracking-wide mb-4">
                  {groupLabels[group.key]}
                </h3>
                <ul className="flex flex-col gap-1">
                  {group.outlets.map((outlet) => (
                    <li key={outlet.domain}>
                      <a
                        href={outlet.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center justify-between gap-2 py-2 px-2.5 -mx-2.5 rounded-lg text-[13.5px] text-ink-soft hover:bg-paper-soft hover:text-gold-deep transition-colors"
                      >
                        <span className="truncate">{outlet.name}</span>
                        <ExternalLink size={13} className="flex-shrink-0 opacity-40 group-hover:opacity-100 transition-opacity" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
