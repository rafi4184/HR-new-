import { motion } from "framer-motion";

const TONES = {
  gold: "rgba(201,151,59,0.22)",
  goldSoft: "rgba(201,151,59,0.14)",
  navy: "rgba(15,37,64,0.35)",
} as const;

// Slow-drifting blurred blobs used to keep sections feeling "alive" without
// competing with foreground content — always continuous, never triggered by
// scroll/hover, so it reads as ambient background motion on every page.
export default function AmbientGlow({ variant = "light" }: { variant?: "light" | "dark" }) {
  const tone1 = variant === "dark" ? TONES.gold : TONES.gold;
  const tone2 = variant === "dark" ? TONES.goldSoft : TONES.navy;

  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute -top-20 -left-20 w-80 h-80 rounded-full blur-3xl"
        style={{ background: `radial-gradient(circle, ${tone1}, transparent 70%)` }}
        animate={{ x: [0, 26, 0], y: [0, 18, 0] }}
        transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-24 -right-16 w-96 h-96 rounded-full blur-3xl"
        style={{ background: `radial-gradient(circle, ${tone2}, transparent 70%)` }}
        animate={{ x: [0, -22, 0], y: [0, -14, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
