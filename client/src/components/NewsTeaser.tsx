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
    <section className="relative px-5 md:px-10 py-14 md:py-20 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="relative rounded-[32px] border-2 border-gold/25 bg-gradient-to-br from-gold-pale/50 via-white to-paper-soft p-6 sm:p-10 md:p-14 shadow-card-hover overflow-hidden">
          <motion.div
            aria-hidden="true"
            className="absolute -top-24 -left-24 w-[380px] h-[380px] rounded-full blur-3xl pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(198,161,91,0.18), transparent 70%)" }}
            animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
            transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            aria-hidden="true"
            className="absolute -bottom-24 -right-16 w-[340px] h-[340px] rounded-full blur-3xl pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(16,42,67,0.08), transparent 70%)" }}
            animate={{ x: [0, -24, 0], y: [0, -16, 0] }}
            transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
          />

          <Reveal className="relative text-center max-w-3xl mx-auto mb-10 md:mb-12">
            <div className="inline-flex items-center gap-2 mb-5 px-4 py-1.5 rounded-full bg-navy text-white text-[11px] font-bold tracking-[0.22em] uppercase">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-gold" />
              </span>
              {T.liveBadge}
            </div>
            <div className="flex items-center justify-center gap-2 mb-3 text-[12px] font-medium tracking-[0.2em] uppercase text-gold-deep">
              <Newspaper size={14} />
              {T.eyebrow}
            </div>
            <h2 className="font-display text-navy text-4xl sm:text-5xl md:text-6xl mb-5" style={{ textWrap: "balance" }}>
              {T.h2}
            </h2>
            <p className="text-[15px] md:text-[16.5px] text-ink-muted leading-relaxed max-w-2xl mx-auto mb-8">{T.intro}</p>
            <Link
              to="/news"
              className="group inline-flex items-center gap-2.5 px-9 py-4 rounded-full font-semibold text-[15px] tracking-wide uppercase bg-gold text-white hover:bg-gold-deep hover:scale-[1.03] active:scale-95 transition-all shadow-card-hover"
            >
              {T.ctaBig}
              <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>

          <div className="relative grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
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

          <Reveal className="relative text-center mt-10">
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
    </section>
  );
}
