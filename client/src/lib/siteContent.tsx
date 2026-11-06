import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { getSiteContent } from "./api";
import { useLanguage } from "./i18n";

// Registry of the website copy staff/admin can edit from the dashboard,
// without touching code. Each entry has a stable key plus the current
// hard-coded text as a fallback, so the site renders correctly even
// before anyone edits anything, and new keys can be added here any time
// to extend what's editable.
export interface ContentKeyDef {
  key: string;
  label: string;
  group: string;
  defaultEn: string;
  defaultBn: string;
  multiline?: boolean;
}

export const SITE_CONTENT_KEYS: ContentKeyDef[] = [
  {
    key: "about.para1",
    label: "About — first paragraph",
    group: "About Page",
    multiline: true,
    defaultEn:
      "ARK Property Solution was built to give sellers, landlords, buyers and investors one trusted point of contact across Sydney — instead of juggling separate agents for sales, rent collection, and the search for the next property.",
    defaultBn:
      "ARK Property Solution was built to give sellers, landlords, buyers and investors one trusted point of contact across Sydney — instead of juggling separate agents for sales, rent collection, and the search for the next property.",
  },
  {
    key: "about.para2",
    label: "About — second paragraph",
    group: "About Page",
    multiline: true,
    defaultEn:
      "We work across three services — real estate sales, property management and buyer's agency — so your file stays with people who already know your property, your preferences and your goals.",
    defaultBn:
      "We work across three services — real estate sales, property management and buyer's agency — so your file stays with people who already know your property, your preferences and your goals.",
  },
  {
    key: "footer.description",
    label: "Footer — company description",
    group: "Footer",
    multiline: true,
    defaultEn:
      "Your trusted property partner in Sydney, NSW — real estate sales, property management and buyer's agency services for homeowners, landlords, buyers and investors.",
    defaultBn:
      "Your trusted property partner in Sydney, NSW — real estate sales, property management and buyer's agency services for homeowners, landlords, buyers and investors.",
  },
];

const KEY_DEF_MAP = new Map(SITE_CONTENT_KEYS.map((d) => [d.key, d]));

interface SiteContentMap {
  [key: string]: { en: string; bn: string };
}

const SiteContentContext = createContext<{ content: SiteContentMap; reload: () => void }>({
  content: {},
  reload: () => {},
});

export function SiteContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContentMap>({});

  const load = () => {
    getSiteContent()
      .then((rows) => {
        const map: SiteContentMap = {};
        for (const row of rows) map[row.key] = { en: row.valueEn, bn: row.valueBn };
        setContent(map);
      })
      .catch(() => {
        /* fall back to defaults silently — not every visitor's network reaches Supabase from every context */
      });
  };

  useEffect(() => {
    load();
  }, []);

  return <SiteContentContext.Provider value={{ content, reload: load }}>{children}</SiteContentContext.Provider>;
}

// Reads a staff/admin-editable piece of copy: the live override if one has
// been saved, otherwise the hard-coded default for the given key.
export function useSiteText(key: string): string {
  const { lang } = useLanguage();
  const { content } = useContext(SiteContentContext);
  const def = KEY_DEF_MAP.get(key);
  const override = content[key];
  if (override) return lang === "bn" ? override.bn : override.en;
  if (def) return lang === "bn" ? def.defaultBn : def.defaultEn;
  return "";
}

export function useReloadSiteContent(): () => void {
  return useContext(SiteContentContext).reload;
}

// Raw { en, bn } pair for a key (override if saved, else the default) —
// for the admin editor, which needs both languages regardless of the
// current site language.
export function useSiteContentRaw(key: string): { en: string; bn: string } {
  const { content } = useContext(SiteContentContext);
  const def = KEY_DEF_MAP.get(key);
  return content[key] ?? { en: def?.defaultEn ?? "", bn: def?.defaultBn ?? "" };
}
