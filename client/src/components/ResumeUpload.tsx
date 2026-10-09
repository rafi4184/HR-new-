import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { FileText, CheckCircle2, UploadCloud } from "lucide-react";
import Reveal from "./ui/Reveal";
import { Field, inputClass } from "./ui/Field";
import { submitResume, ApiError } from "../lib/api";
import { useDict } from "../lib/i18n";
import { resumeUploadT } from "../lib/translations";

const MAX_SIZE = 10 * 1024 * 1024;
const ACCEPTED = ".pdf,.doc,.docx";

export default function ResumeUpload() {
  const T = useDict(resumeUploadT);
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!file) {
      setError(T.errorGeneric);
      return;
    }
    if (file.size > MAX_SIZE) {
      setError(T.errorGeneric);
      return;
    }

    const form = e.currentTarget;
    const data = new FormData(form);

    setSubmitting(true);
    try {
      await submitResume(
        {
          name: String(data.get("name") ?? ""),
          email: String(data.get("email") ?? ""),
          phone: String(data.get("phone") ?? "") || undefined,
          targetRole: String(data.get("targetRole") ?? "") || undefined,
          targetCountry: String(data.get("targetCountry") ?? "") || undefined,
          note: String(data.get("note") ?? "") || undefined,
        },
        file,
      );
      setDone(true);
      form.reset();
      setFile(null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : T.errorGeneric);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="px-5 md:px-10 py-14 md:py-16 bg-paper-panel">
      <div className="max-w-2xl mx-auto">
        <Reveal className="text-center mb-8">
          <div className="text-[12px] font-medium mb-2 tracking-[0.2em] uppercase text-gold-deep">{T.eyebrow}</div>
          <h2 className="font-display text-2xl md:text-3xl text-navy mb-3">{T.h2}</h2>
          <p className="text-[14.5px] text-ink-muted leading-relaxed">{T.intro}</p>
        </Reveal>

        <Reveal delay={0.08}>
          {done ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-2xl bg-white border border-border p-8 text-center"
            >
              <CheckCircle2 size={32} className="text-gold-deep mx-auto mb-3" />
              <p className="text-[14.5px] text-ink-soft">{T.success}</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="rounded-2xl bg-white border border-border p-6 md:p-8">
              <div className="grid sm:grid-cols-2 gap-x-4">
                <Field label={T.nameLabel} required>
                  <input name="name" required className={inputClass} />
                </Field>
                <Field label={T.emailLabel} required>
                  <input name="email" type="email" required className={inputClass} />
                </Field>
                <Field label={T.phoneLabel}>
                  <input name="phone" className={inputClass} />
                </Field>
                <Field label={T.roleLabel}>
                  <input name="targetRole" className={inputClass} placeholder="e.g. Driver, Technician" />
                </Field>
                <Field label={T.countryLabel}>
                  <input name="targetCountry" className={inputClass} placeholder="e.g. Saudi Arabia" />
                </Field>
                <Field label={T.noteLabel}>
                  <input name="note" className={inputClass} />
                </Field>
              </div>

              <Field label={T.fileLabel} required>
                <label
                  className={`flex items-center gap-3 rounded-lg border border-dashed px-3.5 py-3 cursor-pointer transition-colors ${
                    file ? "border-gold bg-gold-pale" : "border-border hover:border-gold"
                  }`}
                >
                  {file ? <FileText size={18} className="text-gold-deep shrink-0" /> : <UploadCloud size={18} className="text-ink-faint shrink-0" />}
                  <span className="text-[13.5px] text-ink-soft truncate">{file ? file.name : T.fileLabel}</span>
                  <input
                    type="file"
                    accept={ACCEPTED}
                    required
                    className="hidden"
                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  />
                </label>
              </Field>

              {error && <p className="text-[13px] text-[#8A3B22] mb-3">{error}</p>}

              <button
                type="submit"
                disabled={submitting}
                className="w-full mt-2 px-6 py-3 rounded-lg font-medium text-[15px] bg-gradient-to-r from-gold to-[#5AD1A8] text-navy hover:from-gold-deep hover:to-gold-deep hover:text-white transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? T.submitting : T.submit}
              </button>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}
