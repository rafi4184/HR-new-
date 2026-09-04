import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Menu, X } from "lucide-react";
import LogoMark from "./ui/Logo";
import { SERVICES } from "../lib/services";
import { useRequestHref } from "../lib/useRequestHref";

export default function Header() {
  const requestHref = useRequestHref();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const openServices = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setServicesOpen(true);
  };
  const scheduleCloseServices = () => {
    closeTimer.current = setTimeout(() => setServicesOpen(false), 150);
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `relative group py-1 text-[14px] font-medium transition-colors ${isActive ? "text-navy" : "text-ink-soft hover:text-navy"}`;

  const NavUnderline = ({ isActive }: { isActive: boolean }) => (
    <span
      aria-hidden="true"
      className={`absolute left-0 -bottom-0.5 h-[1.5px] bg-gradient-to-r from-gold to-gold-deep rounded-full transition-transform duration-300 origin-left ${
        isActive ? "w-full scale-x-100" : "w-full scale-x-0 group-hover:scale-x-100"
      }`}
    />
  );

  return (
    <header
      className={`sticky top-0 inset-x-0 z-40 transition-all duration-300 ${
        scrolled ? "bg-white shadow-soft border-b border-border" : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="flex items-center justify-between px-5 md:px-10 py-3.5 max-w-7xl mx-auto">
        <Link to="/" className="flex items-center gap-2 sm:gap-2.5 min-w-0 shrink" onClick={() => setMobileOpen(false)}>
          <LogoMark size={30} className="text-navy shrink-0 sm:hidden" animated />
          <LogoMark size={34} className="text-navy shrink-0 hidden sm:block" animated />
          <div className="min-w-0">
            <div className="text-navy font-display text-[15px] sm:text-[17px] leading-none truncate">HR — The Mediator</div>
            <div className="hidden sm:block text-[10px] leading-none mt-1 tracking-wide text-ink-faint">
              Trusted Service &amp; Support Partner
            </div>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-7">
          <NavLink to="/" className={linkClass} end>
            {({ isActive }) => (
              <>
                Home
                <NavUnderline isActive={isActive} />
              </>
            )}
          </NavLink>

          <div className="relative" onMouseEnter={openServices} onMouseLeave={scheduleCloseServices}>
            <button
              className="flex items-center gap-1 text-[14px] font-medium text-ink-soft hover:text-navy transition-colors"
              onClick={() => setServicesOpen((v) => !v)}
              aria-expanded={servicesOpen}
            >
              Services <ChevronDown size={14} className={`transition-transform ${servicesOpen ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
              {servicesOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-1/2 -translate-x-1/2 top-full pt-3 w-72"
                >
                  <div className="rounded-xl border border-border bg-white shadow-card-hover p-2">
                    {SERVICES.map((s) => (
                      <Link
                        key={s.id}
                        to={s.path}
                        onClick={() => setServicesOpen(false)}
                        className="flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-paper-soft transition-colors"
                      >
                        <s.icon size={18} className="text-gold-deep mt-0.5 shrink-0" />
                        <div>
                          <div className="text-[14px] font-medium text-navy">{s.navLabel}</div>
                          <div className="text-[12px] text-ink-faint line-clamp-1">{s.summary}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <NavLink to="/about-us" className={linkClass}>
            {({ isActive }) => (
              <>
                About Us
                <NavUnderline isActive={isActive} />
              </>
            )}
          </NavLink>
          <NavLink to="/contact" className={linkClass}>
            {({ isActive }) => (
              <>
                Contact
                <NavUnderline isActive={isActive} />
              </>
            )}
          </NavLink>
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <Link
            to="/#track"
            className="text-[13px] font-medium text-ink-faint hover:text-navy transition-colors"
          >
            Track Request
          </Link>
          <Link
            to={requestHref}
            className="text-[13px] font-medium tracking-wide px-5 py-2.5 rounded-full bg-gradient-to-r from-gold to-[#E0B563] text-navy hover:from-gold-deep hover:to-gold-deep hover:text-white transition-colors"
          >
            Request a Service
          </Link>
        </div>

        <div className="lg:hidden flex items-center gap-1.5 shrink-0">
          <Link
            to={requestHref}
            className="text-[12px] sm:text-[12.5px] font-medium px-2.5 sm:px-3.5 py-2 rounded-full bg-gradient-to-r from-gold to-[#E0B563] text-navy whitespace-nowrap"
          >
            <span className="sm:hidden">Request</span>
            <span className="hidden sm:inline">Request a Service</span>
          </Link>
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-navy shrink-0"
            aria-label="Menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden border-t border-border bg-white overflow-hidden"
          >
            <div className="px-5 py-4 flex flex-col gap-1">
              <Link to="/" onClick={() => setMobileOpen(false)} className="py-2.5 text-[15px] font-medium text-navy">
                Home
              </Link>
              <button
                onClick={() => setMobileServicesOpen((v) => !v)}
                className="py-2.5 flex items-center justify-between text-[15px] font-medium text-navy"
              >
                Services
                <ChevronDown size={16} className={`transition-transform ${mobileServicesOpen ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {mobileServicesOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="pl-3 flex flex-col overflow-hidden"
                  >
                    {SERVICES.map((s) => (
                      <Link
                        key={s.id}
                        to={s.path}
                        onClick={() => setMobileOpen(false)}
                        className="py-2 text-[14px] text-ink-soft"
                      >
                        {s.navLabel}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
              <Link to="/about-us" onClick={() => setMobileOpen(false)} className="py-2.5 text-[15px] font-medium text-navy">
                About Us
              </Link>
              <Link to="/contact" onClick={() => setMobileOpen(false)} className="py-2.5 text-[15px] font-medium text-navy">
                Contact
              </Link>
              <Link to="/#track" onClick={() => setMobileOpen(false)} className="py-2.5 text-[15px] font-medium text-ink-soft">
                Track Request
              </Link>
              <Link
                to={requestHref}
                onClick={() => setMobileOpen(false)}
                className="mt-3 text-center text-[14px] font-medium px-5 py-3 rounded-full bg-gradient-to-r from-gold to-[#E0B563] text-navy"
              >
                Request a Service
              </Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
