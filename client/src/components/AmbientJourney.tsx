import { motion } from "framer-motion";
import { Plane, Building2, Landmark, ShieldCheck } from "lucide-react";

// A fully animated "journey" scene built from SVG + Framer Motion — no
// video file, no external image, nothing to fetch or ever 404. Stands in
// for real footage, built directly from the site's own content: the four
// real services (Services.tsx), in order, as stops on a flight path that
// draws itself across the hero and lights up stop by stop.
const STOPS = [
  { Icon: Plane, cx: 8, label: "Airport VIP" },
  { Icon: Building2, cx: 36, label: "Hotel & car" },
  { Icon: Landmark, cx: 64, label: "Government" },
  { Icon: ShieldCheck, cx: 92, label: "Manpower" },
];

export default function AmbientJourney() {
  return (
    // Fixed, slim strip pinned to the very bottom edge of the hero — well
    // clear of the headline/CTA/floating-card column above it, and hidden
    // below md since there's no spare vertical room on a stacked mobile
    // layout without it colliding with the content above.
    <div
      className="hidden md:block absolute inset-x-0 bottom-0 h-16 lg:h-20 overflow-hidden pointer-events-none opacity-70"
      aria-hidden="true"
    >
      <svg viewBox="0 0 100 16" preserveAspectRatio="none" className="absolute inset-0 w-full h-full" fill="none">
        <path d="M6 8 Q 30 1, 50 8 T 94 8" stroke="rgba(243,238,223,0.1)" strokeWidth="0.35" />
        <motion.path
          d="M6 8 Q 30 1, 50 8 T 94 8"
          stroke="#A6402A"
          strokeWidth="0.35"
          strokeLinecap="round"
          strokeDasharray="1 2"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ pathLength: { duration: 2.6, ease: [0.2, 0.8, 0.2, 1], delay: 0.6 }, opacity: { duration: 0.4, delay: 0.6 } }}
        />
        <motion.circle
          r="0.55"
          fill="#D9A441"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1, 0] }}
          transition={{ duration: 4, repeat: Infinity, repeatDelay: 1.5, delay: 3.2, times: [0, 0.05, 0.9, 1] }}
        >
          <animateMotion dur="4s" repeatCount="indefinite" begin="3.2s" path="M6 8 Q 30 1, 50 8 T 94 8" />
        </motion.circle>
      </svg>

      {STOPS.map((s, i) => (
        <motion.div
          key={s.label}
          className="absolute top-1/2 flex items-center gap-1.5"
          style={{ left: `${s.cx}%`, transform: "translate(-50%, -50%)" }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 1.2 + i * 0.35, ease: [0.2, 0.8, 0.2, 1.3] }}
        >
          <motion.div
            className="w-7 h-7 rounded-full flex items-center justify-center bg-navy/80 border border-white/15 shrink-0"
            animate={{
              boxShadow: [
                "0 0 0 0 rgba(166,64,42,0)",
                "0 0 0 5px rgba(166,64,42,0.14)",
                "0 0 0 0 rgba(166,64,42,0)",
              ],
            }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: 1.6 + i * 0.35 }}
          >
            <s.Icon size={13} className="text-mist" />
          </motion.div>
          <span className="text-[10px] uppercase tracking-wide text-mist/60 whitespace-nowrap hidden lg:block">
            {s.label}
          </span>
        </motion.div>
      ))}
    </div>
  );
}
