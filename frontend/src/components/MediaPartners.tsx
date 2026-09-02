import { motion } from "framer-motion";
import { Radio, Award, Mic } from "lucide-react";
import { HASANUR_PHOTO, MEDIA_PARTNERS } from "../lib/constants";

export default function MediaPartners() {
  return (
    <section
      id="on-air"
      className="relative overflow-hidden bg-cream-panel border-y border-border py-16 md:py-20"
    >
      <div
        className="absolute inset-0 opacity-[0.35] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 20% 30%, rgba(47,93,63,0.20), transparent 55%), radial-gradient(circle at 80% 70%, rgba(166,64,42,0.14), transparent 55%)",
        }}
      />
      <div className="relative max-w-6xl mx-auto px-5 md:px-10 grid md:grid-cols-[0.85fr_1.15fr] gap-10 md:gap-14 items-center">
        {/* Portrait card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7 }}
          className="relative mx-auto w-full max-w-[320px]"
        >
          <div className="relative rounded-2xl overflow-hidden border border-border-strong bg-navy shadow-[0_30px_60px_-20px_rgba(23,36,28,0.35)]">
            <div className="aspect-[4/5] w-full bg-navy">
              <img
                src={HASANUR_PHOTO}
                alt="Hasanur Rahman, news presenter"
                loading="lazy"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
                className="w-full h-full object-cover object-center"
              />
            </div>
            <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/85 via-black/45 to-transparent">
              <div className="text-[10px] font-mono uppercase tracking-[0.24em] text-teal-soft mb-1">
                On the desk
              </div>
              <div className="font-display text-white text-lg leading-tight">
                Hasanur Rahman
              </div>
              <div className="text-[12px] text-mist">
                News presenter · Trainer, Media &amp; Public Speaking Academy
              </div>
            </div>
          </div>
          <motion.div
            initial={{ scale: 0, rotate: -30 }}
            whileInView={{ scale: 1, rotate: -8 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ delay: 0.6, duration: 0.6, ease: [0.2, 0.9, 0.3, 1.3] }}
            className="absolute -top-3 -right-3 w-16 h-16 rounded-full border-[3px] border-gold text-gold bg-cream-card flex flex-col items-center justify-center font-mono text-[9px] font-semibold uppercase tracking-widest leading-tight text-center select-none"
          >
            BTV
            <br />
            featured
          </motion.div>
        </motion.div>

        {/* Copy + network list */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.22em] text-gold mb-3"
          >
            <Radio size={12} /> As seen on air
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="font-display text-3xl md:text-4xl leading-tight mb-4 max-w-xl"
          >
            The mediator's newsroom presence — training the next generation of
            <span className="italic text-teal"> on-air voices</span>.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="text-ink-muted max-w-xl mb-8 leading-relaxed"
          >
            Our media desk is led by working broadcast professionals from Bangladesh Television
            and national news networks. The Media &amp; Public Speaking Academy runs on the same
            standards those newsrooms hold — camera presence, breath control, and Bengali /
            English on-air fluency.
          </motion.p>
          <div className="flex flex-wrap gap-3 mb-6">
            {MEDIA_PARTNERS.map((m, i) => (
              <motion.div
                key={m}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.08 * i, duration: 0.5 }}
                whileHover={{ y: -2 }}
                className="px-4 py-2 rounded-full border border-border-strong bg-cream-card font-display text-[14px] text-ink-soft flex items-center gap-2"
              >
                <Mic size={12} className="text-gold" />
                {m}
              </motion.div>
            ))}
          </div>
          <motion.a
            href="#programs"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="inline-flex items-center gap-2 text-[13px] font-medium text-teal border-b border-teal/30 hover:border-teal transition-colors"
          >
            <Award size={14} /> Enroll in the media academy
          </motion.a>
        </div>
      </div>
    </section>
  );
}
