import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Newspaper } from "lucide-react";
import Reveal from "./ui/Reveal";
import { listNews } from "../lib/api";
import type { NewsItem } from "../types";
import { useDict, useLanguage } from "../lib/i18n";
import { newsTeaserT } from "../lib/translations";

function timeAgo(iso: string | null, lang: "en" | "bn"): string {
  if (!iso) return "";
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.max(1, Math.round(diffMs / 60000));
  if (mins < 60) return lang === "bn" ? `${mins} মিনিট আগে` : `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return lang === "bn" ? `${hours} ঘণ্টা আগে` : `${hours}h ago`;
  const days = Math.round(hours / 24);
  return lang === "bn" ? `${days} দিন আগে` : `${days}d ago`;
}

export default function NewsTeaser() {
  const T = useDict(newsTeaserT);
  const { lang } = useLanguage();
  const [items, setItems] = useState<NewsItem[]>([]);

  useEffect(() => {
    listNews(null, 6)
      .then(setItems)
      .catch(() => {});
  }, []);

  if (items.length === 0) return null;

  return (
    <section className="px-5 md:px-10 pt-8 pb-14 md:pt-10 md:pb-20 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="rounded-2xl border border-border shadow-card overflow-hidden">
          {/* Masthead strip */}
          <div className="h-1 bg-gold" />
          <div className="flex items-center justify-center gap-3 px-6 py-3 bg-navy">
            <span className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.22em] uppercase text-white">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-gold" />
              </span>
              {T.liveBadge}
            </span>
            <span className="h-3 w-px bg-white/20" />
            <span className="text-[11px] font-medium tracking-[0.15em] uppercase text-white/70">{T.eyebrow}</span>
          </div>

          <div className="px-6 sm:px-10 md:px-14 py-10 md:py-14 bg-paper-soft">
            <Reveal className="text-center max-w-3xl mx-auto mb-10 md:mb-12">
              <h2 className="font-display text-navy text-3xl sm:text-4xl md:text-5xl mb-5" style={{ textWrap: "balance" }}>
                {T.h2}
              </h2>
              <p className="text-[15px] md:text-[16.5px] text-ink-muted leading-relaxed max-w-2xl mx-auto mb-8">{T.intro}</p>
              <Link
                to="/news"
                className="group inline-flex items-center gap-2.5 px-9 py-4 rounded-full font-semibold text-[14px] tracking-wide uppercase bg-gold text-white hover:bg-gold-deep transition-colors"
              >
                {T.ctaBig}
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </Reveal>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {items.slice(0, 6).map((item, i) => (
                <Reveal key={item.id} delay={Math.min(i, 5) * 0.05}>
                  <motion.a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -3 }}
                    className="group flex flex-row sm:flex-col h-full rounded-xl bg-white border border-border overflow-hidden shadow-card hover:border-gold hover:shadow-card-hover transition-all"
                  >
                    {/* Small thumbnail on phones (single-column) so a photo
                        doesn't dominate the screen; full-width image once
                        the grid gives a card real width (sm:+). */}
                    <div className="relative w-20 sm:w-full aspect-square sm:aspect-[16/10] shrink-0 bg-paper-panel overflow-hidden">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt=""
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gold-deep/40">
                          <Newspaper size={20} className="sm:hidden" />
                          <Newspaper size={28} className="hidden sm:block" />
                        </div>
                      )}
                    </div>
                    <div className="p-3 sm:p-4 flex flex-col flex-1 min-w-0">
                      <h3 className="font-display text-[13.5px] sm:text-[14.5px] text-navy leading-snug mb-1 sm:mb-2 line-clamp-2 group-hover:text-gold-deep transition-colors">
                        {item.headline}
                      </h3>
                      <div className="mt-auto text-[11px] text-ink-faint">{timeAgo(item.publishedAt ?? item.fetchedAt, lang)}</div>
                    </div>
                  </motion.a>
                </Reveal>
              ))}
            </div>

            <Reveal className="text-center mt-10">
              <Link
                to="/news"
                className="group inline-flex items-center gap-1.5 px-6 py-3 rounded-full font-medium text-[13.5px] tracking-wide uppercase border border-navy text-navy hover:bg-navy hover:text-white transition-colors"
              >
                {T.viewAll}
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
