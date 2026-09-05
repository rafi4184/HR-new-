import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useRequestHref } from "../lib/useRequestHref";
import AmbientGlow from "./ui/AmbientGlow";
import { useDict } from "../lib/i18n";
import { finalCta } from "../lib/translations";

export default function FinalCta() {
  const requestHref = useRequestHref();
  const T = useDict(finalCta);
  return (
    <section className="relative px-5 md:px-10 py-14 bg-gold-pale text-center overflow-hidden">
      <AmbientGlow variant="light" />
      <div className="relative max-w-2xl mx-auto">
        <h2 className="font-display text-2xl md:text-3xl text-navy mb-4">{T.heading}</h2>
        <Link
          to={requestHref}
          className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-medium text-[14px] tracking-wide uppercase bg-gradient-to-r from-navy to-navy-soft text-white hover:from-navy-soft hover:to-navy transition-colors"
        >
          {T.requestService}
          <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  );
}
