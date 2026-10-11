import Image from "next/image";
import { formatDate } from "@/lib/data";
import type { EventItem } from "@/lib/types";

export default function EventCard({ event, upcoming }: { event: EventItem; upcoming?: boolean }) {
  const cover = event.media.find((m) => m.mediaType === "image");
  return (
    <article id={`event-${event.id}`} className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-white">
      <div className="relative aspect-[4/3] bg-gold-pale">
        {cover ? (
          <Image
            src={cover.url}
            alt={event.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-contain"
          />
        ) : (
          <div className="flex h-full items-center justify-center font-display text-3xl text-gold-deep/50">HR</div>
        )}
        {upcoming && (
          <span className="absolute left-3 top-3 rounded-full bg-gold px-2.5 py-1 text-xs font-medium text-navy-deep">
            Upcoming
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs text-muted">
          {[formatDate(event.eventDate), event.location].filter(Boolean).join(" · ")}
        </p>
        <h3 className="mt-1.5 font-display text-lg leading-snug text-navy">{event.title}</h3>
        {event.description && (
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">{event.description}</p>
        )}
      </div>
    </article>
  );
}
