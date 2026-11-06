import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Facebook, Instagram } from "lucide-react";
import LogoMark from "./ui/Logo";
import { listContacts } from "../lib/api";
import { SERVICES } from "../lib/services";
import { useRequestHref } from "../lib/useRequestHref";
import AmbientGlow from "./ui/AmbientGlow";
import { useDict } from "../lib/i18n";
import { footer } from "../lib/translations";
import { useSiteText } from "../lib/siteContent";
import type { Contact } from "../types";

// Placeholder contact details — replace with ARK Property Solution's real
// phone, email and office address before launch.
const FALLBACK_CONTACTS: Contact[] = [
  {
    id: -1,
    label: "Reach us",
    phone: "(02) 0000 0000",
    email: "hello@arkpropertysolution.com.au",
    address: null,
    whatsapp: null,
    sortOrder: 0,
  },
  {
    id: -2,
    label: "Office",
    phone: null,
    email: null,
    address: "Sydney, NSW, Australia",
    whatsapp: null,
    sortOrder: 1,
  },
];

export default function Footer() {
  const requestHref = useRequestHref();
  const T = useDict(footer);
  const description = useSiteText("footer.description");
  const [contacts, setContacts] = useState<Contact[]>(FALLBACK_CONTACTS);

  useEffect(() => {
    listContacts()
      .then((rows) => {
        if (rows.length > 0) setContacts(rows);
      })
      .catch(() => {});
  }, []);

  const quickLinks = [
    { label: T.home, to: "/" },
    { label: T.aboutUs, to: "/about-us" },
    { label: T.contact, to: "/contact" },
    { label: T.trackARequest, to: "/#track" },
    { label: T.staffLogin, to: "/staff" },
  ];

  return (
    <footer id="contact" className="relative bg-navy text-mist overflow-hidden">
      <AmbientGlow variant="dark" />
      <div className="relative px-5 md:px-10 pt-16 pb-8 max-w-7xl mx-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <LogoMark size={30} className="text-white" />
              <div className="font-display text-white text-xl">ARK Property Solution</div>
            </div>
            <p className="text-[14px] leading-relaxed">{description}</p>
            <div className="flex items-center gap-3 mt-5">
              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 rounded-full flex items-center justify-center bg-white/10 hover:bg-gold hover:text-navy transition-colors"
              >
                <Facebook size={16} />
              </a>
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full flex items-center justify-center bg-white/10 hover:bg-gold hover:text-navy transition-colors"
              >
                <Instagram size={16} />
              </a>
            </div>
          </div>

          <div>
            <div className="text-white text-sm font-medium mb-3">{T.servicesHeading}</div>
            <div className="flex flex-col gap-2 text-[14px]">
              {SERVICES.map((s) => (
                <Link key={s.id} to={s.path} className="hover:text-white transition-colors">
                  {s.shortTitle}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <div className="text-white text-sm font-medium mb-3">{T.quickLinksHeading}</div>
            <div className="flex flex-col gap-2 text-[14px]">
              {quickLinks.map((l) => (
                <Link key={l.to} to={l.to} className="hover:text-white transition-colors">
                  {l.label}
                </Link>
              ))}
              <Link to={requestHref} className="hover:text-white transition-colors">
                {T.requestService}
              </Link>
            </div>
          </div>

          <div>
            <div className="text-white text-sm font-medium mb-3">{T.contactHeading}</div>
            <div className="space-y-2.5 text-[14px]">
              {contacts.map((c) => (
                <div key={c.id}>
                  {c.phone && (
                    <div className="flex items-center gap-2">
                      <Phone size={14} /> {c.phone}
                    </div>
                  )}
                  {c.email && (
                    <div className="flex items-center gap-2">
                      <Mail size={14} /> {c.email}
                    </div>
                  )}
                  {c.address && (
                    <div className="flex items-start gap-2">
                      <MapPin size={14} className="mt-0.5 shrink-0" />
                      <span>
                        {c.label && c.label !== "Reach us" && (
                          <span className="block text-[11px] text-mist-soft uppercase tracking-wide mb-0.5">{c.label}</span>
                        )}
                        {c.address}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between gap-3 text-[12px]">
          <span>
            © {new Date().getFullYear()} {T.copyright}
          </span>
          <div className="flex items-center gap-4">
            <Link to="/privacy-policy" className="hover:text-white transition-colors">
              {T.privacyPolicy}
            </Link>
            <Link to="/terms" className="hover:text-white transition-colors">
              {T.termsConditions}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
