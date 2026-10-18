import { useRef, useState } from "react";
import { useSeo } from "../lib/useSeo";
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
import { HOME_FAQS } from "../data/servicePages";
import { trackRequest, ApiError } from "../lib/api";
import type { BookingTab, ServiceRequest } from "../types";
import { useLanguage } from "../lib/i18n";
import { homeFaqs } from "../lib/translations";

export default function HomePage({ onToast }: { onToast: (msg: string) => void }) {
  const { lang } = useLanguage();
  const translatedFaqs = homeFaqs.map((f) => ({ question: f.question[lang], answer: f.answer[lang] }));
  useSeo({
    title: "HR — The Mediator | Dhaka International Airport VIP Service & Jobs in Saudi Arabia",
    description:
      "HR — The Mediator connects individuals, families, businesses and international clients with premium VIP service at Dhaka International Airport (Hazrat Shahjalal International), plus trusted transport, government assistance, manpower, security, education and career services — including jobs in Saudi Arabia and the Middle East — across Bangladesh. Also home to live Bangladesh news, updated every 20 minutes.",
    path: "/",
    faq: HOME_FAQS,
  });

  const [activeTab, setActiveTab] = useState<BookingTab>("airport");
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
      <Hero />
      <NewsTeaser />
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
