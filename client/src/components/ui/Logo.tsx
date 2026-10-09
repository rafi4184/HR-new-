import { motion } from "framer-motion";

// Brand mark: blue-to-green gradient handshake-in-circle icon (fixed
// brand colors, not theme-reactive via currentColor). Works from a
// 320px header badge down to a 16px favicon context.
export default function LogoMark({
  size = 36,
  className = "",
  animated = false,
}: {
  size?: number;
  className?: string;
  animated?: boolean;
}) {
  const img = (
    <img
      src="/logo-icon.png"
      width={size}
      height={size}
      alt="HR — The Mediator"
      className={className}
      style={{ width: size, height: size, objectFit: "contain" }}
      draggable={false}
    />
  );

  if (!animated) return img;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
      style={{ width: size, height: size, display: "inline-block" }}
    >
      {img}
    </motion.div>
  );
}
