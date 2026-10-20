import { motion } from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";

export default function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  // Belt-and-suspenders: whileInView depends on IntersectionObserver firing
  // a clean "it's visible" callback. On a phone that's usually reliable,
  // but a late-loading web font reflowing the page, or an odd in-app
  // browser (Facebook/WhatsApp webviews are how a lot of visitors here
  // actually arrive), can occasionally mean it never fires — which would
  // strand content at opacity: 0 forever with nothing to explain why the
  // page looks blank. A short forced-visible timeout makes that failure
  // mode impossible: worst case the fade-in is skipped, content is never
  // missing.
  const [forceVisible, setForceVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setForceVisible(true), 1200);
    return () => clearTimeout(t);
  }, []);

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      animate={forceVisible ? { opacity: 1, y: 0, scale: 1 } : undefined}
      viewport={{ once: true, amount: 0, margin: "200px 0px 200px 0px" }}
      transition={{ duration: 0.65, delay, ease: [0.2, 0.9, 0.3, 1.3] }}
    >
      {children}
    </motion.div>
  );
}
