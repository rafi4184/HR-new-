import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import RequestForm from "@/components/RequestForm";
import type { RequestType } from "@/lib/types";

export const metadata: Metadata = { title: "Make a request" };

const TYPES: RequestType[] = ["airport", "hotel", "government", "program"];

export default async function RequestPage({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
  const { type } = await searchParams;
  const initialType = TYPES.includes(type as RequestType) ? (type as RequestType) : "airport";
  return (
    <>
      <PageHeader eyebrow="Start here" title="Make a request" intro="Takes about two minutes. You'll get a ticket number to track it." />
      <section className="container-page max-w-3xl py-12">
        <RequestForm initialType={initialType} />
      </section>
    </>
  );
}
