import type { ReactNode } from "react";

export const inputClass =
  "w-full rounded-md px-3 py-2.5 text-[15px] outline-none transition-colors border border-border bg-cream-card text-ink";

export function Field({
  label,
  children,
  required,
}: {
  label: string;
  children: ReactNode;
  required?: boolean;
}) {
  return (
    <label className="block mb-4">
      <span className="block text-sm mb-1.5 text-ink-soft">
        {label}
        {required && <span className="text-[#B4482B]"> *</span>}
      </span>
      {children}
    </label>
  );
}

export function IdentityFields({ defaultName = "" }: { defaultName?: string }) {
  return (
    <>
      <Field label="Full name" required>
        <input name="name" required defaultValue={defaultName} className={inputClass} />
      </Field>
      <Field label="Date of birth" required>
        <input name="dob" type="date" required className={inputClass} />
      </Field>
      <Field label="Phone" required>
        <input name="phone" required className={inputClass} />
      </Field>
      <Field label="Email" required>
        <input name="email" type="email" required className={inputClass} />
      </Field>
    </>
  );
}
