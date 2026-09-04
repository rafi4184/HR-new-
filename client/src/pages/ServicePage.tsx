import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Check, ArrowRight } from "lucide-react";
import { useSeo } from "../lib/useSeo";
import Reveal from "../components/ui/Reveal";
import Faq from "../components/Faq";
import Booking, { type AirportPrefill } from "../components/Booking";
import type { ServicePageData } from "../data/servicePages";
import { SERVICE_PAGES } from "../data/servicePages";
import type { BookingTab } from "../types";

export default function ServicePage({ data }: { data: ServicePageData }) {
  useSeo({
    title: data.metaTitle,
    description: data.metaDescription,
    path: data.path,
    faq: data.faqs,
    serviceSchema: { name: data.title, description: data.metaDescription },
  });

  const [activeTab, setActiveTab] = useState<BookingTab>(data.bookTab ?? "airport");
  const [lastTicket, setLastTicket] = useState<string | null>(null);
  const [airportPrefill] = useState<AirportPrefill>({ name: "", flight: "", purpose: "Business" });
  const bookingRef = useRef<HTMLElement>(null);

  return (
    <div>
      <section className="px-5 md:px-10 py-14 md:py-20 bg-paper-soft">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-[12px] font-medium mb-3 tracking-[0.2em] uppercase text-gold-deep">
            {data.navLabel}
          </div>
          <h1 className="font-display text-3xl md:text-5xl text-navy mb-5" style={{ textWrap: "balance" }}>
            {data.h1}
          </h1>
          <p className="text-[16px] text-ink-muted leading-relaxed max-w-2xl mx-auto mb-8">{data.intro}</p>
          <button
            onClick={() => bookingRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-medium text-[14px] tracking-wide uppercase bg-gold text-navy hover:bg-gold-deep hover:text-white transition-colors"
          >
            {data.cta} <ArrowRight size={15} />
          </button>
        </div>
      </section>

      <section className="px-5 md:px-10 py-14 max-w-5xl mx-auto grid md:grid-cols-2 gap-10">
        <Reveal>
          <h2 className="font-display text-2xl text-navy mb-4">Who This Is For</h2>
          <ul className="space-y-2.5">
            {data.whoFor.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-[14.5px] text-ink-soft">
                <Check size={16} className="text-gold-deep shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="font-display text-2xl text-navy mb-4">What&apos;s Included</h2>
          <ul className="space-y-2.5">
            {data.included.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-[14.5px] text-ink-soft">
                <Check size={16} className="text-gold-deep shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      <section className="px-5 md:px-10 py-14 bg-paper-panel">
        <div className="max-w-5xl mx-auto">
          <Reveal className="text-center mb-10">
            <h2 className="font-display text-2xl md:text-3xl text-navy">How the Process Works</h2>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {data.process.map((step, i) => (
              <Reveal key={step.title} delay={i * 0.07}>
                <div className="rounded-xl bg-white border border-border p-5 h-full shadow-card">
                  <div className="font-display text-2xl text-gold-deep mb-2">{String(i + 1).padStart(2, "0")}</div>
                  <div className="text-[15px] font-medium text-navy mb-1.5">{step.title}</div>
                  <div className="text-[13px] text-ink-muted leading-relaxed">{step.body}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Faq items={data.faqs} title={`${data.navLabel} FAQs`} />

      <Booking
        ref={bookingRef}
        id="service-request"
        heading={data.cta}
        subheading="Fill in the details below and our team will follow up directly."
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        lockedTab={data.bookTab ?? undefined}
        presetProgram="study"
        airportPrefill={airportPrefill}
        airportPrefillKey={0}
        lastTicket={lastTicket}
        onSubmitted={setLastTicket}
      />

      {data.related.length > 0 && (
        <section className="px-5 md:px-10 py-14 max-w-5xl mx-auto">
          <h2 className="font-display text-2xl text-navy mb-6 text-center">Related Services</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {data.related.map((id) => {
              const page = SERVICE_PAGES[id];
              if (!page) return null;
              return (
                <Link
                  key={id}
                  to={page.path}
                  className="px-5 py-2.5 rounded-full border border-border text-[13.5px] font-medium text-navy hover:border-gold hover:bg-gold-pale transition-colors"
                >
                  {page.navLabel}
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
