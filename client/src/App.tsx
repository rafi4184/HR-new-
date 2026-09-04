import { useRef, useState } from "react";
import { Routes, Route } from "react-router-dom";
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

  const showToast = (msg: string) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3600);
  };

  return (
    <div className="font-sans text-ink bg-white">
      <ScrollToHash />
      <Header />

      <Routes>
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
