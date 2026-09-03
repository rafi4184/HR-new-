import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

// Video-ready cinematic background: renders a real <video> when `video`
// resolves (onError swaps it out), otherwise crossfades slowly through
// `images` with a Ken Burns drift. Same visual language everywhere a
// service needs a full-bleed atmosphere, so a real MP4 can replace the
// image set later with zero changes elsewhere.
export default function CinematicBackground({
  video,
  poster,
  images,
  active = true,
}: {
  video?: string;
  poster?: string;
  images: string[];
  active?: boolean;
}) {
  const [videoFailed, setVideoFailed] = useState(false);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (!active || (video && !videoFailed)) return;
    const iv = setInterval(() => setIdx((i) => (i + 1) % images.length), 6000);
    return () => clearInterval(iv);
  }, [active, video, videoFailed, images.length]);

  if (video && !videoFailed) {
    return (
      <video
        key={video}
        className="absolute inset-0 w-full h-full object-cover"
        src={video}
        poster={poster}
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
    <div className="absolute inset-0 overflow-hidden">
      <AnimatePresence>
        <motion.div
          key={idx}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${images[idx]})` }}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1.16 }}
          exit={{ opacity: 0 }}
          transition={{
            opacity: { duration: 1.4, ease: "easeInOut" },
            scale: { duration: 6.4, ease: "linear" },
          }}
        />
      </AnimatePresence>
    </div>
  );
}
