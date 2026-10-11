"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { submitRequest, type SubmitState } from "@/app/actions";
import { AIRPORTS, BATCHES, CAR_OPTIONS, GOV_SERVICES, HOTEL_TIERS, PROGRAMS, PURPOSES } from "@/lib/services";
import type { RequestType } from "@/lib/types";

const TABS: { id: RequestType; label: string }[] = [
  { id: "airport", label: "Airport VIP" },
  { id: "hotel", label: "Hotel & Car" },
  { id: "government", label: "Government" },
  { id: "program", label: "Courses & Careers" },
];

export default function RequestForm({ initialType }: { initialType: RequestType }) {
  const [type, setType] = useState<RequestType>(initialType);
  const [state, action, pending] = useActionState<SubmitState, FormData>(submitRequest, {});

  if (state.ticket) {
    return (
      <div className="rounded-2xl border border-line bg-white p-8 text-center sm:p-12">
        <p className="eyebrow">Request received</p>
        <p className="mt-4 text-sm text-muted">Your ticket number</p>
        <p className="mt-1 font-mono text-3xl font-semibold tracking-wider text-navy">{state.ticket}</p>
        <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-muted">
          Save this number. You'll need it — with your name and date of birth — to track your request. We'll also email
          you once our desk has reviewed it.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/track" className="btn-primary">Track this request</Link>
          <Link href="/" className="btn-ghost">Back home</Link>
        </div>
      </div>
    );
  }

  return (
    <form action={action} className="rounded-2xl border border-line bg-white p-6 sm:p-8">
      <input type="hidden" name="type" value={type} />

      <div role="tablist" className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={type === t.id}
            onClick={() => setType(t.id)}
            className={`rounded-full px-4 py-2 text-sm transition-colors ${
              type === t.id ? "bg-navy text-white" : "bg-paper text-muted hover:text-navy"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <fieldset key={type} className="mt-8 grid gap-5 sm:grid-cols-2">
        <legend className="mb-4 font-display text-xl text-navy">Request details</legend>
        {type === "airport" && (
          <>
            <Field label="Flight number" name="flight" required placeholder="e.g. EK582" />
            <Select label="Airport" name="airport" options={AIRPORTS} required />
            <Field label="Arrival date" name="date" type="date" required />
            <Field label="Arrival time" name="time" type="time" />
            <Select label="Purpose of visit" name="purpose" options={PURPOSES} />
            <Field label="Travelers" name="travelers" type="number" min="1" defaultValue="1" />
            <Area label="Notes" name="notes" placeholder="Anything we should know — wheelchair, extra luggage, VIP guest…" />
          </>
        )}
        {type === "hotel" && (
          <>
            <Field label="City" name="city" required placeholder="e.g. Dhaka" />
            <Select label="Hotel tier" name="tier" options={HOTEL_TIERS} />
            <Field label="Check-in" name="checkin" type="date" required />
            <Field label="Check-out" name="checkout" type="date" required />
            <Select label="Car" name="car" options={CAR_OPTIONS} />
            <Field label="Pickup location" name="pickup" />
            <Area label="Notes" name="notes" />
          </>
        )}
        {type === "government" && (
          <>
            <Select label="Service" name="service" options={GOV_SERVICES} required placeholder="Select a service" />
            <Select label="Urgency" name="urgency" options={["Standard", "Urgent"]} />
            <Area label="Describe your case" name="description" required rows={4} />
            <p className="text-sm text-muted sm:col-span-2">
              Our desk reviews every case individually and confirms the scope with you by phone before any work begins.
            </p>
          </>
        )}
        {type === "program" && (
          <>
            <label className="block">
              <span className="label">Program<Req /></span>
              <select name="program" required className="input">
                {PROGRAMS.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
              </select>
            </label>
            <Select label="Batch" name="batch" options={BATCHES} />
            <Field label="Current education / occupation" name="background" />
            <Area label="Your goal" name="notes" placeholder="e.g. Master's in Germany, autumn intake" />
          </>
        )}
      </fieldset>

      <hr className="mt-10 border-line" />
      <fieldset className="mt-8 grid gap-5 sm:grid-cols-2">
        <legend className="mb-4 font-display text-xl text-navy">Your details</legend>
        <Field label="Full name" name="name" required autoComplete="name" />
        <Field label="Date of birth" name="dob" type="date" required autoComplete="bday" />
        <Field label="Phone" name="phone" type="tel" required autoComplete="tel" placeholder="+880…" />
        <Field label="Email" name="email" type="email" required autoComplete="email" />
      </fieldset>

      {state.error && (
        <p role="alert" className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</p>
      )}

      <div className="mt-8 flex items-center justify-between gap-4">
        <p className="text-xs text-muted">We only use your details to handle this request.</p>
        <button type="submit" disabled={pending} className="btn-primary px-6 py-3">
          {pending ? "Sending…" : "Submit request"}
        </button>
      </div>
    </form>
  );
}

function Req() {
  return <span className="ml-0.5 text-gold-deep">*</span>;
}

function Field({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="label">{label}{props.required && <Req />}</span>
      <input className="input" {...props} />
    </label>
  );
}

function Area({ label, ...props }: { label: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <label className="block sm:col-span-2">
      <span className="label">{label}{props.required && <Req />}</span>
      <textarea rows={3} className="input" {...props} />
    </label>
  );
}

function Select({
  label,
  options,
  placeholder,
  ...props
}: { label: string; options: string[]; placeholder?: string } & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <label className="block">
      <span className="label">{label}{props.required && <Req />}</span>
      <select className="input" defaultValue={placeholder ? "" : options[0]} {...props}>
        {placeholder && <option value="" disabled>{placeholder}</option>}
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );
}
