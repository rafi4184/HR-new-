import type { ReactNode } from "react";
import { useDict } from "../../lib/i18n";
import { identityFields } from "../../lib/translations";

export const inputClass =
  "w-full rounded-lg px-3.5 py-2.5 text-[15px] outline-none transition-colors border border-border bg-white text-ink placeholder:text-ink-faint";

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
        {required && <span className="text-gold-deep"> *</span>}
      </span>
      {children}
    </label>
  );
}

export function IdentityFields({ defaultName = "" }: { defaultName?: string }) {
  const T = useDict(identityFields);
  return (
    <>
      <Field label={T.fullName} required>
        <input name="name" required defaultValue={defaultName} className={inputClass} />
      </Field>
      <Field label={T.phoneWhatsapp} required>
        <input name="phone" required className={inputClass} />
      </Field>
      <Field label={T.email} required>
        <input name="email" type="email" required className={inputClass} />
      </Field>
      <Field label={T.dob} required>
        <input name="dob" type="date" required className={inputClass} />
      </Field>
    </>
  );
}
