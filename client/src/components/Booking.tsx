import { forwardRef, useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, KeyRound, Search, MessageSquare, Ticket } from "lucide-react";
import Reveal from "./ui/Reveal";
import { Field, IdentityFields, inputClass } from "./ui/Field";
import { submitRequest, ApiError } from "../lib/api";
import type { BookingTab } from "../types";
import { useDict } from "../lib/i18n";
import { bookingT } from "../lib/translations";

const TAB_META: { id: BookingTab; icon: typeof Home }[] = [
  { id: "sales", icon: Home },
  { id: "management", icon: KeyRound },
  { id: "buyers", icon: Search },
  { id: "general", icon: MessageSquare },
];

const TYPE_BY_TAB: Record<BookingTab, string> = {
  sales: "property-sales",
  management: "property-management",
  buyers: "buyers-agency",
  general: "general-enquiry",
};

const Booking = forwardRef<
  HTMLElement,
  {
    activeTab: BookingTab;
    setActiveTab: (tab: BookingTab) => void;
    lastTicket: string | null;
    onSubmitted: (ticket: string) => void;
    lockedTab?: BookingTab;
    id?: string;
    heading?: string;
    subheading?: string;
  }
>(function Booking({ activeTab, setActiveTab, lastTicket, onSubmitted, lockedTab, id = "request-service", heading, subheading }, ref) {
  const T = useDict({
    submitting: bookingT.submitting,
    submitSales: bookingT.submitSales,
    submitManagement: bookingT.submitManagement,
    submitBuyers: bookingT.submitBuyers,
    submitGeneral: bookingT.submitGeneral,
    errorFallback: bookingT.errorFallback,
    ticketSaved: bookingT.ticketSaved,
    defaultHeading: bookingT.defaultHeading,
    defaultSubheading: bookingT.defaultSubheading,
  });
  const fields = useDict(bookingT.fields);
  const tabsT = useDict(bookingT.tabs);
  const placeholders = useDict(bookingT.placeholders);
  const propertyTypes = bookingT.propertyTypes.map((p) => p.en);
  const timeframes = bookingT.timeframes.map((t) => t.en);
  const statusOptions = bookingT.statusOptions.map((s) => s.en);
  const budgetRanges = bookingT.budgetRanges.map((b) => b.en);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const tab = lockedTab ?? activeTab;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      const created = await submitRequest(TYPE_BY_TAB[tab], data);
      onSubmitted(created.ticket);
      form.reset();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : T.errorFallback);
    } finally {
      setSubmitting(false);
    }
  };

  const submitBtn = (label: string) => (
    <button
      type="submit"
      disabled={submitting}
      className="w-full sm:w-auto px-6 py-3 rounded-lg font-medium text-[15px] bg-gold text-white hover:bg-gold-deep hover:scale-[1.03] active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
    >
      {submitting ? T.submitting : label}
    </button>
  );

  return (
    <section id={id} ref={ref} className="px-5 md:px-10 py-16 md:py-20 bg-paper-soft">
      <div className="max-w-3xl mx-auto">
        <Reveal>
          <h2 className="font-display text-3xl md:text-4xl mb-2 text-navy">{heading ?? T.defaultHeading}</h2>
          <p className="mb-8 text-ink-muted">{subheading ?? T.defaultSubheading}</p>
        </Reveal>

        {!lockedTab && (
          <div className="flex gap-2 mb-8 flex-wrap">
            {TAB_META.map(({ id: tabId, icon: Icon }) => (
              <button
                key={tabId}
                onClick={() => setActiveTab(tabId)}
                className={`relative overflow-hidden flex items-center gap-2 px-4 py-2.5 rounded-lg text-[14px] font-medium transition-colors ${
                  tab === tabId ? "text-white" : "bg-paper-panel text-ink-soft hover:text-navy"
                }`}
              >
                {tab === tabId && (
                  <motion.span
                    layoutId="bookingTabIndicator"
                    className="absolute inset-0 bg-navy rounded-lg"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <Icon size={15} /> {tabsT[tabId]}
                </span>
              </button>
            ))}
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="rounded-2xl border border-border bg-white shadow-card p-6 md:p-8"
          >
            {error && <div className="mb-5 text-[13px] rounded-lg px-4 py-3 bg-[#FBEAE5] text-[#9A3412]">{error}</div>}

            {tab === "sales" && (
              <form onSubmit={handleSubmit}>
                <div className="grid sm:grid-cols-2 gap-x-5">
                  <IdentityFields />
                  <Field label={fields.propertyAddress} required>
                    <input name="propertyAddress" required placeholder={placeholders.propertyAddressExample} className={inputClass} />
                  </Field>
                  <Field label={fields.propertyType}>
                    <select name="propertyType" className={inputClass} defaultValue={propertyTypes[0]}>
                      {propertyTypes.map((p) => (
                        <option key={p}>{p}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label={fields.timeframe}>
                    <select name="timeframe" className={inputClass} defaultValue={timeframes[0]}>
                      {timeframes.map((t) => (
                        <option key={t}>{t}</option>
                      ))}
                    </select>
                  </Field>
                </div>
                <Field label={fields.description}>
                  <textarea name="notes" rows={3} placeholder={placeholders.salesNotes} className={inputClass} />
                </Field>
                {submitBtn(T.submitSales)}
              </form>
            )}

            {tab === "management" && (
              <form onSubmit={handleSubmit}>
                <div className="grid sm:grid-cols-2 gap-x-5">
                  <IdentityFields />
                  <Field label={fields.propertyAddress} required>
                    <input name="propertyAddress" required placeholder={placeholders.propertyAddressExample} className={inputClass} />
                  </Field>
                  <Field label={fields.propertyType}>
                    <select name="propertyType" className={inputClass} defaultValue={propertyTypes[0]}>
                      {propertyTypes.map((p) => (
                        <option key={p}>{p}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label={fields.currentStatus}>
                    <select name="status" className={inputClass} defaultValue={statusOptions[0]}>
                      {statusOptions.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </Field>
                </div>
                <Field label={fields.description}>
                  <textarea name="notes" rows={3} placeholder={placeholders.managementNotes} className={inputClass} />
                </Field>
                {submitBtn(T.submitManagement)}
              </form>
            )}

            {tab === "buyers" && (
              <form onSubmit={handleSubmit}>
                <div className="grid sm:grid-cols-2 gap-x-5">
                  <IdentityFields />
                  <Field label={fields.areaOfInterest} required>
                    <input name="areaOfInterest" required placeholder={placeholders.areaExample} className={inputClass} />
                  </Field>
                  <Field label={fields.propertyType}>
                    <select name="propertyType" className={inputClass} defaultValue={propertyTypes[0]}>
                      {propertyTypes.map((p) => (
                        <option key={p}>{p}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label={fields.budgetRange}>
                    <select name="budgetRange" className={inputClass} defaultValue={budgetRanges[0]}>
                      {budgetRanges.map((b) => (
                        <option key={b}>{b}</option>
                      ))}
                    </select>
                  </Field>
                </div>
                <Field label={fields.description}>
                  <textarea name="notes" rows={3} placeholder={placeholders.buyersNotes} className={inputClass} />
                </Field>
                {submitBtn(T.submitBuyers)}
              </form>
            )}

            {tab === "general" && (
              <form onSubmit={handleSubmit}>
                <div className="grid sm:grid-cols-2 gap-x-5">
                  <IdentityFields />
                  <Field label={fields.enquiryType}>
                    <input name="enquiryType" placeholder={placeholders.generalNotes} className={inputClass} />
                  </Field>
                </div>
                <Field label={fields.description} required>
                  <textarea name="notes" rows={4} required placeholder={placeholders.generalNotes} className={inputClass} />
                </Field>
                {submitBtn(T.submitGeneral)}
              </form>
            )}
          </motion.div>
        </AnimatePresence>

        <AnimatePresence>
          {lastTicket && (
            <motion.div
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.45, ease: [0.2, 0.9, 0.3, 1.3] }}
              className="mt-5 rounded-lg px-4 py-3 flex items-center gap-3 bg-gold-pale"
            >
              <Ticket size={18} color="#7C591E" className="shrink-0" />
              <div className="text-[13px] text-navy">
                {T.ticketSaved.split("{ticket}").map((part, i, arr) => (
                  <span key={i}>
                    {part}
                    {i < arr.length - 1 && <strong>{lastTicket}</strong>}
                  </span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
});

export default Booking;
