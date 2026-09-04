import { useRef, useState } from "react";
import { useSeo } from "../lib/useSeo";
import Hero from "../components/Hero";
import ServicesGrid from "../components/ServicesGrid";
import PlatformHub from "../components/PlatformHub";
import CoursesCareersTeaser from "../components/CoursesCareersTeaser";
import HowItWorks from "../components/HowItWorks";
import WhoWeHelp from "../components/WhoWeHelp";
import WhyChooseUs from "../components/WhyChooseUs";
import StatsRow from "../components/StatsRow";
import MediaPartners from "../components/MediaPartners";
import Events from "../components/Events";
import Booking, { type AirportPrefill } from "../components/Booking";
import TrackRequest from "../components/TrackRequest";
import PaymentModal from "../components/PaymentModal";
import Faq from "../components/Faq";
import { HOME_FAQS } from "../data/servicePages";
import { trackRequest, ApiError } from "../lib/api";
import type { BookingTab, ServiceRequest } from "../types";

export default function HomePage({ onToast }: { onToast: (msg: string) => void }) {
  useSeo({
    title: "HR — The Mediator | Trusted Services & Support in Bangladesh",
    description:
      "HR — The Mediator connects individuals, families, businesses and international clients with trusted concierge, transport, government assistance, manpower, security, education and career services across Bangladesh.",
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
      <ServicesGrid />
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
      <PlatformHub />
      <HowItWorks />
      <WhyChooseUs />
      <WhoWeHelp />
      <CoursesCareersTeaser />
      <StatsRow />
      <MediaPartners />
      <Events />
      <Faq items={HOME_FAQS} />

      <PaymentModal request={payModal} onClose={() => setPayModal(null)} onPaid={handlePaid} />
    </div>
  );
}
