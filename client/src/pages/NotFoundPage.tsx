import { Link } from "react-router-dom";
import { ArrowRight, Home } from "lucide-react";
import { useSeo } from "../lib/useSeo";
import { useRequestHref } from "../lib/useRequestHref";
import { SERVICE_PAGE_LIST } from "../data/servicePages";

export default function NotFoundPage() {
  useSeo({
    title: "Page Not Found | HR — The Mediator",
    description: "The page you're looking for doesn't exist. Explore HR — The Mediator's services or return to the homepage.",
    path: "/404",
    noindex: true,
  });

  const requestHref = useRequestHref();

  return (
    <div className="px-5 md:px-10 py-24 md:py-32 text-center max-w-2xl mx-auto">
      <div className="font-display text-6xl md:text-7xl text-navy mb-4">404</div>
      <h1 className="font-display text-2xl md:text-3xl text-navy mb-4">Page Not Found</h1>
      <p className="text-[15px] text-ink-muted leading-relaxed mb-10">
        The page you're looking for doesn't exist or may have moved. Try one of the links below, or head back to the
        homepage.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-medium text-[14px] bg-navy text-white hover:bg-navy-deep hover:scale-105 active:scale-95 transition-all"
        >
          <Home size={15} /> Back to Homepage
        </Link>
        <Link
          to={requestHref}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-medium text-[14px] bg-gold text-white hover:bg-gold-deep hover:scale-105 active:scale-95 transition-all"
        >
          Request a Service <ArrowRight size={15} />
        </Link>
      </div>

      <div className="text-left max-w-md mx-auto">
        <div className="text-[12px] font-medium mb-3 tracking-[0.2em] uppercase text-gold-deep">Our Services</div>
        <ul className="space-y-2">
          {SERVICE_PAGE_LIST.map((s) => (
            <li key={s.id}>
              <Link to={s.path} className="text-[14px] text-ink-soft hover:text-navy transition-colors">
                {s.navLabel}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
