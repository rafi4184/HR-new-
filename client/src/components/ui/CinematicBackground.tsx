import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ServiceScene, { type SceneKind } from "./ServiceScene";

// Video-ready background: renders a real <video> when `video` resolves
// (onError swaps it out); otherwise falls back to a fully original,
// hand-drawn SVG scene (ServiceScene) — never a stock photo. Drop a real
// MP4 in later and it takes over automatically with no other changes.
export default function CinematicBackground({ video, scene }: { video?: string; scene: SceneKind }) {
  const [videoFailed, setVideoFailed] = useState(false);

  if (video && !videoFailed) {
    return (
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
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        key={scene}
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1 }}
      >
        <ServiceScene kind={scene} />
      </motion.div>
    </AnimatePresence>
  );
}
