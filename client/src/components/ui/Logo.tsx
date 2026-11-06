import { motion } from "framer-motion";

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
      alt="ARK Property Solution"
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
