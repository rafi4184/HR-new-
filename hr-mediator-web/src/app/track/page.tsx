import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import TrackForm from "@/components/TrackForm";

export const metadata: Metadata = { title: "Track a request" };

export default function TrackPage() {
  return (
    <>
      <PageHeader eyebrow="Your ticket" title="Track a request" intro="Enter the ticket number you received, with the name and date of birth you used." />
      <section className="container-page max-w-4xl py-12">
        <TrackForm />
      </section>
    </>
  );
}
