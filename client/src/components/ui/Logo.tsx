import { motion } from "framer-motion";

// H·M bridge mark: two navy uprights (H) joined by a gold chevron (M) at
// mid-height — the chevron reads as both the second letter and the literal
// "bridge" connecting the two sides. Works from a 320px header badge down
// to a 16px favicon.
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
          d="M40 28 V92 M80 28 V92"
          fill="none"
          stroke="currentColor"
          strokeWidth="12"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
        />
      ) : (
        <path d="M40 28 V92 M80 28 V92" fill="none" stroke="currentColor" strokeWidth="12" strokeLinecap="round" />
      )}
      {animated ? (
        <motion.path
          d="M40 54 L60 70 L80 54"
          fill="none"
          stroke="#C9973B"
          strokeWidth="12"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.55, ease: [0.2, 0.9, 0.3, 1.3] }}
        />
      ) : (
        <path
          d="M40 54 L60 70 L80 54"
          fill="none"
          stroke="#C9973B"
          strokeWidth="12"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}
