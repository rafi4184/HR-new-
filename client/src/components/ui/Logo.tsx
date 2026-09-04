import { motion } from "framer-motion";

// Refined gateway arch — an evolution of the brand's original mark. A literal
// gateway/archway with a gold threshold line: reads as "access" for the
// concierge desk and "your gateway to Bangladesh" for the wider platform.
// Works from a 320px header badge down to a 16px favicon.
export default function LogoMark({
  size = 36,
  className = "",
  animated = false,
}: {
  size?: number;
  className?: string;
  animated?: boolean;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      className={className}
      role="img"
      aria-label="HR — The Mediator"
    >
      {animated ? (
        <motion.path
          d="M28 88 V52 A32 32 0 0 1 92 52 V88"
          fill="none"
          stroke="currentColor"
          strokeWidth="9"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
        />
      ) : (
        <path d="M28 88 V52 A32 32 0 0 1 92 52 V88" fill="none" stroke="currentColor" strokeWidth="9" strokeLinecap="round" />
      )}
      {animated ? (
        <motion.path
          d="M22 90 H98"
          stroke="#C9973B"
          strokeWidth="7"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.55, ease: [0.2, 0.9, 0.3, 1.3] }}
        />
      ) : (
        <path d="M22 90 H98" stroke="#C9973B" strokeWidth="7" strokeLinecap="round" />
      )}
    </svg>
  );
}
