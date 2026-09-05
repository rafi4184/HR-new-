import { Globe2, Users, Building2, GraduationCap, Plane } from "lucide-react";
import Reveal from "./ui/Reveal";
import { useDict } from "../lib/i18n";
import { whoWeHelp } from "../lib/translations";

const ICONS = [Globe2, Users, Building2, GraduationCap, Plane];

export default function WhoWeHelp() {
  const T = useDict({ eyebrow: whoWeHelp.eyebrow, h2: whoWeHelp.h2 });
  const groups = whoWeHelp.groups.map((g, i) => ({ icon: ICONS[i], title: g.title, body: g.body }));

  return (
    <section className="px-5 md:px-10 py-16 md:py-20 bg-paper-panel">
      <div className="max-w-7xl mx-auto">
        <Reveal className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-[12px] font-medium mb-3 tracking-[0.2em] uppercase text-gold-deep">{T.eyebrow}</div>
          <h2 className="font-display text-3xl md:text-4xl text-navy">{T.h2}</h2>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {groups.map((g, i) => (
            <Reveal key={i} delay={i * 0.06}>
              <div className="rounded-2xl bg-white border border-border p-6 h-full shadow-card">
                <div className="w-11 h-11 rounded-xl bg-navy/5 flex items-center justify-center mb-4 text-navy">
                  <g.icon size={20} />
                </div>
                <GroupText title={g.title} body={g.body} />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function GroupText({ title, body }: { title: { en: string; bn: string }; body: { en: string; bn: string } }) {
  const t = useDict({ title, body });
  return (
    <>
      <h3 className="font-display text-[16px] text-navy mb-2">{t.title}</h3>
      <p className="text-[13px] text-ink-muted leading-relaxed">{t.body}</p>
    </>
  );
}
