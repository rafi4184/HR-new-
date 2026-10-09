import { motion, useScroll, useSpring } from "framer-motion";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[3px] z-50 origin-left bg-gradient-to-r from-gold via-[#5AD1A8] to-gold-deep"
      style={{ scaleX }}
    />
  );
}
