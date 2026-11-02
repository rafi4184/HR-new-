import { Link } from "react-router-dom";
import { ArrowRight, Euro } from "lucide-react";
import Reveal from "./ui/Reveal";
import { useDict, useLanguage } from "../lib/i18n";
import { spainVisaPageT } from "../lib/translations";

/** Homepage block: Bengali Spain visa banner, photos and the DNV income table (EUR + BDT). */
export default function SpainVisaHighlights() {
  const { lang } = useLanguage();
  const T = useDict({
    bannerAlt: {
      en: "Spain Visa Guide 2026 — Digital Nomad Visa (€2,849+/month), Schengen Visit Visa (up to 90 days in 180) and Highly Qualified / EU Blue Card (€41,356+/year)",
      bn: "স্পেন ভিসা গাইড ২০২৬ — ডিজিটাল নোম্যাড ভিসা (মাসে €২,৮৪৯+), শেনজেন ভিজিট ভিসা (১৮০ দিনে সর্বোচ্চ ৯০ দিন) ও হাইলি স্কিলড / EU ব্লু কার্ড (বছরে €৪১,৩৫৬+)",
    },
    eyebrow: { en: "Spain Digital Nomad Visa", bn: "স্পেন ডিজিটাল নোম্যাড ভিসা" },
    heading: spainVisaPageT.incomeHeading,
    intro: {
      en: "The minimum income you must show — in euros and the Bangladeshi Taka equivalent.",
      bn: "যে ন্যূনতম আয় দেখাতে হবে — ইউরো ও বাংলাদেশি টাকায়।",
    },
    cta: { en: "Full Spain visa details", bn: "স্পেন ভিসার সম্পূর্ণ বিস্তারিত" },
    nomadAlt: { en: "Remote professional working on a laptop — digital nomad lifestyle", bn: "ল্যাপটপে রিমোট কাজ — ডিজিটাল নোম্যাড জীবনধারা" },
    skylineAlt: { en: "Sagrada Familia and the Barcelona skyline, Spain", bn: "সাগ্রাদা ফামিলিয়া ও বার্সেলোনার স্কাইলাইন, স্পেন" },
  });

  return (
    <section id="spain-visa-guide" className="px-5 md:px-10 py-14 md:py-16 max-w-6xl mx-auto">
      {/* Banner */}
      <Reveal>
        <Link
          to="/spain-visa"
          aria-label={T.bannerAlt}
          className="block rounded-2xl overflow-hidden shadow-card-hover border border-border hover:scale-[1.01] transition-transform"
        >
          <picture>
            <source srcSet="/images/spain/spain-visa-guide-2026-banner-bn.webp" type="image/webp" />
            <img
              src="/images/spain/spain-visa-guide-2026-banner-bn.jpg"
              alt={T.bannerAlt}
              width={1920}
              height={1080}
              loading="lazy"
              className="w-full h-auto block"
            />
          </picture>
        </Link>
      </Reveal>

      {/* Photos + income table */}
      <div className="grid lg:grid-cols-5 gap-8 mt-12 items-stretch">
        <Reveal className="lg:col-span-2 grid grid-cols-2 lg:grid-cols-1 gap-4">
          <div className="rounded-2xl overflow-hidden shadow-card border border-border aspect-[4/3] lg:aspect-[16/10]">
            <img src="/images/spain/digital-nomad-remote-worker.jpg" alt={T.nomadAlt} loading="lazy" className="w-full h-full object-cover" />
          </div>
          <div className="rounded-2xl overflow-hidden shadow-card border border-border aspect-[4/3] lg:aspect-[16/10]">
            <img src="/images/spain/barcelona-sagrada-familia-skyline.jpg" alt={T.skylineAlt} loading="lazy" className="w-full h-full object-cover" />
          </div>
        </Reveal>

        <Reveal delay={0.1} className="lg:col-span-3 flex flex-col">
          <div className="text-[12px] font-medium mb-2 tracking-[0.2em] uppercase text-gold-deep">{T.eyebrow}</div>
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-9 h-9 rounded-lg bg-gold-pale flex items-center justify-center text-gold-deep shrink-0">
              <Euro size={18} />
            </div>
            <h2 className="font-display text-2xl md:text-3xl text-navy">{T.heading}</h2>
          </div>
          <p className="text-[13.5px] text-ink-muted mb-5">{T.intro}</p>

          <div className="rounded-2xl bg-white border border-border shadow-card overflow-hidden mb-4">
            <div className="hidden sm:grid grid-cols-[1.2fr_1fr_1fr] gap-4 px-5 py-3 bg-navy text-white text-[12px] font-semibold uppercase tracking-[0.08em]">
              <span>{spainVisaPageT.incomeColumns.applicant[lang]}</span>
              <span className="text-right">{spainVisaPageT.incomeColumns.eur[lang]}</span>
              <span className="text-right">{spainVisaPageT.incomeColumns.bdt[lang]}</span>
            </div>
            {spainVisaPageT.incomeRows.map((row, i) => (
              <div
                key={i}
                className={`grid grid-cols-2 sm:grid-cols-[1.2fr_1fr_1fr] items-center gap-x-4 gap-y-1.5 px-5 py-3.5 ${
                  i > 0 ? "border-t border-border" : ""
                } ${i === 0 ? "bg-gold-pale/40" : ""}`}
              >
                <div className="col-span-2 sm:col-span-1">
                  <div className="text-[14px] font-medium text-navy">{row.label[lang]}</div>
                  <div className="text-[12px] text-ink-faint">{row.sub[lang]}</div>
                </div>
                <div className="text-[14.5px] font-semibold text-navy sm:text-right">{row.value[lang]}</div>
                <div className="text-[14.5px] font-semibold text-gold-deep text-right">{row.bdt[lang]}</div>
              </div>
            ))}
          </div>

          <p className="text-[13px] text-ink-soft mb-1.5">{spainVisaPageT.incomeExample[lang]}</p>
          <p className="text-[12px] text-ink-faint leading-relaxed mb-6">{spainVisaPageT.incomeRateNote[lang]}</p>

          <Link
            to="/spain-visa"
            className="self-start inline-flex items-center gap-2 px-6 py-3 rounded-full font-medium text-[13.5px] tracking-wide uppercase bg-gold text-white hover:bg-gold-deep hover:scale-105 active:scale-95 transition-all"
          >
            {T.cta} <ArrowRight size={15} />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
