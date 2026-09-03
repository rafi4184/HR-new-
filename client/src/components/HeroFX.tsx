import { motion } from "framer-motion";

// A layered, animated "3D" backdrop for the hero — floating rings on
// independent orbits plus a drifting particle field, built entirely from
// CSS 3D transforms and Framer Motion (no external video/image assets to
// fetch, so it never breaks on a slow connection or a blocked CDN).
const RINGS = [
  { size: 340, top: "-8%", left: "58%", duration: 26, tiltX: 62, tiltZ: -18, border: "rgba(212,175,80,0.28)" },
  { size: 220, top: "38%", left: "82%", duration: 34, tiltX: 70, tiltZ: 24, border: "rgba(166,64,42,0.3)" },
  { size: 460, top: "50%", left: "8%", duration: 46, tiltX: 66, tiltZ: 8, border: "rgba(107,163,131,0.22)" },
];

const PARTICLES = Array.from({ length: 22 }, (_, i) => ({
  id: i,
  left: (i * 37) % 100,
  top: (i * 53) % 100,
  size: 2 + (i % 3),
  delay: (i % 7) * 0.6,
  duration: 6 + (i % 5),
}));

export default function HeroFX() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ perspective: 1200 }} aria-hidden="true">
      {RINGS.map((r, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: r.size,
            height: r.size,
            top: r.top,
            left: r.left,
            border: `1px solid ${r.border}`,
            transformStyle: "preserve-3d",
          }}
          initial={{ rotateX: r.tiltX, rotateZ: r.tiltZ, rotateY: 0, opacity: 0 }}
          animate={{ rotateY: 360, opacity: 1 }}
          transition={{
            rotateY: { duration: r.duration, repeat: Infinity, ease: "linear" },
            opacity: { duration: 1.4 },
          }}
        />
      ))}

      {PARTICLES.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            backgroundColor: "rgba(243,238,223,0.55)",
          }}
          animate={{ y: [0, -18, 0], opacity: [0.15, 0.65, 0.15] }}
          transition={{ duration: p.duration, repeat: Infinity, ease: "easeInOut", delay: p.delay }}
        />
      ))}
    </div>
  );
}
