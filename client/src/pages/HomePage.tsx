import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Home, KeyRound, Search, ShieldCheck } from "lucide-react";
import { useSeo } from "../lib/useSeo";
import ServicesOverview from "../components/ServicesOverview";
import HowItWorks from "../components/HowItWorks";
import WhyChooseUs from "../components/WhyChooseUs";
import StatsRow from "../components/StatsRow";
import Booking from "../components/Booking";
import TrackRequest from "../components/TrackRequest";
import Faq from "../components/Faq";
import { HOME_FAQS } from "../data/servicePages";
import { trackRequest, ApiError } from "../lib/api";
import type { BookingTab, ServiceRequest } from "../types";
import { homeFaqs } from "../lib/translations";

const ease = [0.2, 0.8, 0.2, 1] as const;

export default function HomePage({ onToast }: { onToast: (msg: string) => void }) {
  const translatedFaqs = homeFaqs.map((f) => ({ question: f.question.en, answer: f.answer.en }));
  useSeo({
    title: "ARK Property Solution — Real Estate Sales, Property Management & Buyer's Agency in Sydney, NSW",
    description:
      "ARK Property Solution is a Sydney-based real estate agency offering property sales, property management and buyer's agency services across NSW. Honest advice, hands-on service, and results you can track.",
    path: "/",
    faq: HOME_FAQS,
  });

  const [activeTab, setActiveTab] = useState<BookingTab>("sales");
  const [lastTicket, setLastTicket] = useState<string | null>(null);
  const [trackLoading, setTrackLoading] = useState(false);
  const [trackResult, setTrackResult] = useState<ServiceRequest | "notfound" | null>(null);

  const bookingRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLElement>(null);

  const goToBooking = (tab: BookingTab | null) => {
    if (tab) setActiveTab(tab);
    bookingRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSubmitted = (ticket: string) => {
    setLastTicket(ticket);
    onToast(`Enquiry ${ticket} received — track it anytime with your name, date of birth, and reference number.`);
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

  return (
    <div>
      <HeroSection onExplore={() => goToBooking(null)} />

      <Booking
        ref={bookingRef}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        lastTicket={lastTicket}
        onSubmitted={handleSubmitted}
      />

      <ServicesOverview />
      <WhyChooseUs />
      <StatsRow />
      <HowItWorks />
      <TrackRequest ref={trackRef} loading={trackLoading} result={trackResult} onSubmit={runTrack} />
      <Faq items={translatedFaqs} />
    </div>
  );
}

const FACTS = [
  { Icon: Home, label: "Real Estate Sales" },
  { Icon: KeyRound, label: "Property Management" },
  { Icon: Search, label: "Buyer's Agency" },
];

function HeroSection({ onExplore }: { onExplore: () => void }) {
  return (
    <section className="relative px-5 md:px-10 pt-14 pb-16 md:pt-20 md:pb-24 bg-white overflow-hidden">
      <motion.div
        aria-hidden="true"
        className="absolute -top-24 -left-24 w-[420px] h-[420px] rounded-full blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(169,121,45,0.10), transparent 70%)" }}
        animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden="true"
        className="absolute -bottom-32 -right-16 w-[480px] h-[480px] rounded-full blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(12,35,64,0.06), transparent 70%)" }}
        animate={{ x: [0, -24, 0], y: [0, -16, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-2 mb-5 text-[12px] tracking-[0.2em] uppercase text-gold-deep font-medium"
          >
            <span className="w-6 h-px bg-gold-deep" />
            Sydney, NSW · Real Estate Sales · Property Management · Buyer's Agency
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease }}
            className="font-display text-navy text-[2.5rem] sm:text-[3.4rem] leading-[1.08] mb-6"
            style={{ textWrap: "balance" }}
          >
            Your Sydney Property, Handled Properly
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease }}
            className="text-[16px] md:text-[18px] text-ink-muted leading-relaxed mb-9 max-w-xl"
          >
            Selling, renting out, or buying — ARK Property Solution runs all three on one standard: straight advice,
            hands-on service, and a team that stays with your case from first enquiry to close.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease }}
            className="flex flex-wrap items-center gap-4"
          >
            <button
              onClick={onExplore}
              className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-medium text-[14px] tracking-wide uppercase bg-gold text-white hover:bg-gold-deep transition-colors"
            >
              Get in Touch
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
            </button>
            <a
              href="#services"
              className="px-7 py-3.5 rounded-full font-medium text-[14px] tracking-wide uppercase border border-navy text-navy hover:bg-navy hover:text-white transition-colors"
            >
              Explore Services
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.15, ease }}
          className="relative mx-4 sm:mx-8 lg:mx-2"
        >
          <div className="absolute -inset-3 rounded-[28px] bg-gradient-to-br from-gold/40 via-transparent to-navy/20 blur-md pointer-events-none" />
          <div className="relative rounded-2xl overflow-hidden shadow-card-hover border border-white/60 bg-navy p-7 sm:p-9">
            <div className="flex items-center gap-1.5 mb-4">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-gold" />
              </span>
              <span className="text-[9.5px] font-medium tracking-[0.14em] uppercase text-gold-pale">ARK Property Solution</span>
            </div>

            <div className="text-[20px] sm:text-[24px] font-display text-white leading-snug mb-7">
              Three services, one team, one standard of care
            </div>

            <div className="space-y-4">
              {FACTS.map(({ Icon, label }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
                  className="flex items-center gap-3.5 rounded-xl bg-white/[0.07] border border-white/10 px-4 py-3"
                >
                  <div className="w-9 h-9 rounded-lg bg-gold/20 flex items-center justify-center text-gold shrink-0">
                    <Icon size={17} />
                  </div>
                  <div className="text-[14.5px] font-medium text-white">{label}</div>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="flex items-center gap-3.5 rounded-xl bg-white/[0.07] border border-white/10 px-4 py-3"
              >
                <div className="w-9 h-9 rounded-lg bg-gold/20 flex items-center justify-center text-gold shrink-0">
                  <ShieldCheck size={17} />
                </div>
                <div className="text-[14.5px] font-medium text-white">Straight, honest advice — always</div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
