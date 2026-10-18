import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Newspaper, RefreshCw } from "lucide-react";
import { useSeo } from "../lib/useSeo";
import Reveal from "../components/ui/Reveal";
import AmbientGlow from "../components/ui/AmbientGlow";
import NewsOutletsDirectory from "../components/NewsOutletsDirectory";
import { listNews } from "../lib/api";
import type { NewsCategory, NewsItem } from "../types";
import { useDict, useLanguage } from "../lib/i18n";
import { newsPageT, newsCategoryLabels } from "../lib/translations";

const CATEGORIES: (NewsCategory | "all")[] = [
  "all",
  "national",
  "politics",
  "crime",
  "jobs",
  "business",
  "education",
  "sports",
  "international",
];

const REFRESH_MS = 5 * 60 * 1000;

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

export default function NewsPage() {
  const T = useDict(newsPageT);
  const { lang } = useLanguage();
  const [items, setItems] = useState<NewsItem[]>([]);
  const [category, setCategory] = useState<NewsCategory | "all">("all");
  const [loaded, setLoaded] = useState(false);

  useSeo({
    title: "Bangladesh News Today — Live Headlines & Updates | HR — The Mediator",
    description:
      "Bangladesh news today — national, politics, crime, jobs, business, education, sports and international headlines, refreshed live every 20 minutes. Read the latest Bangladesh news now.",
    path: "/news",
    image: items.find((it) => it.imageUrl)?.imageUrl ?? undefined,
    newsListSchema: {
      name: "Bangladesh News — Live Headlines",
      items: items.slice(0, 30).map((it) => ({ url: it.link, headline: it.headline })),
    },
  });

  const load = () => {
    listNews(category === "all" ? null : category, 90)
      .then((rows) => {
        setItems(rows);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  };

  useEffect(() => {
    setLoaded(false);
    load();
    const t = setInterval(load, REFRESH_MS);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  const latest = items.reduce<string | null>((acc, it) => {
    const t = it.publishedAt ?? it.fetchedAt;
    return !acc || t > acc ? t : acc;
  }, null);

  return (
    <div>
      <section className="relative px-5 md:px-10 pt-14 pb-10 md:pt-20 md:pb-12 bg-paper-soft overflow-hidden">
        <AmbientGlow variant="light" />
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-3 text-[12px] font-medium tracking-[0.2em] uppercase text-gold-deep">
            <Newspaper size={14} />
            {T.eyebrow}
          </div>
          <h1 className="font-display text-3xl md:text-5xl text-navy mb-5" style={{ textWrap: "balance" }}>
            {T.h1}
          </h1>
          <p className="text-[15.5px] text-ink-muted leading-relaxed max-w-2xl mx-auto mb-5">{T.intro}</p>
          {latest && (
            <div className="inline-flex items-center gap-2 text-[12.5px] text-ink-faint">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-gold-deep" />
              </span>
              {T.lastUpdated} {timeAgo(latest, lang)}
            </div>
          )}
        </div>
      </section>

      <section className="px-5 md:px-10 py-10 md:py-14 max-w-6xl mx-auto">
        <Reveal delay={0.05} className="flex flex-wrap justify-center gap-2.5 mb-10">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-4 py-2 rounded-full text-[13px] font-medium border transition-colors ${
                category === c
                  ? "bg-navy text-white border-navy"
                  : "bg-white text-ink-soft border-border hover:border-navy hover:text-navy"
              }`}
            >
              {c === "all" ? T.allCategories : newsCategoryLabels[c][lang]}
            </button>
          ))}
        </Reveal>

        {!loaded && (
          <div className="flex items-center justify-center gap-2 py-20 text-ink-faint text-[14px]">
            <RefreshCw size={16} className="animate-spin" />
            {T.loading}
          </div>
        )}

        {loaded && items.length === 0 && (
          <div className="text-center py-20 text-ink-faint text-[14px]">{T.empty}</div>
        )}

        {loaded && items.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item, i) => (
              <NewsCard key={item.id} item={item} delay={Math.min(i, 8) * 0.04} lang={lang} />
            ))}
          </div>
        )}
      </section>

      <NewsOutletsDirectory />
    </div>
  );
}

function NewsCard({ item, delay, lang }: { item: NewsItem; delay: number; lang: "en" | "bn" }) {
  const [imgFailed, setImgFailed] = useState(false);
  const showImage = item.imageUrl && !imgFailed;
  return (
    <Reveal delay={delay}>
      <motion.a
        href={item.link}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ y: -3 }}
        className="group flex flex-col h-full rounded-2xl bg-white border border-border overflow-hidden shadow-card hover:border-gold hover:shadow-card-hover transition-all"
      >
        <div className="relative aspect-[16/10] bg-paper-panel overflow-hidden">
          {showImage ? (
            <img
              src={item.imageUrl!}
              alt=""
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={() => setImgFailed(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gold-deep/40">
              <Newspaper size={34} />
            </div>
          )}
          <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full text-[10.5px] font-semibold uppercase tracking-wide bg-white/90 text-navy backdrop-blur-sm">
            {item.source}
          </span>
        </div>
        <div className="p-4 flex flex-col flex-1">
          <h3 className="font-display text-[15.5px] text-navy leading-snug mb-2 line-clamp-3 group-hover:text-gold-deep transition-colors">
            {item.headline}
          </h3>
          {item.excerpt && <p className="text-[12.5px] text-ink-muted leading-relaxed line-clamp-3 mb-3">{item.excerpt}</p>}
          <div className="mt-auto text-[11.5px] text-ink-faint">{timeAgo(item.publishedAt ?? item.fetchedAt, lang)}</div>
        </div>
      </motion.a>
    </Reveal>
  );
}
