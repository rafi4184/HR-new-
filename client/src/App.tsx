import { useRef, useState } from "react";
import { MessageCircle } from "lucide-react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Services from "./components/Services";
import HowItWorks from "./components/HowItWorks";
import MediaPartners from "./components/MediaPartners";
import Programs from "./components/Programs";
import Events from "./components/Events";
import Booking, { type AirportPrefill } from "./components/Booking";
import TrackRequest from "./components/TrackRequest";
import StaffDashboard from "./components/StaffDashboard";
import PaymentModal from "./components/PaymentModal";
import FinalCta from "./components/FinalCta";
import Footer from "./components/Footer";
import Toast from "./components/Toast";
import { trackRequest, ApiError } from "./lib/api";
import type { BookingTab, ServiceRequest } from "./types";

export default function App() {
  const [activeTab, setActiveTab] = useState<BookingTab>("airport");
  const [presetProgram, setPresetProgram] = useState("study");
  const [airportPrefill] = useState<AirportPrefill>({ name: "", flight: "", purpose: "Business" });
  const [airportPrefillKey] = useState(0);
  const [lastTicket, setLastTicket] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const [trackLoading, setTrackLoading] = useState(false);
  const [trackResult, setTrackResult] = useState<ServiceRequest | "notfound" | null>(null);
  const [payModal, setPayModal] = useState<ServiceRequest | null>(null);

  const bookingRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLElement>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3600);
  };

  const scrollToBooking = (tab: BookingTab, program?: string) => {
    setActiveTab(tab);
    if (program) setPresetProgram(program);
    bookingRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const scrollToTrack = () => {
    trackRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSubmitted = (ticket: string) => {
    setLastTicket(ticket);
    showToast(`Request ${ticket} received — track it anytime with your name, date of birth, and ticket number.`);
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
    showToast(`Payment received for ${updated.ticket}. Confirmed.`);
  };

  return (
    <div id="top" className="font-sans text-ink bg-cream">
      <Header onBook={scrollToBooking} onTrack={scrollToTrack} />
      <Hero onBook={scrollToBooking} onContact={scrollToContact} />
      <Services onBook={scrollToBooking} />
      <HowItWorks />
      <MediaPartners />
      <Programs onBook={scrollToBooking} />
      <Events />
      <Booking
        ref={bookingRef}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        presetProgram={presetProgram}
        airportPrefill={airportPrefill}
        airportPrefillKey={airportPrefillKey}
        lastTicket={lastTicket}
        onSubmitted={handleSubmitted}
      />
      <TrackRequest
        ref={trackRef}
        loading={trackLoading}
        result={trackResult}
        onSubmit={runTrack}
        onPay={setPayModal}
      />
      <StaffDashboard onToast={showToast} />
      <FinalCta onBook={scrollToBooking} />
      <Footer />

      <PaymentModal request={payModal} onClose={() => setPayModal(null)} onPaid={handlePaid} />
      <Toast message={toast} />

      <a
        href="tel:+8801717013150"
        className="fixed bottom-5 right-5 z-40 w-14 h-14 rounded-full flex items-center justify-center shadow-lg bg-teal active:scale-[0.97] transition-transform"
        aria-label="Call the desk"
      >
        <MessageCircle size={22} color="#fff" />
      </a>
    </div>
  );
}
