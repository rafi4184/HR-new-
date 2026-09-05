import { forwardRef, useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlaneTakeoff, CarFront, Landmark, GraduationCap, Clock, Ticket } from "lucide-react";
import { Field, IdentityFields, inputClass } from "./ui/Field";
import { PROGRAMS } from "../lib/constants";
import { submitRequest, ApiError } from "../lib/api";
import type { BookingTab } from "../types";
import { useDict, useLanguage } from "../lib/i18n";
import { bookingT, govServicesT, purposesT, programsT } from "../lib/translations";

export interface AirportPrefill {
  name: string;
  flight: string;
  purpose: string;
}

const TAB_META: { id: BookingTab; icon: typeof PlaneTakeoff }[] = [
  { id: "airport", icon: PlaneTakeoff },
  { id: "hotel", icon: CarFront },
  { id: "government", icon: Landmark },
  { id: "programs", icon: GraduationCap },
];

const Booking = forwardRef<
  HTMLElement,
  {
    activeTab: BookingTab;
    setActiveTab: (tab: BookingTab) => void;
    presetProgram: string;
    airportPrefill: AirportPrefill;
    airportPrefillKey: number;
    lastTicket: string | null;
    onSubmitted: (ticket: string) => void;
    lockedTab?: BookingTab;
    id?: string;
    heading?: string;
    subheading?: string;
  }
>(function Booking(
  {
    activeTab,
    setActiveTab,
    presetProgram,
    airportPrefill,
    airportPrefillKey,
    lastTicket,
    onSubmitted,
    lockedTab,
    id = "request-service",
    heading,
    subheading,
  },
  ref
) {
  const { lang } = useLanguage();
  const T = useDict({
    submitting: bookingT.submitting,
    submitAirport: bookingT.submitAirport,
    submitHotel: bookingT.submitHotel,
    submitGovernment: bookingT.submitGovernment,
    submitProgram: bookingT.submitProgram,
    errorFallback: bookingT.errorFallback,
    govNotice: bookingT.govNotice,
    ticketSaved: bookingT.ticketSaved,
    defaultHeading: bookingT.defaultHeading,
    defaultSubheading: bookingT.defaultSubheading,
  });
  const fields = useDict(bookingT.fields);
  const tabsT = useDict(bookingT.tabs);
  const airportsT = useDict(bookingT.airports);
  const hotelTiersT = useDict(bookingT.hotelTiers);
  const carOptionsT = useDict(bookingT.carOptions);
  const urgencyT = useDict(bookingT.urgencyOptions);
  const batchT = useDict(bookingT.batchOptions);
  const placeholders = useDict(bookingT.placeholders);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const tab = lockedTab ?? activeTab;

  const handleSubmit = async (type: string, e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      const created = await submitRequest(type, data);
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
      className="w-full sm:w-auto px-6 py-3 rounded-lg font-medium text-[15px] bg-gradient-to-r from-gold to-[#E0B563] text-navy hover:from-gold-deep hover:to-gold-deep hover:text-white active:scale-[0.97] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {submitting ? T.submitting : label}
    </button>
  );

  return (
    <section id={id} ref={ref} className="px-5 md:px-10 py-16 md:py-20 bg-paper-soft">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display text-3xl md:text-4xl mb-2 text-navy">{heading ?? T.defaultHeading}</h2>
          <p className="mb-8 text-ink-muted">{subheading ?? T.defaultSubheading}</p>
        </motion.div>

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
            key={`${tab}-${airportPrefillKey}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="rounded-2xl border border-border bg-white shadow-card p-6 md:p-8"
          >
            {error && <div className="mb-5 text-[13px] rounded-lg px-4 py-3 bg-[#FBEAE5] text-[#9A3412]">{error}</div>}

            {tab === "airport" && (
              <form onSubmit={(e) => handleSubmit("airport", e)}>
                <div className="grid sm:grid-cols-2 gap-x-5">
                  <IdentityFields defaultName={airportPrefill.name} />
                  <Field label={fields.flightNumber} required>
                    <input
                      name="flight"
                      required
                      defaultValue={airportPrefill.flight}
                      placeholder={placeholders.flightExample}
                      className={inputClass}
                    />
                  </Field>
                  <Field label={fields.arrivalAirport} required>
                    <select name="airport" required className={inputClass} defaultValue={airportsT.dhaka}>
                      <option>{airportsT.dhaka}</option>
                      <option>{airportsT.chattogram}</option>
                      <option>{airportsT.sylhet}</option>
                    </select>
                  </Field>
                  <Field label={fields.preferredDate} required>
                    <input name="date" type="date" required className={inputClass} />
                  </Field>
                  <Field label={fields.arrivalTime}>
                    <input name="time" type="time" className={inputClass} />
                  </Field>
                  <Field label={fields.purposeOfVisit} required>
                    <select
                      name="purpose"
                      required
                      defaultValue={
                        purposesT.find((p) => p.en === (airportPrefill.purpose || "Business"))?.[lang] ?? purposesT[0][lang]
                      }
                      className={inputClass}
                    >
                      {purposesT.map((p) => (
                        <option key={p.en}>{p[lang]}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label={fields.travelers}>
                    <input name="travelers" type="number" min="1" defaultValue="1" className={inputClass} />
                  </Field>
                </div>
                <Field label={fields.description}>
                  <textarea name="notes" rows={3} placeholder={placeholders.airportNotes} className={inputClass} />
                </Field>
                {submitBtn(T.submitAirport)}
              </form>
            )}

            {tab === "hotel" && (
              <form onSubmit={(e) => handleSubmit("hotel", e)}>
                <div className="grid sm:grid-cols-2 gap-x-5">
                  <IdentityFields />
                  <Field label={fields.locationCity} required>
                    <input name="city" required placeholder={placeholders.cityExample} className={inputClass} />
                  </Field>
                  <Field label={fields.hotelTier}>
                    <select name="tier" className={inputClass} defaultValue={hotelTiersT.standard}>
                      <option>{hotelTiersT.standard}</option>
                      <option>{hotelTiersT.business}</option>
                      <option>{hotelTiersT.luxury}</option>
                    </select>
                  </Field>
                  <Field label={fields.checkin} required>
                    <input name="checkin" type="date" required className={inputClass} />
                  </Field>
                  <Field label={fields.checkout} required>
                    <input name="checkout" type="date" required className={inputClass} />
                  </Field>
                  <Field label={fields.carType}>
                    <select name="car" className={inputClass} defaultValue={carOptionsT.sedanSelf}>
                      <option>{carOptionsT.sedanSelf}</option>
                      <option>{carOptionsT.sedanDriver}</option>
                      <option>{carOptionsT.suvDriver}</option>
                      <option>{carOptionsT.vanDriver}</option>
                      <option>{carOptionsT.noCar}</option>
                    </select>
                  </Field>
                  <Field label={fields.pickupLocation}>
                    <input name="pickup" className={inputClass} />
                  </Field>
                </div>
                <Field label={fields.description}>
                  <textarea name="notes" rows={3} className={inputClass} />
                </Field>
                {submitBtn(T.submitHotel)}
              </form>
            )}

            {tab === "government" && (
              <form onSubmit={(e) => handleSubmit("government", e)}>
                <div className="mb-5 text-[13px] rounded-lg px-4 py-3 flex gap-2 bg-gold-pale text-[#7A5E13]">
                  <Clock size={16} className="shrink-0 mt-0.5" />
                  {T.govNotice}
                </div>
                <div className="grid sm:grid-cols-2 gap-x-5">
                  <IdentityFields />
                  <Field label={fields.serviceRequired} required>
                    <select name="service" required className={inputClass} defaultValue="">
                      <option value="" disabled>
                        {fields.selectAService}
                      </option>
                      {govServicesT.map((g) => (
                        <option key={g.en}>{g[lang]}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label={fields.urgency}>
                    <select name="urgency" className={inputClass} defaultValue={urgencyT.standard}>
                      <option>{urgencyT.standard}</option>
                      <option>{urgencyT.urgent}</option>
                    </select>
                  </Field>
                </div>
                <Field label={fields.description} required>
                  <textarea name="description" rows={4} required className={inputClass} />
                </Field>
                {submitBtn(T.submitGovernment)}
              </form>
            )}

            {tab === "programs" && (
              <form onSubmit={(e) => handleSubmit("program", e)}>
                <div className="grid sm:grid-cols-2 gap-x-5">
                  <IdentityFields />
                  <Field label={fields.program} required>
                    <select key={presetProgram} name="program" required defaultValue={presetProgram} className={inputClass}>
                      {PROGRAMS.map((p) => {
                        const tp = programsT.find((x) => x.id === p.id);
                        return (
                          <option key={p.id} value={p.id}>
                            {tp ? tp[lang] : p.label}
                          </option>
                        );
                      })}
                    </select>
                  </Field>
                  <Field label={fields.preferredBatch}>
                    <select name="batch" className={inputClass} defaultValue={batchT.offline}>
                      <option>{batchT.offline}</option>
                      <option>{batchT.online}</option>
                      <option>{batchT.notApplicable}</option>
                    </select>
                  </Field>
                  <Field label={fields.currentEducation}>
                    <input name="background" className={inputClass} />
                  </Field>
                </div>
                <Field label={fields.description}>
                  <textarea name="notes" rows={3} placeholder={placeholders.programGoal} className={inputClass} />
                </Field>
                {submitBtn(T.submitProgram)}
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
              <Ticket size={18} color="#A97C24" className="shrink-0" />
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
