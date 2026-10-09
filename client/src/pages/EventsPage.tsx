import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CalendarDays, MapPin, Mic, Landmark, ArrowRight, Sparkles, ShieldCheck, LogOut } from "lucide-react";
import { useSeo } from "../lib/useSeo";
import Reveal from "../components/ui/Reveal";
import AmbientGlow from "../components/ui/AmbientGlow";
import EventsManager from "../components/EventsManager";
import { listEvents, whoami, staffLogout } from "../lib/api";
import type { EventItem, WhoAmI } from "../types";
import { useDict } from "../lib/i18n";
import { eventsPageT } from "../lib/translations";

function formatDate(iso: string | null) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export default function EventsPage({ onToast }: { onToast: (msg: string) => void }) {
  useSeo({
    title: "Events & Success Stories | Media Training & Government Relations | HR — The Mediator",
    description:
      "Seminars from our media and public-speaking academy and updates from our government-relations casework — events, workshops and success stories from HR — The Mediator in Bangladesh.",
    path: "/events",
  });

  const T = useDict(eventsPageT);
  const [items, setEvents] = useState<EventItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [me, setMe] = useState<WhoAmI | null>(null);

  useEffect(() => {
    listEvents()
      .then((rows) => {
        setEvents(rows);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
    whoami()
      .then(setMe)
      .catch(() => setMe(null));
  }, []);

  const refreshPublic = () => {
    void listEvents().then(setEvents).catch(() => {});
  };

  const canManage = !!me && (me.role === "staff" || me.isAdmin);

  return (
    <div>
      {canManage && (
        <section className="px-5 md:px-10 pt-10 pb-2 max-w-6xl mx-auto">
          <div className="rounded-xl border border-border bg-paper-panel p-5">
            <div className="flex items-center justify-between gap-3 flex-wrap mb-1">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-navy" />
                <h2 className="font-display text-lg text-navy">Staff: manage events</h2>
              </div>
              <button
                onClick={() =>
                  void staffLogout().then(() => {
                    setMe(null);
                    onToast("Signed out.");
                  })
                }
                className="flex items-center gap-1.5 text-[12px] font-medium px-3 py-1.5 rounded-full border border-border-strong text-ink-faint hover:text-ink hover:border-ink-faint transition-colors"
              >
                <LogOut size={12} /> Sign out
              </button>
            </div>
            <p className="text-[13px] mb-4 text-ink-faint">
              Signed in as {me?.staffId}. Add, edit, upload photos/video, or delete events below — changes go live on this page immediately.
            </p>
            <EventsManager
              onToast={(msg) => {
                onToast(msg);
                refreshPublic();
              }}
            />
          </div>
        </section>
      )}

      <section className="relative px-5 md:px-10 py-14 md:py-20 bg-paper-soft overflow-hidden text-center">
        <AmbientGlow variant="light" />
        <div className="relative max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-4 text-[12px] tracking-[0.2em] uppercase text-gold-deep font-medium">
            <Mic size={14} />
            {T.eyebrow}
            <Landmark size={14} />
          </div>
          <h1 className="font-display text-3xl md:text-5xl text-navy mb-5">{T.h1}</h1>
          <p className="text-[15.5px] md:text-[17px] text-ink-muted leading-relaxed">{T.intro}</p>
        </div>
      </section>

      <section className="px-5 md:px-10 py-14 md:py-20 max-w-6xl mx-auto">
        {!loaded ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[0, 1, 2].map((i) => (
              <div key={i} className="shimmer rounded-xl h-64 animate-shimmer" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <Reveal className="max-w-md mx-auto text-center py-10">
            <div className="w-14 h-14 rounded-2xl bg-gold-pale flex items-center justify-center text-gold-deep mx-auto mb-5">
              <Sparkles size={24} />
            </div>
            <h2 className="font-display text-xl text-navy mb-3">{T.emptyTitle}</h2>
            <p className="text-[14px] text-ink-muted leading-relaxed">{T.emptyBody}</p>
          </Reveal>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((ev, i) => {
              const cover = ev.media[0];
              return (
                <motion.div
                  key={ev.id}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.55, delay: Math.min(i, 8) * 0.06 }}
                  whileHover={{ y: -4 }}
                  className="rounded-2xl overflow-hidden border border-border bg-white shadow-card hover:shadow-card-hover transition-shadow"
                >
                  <div className="aspect-[16/10] bg-navy/10 overflow-hidden">
                    {cover?.mediaType === "image" && (
                      <img src={cover.url} alt={ev.title} className="w-full h-full object-cover" />
                    )}
                    {cover?.mediaType === "video" && (
                      <video src={cover.url} className="w-full h-full object-cover" muted loop playsInline autoPlay />
                    )}
                  </div>
                  <div className="p-5">
                    <div className="font-display text-lg mb-1.5 text-navy">{ev.title}</div>
                    <div className="flex flex-wrap gap-x-3 gap-y-1 text-[12px] mb-2.5 text-ink-faint">
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
                    {ev.description && <p className="text-[13.5px] text-ink-soft leading-relaxed">{ev.description}</p>}
                    {ev.media.length > 1 && (
                      <div className="flex gap-1.5 mt-3">
                        {ev.media.slice(1, 6).map((m) => (
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

      <section className="px-5 md:px-10 py-14 bg-paper-panel">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
          <Reveal className="rounded-2xl bg-white border border-border p-7">
            <div className="w-11 h-11 rounded-xl bg-gold-pale flex items-center justify-center text-gold-deep mb-4">
              <Mic size={20} />
            </div>
            <h3 className="font-display text-xl text-navy mb-2.5">{T.ctaMediaHeading}</h3>
            <p className="text-[13.5px] text-ink-muted leading-relaxed mb-5">{T.ctaMediaBody}</p>
            <Link
              to="/courses-careers"
              className="inline-flex items-center gap-1.5 text-[13px] font-medium text-gold-deep hover:gap-2.5 transition-all"
            >
              {T.ctaMediaButton} <ArrowRight size={14} />
            </Link>
          </Reveal>
          <Reveal delay={0.08} className="rounded-2xl bg-white border border-border p-7">
            <div className="w-11 h-11 rounded-xl bg-gold-pale flex items-center justify-center text-gold-deep mb-4">
              <Landmark size={20} />
            </div>
            <h3 className="font-display text-xl text-navy mb-2.5">{T.ctaGovHeading}</h3>
            <p className="text-[13.5px] text-ink-muted leading-relaxed mb-5">{T.ctaGovBody}</p>
            <Link
              to="/government-request"
              className="inline-flex items-center gap-1.5 text-[13px] font-medium text-gold-deep hover:gap-2.5 transition-all"
            >
              {T.ctaGovButton} <ArrowRight size={14} />
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
