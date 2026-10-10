import { useRef, useState, Suspense, lazy } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Phone, MessageCircle } from "lucide-react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import FinalCta from "./components/FinalCta";
import Toast from "./components/Toast";
import ScrollToHash from "./components/ScrollToHash";
import ScrollProgress from "./components/ScrollProgress";
import HomePage from "./pages/HomePage";
import { SERVICE_PAGE_LIST } from "./data/servicePages";

// Code-split every route except the homepage — most visitors land on "/" and
// never touch, say, the staff dashboard, so there's no reason to ship that
// code (or any other route's) in the bundle everyone downloads first.
const ServicePage = lazy(() => import("./pages/ServicePage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const EventsPage = lazy(() => import("./pages/EventsPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const PrivacyPage = lazy(() => import("./pages/PrivacyPage"));
const TermsPage = lazy(() => import("./pages/TermsPage"));
const StaffPage = lazy(() => import("./pages/StaffPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

export default function App() {
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const location = useLocation();

  const showToast = (msg: string) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3600);
  };

  return (
    <div className="font-sans text-ink bg-white">
      <ScrollProgress />
      <ScrollToHash />
      <Header />

      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <Suspense fallback={<div className="min-h-[60vh]" />}>
            <Routes location={location}>
              <Route path="/" element={<HomePage onToast={showToast} />} />
              {SERVICE_PAGE_LIST.map((data) => (
                <Route key={data.id} path={data.path} element={<ServicePage data={data} />} />
              ))}
              <Route path="/about-us" element={<AboutPage />} />
              <Route path="/events" element={<EventsPage onToast={showToast} />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/privacy-policy" element={<PrivacyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/staff" element={<StaffPage onToast={showToast} />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </motion.div>
      </AnimatePresence>

      <FinalCta />
      <Footer />
      <Toast message={toast} />

      <a
        href="https://wa.me/8801717013150?text=Hi%2C%20I%27d%20like%20to%20request%20a%20service%20from%20HR%20%E2%80%94%20The%20Mediator."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-24 right-5 z-40 w-14 h-14 rounded-full flex items-center justify-center shadow-card-hover bg-[#25D366] text-white hover:brightness-95 hover:scale-110 active:scale-95 transition-all"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle size={22} />
      </a>

      <a
        href="tel:+8801717013150"
        className="fixed bottom-5 right-5 z-40 w-14 h-14 rounded-full flex items-center justify-center shadow-card-hover bg-gold text-white hover:bg-gold-deep hover:scale-110 active:scale-95 transition-all"
        aria-label="Call the desk"
      >
        <Phone size={20} />
      </a>
    </div>
  );
}
