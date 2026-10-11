import Link from "next/link";
import { getContacts } from "@/lib/data";

export default async function Footer() {
  const contacts = await getContacts();
  const primary = contacts[0];

  return (
    <footer className="mt-24 bg-navy-deep text-white/80">
      <div className="container-page grid gap-10 py-14 md:grid-cols-3">
        <div>
          <p className="font-display text-xl text-white">HR — The Mediator</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed">
            Your trusted concierge and liaison desk in Bangladesh.
          </p>
        </div>
        <div className="text-sm">
          <p className="mb-3 font-medium text-white">Explore</p>
          <ul className="space-y-2">
            <li><Link href="/services" className="hover:text-white">Services</Link></li>
            <li><Link href="/events" className="hover:text-white">Events</Link></li>
            <li><Link href="/request" className="hover:text-white">Make a request</Link></li>
            <li><Link href="/track" className="hover:text-white">Track a request</Link></li>
          </ul>
        </div>
        <div className="text-sm">
          <p className="mb-3 font-medium text-white">Get in touch</p>
          {primary ? (
            <ul className="space-y-2">
              {primary.phone && <li><a href={`tel:${primary.phone}`} className="hover:text-white">{primary.phone}</a></li>}
              {primary.email && <li><a href={`mailto:${primary.email}`} className="hover:text-white">{primary.email}</a></li>}
              {primary.address && <li>{primary.address}</li>}
            </ul>
          ) : (
            <Link href="/contact" className="hover:text-white">Contact page →</Link>
          )}
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="container-page py-5 text-xs text-white/50">
          © {new Date().getFullYear()} HR — The Mediator. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
