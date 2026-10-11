import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { getContacts } from "@/lib/data";

export const metadata: Metadata = { title: "Contact" };

export default async function ContactPage() {
  const contacts = await getContacts();
  return (
    <>
      <PageHeader eyebrow="Get in touch" title="Contact" intro="Call, email, or message us on WhatsApp — or send a request online and we'll reach out." />
      <section className="container-page py-16">
        {contacts.length === 0 ? (
          <p className="text-muted">
            Contact details are loading slowly — please <Link href="/request" className="text-navy underline">send a request</Link> and we'll reach out.
          </p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {contacts.map((c) => (
              <div key={c.id} className="rounded-2xl border border-line bg-white p-6">
                <h2 className="font-display text-xl text-navy">{c.label}</h2>
                <dl className="mt-4 space-y-3 text-sm">
                  {c.phone && <Row label="Phone"><a href={`tel:${c.phone}`} className="hover:text-navy">{c.phone}</a></Row>}
                  {c.whatsapp && (
                    <Row label="WhatsApp">
                      <a href={`https://wa.me/${c.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="hover:text-navy">{c.whatsapp}</a>
                    </Row>
                  )}
                  {c.email && <Row label="Email"><a href={`mailto:${c.email}`} className="break-all hover:text-navy">{c.email}</a></Row>}
                  {c.address && <Row label="Address">{c.address}</Row>}
                </dl>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wider text-muted">{label}</dt>
      <dd className="mt-0.5 text-ink">{children}</dd>
    </div>
  );
}
