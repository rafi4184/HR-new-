import { forwardRef, useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlaneTakeoff, CarFront, Landmark, GraduationCap, Clock, Ticket } from "lucide-react";
import { Field, IdentityFields, inputClass } from "./ui/Field";
import { GOV_SERVICES, PROGRAMS, PURPOSES } from "../lib/constants";
import { submitRequest, ApiError } from "../lib/api";
import type { BookingTab } from "../types";

export interface AirportPrefill {
  name: string;
  flight: string;
  purpose: string;
}

const TABS: { id: BookingTab; label: string; icon: typeof PlaneTakeoff }[] = [
  { id: "airport", label: "Airport VIP", icon: PlaneTakeoff },
  { id: "hotel", label: "Hotel & car", icon: CarFront },
  { id: "government", label: "Government request", icon: Landmark },
  { id: "programs", label: "Courses & careers", icon: GraduationCap },
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
    heading = "Request a Service",
    subheading = "Pick the service you need. Every request gets a ticket number you can track.",
  },
  ref
) {
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
      setError(err instanceof ApiError ? err.message : "Couldn't submit that request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const submitBtn = (label: string) => (
    <button
      type="submit"
      disabled={submitting}
      className="w-full sm:w-auto px-6 py-3 rounded-lg font-medium text-[15px] bg-gold text-navy hover:bg-gold-deep hover:text-white active:scale-[0.97] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {submitting ? "Submitting…" : label}
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
          <h2 className="font-display text-3xl md:text-4xl mb-2 text-navy">{heading}</h2>
          <p className="mb-8 text-ink-muted">{subheading}</p>
        </motion.div>

        {!lockedTab && (
          <div className="flex gap-2 mb-8 flex-wrap">
            {TABS.map(({ id: tabId, label, icon: Icon }) => (
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
                  <Icon size={15} /> {label}
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
            {error && (
              <div className="mb-5 text-[13px] rounded-lg px-4 py-3 bg-[#FBEAE5] text-[#9A3412]">{error}</div>
            )}

            {tab === "airport" && (
              <form onSubmit={(e) => handleSubmit("airport", e)}>
                <div className="grid sm:grid-cols-2 gap-x-5">
                  <IdentityFields defaultName={airportPrefill.name} />
                  <Field label="Flight number" required>
                    <input
                      name="flight"
                      required
                      defaultValue={airportPrefill.flight}
                      placeholder="e.g. BG 147"
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Arrival airport" required>
                    <select name="airport" required className={inputClass} defaultValue="Hazrat Shahjalal Int'l, Dhaka">
                      <option>Hazrat Shahjalal Int&apos;l, Dhaka</option>
                      <option>Shah Amanat Int&apos;l, Chattogram</option>
                      <option>Osmani Int&apos;l, Sylhet</option>
                    </select>
                  </Field>
                  <Field label="Preferred date" required>
                    <input name="date" type="date" required className={inputClass} />
                  </Field>
                  <Field label="Arrival time">
                    <input name="time" type="time" className={inputClass} />
                  </Field>
                  <Field label="Purpose of visit" required>
                    <select name="purpose" required defaultValue={airportPrefill.purpose || "Business"} className={inputClass}>
                      {PURPOSES.map((p) => (
                        <option key={p}>{p}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Travelers">
                    <input name="travelers" type="number" min="1" defaultValue="1" className={inputClass} />
                  </Field>
                </div>
                <Field label="Description of request">
                  <textarea name="notes" rows={3} placeholder="Anything else we should know" className={inputClass} />
                </Field>
                {submitBtn("Submit airport request")}
              </form>
            )}

            {tab === "hotel" && (
              <form onSubmit={(e) => handleSubmit("hotel", e)}>
                <div className="grid sm:grid-cols-2 gap-x-5">
                  <IdentityFields />
                  <Field label="Location / City" required>
                    <input name="city" required placeholder="Dhaka, Rajshahi..." className={inputClass} />
                  </Field>
                  <Field label="Hotel tier">
                    <select name="tier" className={inputClass} defaultValue="Standard">
                      <option>Standard</option>
                      <option>Business</option>
                      <option>Luxury</option>
                    </select>
                  </Field>
                  <Field label="Check-in (preferred date)" required>
                    <input name="checkin" type="date" required className={inputClass} />
                  </Field>
                  <Field label="Check-out" required>
                    <input name="checkout" type="date" required className={inputClass} />
                  </Field>
                  <Field label="Car type">
                    <select name="car" className={inputClass} defaultValue="Sedan, self-drive">
                      <option>Sedan, self-drive</option>
                      <option>Sedan, with driver</option>
                      <option>SUV, with driver</option>
                      <option>Van, with driver</option>
                      <option>No car needed</option>
                    </select>
                  </Field>
                  <Field label="Pickup location">
                    <input name="pickup" className={inputClass} />
                  </Field>
                </div>
                <Field label="Description of request">
                  <textarea name="notes" rows={3} className={inputClass} />
                </Field>
                {submitBtn("Submit hotel & car request")}
              </form>
            )}

            {tab === "government" && (
              <form onSubmit={(e) => handleSubmit("government", e)}>
                <div className="mb-5 text-[13px] rounded-lg px-4 py-3 flex gap-2 bg-gold-pale text-[#7A5E13]">
                  <Clock size={16} className="shrink-0 mt-0.5" />
                  Our desk reviews every case individually and confirms scope directly with you by
                  phone before any work begins.
                </div>
                <div className="grid sm:grid-cols-2 gap-x-5">
                  <IdentityFields />
                  <Field label="Service required" required>
                    <select name="service" required className={inputClass} defaultValue="">
                      <option value="" disabled>
                        Select a service
                      </option>
                      {GOV_SERVICES.map((label) => (
                        <option key={label}>{label}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Urgency">
                    <select name="urgency" className={inputClass} defaultValue="Standard">
                      <option>Standard</option>
                      <option>Urgent</option>
                    </select>
                  </Field>
                </div>
                <Field label="Description of request" required>
                  <textarea name="description" rows={4} required className={inputClass} />
                </Field>
                {submitBtn("Submit government request")}
              </form>
            )}

            {tab === "programs" && (
              <form onSubmit={(e) => handleSubmit("program", e)}>
                <div className="grid sm:grid-cols-2 gap-x-5">
                  <IdentityFields />
                  <Field label="Program" required>
                    <select key={presetProgram} name="program" required defaultValue={presetProgram} className={inputClass}>
                      {PROGRAMS.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.label}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Preferred batch">
                    <select name="batch" className={inputClass} defaultValue="Offline, Bangladesh campus">
                      <option>Offline, Bangladesh campus</option>
                      <option>Online, Zoom</option>
                      <option>Not applicable</option>
                    </select>
                  </Field>
                  <Field label="Current education / occupation">
                    <input name="background" className={inputClass} />
                  </Field>
                </div>
                <Field label="Description of request">
                  <textarea name="notes" rows={3} placeholder="What are you hoping to get out of it?" className={inputClass} />
                </Field>
                {submitBtn("Submit enrollment request")}
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
                Your ticket number is <strong>{lastTicket}</strong>. Save it — you&apos;ll need it
                with your name and date of birth to track this request.
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
});

export default Booking;
