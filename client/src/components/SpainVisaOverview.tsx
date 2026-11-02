import { Link } from "react-router-dom";
import { ArrowRight, Laptop2, GraduationCap, Landmark, Briefcase, CheckCircle2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Reveal from "./ui/Reveal";
import { useDict, useLanguage } from "../lib/i18n";
import { spainVisaTypesT, type SpainVisaKey } from "../lib/translations";

const ICONS: Record<SpainVisaKey, LucideIcon> = {
  "digital-nomad": Laptop2,
  student: GraduationCap,
  "permanent-residency": Landmark,
  work: Briefcase,
};

export default function SpainVisaOverview() {
  const { lang } = useLanguage();
  const T = useDict({
    eyebrow: { en: "Spain Visa Consultancy", bn: "স্পেন ভিসা কনসালটেন্সি" },
    h2: { en: "Which Spain Visa Is Right for You?", bn: "আপনার জন্য কোন স্পেন ভিসা উপযুক্ত?" },
    intro: {
      en: "We currently handle the Digital Nomad Visa in full detail, with consultation available now for the other routes below as we expand our Spain practice.",
      bn: "বর্তমানে আমরা ডিজিটাল নোম্যাড ভিসা নিয়ে সম্পূর্ণ বিস্তারিতভাবে কাজ করি, সাথে নিচের অন্যান্য পথের জন্যও এখন পরামর্শ পাওয়া যায় — আমাদের স্পেন প্র্যাকটিস ক্রমশ সম্প্রসারিত হচ্ছে।",
    },
    availableTag: { en: "Full details available", bn: "সম্পূর্ণ বিস্তারিত উপলব্ধ" },
    comingTag: { en: "Consultation available", bn: "পরামর্শ উপলব্ধ" },
    learnMore: { en: "View details", bn: "বিস্তারিত দেখুন" },
    askUs: { en: "Contact us for details", bn: "বিস্তারিত জানতে যোগাযোগ করুন" },
  });

  return (
    <section id="spain-visas" className="px-5 md:px-10 py-16 md:py-20 max-w-6xl mx-auto">
      <Reveal className="text-center max-w-2xl mx-auto mb-12">
        <div className="text-[12px] font-medium mb-3 tracking-[0.2em] uppercase text-gold-deep">{T.eyebrow}</div>
        <h2 className="font-display text-3xl md:text-4xl text-navy mb-4" style={{ textWrap: "balance" }}>
          {T.h2}
        </h2>
        <p className="text-[14.5px] text-ink-muted leading-relaxed">{T.intro}</p>
      </Reveal>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {spainVisaTypesT.map((visa, i) => {
          const Icon = ICONS[visa.key];
          return (
            <Reveal key={visa.key} delay={i * 0.06}>
              <Link
                to="/spain-visa"
                className={`group flex flex-col h-full rounded-2xl border p-6 shadow-card hover:shadow-card-hover transition-all ${
                  visa.available ? "bg-white border-gold/40 hover:border-gold" : "bg-paper-soft border-border hover:border-gold"
                }`}
              >
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${
                    visa.available ? "bg-gold text-white" : "bg-gold-pale text-gold-deep"
                  }`}
                >
                  <Icon size={20} />
                </div>
                <div
                  className={`inline-flex items-center gap-1 self-start mb-3 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${
                    visa.available ? "bg-gold text-white" : "bg-navy/5 text-ink-faint"
                  }`}
                >
                  {visa.available && <CheckCircle2 size={10} />}
                  {visa.available ? T.availableTag : T.comingTag}
                </div>
                <h3 className="font-display text-[16px] text-navy mb-2">{visa.title[lang]}</h3>
                <p className="text-[13px] text-ink-muted leading-relaxed">{visa.summary[lang]}</p>
                <span className="mt-auto pt-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-gold-deep group-hover:gap-2.5 transition-all">
                  {visa.available ? T.learnMore : T.askUs}
                  <ArrowRight size={13} />
                </span>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
