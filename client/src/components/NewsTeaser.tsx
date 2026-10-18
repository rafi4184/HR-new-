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
    <section className="px-5 md:px-10 py-16 md:py-20 bg-paper-soft">
      <div className="max-w-6xl mx-auto">
        <Reveal className="flex flex-wrap items-end justify-between gap-5 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-3 text-[12px] font-medium tracking-[0.2em] uppercase text-gold-deep">
              <Newspaper size={14} />
              {T.eyebrow}
            </div>
            <h2 className="font-display text-3xl md:text-4xl text-navy">{T.h2}</h2>
          </div>
          <Link
            to="/news"
            className="group inline-flex items-center gap-1.5 px-6 py-3 rounded-full font-medium text-[13.5px] tracking-wide uppercase border border-navy text-navy hover:bg-navy hover:text-white transition-colors shrink-0"
          >
            {T.viewAll}
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
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
                className="group flex flex-col h-full rounded-2xl bg-white border border-border overflow-hidden shadow-card hover:border-gold hover:shadow-card-hover transition-all"
              >
                <div className="relative aspect-[16/10] bg-paper-panel overflow-hidden">
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
                      <Newspaper size={28} />
                    </div>
                  )}
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-display text-[14.5px] text-navy leading-snug mb-2 line-clamp-2 group-hover:text-gold-deep transition-colors">
                    {item.headline}
                  </h3>
                  <div className="mt-auto text-[11px] text-ink-faint">{timeAgo(item.publishedAt ?? item.fetchedAt, lang)}</div>
                </div>
              </motion.a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
