import { motion } from "framer-motion";

export type SceneKind = "airport" | "hotel" | "government" | "manpower";

// Fully original, hand-drawn SVG scenes — no stock photography anywhere.
// Built after a real stock photo (an Unsplash "government" search result)
// turned out to show a recognizable public figure on the live site. Rather
// than gamble on more unverified photo IDs, every service background is
// now a graphic this codebase fully controls: guaranteed no faces, no
// copyright exposure, ever.
export default function ServiceScene({ kind }: { kind: SceneKind }) {
  return (
    <div className="absolute inset-0 overflow-hidden bg-navy">
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(120% 100% at 18% 15%, rgba(166,64,42,0.18), transparent 60%)" }}
      />
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(90% 70% at 85% 90%, rgba(217,164,65,0.12), transparent 65%)" }}
      />
      {kind === "airport" && <AirportScene />}
      {kind === "hotel" && <HotelScene />}
      {kind === "government" && <GovernmentScene />}
      {kind === "manpower" && <ManpowerScene />}
    </div>
  );
}

function AirportScene() {
  return (
    <svg viewBox="0 0 400 300" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
      <path d="M-20 220 Q120 180, 220 140 T 440 60" stroke="rgba(243,238,223,0.14)" strokeWidth="1" fill="none" />
      <motion.path
        d="M-20 220 Q120 180, 220 140 T 440 60"
        stroke="#D9A441"
        strokeWidth="1.4"
        strokeDasharray="4 6"
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 2.6, ease: [0.2, 0.8, 0.2, 1] }}
      />
      <motion.circle
        r="3"
        fill="#A6402A"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 1, 0] }}
        transition={{ duration: 5, repeat: Infinity, repeatDelay: 1, times: [0, 0.05, 0.9, 1] }}
      >
        <animateMotion dur="5s" repeatCount="indefinite" path="M-20 220 Q120 180, 220 140 T 440 60" />
      </motion.circle>
      {[70, 160, 250, 330].map((x, i) => (
        <motion.rect
          key={x}
          x={x}
          y={230}
          width="14"
          height={40 + (i % 2) * 20}
          fill="rgba(243,238,223,0.06)"
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          style={{ transformOrigin: "bottom" }}
          transition={{ duration: 0.8, delay: i * 0.1 }}
        />
      ))}
    </svg>
  );
}

function HotelScene() {
  const windows = Array.from({ length: 30 }, (_, i) => i);
  return (
    <svg viewBox="0 0 400 300" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
      <rect x="140" y="40" width="140" height="260" fill="rgba(243,238,223,0.05)" />
      {windows.map((i) => {
        const col = i % 5;
        const row = Math.floor(i / 5);
        return (
          <motion.rect
            key={i}
            x={155 + col * 24}
            y={60 + row * 38}
            width="14"
            height="20"
            fill="#D9A441"
            initial={{ opacity: 0.05 }}
            animate={{ opacity: [0.05, 0.35, 0.05] }}
            transition={{ duration: 4, repeat: Infinity, delay: (i % 7) * 0.4, ease: "easeInOut" }}
          />
        );
      })}
      <motion.path
        d="M-20 280 L420 280"
        stroke="rgba(243,238,223,0.1)"
        strokeWidth="1"
      />
      <motion.circle
        r="2.5"
        fill="#A6402A"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 1, 0] }}
        transition={{ duration: 4, repeat: Infinity, repeatDelay: 0.6 }}
      >
        <animateMotion dur="4s" repeatCount="indefinite" path="M-20 280 L420 280" />
      </motion.circle>
    </svg>
  );
}

function GovernmentScene() {
  const columns = [90, 130, 170, 210, 250, 290];
  return (
    <svg viewBox="0 0 400 300" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
      <motion.path
        d="M70 140 L200 70 L330 140 Z"
        fill="rgba(243,238,223,0.06)"
        initial={{ opacity: 0, y: -10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      />
      {columns.map((x, i) => (
        <motion.rect
          key={x}
          x={x}
          y={140}
          width="12"
          height="140"
          fill="rgba(243,238,223,0.07)"
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          style={{ transformOrigin: "top" }}
          transition={{ duration: 0.6, delay: 0.2 + i * 0.06 }}
        />
      ))}
      <rect x="60" y="278" width="280" height="8" fill="rgba(243,238,223,0.08)" />
      {[100, 160, 220, 280].map((y, i) => (
        <motion.line
          key={y}
          x1="180"
          y1={y}
          x2="360"
          y2={y}
          stroke="#D9A441"
          strokeWidth="1"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.4 }}
          transition={{ duration: 1, delay: 1 + i * 0.15 }}
        />
      ))}
    </svg>
  );
}

function ManpowerScene() {
  const nodes = [
    [90, 90], [180, 70], [270, 100], [330, 170], [250, 220], [140, 210], [70, 160],
  ];
  return (
    <svg viewBox="0 0 400 300" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
      {nodes.map(([x, y], i) => {
        const [nx, ny] = nodes[(i + 1) % nodes.length];
        return (
          <motion.line
            key={`l${i}`}
            x1={x}
            y1={y}
            x2={nx}
            y2={ny}
            stroke="rgba(243,238,223,0.12)"
            strokeWidth="1"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: i * 0.1 }}
          />
        );
      })}
      {nodes.map(([x, y], i) => (
        <motion.circle
          key={`n${i}`}
          cx={x}
          cy={y}
          r="4"
          fill="#A6402A"
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.6 + i * 0.08 }}
        />
      ))}
      <motion.circle
        cx="200"
        cy="150"
        r="30"
        fill="none"
        stroke="#D9A441"
        strokeWidth="1"
        initial={{ opacity: 0 }}
        animate={{ scale: [1, 1.6], opacity: [0.5, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
      />
    </svg>
  );
}
