import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ServiceScene, { type SceneKind } from "./ServiceScene";

// Video-ready background: renders a real <video> when `video` resolves
// (onError swaps it out); otherwise falls back to a fully original,
// hand-drawn SVG scene (ServiceScene) — never a stock photo. Drop a real
// MP4 in later and it takes over automatically with no other changes.
//
// `premium` adds a slow continuous Ken Burns drift + a diagonal light
// sweep on top of the scene — reserved for the hero, where the extra
// motion reads as cinematic rather than distracting a scroll-pinned
// chapter. Skipped entirely under prefers-reduced-motion.
export default function CinematicBackground({
  video,
  scene,
  premium = false,
}: {
  video?: string;
  scene: SceneKind;
  premium?: boolean;
}) {
  const [videoFailed, setVideoFailed] = useState(false);
  const reduceMotion = useMemo(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  const kenBurns =
    premium && !reduceMotion
      ? { scale: [1, 1.08, 1], transition: { duration: 22, repeat: Infinity, ease: "easeInOut" as const } }
      : {};

  if (video && !videoFailed) {
    return (
      <motion.div className="absolute inset-0 overflow-hidden" animate={kenBurns}>
        <video
          key={video}
          className="absolute inset-0 w-full h-full object-cover"
          src={video}
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          onError={() => setVideoFailed(true)}
        />
      </motion.div>
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden">
      <AnimatePresence>
        <motion.div
          key={scene}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: premium ? 1.04 : 1 }}
          animate={{ opacity: 1, scale: 1, ...kenBurns }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <ServiceScene kind={scene} />
        </motion.div>
      </AnimatePresence>
      {premium && !reduceMotion && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent -skew-x-12 animate-shimmerSweep" />
        </div>
      )}
    </div>
  );
}
