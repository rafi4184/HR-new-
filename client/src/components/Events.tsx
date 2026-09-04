import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays, MapPin } from "lucide-react";
import Reveal from "./ui/Reveal";
import { listEvents } from "../lib/api";
import type { EventItem } from "../types";

function formatDate(iso: string | null) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export default function Events() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    listEvents()
      .then((rows) => {
        setEvents(rows);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  if (loaded && events.length === 0) return null;

  return (
    <section id="events" className="px-5 md:px-10 py-16 max-w-6xl mx-auto">
      <Reveal>
        <div className="text-[12px] font-medium mb-2 text-gold-deep uppercase tracking-wide">On the ground</div>
        <h2 className="font-display text-3xl mb-10 text-navy">Recent Events</h2>
      </Reveal>

      {!loaded ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[0, 1, 2].map((i) => (
            <div key={i} className="shimmer rounded-xl h-56 animate-shimmer" />
          ))}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {events.map((ev, i) => {
            const cover = ev.media[0];
            return (
              <motion.div
                key={ev.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: Math.min(i, 6) * 0.06 }}
                whileHover={{ y: -3 }}
                className="rounded-xl overflow-hidden border border-border bg-white shadow-card"
              >
                <div className="aspect-[16/10] bg-navy/10 overflow-hidden">
                  {cover?.mediaType === "image" && <img src={cover.url} alt={ev.title} className="w-full h-full object-cover" />}
                  {cover?.mediaType === "video" && (
                    <video src={cover.url} className="w-full h-full object-cover" muted loop playsInline autoPlay />
                  )}
                </div>
                <div className="p-4">
                  <div className="font-display text-lg mb-1.5">{ev.title}</div>
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
                  {ev.description && <p className="text-[13px] text-ink-soft leading-relaxed">{ev.description}</p>}
                  {ev.media.length > 1 && (
                    <div className="flex gap-1.5 mt-3">
                      {ev.media.slice(1, 5).map((m) => (
                        <div key={m.id} className="w-10 h-10 rounded-md overflow-hidden border border-border">
                          {m.mediaType === "image" ? (
                            <img src={m.url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <video src={m.url} className="w-full h-full object-cover" muted />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </section>
  );
}
