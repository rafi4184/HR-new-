import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Award, Users, Plane, Landmark } from "lucide-react";

interface Stat {
  label: string;
  value: number;
  suffix: string;
  icon: typeof Award;
}

const STATS: Stat[] = [
  { label: "Cases handled", value: 12480, suffix: "+", icon: Landmark },
  { label: "Guests received", value: 9430, suffix: "+", icon: Plane },
  { label: "Years at the desk", value: 14, suffix: "", icon: Award },
  { label: "Partners on file", value: 68, suffix: "", icon: Users },
];

const TESTIMONIALS = [
  {
    quote:
      "The mediator's team met us at the gate, drove us straight to the hotel, and my father's NID correction was done before we flew home. Extraordinary.",
    name: "Rehana K.",
    tag: "Toronto → Dhaka",
  },
  {
    quote:
      "I dreaded queuing for my mother's passport renewal. HR handled the whole file end-to-end. No queue, no chai runs, no wasted day.",
    name: "Farhan A.",
    tag: "Dhanmondi resident",
  },
  {
    quote:
      "They arranged our BG media crew's accommodation, cars, and government clearance in 36 hours. It felt like flying with a personal chief of staff.",
    name: "M. Hasan",
    tag: "Dubai broadcaster",
  },
  {
    quote:
      "We enrolled two managers in their Gulf-employment program. Both were placed inside four months. Old-fashioned trust, modern execution.",
    name: "Sadia Z.",
    tag: "HR lead, Chattogram",
  },
];

function Counter({ target, duration = 1400 }: { target: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const from = 0;
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      // eased out cubic
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(from + (target - from) * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target, duration]);

  return <span ref={ref}>{value.toLocaleString()}</span>;
}

export default function Signature() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const iv = setInterval(() => setIdx((i) => (i + 1) % TESTIMONIALS.length), 5200);
    return () => clearInterval(iv);
  }, []);

  return (
    <section
      id="signature"
      className="relative overflow-hidden px-5 md:px-10 py-24 bg-navy text-white"
    >
      {/* subtle aurora */}
      <motion.div
        aria-hidden
        className="blob"
        style={{ width: 420, height: 420, top: -160, left: "-6%", background: "rgba(47,93,63,0.35)" }}
        animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="blob"
        style={{ width: 360, height: 360, bottom: -140, right: "-5%", background: "rgba(166,64,42,0.28)" }}
        animate={{ x: [0, -24, 0], y: [0, -18, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative max-w-6xl mx-auto">
        <div className="flex items-end justify-between gap-4 flex-wrap mb-12">
          <div>
            <div className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.22em] text-teal-soft mb-3">
              <span className="w-2 h-px bg-teal-soft" /> Ledger
            </div>
            <h2 className="font-display text-4xl md:text-5xl leading-tight max-w-2xl">
              Fourteen years, one desk, thousands of quietly-handled cases.
            </h2>
          </div>
          <p className="text-mist max-w-sm">
            A boutique operation with the reach of a bureau. Every metric below is a case we
            personally shepherded from first call to closing signature.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-16">
          {STATS.map(({ label, value, suffix, icon: Icon }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.08 * i, duration: 0.6 }}
              className="relative rounded-2xl p-5 border border-white/10 bg-white/[0.04] backdrop-blur-sm hover:bg-white/[0.07] transition-colors"
            >
              <div className="w-9 h-9 rounded-full flex items-center justify-center bg-teal/30 mb-4">
                <Icon size={16} color="#DEE8DA" />
              </div>
              <div className="font-display text-4xl md:text-5xl leading-none">
                <Counter target={value} />
                <span className="text-gold">{suffix}</span>
              </div>
              <div className="mt-2 text-[11px] font-mono uppercase tracking-[0.2em] text-mist-soft">
                {label}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid md:grid-cols-[1.05fr_0.95fr] gap-10 items-stretch">
          <motion.div
            initial={{ opacity: 0, x: -14 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-8 md:p-10 min-h-[280px]"
          >
            <div className="absolute -top-6 -left-4 font-display text-[120px] leading-none text-white/[0.06] select-none">
              &ldquo;
            </div>
            <div className="relative h-full flex flex-col justify-between">
              <div>
                {TESTIMONIALS.map((t, i) => (
                  <motion.blockquote
                    key={t.name}
                    initial={false}
                    animate={{
                      opacity: i === idx ? 1 : 0,
                      y: i === idx ? 0 : 10,
                      pointerEvents: i === idx ? "auto" : "none",
                    }}
                    transition={{ duration: 0.5 }}
                    className={i === idx ? "relative" : "absolute inset-0 md:p-10 p-8"}
                    style={{ pointerEvents: i === idx ? "auto" : "none" }}
                  >
                    <p className="font-display italic text-xl md:text-2xl leading-snug text-white">
                      {t.quote}
                    </p>
                    <div className="mt-6 text-[12px] font-mono uppercase tracking-[0.22em] text-teal-soft">
                      {t.name} · <span className="text-mist-soft">{t.tag}</span>
                    </div>
                  </motion.blockquote>
                ))}
              </div>
              <div className="mt-8 flex gap-1.5">
                {TESTIMONIALS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setIdx(i)}
                    aria-label={`Show quote ${i + 1}`}
                    className={`h-[3px] rounded-full transition-all ${
                      i === idx ? "w-8 bg-gold" : "w-4 bg-white/25 hover:bg-white/40"
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 14 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="rounded-2xl border border-white/10 bg-gradient-to-br from-teal/25 to-transparent p-8 md:p-10"
          >
            <div className="text-[11px] font-mono uppercase tracking-[0.22em] text-teal-soft mb-4">
              House rules
            </div>
            <ul className="space-y-4">
              {[
                { t: "Same officer, start to finish.", d: "Your case doesn't change hands. One face, one number, one accountability." },
                { t: "Discretion by default.", d: "Your papers, phone number, and case details never leave the desk." },
                { t: "Direct human line, 7:00–23:00.", d: "Reach the concierge on WhatsApp, not a call-centre queue." },
                { t: "No-surprise pricing.", d: "Every fee — government or private — is quoted in writing before we start." },
              ].map((r, i) => (
                <motion.li
                  key={r.t}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.05 * i, duration: 0.5 }}
                  className="flex gap-3"
                >
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
                  <div>
                    <div className="text-white font-medium">{r.t}</div>
                    <div className="text-mist text-[13.5px] leading-relaxed">{r.d}</div>
                  </div>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
