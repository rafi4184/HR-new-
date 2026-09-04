import { useRef, useState, type ReactNode, type MouseEvent as ReactMouseEvent } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const MotionLink = motion.create(Link);
const MotionButton = motion.create("button");

export default function MagneticButton({
  children,
  onClick,
  className = "",
  strength = 0.25,
  as = "button",
  to = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  strength?: number;
  as?: "button" | "link";
  to?: string;
}) {
  const ref = useRef<HTMLButtonElement | HTMLAnchorElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleMove = (e: ReactMouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setPos({
      x: (e.clientX - (rect.left + rect.width / 2)) * strength,
      y: (e.clientY - (rect.top + rect.height / 2)) * strength,
    });
  };

  const shared = {
    onMouseMove: handleMove,
    onMouseLeave: () => setPos({ x: 0, y: 0 }),
    animate: { x: pos.x, y: pos.y },
    transition: { type: "spring" as const, stiffness: 150, damping: 12, mass: 0.4 },
    className,
  };

  if (as === "link") {
    return (
      <MotionLink ref={ref as never} to={to} {...shared}>
        {children}
      </MotionLink>
    );
  }

  return (
    <MotionButton ref={ref as never} onClick={onClick} {...shared}>
      {children}
    </MotionButton>
  );
}
