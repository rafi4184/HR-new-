import type { Metadata } from "next";
import EventCard from "@/components/EventCard";
import PageHeader from "@/components/PageHeader";
import { getEvents, isUpcoming } from "@/lib/data";

export const metadata: Metadata = { title: "Events" };

export default async function EventsPage() {
  const events = await getEvents();
  const upcoming = events.filter((e) => isUpcoming(e));
  const past = events.filter((e) => !isUpcoming(e));

  return (
    <>
      <PageHeader eyebrow="News & gatherings" title="Events" intro="Summits, awards, courses and consultation sessions we've hosted or joined." />
      <div className="container-page py-16">
        {events.length === 0 && <p className="text-muted">No events to show right now — check back soon.</p>}
        {upcoming.length > 0 && (
          <section>
            <h2 className="font-display text-2xl text-navy">Upcoming</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {upcoming.map((e) => <EventCard key={e.id} event={e} upcoming />)}
            </div>
          </section>
        )}
        {past.length > 0 && (
          <section className={upcoming.length ? "mt-16" : ""}>
            <h2 className="font-display text-2xl text-navy">Past events</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {past.map((e) => <EventCard key={e.id} event={e} />)}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
