import { Link } from "react-router-dom";
import { Newspaper, ArrowRight } from "lucide-react";
import { useDict } from "../lib/i18n";
import { newsAnnouncementT } from "../lib/translations";

export default function NewsAnnouncementBar() {
  const T = useDict(newsAnnouncementT);

  return (
    <Link
      to="/news"
      className="group relative z-50 flex items-center justify-center gap-2.5 w-full px-4 py-2.5 bg-navy text-white text-[13px] sm:text-[13.5px] font-medium hover:bg-navy-deep transition-colors"
    >
      <span className="relative flex h-2 w-2 shrink-0">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-gold" />
      </span>
      <Newspaper size={15} className="shrink-0 text-gold" />
      <span className="truncate sm:hidden">{T.messageShort}</span>
      <span className="truncate hidden sm:inline">{T.message}</span>
      <span className="inline-flex items-center gap-1 font-semibold text-gold shrink-0 group-hover:gap-1.5 transition-all">
        {T.cta}
        <ArrowRight size={13} />
      </span>
    </Link>
  );
}
