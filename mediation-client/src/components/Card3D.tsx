import { useRef, useState, type ReactNode } from "react";
import { motion } from "framer-motion";

// A glass card with two coupled cursor effects: a 3D tilt driven by mouse
// position relative to the card's bounds, and a radial spotlight that
// follows the cursor via a CSS custom property (cheaper than re-rendering
// a gradient on every mousemove — the browser just repaints the background).
export default function Card3D({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [spot, setSpot] = useState({ x: 50, y: 50 });
  const [hovering, setHovering] = useState(false);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;

    setTilt({ x: (py - 0.5) * -14, y: (px - 0.5) * 14 });
    setSpot({ x: px * 100, y: py * 100 });
  };

  return (
    <motion.div
      ref={ref}
      className={`gpu-layer relative rounded-2xl glass-panel overflow-hidden ${className}`}
      style={{
        transformPerspective: 900,
        // @ts-expect-error -- CSS custom property, not a typed style key
        "--spot-x": `${spot.x}%`,
        "--spot-y": `${spot.y}%`,
      }}
      animate={{ rotateX: tilt.x, rotateY: tilt.y, scale: hovering ? 1.02 : 1 }}
      transition={{ type: "spring", stiffness: 180, damping: 18, mass: 0.6 }}
      onMouseMove={handleMove}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => {
        setHovering(false);
        setTilt({ x: 0, y: 0 });
      }}
    >
      {/* cursor-following spotlight glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300"
        style={{
          opacity: hovering ? 1 : 0,
          background:
            "radial-gradient(360px circle at var(--spot-x) var(--spot-y), rgba(201,162,75,0.16), transparent 60%)",
        }}
      />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
