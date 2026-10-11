import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import ServiceCard from "@/components/ServiceCard";
import { SERVICES } from "@/lib/services";

export const metadata: Metadata = { title: "Services" };

export default function ServicesPage() {
  return (
    <>
      <PageHeader eyebrow="What we do" title="Services" intro="One desk for arrivals, stays, paperwork and your next step abroad." />
      <section className="container-page grid gap-5 py-16 sm:grid-cols-2 lg:grid-cols-3">
        {SERVICES.map((s, i) => <ServiceCard key={s.id} service={s} index={i} />)}
      </section>
    </>
  );
}
