import { forwardRef, useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plane, Car, Landmark, GraduationCap, Clock, Ticket } from "lucide-react";
import { Field, IdentityFields, inputClass } from "./ui/Field";
import { GOV_SERVICES, PROGRAMS, PURPOSES } from "../lib/constants";
import { submitRequest, ApiError } from "../lib/api";
import type { BookingTab } from "../types";

export interface AirportPrefill {
  name: string;
  flight: string;
  purpose: string;
}

const TABS: { id: BookingTab; label: string; icon: typeof Plane }[] = [
  { id: "airport", label: "Airport VIP", icon: Plane },
  { id: "hotel", label: "Hotel & car", icon: Car },
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
  }
>(function Booking(
  { activeTab, setActiveTab, presetProgram, airportPrefill, airportPrefillKey, lastTicket, onSubmitted },
  ref
) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      className="w-full sm:w-auto px-6 py-3 rounded-md font-medium text-[15px] bg-teal text-white active:scale-[0.97] transition-transform disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {submitting ? "Submitting…" : label}
    </button>
  );

  return (
    <section id="booking" ref={ref} className="px-5 md:px-10 py-16 bg-cream-card">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="font-display text-3xl mb-2">Make a request</h2>
          <p className="mb-8 text-ink-muted">
            Pick the desk you need. Every request gets a ticket number you can track.
          </p>
        </motion.div>

        <div className="flex gap-2 mb-8 flex-wrap">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-md text-[14px] font-medium transition-colors ${
                activeTab === id ? "bg-teal text-white" : "bg-cream-panel text-ink-soft"
              }`}
            >
              <Icon size={15} /> {label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeTab}-${airportPrefillKey}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="rounded-xl border border-border bg-white p-6 md:p-8"
          >
            {error && (
              <div className="mb-5 text-[13px] rounded-md px-4 py-3 bg-[#F7E3DD] text-[#8A3B22]">{error}</div>
            )}

            {activeTab === "airport" && (
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
                  <Field label="Arrival date" required>
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
                <Field label="Notes for the concierge">
                  <textarea name="notes" rows={3} className={inputClass} />
                </Field>
                {submitBtn("Submit airport request")}
              </form>
            )}

            {activeTab === "hotel" && (
              <form onSubmit={(e) => handleSubmit("hotel", e)}>
                <div className="grid sm:grid-cols-2 gap-x-5">
                  <IdentityFields />
                  <Field label="City" required>
                    <input name="city" required placeholder="Dhaka, Rajshahi..." className={inputClass} />
                  </Field>
                  <Field label="Hotel tier">
                    <select name="tier" className={inputClass} defaultValue="Standard">
                      <option>Standard</option>
                      <option>Business</option>
                      <option>Luxury</option>
                    </select>
                  </Field>
                  <Field label="Check-in" required>
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
                <Field label="Notes for the concierge">
                  <textarea name="notes" rows={3} className={inputClass} />
                </Field>
                {submitBtn("Submit hotel & car request")}
              </form>
            )}

            {activeTab === "government" && (
              <form onSubmit={(e) => handleSubmit("government", e)}>
                <div className="mb-5 text-[13px] rounded-md px-4 py-3 flex gap-2 bg-[#F4E7C9] text-[#7A5E13]">
                  <Clock size={16} className="shrink-0 mt-0.5" />
                  Our desk reviews every case individually and confirms scope directly with you by
                  phone before any work begins.
                </div>
                <div className="grid sm:grid-cols-2 gap-x-5">
                  <IdentityFields />
                  <Field label="Service needed" required>
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
                <Field label="Describe the issue" required>
                  <textarea name="description" rows={4} required className={inputClass} />
                </Field>
                {submitBtn("Submit government request")}
              </form>
            )}

            {activeTab === "programs" && (
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
                <Field label="What are you hoping to get out of it?">
                  <textarea name="notes" rows={3} className={inputClass} />
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
              className="mt-5 rounded-lg px-4 py-3 flex items-center gap-3 bg-teal-pale"
            >
              <Ticket size={18} color="#2F5D3F" className="shrink-0" />
              <div className="text-[13px] text-navy-light">
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
