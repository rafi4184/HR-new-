import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CalendarDays, MapPin, ArrowRight, Sparkles } from "lucide-react";
import Reveal from "./ui/Reveal";
import EventMediaCarousel from "./EventMediaCarousel";
import EventLightbox, { type LightboxState } from "./EventLightbox";
import EventDetailModal from "./EventDetailModal";
import { listEvents } from "../lib/api";
import type { EventItem } from "../types";
import { useDict } from "../lib/i18n";
import { events } from "../lib/translations";
import { isUpcoming } from "../lib/eventDate";

function formatDate(iso: string | null) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export default function Events() {
  const T = useDict({ eyebrow: events.eyebrow, h2: events.h2, viewAll: events.viewAll });
  const [items, setEvents] = useState<EventItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [lightbox, setLightbox] = useState<LightboxState | null>(null);
  const [detail, setDetail] = useState<EventItem | null>(null);

  useEffect(() => {
    listEvents()
      .then((rows) => {
        setEvents(rows);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  if (loaded && items.length === 0) return null;

  return (
    <section id="events" className="px-5 md:px-10 py-16 max-w-6xl mx-auto">
      <Reveal className="flex items-end justify-between flex-wrap gap-4 mb-10">
        <div>
          <div className="text-[12px] font-medium mb-2 text-gold-deep uppercase tracking-wide">{T.eyebrow}</div>
          <h2 className="font-display text-3xl text-navy">{T.h2}</h2>
        </div>
        <Link
          to="/events"
          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-gold-deep hover:gap-2.5 transition-all"
        >
          {T.viewAll} <ArrowRight size={14} />
        </Link>
      </Reveal>

      {!loaded ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[0, 1, 2].map((i) => (
            <div key={i} className="shimmer rounded-xl h-56 animate-shimmer" />
          ))}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((ev, i) => {
            const promo = isUpcoming(ev.eventDate);
            return (
            <motion.div
              key={ev.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: Math.min(i, 6) * 0.06 }}
              whileHover={{ y: -3 }}
              className={`relative rounded-xl overflow-hidden bg-white shadow-card hover:shadow-card-hover transition-shadow ${
                promo ? "border-2 border-gold ring-2 ring-gold/25" : "border border-border"
              }`}
            >
              {promo && (
                <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gold text-white text-[11px] font-semibold uppercase tracking-wide shadow-card">
                  <Sparkles size={11} /> Upcoming
                </div>
              )}
              <EventMediaCarousel
                media={ev.media}
                title={ev.title}
                onExpand={(index) => setLightbox({ media: ev.media, title: ev.title, index })}
              />
              <button
                type="button"
                onClick={() => setDetail(ev)}
                className="block w-full text-left p-4 hover:bg-paper-soft transition-colors"
              >
                <div className="font-display text-lg mb-1.5 text-navy">{ev.title}</div>
                <div className="flex flex-wrap gap-x-3 gap-y-1 text-[12px] mb-2 text-ink-faint">
                  {ev.eventDate && (
                    <span className="flex items-center gap-1">
                      <CalendarDays size={12} /> {formatDate(ev.eventDate)}
                    </span>
                  )}
                  {ev.location && (
                    <span className="flex items-center gap-1">
                      <MapPin size={12} /> {ev.location}
                    </span>
                  )}
                </div>
                {ev.description && <p className="text-[13px] text-ink-soft leading-relaxed line-clamp-3">{ev.description}</p>}
              </button>
            </motion.div>
            );
          })}
        </div>
      )}

      <EventDetailModal
        event={detail}
        onClose={() => setDetail(null)}
        onExpandPhoto={(index) => detail && setLightbox({ media: detail.media, title: detail.title, index })}
      />
      <EventLightbox state={lightbox} onClose={() => setLightbox(null)} />
    </section>
  );
}
