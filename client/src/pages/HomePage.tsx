import { useRef, useState } from "react";
import { useSeo } from "../lib/useSeo";
import SpainHero from "../components/SpainHero";
import SpainVisaOverview from "../components/SpainVisaOverview";
import SpainVisaHighlights from "../components/SpainVisaHighlights";
import Hero from "../components/Hero";
import ServiceVideoHero from "../components/ServiceVideoHero";
import ServicesOverview from "../components/ServicesOverview";
import NewsTeaser from "../components/NewsTeaser";
import HowItWorks from "../components/HowItWorks";
import WhyChooseUs from "../components/WhyChooseUs";
import StatsRow from "../components/StatsRow";
import Booking, { type AirportPrefill } from "../components/Booking";
import TrackRequest from "../components/TrackRequest";
import PaymentModal from "../components/PaymentModal";
import Faq from "../components/Faq";
import Reveal from "../components/ui/Reveal";
import AmbientGlow from "../components/ui/AmbientGlow";
import { HOME_FAQS } from "../data/servicePages";
import { trackRequest, ApiError } from "../lib/api";
import type { BookingTab, ServiceRequest } from "../types";
import { useDict, useLanguage, useT } from "../lib/i18n";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { homeFaqs, otherServicesSection, homeTopIntro, spainVisaPageT } from "../lib/translations";

export default function HomePage({ onToast }: { onToast: (msg: string) => void }) {
  const { lang } = useLanguage();
  const translatedFaqs = homeFaqs.map((f) => ({ question: f.question[lang], answer: f.answer[lang] }));
  const otherServicesT = useDict(otherServicesSection);
  const topIntroT = useDict(homeTopIntro);
  const dnvT = useDict({
    eyebrow: spainVisaPageT.eyebrow,
    h1: spainVisaPageT.h1,
    intro: spainVisaPageT.intro,
    updatedNote: spainVisaPageT.updatedNote,
    ctaButton: spainVisaPageT.ctaButton,
  });
  const dnvMore = useT({ en: "View full details", bn: "সম্পূর্ণ বিস্তারিত দেখুন" });
  useSeo({
    title: "Spain Visa Consultation Firm in Dhaka, Bangladesh | Digital Nomad, Study, Work & Tourist Visa | HR — The Mediator",
    description:
      "HR — The Mediator is the Dhaka-based Spain visa consultation firm guiding clients from Bangladesh to Spain — Digital Nomad Visa (ARTIN) specialists, plus Spain Study Visa, Work Visa and Tourist/Visitor Visa handled directly, with Permanent Residency guidance underway. Also: visa and placement consultation for the Gulf and Australia, Dhaka Airport VIP, and government-request assistance.",
    path: "/",
    faq: HOME_FAQS,
  });

  const [activeTab, setActiveTab] = useState<BookingTab>("spain");
  const [presetProgram] = useState("study");
  const [airportPrefill] = useState<AirportPrefill>({ name: "", flight: "", purpose: "Business" });
  const [lastTicket, setLastTicket] = useState<string | null>(null);
  const [trackLoading, setTrackLoading] = useState(false);
  const [trackResult, setTrackResult] = useState<ServiceRequest | "notfound" | null>(null);
  const [payModal, setPayModal] = useState<ServiceRequest | null>(null);

  const bookingRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLElement>(null);

  const goToBooking = (tab: BookingTab | null) => {
    if (tab) setActiveTab(tab);
    bookingRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSubmitted = (ticket: string) => {
    setLastTicket(ticket);
    onToast(`Request ${ticket} received — track it anytime with your name, date of birth, and ticket number.`);
  };

  const runTrack = async (ticket: string, name: string, dob: string) => {
    setTrackLoading(true);
    setTrackResult(null);
    try {
      const found = await trackRequest(ticket, name, dob);
      setTrackResult(found);
    } catch (err) {
      if (err instanceof ApiError) setTrackResult("notfound");
    } finally {
      setTrackLoading(false);
    }
  };

  const handlePaid = (updated: ServiceRequest) => {
    setPayModal(null);
    setTrackResult((r) => (r && r !== "notfound" && r.id === updated.id ? updated : r));
    onToast(`Payment received for ${updated.ticket}. Confirmed.`);
  };

  return (
    <div>
      {/* Spain Digital Nomad Visa — top of homepage */}
      <section className="relative px-5 md:px-10 pt-14 pb-12 md:pt-20 md:pb-14 bg-paper-soft overflow-hidden">
        <AmbientGlow variant="light" />
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="text-[12px] font-medium mb-3 tracking-[0.2em] uppercase text-gold-deep">{dnvT.eyebrow}</div>
          <h2 className="font-display text-3xl md:text-5xl text-navy mb-5" style={{ textWrap: "balance" }}>
            {dnvT.h1}
          </h2>
          <p className="text-[16px] text-ink-muted leading-relaxed max-w-2xl mx-auto mb-3">{dnvT.intro}</p>
          <p className="text-[12px] text-ink-faint mb-8">{dnvT.updatedNote}</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => goToBooking("spain")}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-medium text-[14px] tracking-wide uppercase bg-gold text-white hover:bg-gold-deep hover:scale-105 active:scale-95 transition-all"
            >
              {dnvT.ctaButton} <ArrowRight size={15} />
            </button>
            <Link
              to="/spain-visa"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-medium text-[14px] tracking-wide uppercase border border-navy/20 text-navy hover:border-gold hover:text-gold-deep transition-all"
            >
              {dnvMore}
            </Link>
          </div>
        </div>
        <Reveal delay={0.1} className="relative max-w-5xl mx-auto mt-10">
          <div className="rounded-2xl overflow-hidden shadow-card-hover border border-white/60 aspect-[21/9]">
            <img
              src="/images/spain/barcelona-sagrada-familia-skyline.jpg"
              alt="Sagrada Familia and the Barcelona skyline, Spain"
              className="w-full h-full object-cover"
            />
          </div>
        </Reveal>
      </section>

      <section className="relative px-5 md:px-10 pt-14 pb-8 md:pt-20 md:pb-10 overflow-hidden">
        <AmbientGlow variant="light" />
        <Reveal className="relative max-w-3xl mx-auto text-center">
          <div className="text-[12px] font-medium mb-4 tracking-[0.2em] uppercase text-gold-deep">{topIntroT.eyebrow}</div>
          <h1 className="font-display text-navy text-3xl md:text-5xl leading-[1.1] mb-6" style={{ textWrap: "balance" }}>
            {topIntroT.h1}
          </h1>
          <p className="text-[15.5px] md:text-[17px] text-ink-muted leading-relaxed">{topIntroT.summary}</p>
        </Reveal>
      </section>

      <Booking
        ref={bookingRef}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        presetProgram={presetProgram}
        airportPrefill={airportPrefill}
        airportPrefillKey={0}
        lastTicket={lastTicket}
        onSubmitted={handleSubmitted}
      />

      <SpainHero />
      <SpainVisaHighlights />
      <SpainVisaOverview />

      <section className="px-5 md:px-10 pt-4 pb-2 max-w-6xl mx-auto">
        <Reveal className="text-center max-w-2xl mx-auto">
          <div className="text-[12px] font-medium mb-3 tracking-[0.2em] uppercase text-gold-deep">{otherServicesT.eyebrow}</div>
          <h2 className="font-display text-2xl md:text-3xl text-navy mb-3">{otherServicesT.h2}</h2>
          <p className="text-[14px] text-ink-muted leading-relaxed">{otherServicesT.intro}</p>
        </Reveal>
      </section>

      <NewsTeaser />
      <Hero />
      <ServiceVideoHero onRequest={goToBooking} />
      <ServicesOverview />
      <TrackRequest ref={trackRef} loading={trackLoading} result={trackResult} onSubmit={runTrack} onPay={setPayModal} />
      <WhyChooseUs />
      <StatsRow />
      <HowItWorks />
      <Faq items={translatedFaqs} />

      <PaymentModal request={payModal} onClose={() => setPayModal(null)} onPaid={handlePaid} />
    </div>
  );
}
