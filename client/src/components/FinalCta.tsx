import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function FinalCta() {
  return (
    <section className="px-5 md:px-10 py-14 bg-gold-pale text-center">
      <div className="max-w-2xl mx-auto">
        <h2 className="font-display text-2xl md:text-3xl text-navy mb-4">Need Assistance?</h2>
        <Link
          to="/#request-service"
          className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-medium text-[14px] tracking-wide uppercase bg-navy text-white hover:bg-navy-soft transition-colors"
        >
          Request a Service
          <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  );
}
