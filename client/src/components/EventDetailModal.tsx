import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CalendarDays, MapPin } from "lucide-react";
import EventMediaCarousel from "./EventMediaCarousel";
import type { EventItem } from "../types";

function formatDate(iso: string | null) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

// Full-detail popup for a single event/course — opened by clicking an event
// card's title/body (as opposed to clicking its photo, which opens
// EventLightbox for full-screen browsing). Gives the complete picture —
// date, location, full description, pricing, whatever's in the text — in
// place, without a page navigation.
export default function EventDetailModal({
  event,
  onClose,
  onExpandPhoto,
}: {
  event: EventItem | null;
  onClose: () => void;
  onExpandPhoto: (index: number) => void;
}) {
  useEffect(() => {
    if (!event) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [event, onClose]);

  return (
    <AnimatePresence>
      {event && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[55] flex items-center justify-center p-4 bg-navy/60"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.32, ease: [0.2, 0.9, 0.3, 1.3] }}
            className="w-full max-w-2xl max-h-[88vh] overflow-y-auto rounded-2xl bg-white shadow-card-hover"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <EventMediaCarousel media={event.media} title={event.title} className="rounded-t-2xl" onExpand={onExpandPhoto} />
              <button
                onClick={onClose}
                aria-label="Close"
                className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 hover:bg-white hover:scale-110 active:scale-95 text-navy flex items-center justify-center shadow-card transition-all"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-6 md:p-8">
              <h2 className="font-display text-2xl text-navy mb-3" style={{ textWrap: "balance" }}>
                {event.title}
              </h2>
              {(event.eventDate || event.location) && (
                <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-[13px] mb-4 text-ink-faint">
                  {event.eventDate && (
                    <span className="flex items-center gap-1.5">
                      <CalendarDays size={14} /> {formatDate(event.eventDate)}
                    </span>
                  )}
                  {event.location && (
                    <span className="flex items-center gap-1.5">
                      <MapPin size={14} /> {event.location}
                    </span>
                  )}
                </div>
              )}
              {event.description && (
                <p className="text-[15px] text-ink-soft leading-relaxed whitespace-pre-line">{event.description}</p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
