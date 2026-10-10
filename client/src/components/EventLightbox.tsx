import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import type { EventItem } from "../types";

export interface LightboxState {
  media: EventItem["media"];
  title: string;
  index: number;
}

// Full-screen photo/video viewer: click any event photo to pop it open full
// size, step through the rest of that event's gallery with arrows or the
// keyboard, and close with Escape or the backdrop.
export default function EventLightbox({ state, onClose }: { state: LightboxState | null; onClose: () => void }) {
  const [index, setIndex] = useState(state?.index ?? 0);

  useEffect(() => {
    if (state) setIndex(state.index);
  }, [state]);

  const count = state?.media.length ?? 0;
  const next = () => setIndex((i) => (i + 1) % count);
  const prev = () => setIndex((i) => (i - 1 + count) % count);

  useEffect(() => {
    if (!state) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" && count > 1) next();
      if (e.key === "ArrowLeft" && count > 1) prev();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, count]);

  if (!state) return null;
  const current = state.media[index];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] bg-navy/95 flex items-center justify-center p-4 md:p-10"
        onClick={onClose}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 md:top-6 md:right-6 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-10"
        >
          <X size={20} />
        </button>

        {count > 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            aria-label="Previous photo"
            className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-10"
          >
            <ChevronLeft size={22} />
          </button>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.25 }}
            className="max-w-5xl w-full max-h-full flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {current.mediaType === "image" ? (
              <img src={current.url} alt={state.title} className="max-w-full max-h-[78vh] rounded-lg object-contain" />
            ) : (
              <video src={current.url} className="max-w-full max-h-[78vh] rounded-lg" controls autoPlay />
            )}
            <div className="mt-4 text-center text-white/90">
              <div className="font-display text-lg">{state.title}</div>
              {count > 1 && (
                <div className="text-[12px] text-white/60 mt-1">
                  {index + 1} / {count}
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {count > 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            aria-label="Next photo"
            className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-10"
          >
            <ChevronRight size={22} />
          </button>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
