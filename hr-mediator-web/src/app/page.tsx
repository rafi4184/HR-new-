import Link from "next/link";
import EventCard from "@/components/EventCard";
import ServiceCard from "@/components/ServiceCard";
import { getEvents, isUpcoming } from "@/lib/data";
import { SERVICES } from "@/lib/services";

const STEPS = [
  { title: "Tell us what you need", body: "Send a request online in a couple of minutes — no account needed." },
  { title: "We review and confirm", body: "Our desk reviews every case and confirms the scope and any fee with you." },
  { title: "Track it to done", body: "Use your ticket number to follow progress until it's complete." },
];

export default async function HomePage() {
  const events = await getEvents();
  const upcoming = events.filter((e) => isUpcoming(e));
  const featured = (upcoming.length ? upcoming : events).slice(0, 3);

  return (
    <>
      <section className="border-b border-line bg-gradient-to-b from-gold-pale/60 to-paper">
        <div className="container-page py-20 sm:py-28">
          <p className="eyebrow">Concierge · Liaison · Careers</p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl leading-[1.1] text-navy sm:text-6xl">
            Everything you need in Bangladesh, handled by one trusted desk.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
            Airport VIP reception, hotels and cars, government paperwork, and study or work abroad — with a ticket you can
            track every step of the way.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/request" className="btn-primary px-6 py-3">Make a request</Link>
            <Link href="/track" className="btn-ghost px-6 py-3">Track a request</Link>
          </div>
        </div>
      </section>

      <section className="container-page py-20">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="eyebrow">What we do</p>
            <h2 className="mt-2 font-display text-3xl text-navy sm:text-4xl">Services</h2>
          </div>
          <Link href="/services" className="hidden text-sm font-medium text-navy hover:underline sm:block">All services →</Link>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.slice(0, 3).map((s, i) => <ServiceCard key={s.id} service={s} index={i} />)}
        </div>
      </section>

      <section className="border-y border-line bg-white">
        <div className="container-page grid gap-10 py-20 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <div key={s.title}>
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-navy font-display text-white">{i + 1}</span>
              <h3 className="mt-4 font-display text-xl text-navy">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {featured.length > 0 && (
        <section className="container-page py-20">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="eyebrow">{upcoming.length ? "Coming up" : "Recent"}</p>
              <h2 className="mt-2 font-display text-3xl text-navy sm:text-4xl">Events</h2>
            </div>
            <Link href="/events" className="text-sm font-medium text-navy hover:underline">All events →</Link>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((e) => <EventCard key={e.id} event={e} upcoming={isUpcoming(e)} />)}
          </div>
        </section>
      )}

      <section className="container-page">
        <div className="rounded-3xl bg-navy px-8 py-14 text-center sm:px-16">
          <h2 className="font-display text-3xl text-white sm:text-4xl">Ready when you are.</h2>
          <p className="mx-auto mt-3 max-w-md text-white/70">Send us your request and our desk will get back to you with next steps.</p>
          <Link href="/request" className="btn mt-8 bg-gold px-6 py-3 text-navy-deep hover:bg-gold-pale">Start a request</Link>
        </div>
      </section>
    </>
  );
}
