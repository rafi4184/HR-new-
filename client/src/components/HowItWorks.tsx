import { motion } from "framer-motion";
import { MessageSquareText, FileCheck2, Handshake } from "lucide-react";
import Reveal from "./ui/Reveal";

const STEPS = [
  {
    icon: MessageSquareText,
    title: "Tell us what you need",
    body: "Submit a request from any desk below — flight details, a hotel brief, or a government case.",
  },
  {
    icon: FileCheck2,
    title: "We review & approve",
    body: "Our desk checks the case and approves it. You get a confirmation the moment we do.",
  },
  {
    icon: Handshake,
    title: "We deliver, on the ground",
    body: "You're met at the gate, checked in, or handed a finished document — not a status update.",
  },
];

export default function HowItWorks() {
  return (
    <section className="px-5 md:px-10 py-16 bg-cream-panel">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <h2 className="font-display text-3xl mb-2">How a request moves</h2>
          <p className="max-w-lg mb-10 text-ink-muted">Three steps, whichever desk you use.</p>
        </Reveal>
        <div className="grid sm:grid-cols-3 gap-8 relative">
          <motion.div
            className="hidden sm:block absolute top-6 left-0 right-0 h-px bg-border-strong origin-left"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 1, ease: [0.2, 0.8, 0.2, 1], delay: 0.1 }}
          />
          {STEPS.map(({ icon: Icon, title, body }, i) => (
            <Reveal key={title} delay={i * 0.1}>
              <div className="relative">
                <motion.div
                  className="relative z-10 w-12 h-12 rounded-full flex items-center justify-center mb-4 font-display text-lg bg-teal text-white"
                  initial={{ scale: 0.4, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ duration: 0.45, delay: i * 0.1 + 0.15, ease: [0.2, 0.9, 0.3, 1.3] }}
                >
                  {i + 1}
                </motion.div>
                <Icon size={18} color="#2F5D3F" className="mb-3" />
                <h3 className="font-display text-lg mb-2">{title}</h3>
                <p className="text-[14px] text-ink-muted">{body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
