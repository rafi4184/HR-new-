import Link from "next/link";
import type { Service } from "@/lib/services";

export default function ServiceCard({ service, index }: { service: Service; index: number }) {
  return (
    <div className="flex flex-col rounded-2xl border border-line bg-white p-6">
      <span className="font-display text-sm text-gold-deep">{String(index + 1).padStart(2, "0")}</span>
      <h3 className="mt-3 font-display text-xl text-navy">{service.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{service.summary}</p>
      <ul className="mt-4 space-y-1.5 text-sm text-ink">
        {service.points.map((p) => (
          <li key={p} className="flex gap-2">
            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gold" />
            {p}
          </li>
        ))}
      </ul>
      <div className="mt-auto pt-6">
        <Link
          href={service.requestType ? `/request?type=${service.requestType}` : "/contact"}
          className="text-sm font-medium text-navy underline-offset-4 hover:underline"
        >
          {service.requestType ? "Request this service →" : "Get a quote →"}
        </Link>
      </div>
    </div>
  );
}
