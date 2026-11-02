import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Euro, FileCheck2, Route, CalendarClock, Laptop2, GraduationCap, Landmark, Briefcase, AlertTriangle } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useSeo } from "../lib/useSeo";
import Reveal from "../components/ui/Reveal";
import AmbientGlow from "../components/ui/AmbientGlow";
import Booking, { type AirportPrefill } from "../components/Booking";
import { useDict, useLanguage, useT } from "../lib/i18n";
import { spainVisaPageT, spainVisaTypesT, type SpainVisaKey } from "../lib/translations";
import type { BookingTab } from "../types";

const ICONS: Record<SpainVisaKey, LucideIcon> = {
  "digital-nomad": Laptop2,
  student: GraduationCap,
  "permanent-residency": Landmark,
  work: Briefcase,
};

export default function SpainVisaPage() {
  const { lang } = useLanguage();
  const T = useDict({
    eyebrow: spainVisaPageT.eyebrow,
    h1: spainVisaPageT.h1,
    intro: spainVisaPageT.intro,
    updatedNote: spainVisaPageT.updatedNote,
    whoHeading: spainVisaPageT.whoHeading,
    incomeHeading: spainVisaPageT.incomeHeading,
    incomeIntro: spainVisaPageT.incomeIntro,
    incomeDisclaimer: spainVisaPageT.incomeDisclaimer,
    documentsHeading: spainVisaPageT.documentsHeading,
    pathsHeading: spainVisaPageT.pathsHeading,
    pathsNote: spainVisaPageT.pathsNote,
    futureHeading: spainVisaPageT.futureHeading,
    otherVisasHeading: spainVisaPageT.otherVisasHeading,
    otherVisasIntro: spainVisaPageT.otherVisasIntro,
    ctaHeading: spainVisaPageT.ctaHeading,
    ctaBody: spainVisaPageT.ctaBody,
    ctaButton: spainVisaPageT.ctaButton,
  });
  const backHome = useT({ en: "← Back to homepage", bn: "← হোমপেজে ফিরে যান" });

  useSeo({
    title: "Spain Digital Nomad Visa (ARTIN) — Eligibility, Income Requirements & Documents | HR — The Mediator",
    description:
      "Everything you need for Spain's Digital Nomad Visa (ARTIN): who can apply, 2026 income requirements, required documents, the Consulate vs UGE application routes, and the path to permanent residency — consultation from HR — The Mediator's Spain Visa Consultancy, Bangladesh.",
    path: "/spain-visa",
  });

  const [activeTab, setActiveTab] = useState<BookingTab>("spain");
  const [lastTicket, setLastTicket] = useState<string | null>(null);
  const [airportPrefill] = useState<AirportPrefill>({ name: "", flight: "", purpose: "Business" });
  const bookingRef = useRef<HTMLElement>(null);

  const scrollToBooking = () => bookingRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <div>
      <section className="relative px-5 md:px-10 pt-14 pb-12 md:pt-20 md:pb-14 bg-paper-soft overflow-hidden">
        <AmbientGlow variant="light" />
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="text-[12px] font-medium mb-3 tracking-[0.2em] uppercase text-gold-deep">{T.eyebrow}</div>
          <h1 className="font-display text-3xl md:text-5xl text-navy mb-5" style={{ textWrap: "balance" }}>
            {T.h1}
          </h1>
          <p className="text-[16px] text-ink-muted leading-relaxed max-w-2xl mx-auto mb-3">{T.intro}</p>
          <p className="text-[12px] text-ink-faint mb-8">{T.updatedNote}</p>
          <button
            onClick={scrollToBooking}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-medium text-[14px] tracking-wide uppercase bg-gold text-white hover:bg-gold-deep hover:scale-105 active:scale-95 transition-all"
          >
            {T.ctaButton} <ArrowRight size={15} />
          </button>
        </div>
      </section>

      {/* Who can apply */}
      <section className="px-5 md:px-10 py-14 max-w-4xl mx-auto">
        <Reveal>
          <div className="flex items-center gap-2.5 mb-6">
            <div className="w-9 h-9 rounded-lg bg-gold-pale flex items-center justify-center text-gold-deep shrink-0">
              <FileCheck2 size={18} />
            </div>
            <h2 className="font-display text-2xl text-navy">{T.whoHeading}</h2>
          </div>
          <ul className="space-y-3">
            {spainVisaPageT.whoItems.map((item, i) => (
              <li key={i} className="flex items-start gap-2.5 text-[14.5px] text-ink-soft leading-relaxed">
                <Check size={16} className="text-gold-deep shrink-0 mt-0.5" />
                {item[lang]}
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      {/* Income requirements */}
      <section className="px-5 md:px-10 py-14 bg-paper-panel">
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-9 h-9 rounded-lg bg-gold-pale flex items-center justify-center text-gold-deep shrink-0">
                <Euro size={18} />
              </div>
              <h2 className="font-display text-2xl text-navy">{T.incomeHeading}</h2>
            </div>
            <p className="text-[13.5px] text-ink-muted mb-6 ml-[46px]">{T.incomeIntro}</p>

            <div className="rounded-2xl bg-white border border-border shadow-card overflow-hidden mb-5">
              {spainVisaPageT.incomeRows.map((row, i) => (
                <div
                  key={i}
                  className={`flex items-center justify-between gap-4 px-5 py-4 ${
                    i > 0 ? "border-t border-border" : ""
                  }`}
                >
                  <span className="text-[14px] text-ink-soft">{row.label[lang]}</span>
                  <span className="text-[15px] font-semibold text-navy text-right">{row.value[lang]}</span>
                </div>
              ))}
            </div>

            <div className="flex items-start gap-2.5 text-[13px] rounded-lg px-4 py-3.5 bg-gold-pale text-[#7A5E13]">
              <AlertTriangle size={16} className="shrink-0 mt-0.5" />
              {T.incomeDisclaimer}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Documents */}
      <section className="px-5 md:px-10 py-14 max-w-4xl mx-auto">
        <Reveal>
          <div className="flex items-center gap-2.5 mb-6">
            <div className="w-9 h-9 rounded-lg bg-gold-pale flex items-center justify-center text-gold-deep shrink-0">
              <FileCheck2 size={18} />
            </div>
            <h2 className="font-display text-2xl text-navy">{T.documentsHeading}</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-x-6 gap-y-3">
            {spainVisaPageT.documents.map((doc, i) => (
              <div key={i} className="flex items-start gap-2.5 text-[14px] text-ink-soft leading-relaxed">
                <Check size={15} className="text-gold-deep shrink-0 mt-0.5" />
                {doc[lang]}
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Application paths */}
      <section className="px-5 md:px-10 py-14 bg-paper-panel">
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <div className="flex items-center gap-2.5 mb-6">
              <div className="w-9 h-9 rounded-lg bg-gold-pale flex items-center justify-center text-gold-deep shrink-0">
                <Route size={18} />
              </div>
              <h2 className="font-display text-2xl text-navy">{T.pathsHeading}</h2>
            </div>
          </Reveal>
          <div className="grid sm:grid-cols-2 gap-5 mb-5">
            {spainVisaPageT.paths.map((p, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div className="rounded-xl bg-white border border-border p-5 h-full shadow-card">
                  <div className="text-[15px] font-semibold text-navy mb-2">{p.title[lang]}</div>
                  <div className="text-[13.5px] text-ink-muted leading-relaxed">{p.body[lang]}</div>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.16}>
            <p className="text-[13px] text-ink-faint">{T.pathsNote}</p>
          </Reveal>
        </div>
      </section>

      {/* Duration & future */}
      <section className="px-5 md:px-10 py-14 max-w-4xl mx-auto">
        <Reveal>
          <div className="flex items-center gap-2.5 mb-6">
            <div className="w-9 h-9 rounded-lg bg-gold-pale flex items-center justify-center text-gold-deep shrink-0">
              <CalendarClock size={18} />
            </div>
            <h2 className="font-display text-2xl text-navy">{T.futureHeading}</h2>
          </div>
          <ul className="space-y-3">
            {spainVisaPageT.futureItems.map((item, i) => (
              <li key={i} className="flex items-start gap-2.5 text-[14.5px] text-ink-soft leading-relaxed">
                <Check size={16} className="text-gold-deep shrink-0 mt-0.5" />
                {item[lang]}
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      {/* Other Spain visas */}
      <section className="px-5 md:px-10 py-14 bg-paper-panel">
        <div className="max-w-5xl mx-auto">
          <Reveal className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="font-display text-2xl md:text-3xl text-navy mb-3">{T.otherVisasHeading}</h2>
            <p className="text-[14px] text-ink-muted leading-relaxed">{T.otherVisasIntro}</p>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {spainVisaTypesT.map((visa, i) => {
              const Icon = ICONS[visa.key];
              return (
                <Reveal key={visa.key} delay={i * 0.06}>
                  <div
                    className={`flex flex-col h-full rounded-xl border p-5 ${
                      visa.available ? "bg-white border-gold/40" : "bg-white border-border"
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${
                        visa.available ? "bg-gold text-white" : "bg-gold-pale text-gold-deep"
                      }`}
                    >
                      <Icon size={17} />
                    </div>
                    <div className="text-[14.5px] font-medium text-navy mb-1.5">{visa.title[lang]}</div>
                    <div className="text-[12.5px] text-ink-muted leading-relaxed">{visa.summary[lang]}</div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA / consultation form */}
      <Booking
        ref={bookingRef}
        id="service-request"
        heading={T.ctaHeading}
        subheading={T.ctaBody}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        lockedTab="spain"
        presetProgram="study"
        airportPrefill={airportPrefill}
        airportPrefillKey={0}
        lastTicket={lastTicket}
        onSubmitted={setLastTicket}
      />

      <section className="px-5 md:px-10 py-10 max-w-4xl mx-auto text-center">
        <Link to="/" className="text-[13.5px] font-medium text-ink-faint hover:text-navy transition-colors">
          {backHome}
        </Link>
      </section>
    </div>
  );
}
