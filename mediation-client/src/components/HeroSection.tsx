import { motion } from "framer-motion";
import { ShieldCheck, TrendingUp, ArrowRight, Compass } from "lucide-react";
import MagneticButton from "./MagneticButton";

const HEADLINE_WORDS = ["Resolve", "workplace", "conflict.", "Protect", "what", "matters."];

const wordReveal = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.5 + i * 0.07, duration: 0.6, ease: [0.2, 0.8, 0.2, 1] as const },
  }),
};

export default function HeroSection({ onBook, onExplore }: { onBook: () => void; onExplore: () => void }) {
  return (
    <section className="grain relative min-h-[100svh] overflow-hidden bg-obsidian-950 flex items-center">
      {/* Video background layer. Drop a real file at public/hero-bg.mp4 (and
          a public/hero-poster.jpg) to activate it — until then the video
          element simply has nothing to paint and the animated gradient/glow
          layer beneath still carries the scene, so the hero never looks
          broken either way. */}
      <video
        className="absolute inset-0 w-full h-full object-cover opacity-45"
        autoPlay
        muted
        loop
        playsInline
        poster="/hero-poster.jpg"
      >
        <source src="/hero-bg.mp4" type="video/mp4" />
      </video>

      {/* Ambient gradient/glow layer — always present, so the hero reads as
          finished even before a real video asset is added. */}
      <div className="absolute inset-0 -z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-obsidian-950 via-obsidian-900 to-obsidian-950" />
        <motion.div
          className="absolute -top-40 -right-20 w-[520px] h-[520px] rounded-full blur-[120px]"
          style={{ background: "radial-gradient(circle, rgba(201,162,75,0.22), transparent 70%)" }}
          animate={{ opacity: [0.5, 0.9, 0.5], scale: [1, 1.08, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-32 -left-20 w-[420px] h-[420px] rounded-full blur-[110px]"
          style={{ background: "radial-gradient(circle, rgba(90,120,200,0.16), transparent 70%)" }}
          animate={{ opacity: [0.4, 0.75, 0.4], scale: [1, 1.1, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
      </div>

      {/* Dark gradient overlay + noise for AAA contrast over the video */}
      <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-obsidian-900/80 to-obsidian-950/40" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-10 py-24 w-full">
        <div className="max-w-3xl">
          {/* A. Eyebrow badge */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full glass-panel shadow-glow"
          >
            <motion.span
              className="w-1.5 h-1.5 rounded-full bg-gild"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            <span className="text-[12px] tracking-[0.14em] uppercase text-gild-soft font-medium">
              Confidential Workplace Dispute Resolution
            </span>
          </motion.div>

          {/* B. Headline — word-by-word reveal */}
          <h1 className="font-display text-[2.75rem] sm:text-6xl md:text-7xl leading-[1.04] mb-7 flex flex-wrap gap-x-4">
            {HEADLINE_WORDS.map((word, i) => (
              <motion.span
                key={word + i}
                custom={i}
                initial="hidden"
                animate="visible"
                variants={wordReveal}
                className={
                  i < 3
                    ? "bg-gradient-to-br from-white via-white to-white/70 bg-clip-text text-transparent"
                    : "bg-gradient-to-br from-gild-bright via-gild to-gild-soft bg-clip-text text-transparent"
                }
              >
                {word}
              </motion.span>
            ))}
          </h1>

          {/* C. Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.0 }}
            className="text-[17px] md:text-lg text-white/65 max-w-xl mb-10 leading-relaxed"
          >
            HR the Mediator brings structured, neutral mediation to employers and their people —
            from confidential intake through joint facilitation to a signed resolution, handled
            with strict legal and workplace neutrality throughout.
          </motion.p>

          {/* D. Dual CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.15 }}
            className="flex flex-wrap items-center gap-4"
          >
            <MagneticButton
              onClick={onBook}
              strength={0.25}
              className="group relative overflow-hidden rounded-full px-7 py-3.5 font-medium text-[15px] text-obsidian-950 bg-gradient-to-r from-gild-bright via-gild to-gild-soft shadow-glow-lg"
            >
              <span className="relative z-10 flex items-center gap-2">
                Book a Confidential Intake <ArrowRight size={16} />
              </span>
              {/* shimmer sweep */}
              <span className="absolute inset-0 overflow-hidden">
                <span className="absolute inset-y-0 left-0 w-1/3 bg-white/40 blur-md animate-shimmerSweep" />
              </span>
            </MagneticButton>

            <MagneticButton
              onClick={onExplore}
              strength={0.4}
              className="flex items-center gap-2 rounded-full px-6 py-3.5 font-medium text-[15px] text-white glass-panel hover:border-white/25 transition-colors"
            >
              <Compass size={16} /> Explore the Mediation Process
            </MagneticButton>
          </motion.div>
        </div>

        {/* Floating live metric cards */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 1.4 }}
          className="hidden lg:flex flex-col gap-4 absolute top-24 right-8 xl:right-16 w-[260px]"
        >
          <motion.div
            className="gpu-layer glass-panel rounded-2xl px-5 py-4 shadow-card"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              <span className="text-[11px] uppercase tracking-wide text-white/50">Live status</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-emerald-400" />
              <span className="text-lg font-semibold text-white">98.4%</span>
            </div>
            <div className="text-[12px] text-white/55 mt-0.5">Resolution success rate</div>
          </motion.div>

          <motion.div
            className="gpu-layer glass-panel rounded-2xl px-5 py-4 shadow-card"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <ShieldCheck size={15} className="text-gild" />
              <span className="text-[11px] uppercase tracking-wide text-white/50">Confidentiality</span>
            </div>
            <div className="text-[13px] font-medium text-white/90 leading-snug">
              Strict legal &amp; workplace neutrality
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
