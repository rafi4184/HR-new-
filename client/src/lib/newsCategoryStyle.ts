import type { NewsCategory } from "../types";

// Topic-color tags, the way real news sites badge Politics/Crime/Business/etc.
// so a reader can tell a story's beat at a glance without reading the source.
// Tailwind needs the full class strings written out (not built from
// variables) to pick them up at build time.
export const CATEGORY_TAG_STYLE: Record<NewsCategory, string> = {
  national: "bg-slate-100 text-slate-700",
  politics: "bg-blue-100 text-blue-700",
  crime: "bg-red-100 text-red-700",
  jobs: "bg-amber-100 text-amber-800",
  business: "bg-emerald-100 text-emerald-700",
  education: "bg-purple-100 text-purple-700",
  sports: "bg-teal-100 text-teal-700",
  international: "bg-indigo-100 text-indigo-700",
};

export const JUST_IN_WINDOW_MS = 30 * 60 * 1000;
