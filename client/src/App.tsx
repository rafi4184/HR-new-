import { useRef, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import FinalCta from "./components/FinalCta";
import Toast from "./components/Toast";
import ScrollToHash from "./components/ScrollToHash";
import HomePage from "./pages/HomePage";
import ServicePage from "./pages/ServicePage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import PrivacyPage from "./pages/PrivacyPage";
import TermsPage from "./pages/TermsPage";
import StaffPage from "./pages/StaffPage";
import { SERVICE_PAGE_LIST } from "./data/servicePages";

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
      <ScrollToHash />
      <Header />

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <Routes location={location}>
            <Route path="/" element={<HomePage onToast={showToast} />} />
            {SERVICE_PAGE_LIST.map((data) => (
              <Route key={data.id} path={data.path} element={<ServicePage data={data} />} />
            ))}
            <Route path="/about-us" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/privacy-policy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/staff" element={<StaffPage onToast={showToast} />} />
          </Routes>
        </motion.div>
      </AnimatePresence>

      <FinalCta />
      <Footer />
      <Toast message={toast} />

      <a
        href="tel:+8801717013150"
        className="fixed bottom-5 right-5 z-40 w-14 h-14 rounded-full flex items-center justify-center shadow-card-hover bg-gold text-navy hover:bg-gold-deep hover:text-white active:scale-[0.97] transition-colors"
        aria-label="Call the desk"
      >
        <MessageCircle size={22} />
      </a>
    </div>
  );
}
