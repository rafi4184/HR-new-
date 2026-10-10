import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Expand } from "lucide-react";
import type { EventItem } from "../types";

const SLIDE_DURATION_MS = 3500;

// Auto-advancing photo/video carousel for an event card — replaces a single
// cover image with tiny thumbnails underneath. Every photo gets equal
// billing and the card cycles through them on its own; hovering pauses it
// so visitors can read a caption-like moment without it jumping away.
// Clicking the image opens it full-size via the onExpand callback (an
// EventLightbox), landing on whichever photo was showing.
export default function EventMediaCarousel({
  media,
  title,
  className = "",
  onExpand,
}: {
  media: EventItem["media"];
  title: string;
  className?: string;
  onExpand?: (index: number) => void;
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (media.length <= 1 || paused) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % media.length);
    }, SLIDE_DURATION_MS);
    return () => clearInterval(timer);
  }, [media.length, paused]);

  const current = media[index];
  if (!current) {
    return <div className={`aspect-[16/10] bg-navy/10 ${className}`} />;
  }

  return (
    <div
      className={`relative aspect-[16/10] bg-navy/10 overflow-hidden group/carousel ${onExpand ? "cursor-zoom-in" : ""} ${className}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onClick={() => onExpand?.(index)}
      role={onExpand ? "button" : undefined}
      aria-label={onExpand ? `View ${title} photos full size` : undefined}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          {current.mediaType === "image" ? (
            <img src={current.url} alt={title} className="w-full h-full object-cover" />
          ) : (
            <video src={current.url} className="w-full h-full object-cover" muted loop playsInline autoPlay />
          )}
        </motion.div>
      </AnimatePresence>

      {onExpand && (
        <div className="absolute inset-0 bg-navy/0 group-hover/carousel:bg-navy/20 transition-colors flex items-center justify-center">
          <div className="opacity-0 group-hover/carousel:opacity-100 transition-opacity w-10 h-10 rounded-full bg-white/90 flex items-center justify-center text-navy">
            <Expand size={16} />
          </div>
        </div>
      )}

      {media.length > 1 && (
        <div className="absolute bottom-3 inset-x-0 flex items-center justify-center gap-1.5 z-10">
          {media.map((m, i) => (
            <button
              key={m.id}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIndex(i);
              }}
              aria-label={`Show photo ${i + 1} of ${media.length}`}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-5 bg-white" : "w-1.5 bg-white/60 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
