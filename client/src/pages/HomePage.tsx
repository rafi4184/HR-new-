import { useRef, useState } from "react";
import { useSeo } from "../lib/useSeo";
import SpainHero from "../components/SpainHero";
import SpainVisaOverview from "../components/SpainVisaOverview";
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
import { HOME_FAQS } from "../data/servicePages";
import { trackRequest, ApiError } from "../lib/api";
import type { BookingTab, ServiceRequest } from "../types";
import { useDict, useLanguage } from "../lib/i18n";
import { homeFaqs, otherServicesSection } from "../lib/translations";

export default function HomePage({ onToast }: { onToast: (msg: string) => void }) {
  const { lang } = useLanguage();
  const translatedFaqs = homeFaqs.map((f) => ({ question: f.question[lang], answer: f.answer[lang] }));
  const otherServicesT = useDict(otherServicesSection);
  useSeo({
    title: "Spain Digital Nomad Visa Consultants | Student, PR & Work Visas | HR — The Mediator",
    description:
      "HR — The Mediator is a Spain visa consultancy based in Bangladesh — specialists in the Digital Nomad Visa (ARTIN), with Student, Permanent Residency and Work visa guidance underway. We also continue our original services: Dhaka Airport VIP, government-request assistance, manpower & security staffing, and overseas careers across the Gulf and Australia.",
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
      <SpainHero />
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
      <TrackRequest ref={trackRef} loading={trackLoading} result={trackResult} onSubmit={runTrack} onPay={setPayModal} />
      <WhyChooseUs />
      <StatsRow />
      <HowItWorks />
      <Faq items={translatedFaqs} />

      <PaymentModal request={payModal} onClose={() => setPayModal(null)} onPaid={handlePaid} />
    </div>
  );
}
