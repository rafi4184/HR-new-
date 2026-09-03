import { useRef, useState, type ReactNode } from "react";
import { motion } from "framer-motion";

// Pulls itself toward the cursor within a small radius, then springs back on
// mouse-leave — signals interactivity before the click even happens.
export default function MagneticButton({
  children,
  onClick,
  className = "",
  strength = 0.3,
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setOffset({
      x: (e.clientX - (rect.left + rect.width / 2)) * strength,
      y: (e.clientY - (rect.top + rect.height / 2)) * strength,
    });
  };

  return (
    <motion.button
      ref={ref}
      onClick={onClick}
      onMouseMove={handleMove}
      onMouseLeave={() => setOffset({ x: 0, y: 0 })}
      animate={{ x: offset.x, y: offset.y }}
      transition={{ type: "spring", stiffness: 150, damping: 12, mass: 0.4 }}
      className={className}
    >
      {children}
    </motion.button>
  );
}
