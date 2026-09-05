import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, MessageCircle, ArrowRight } from "lucide-react";
import { useSeo } from "../lib/useSeo";
import Reveal from "../components/ui/Reveal";
import { listContacts } from "../lib/api";
import type { Contact } from "../types";
import { useDict } from "../lib/i18n";
import { contactPageT } from "../lib/translations";

const FALLBACK_CONTACTS: Contact[] = [
  {
    id: -1,
    label: "Reach the desk",
    phone: "01717013150",
    email: "hrthemediator@gmail.com",
    address: null,
    whatsapp: null,
    sortOrder: 0,
  },
  {
    id: -2,
    label: "Find us",
    phone: null,
    email: null,
    address: "The Meditor, 4th floor, Green Chayera Manzil, Greater Road Mosque, Kadirganj, Rajshahi",
    whatsapp: null,
    sortOrder: 1,
  },
];

export default function ContactPage() {
  useSeo({
    title: "Contact Us | HR — The Mediator",
    description:
      "Contact HR — The Mediator in Rajshahi, Bangladesh. Call, WhatsApp or email our desk, or submit a service request directly.",
    path: "/contact",
  });

  const T = useDict(contactPageT);
  const [contacts, setContacts] = useState<Contact[]>(FALLBACK_CONTACTS);

  useEffect(() => {
    listContacts()
      .then((rows) => {
        if (rows.length > 0) setContacts(rows);
      })
      .catch(() => {});
  }, []);

  const labelFor = (c: Contact) => {
    if (c.label === FALLBACK_CONTACTS[0].label) return T.fallbackReachDesk;
    if (c.label === FALLBACK_CONTACTS[1].label) return T.fallbackFindUs;
    return c.label;
  };

  return (
    <div>
      <section className="px-5 md:px-10 py-14 md:py-20 bg-paper-soft text-center">
        <div className="max-w-2xl mx-auto">
          <div className="text-[12px] font-medium mb-3 tracking-[0.2em] uppercase text-gold-deep">{T.eyebrow}</div>
          <h1 className="font-display text-3xl md:text-5xl text-navy mb-5">{T.h1}</h1>
          <p className="text-[16px] text-ink-muted leading-relaxed">{T.intro}</p>
        </div>
      </section>

      <section className="px-5 md:px-10 py-14 max-w-4xl mx-auto">
        <div className="grid sm:grid-cols-2 gap-6 mb-10">
          {contacts.map((c, i) => (
            <Reveal key={c.id} delay={i * 0.08}>
              <div className="rounded-2xl border border-border bg-white p-6 shadow-card h-full">
                <div className="text-navy font-medium mb-3">{labelFor(c)}</div>
                <div className="space-y-2.5 text-[14.5px] text-ink-soft">
                  {c.phone && (
                    <a href={`tel:${c.phone}`} className="flex items-center gap-2 hover:text-navy">
                      <Phone size={15} /> {c.phone}
                    </a>
                  )}
                  {c.whatsapp && (
                    <a href={`https://wa.me/${c.whatsapp.replace(/\D/g, "")}`} className="flex items-center gap-2 hover:text-navy">
                      <MessageCircle size={15} /> {c.whatsapp}
                    </a>
                  )}
                  {c.email && (
                    <a href={`mailto:${c.email}`} className="flex items-center gap-2 hover:text-navy">
                      <Mail size={15} /> {c.email}
                    </a>
                  )}
                  {c.address && (
                    <div className="flex items-start gap-2">
                      <MapPin size={15} className="mt-0.5 shrink-0" /> {c.address}
                    </div>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="text-center">
          <Link
            to="/#request-service"
            className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-medium text-[14px] tracking-wide uppercase bg-gradient-to-r from-navy to-navy-soft text-white hover:from-navy-soft hover:to-navy transition-colors"
          >
            {T.requestService}
            <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </section>
    </div>
  );
}
