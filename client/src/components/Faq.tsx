import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Reveal from "./ui/Reveal";
import type { Faq as FaqEntry } from "../data/servicePages";
import { useT } from "../lib/i18n";
import { faqDefault } from "../lib/translations";

export default function Faq({
  items,
  title,
  eyebrow,
}: {
  items: FaqEntry[];
  title?: string;
  eyebrow?: string;
}) {
  const [open, setOpen] = useState<number | null>(0);
  const defaultTitle = useT(faqDefault.title);
  const defaultEyebrow = useT(faqDefault.eyebrow);
  const resolvedTitle = title ?? defaultTitle;
  const resolvedEyebrow = eyebrow ?? defaultEyebrow;

  return (
    <section className="px-5 md:px-10 py-16 md:py-20 max-w-3xl mx-auto">
      <Reveal className="text-center mb-10">
        <div className="text-[12px] font-medium mb-3 tracking-[0.2em] uppercase text-gold-deep">{resolvedEyebrow}</div>
        <h2 className="font-display text-3xl md:text-4xl text-navy">{resolvedTitle}</h2>
      </Reveal>

      <div className="space-y-3">
        {items.map((f, i) => (
          <div key={f.question} className="rounded-xl border border-border bg-white overflow-hidden">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
            >
              <span className="text-[15px] font-medium text-navy">{f.question}</span>
              <ChevronDown
                size={17}
                className={`shrink-0 text-ink-faint transition-transform ${open === i ? "rotate-180" : ""}`}
              />
            </button>
            <AnimatePresence initial={false}>
              {open === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <p className="px-5 pb-4 text-[14px] text-ink-muted leading-relaxed">{f.answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
}
