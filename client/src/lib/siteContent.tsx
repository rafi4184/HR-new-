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
    key: "hero.eyebrow",
    label: "Hero — eyebrow tag",
    group: "Homepage Hero",
    defaultEn: "Dhaka International Airport · Premium VIP Partner",
    defaultBn: "ঢাকা আন্তর্জাতিক বিমানবন্দর · প্রিমিয়াম ভিআইপি পার্টনার",
  },
  {
    key: "hero.h1",
    label: "Hero — headline",
    group: "Homepage Hero",
    defaultEn: "Your Premium Welcome Through Dhaka International Airport",
    defaultBn: "ঢাকা আন্তর্জাতিক বিমানবন্দরে আপনার প্রিমিয়াম স্বাগতম",
  },
  {
    key: "hero.paragraph",
    label: "Hero — paragraph",
    group: "Homepage Hero",
    multiline: true,
    defaultEn:
      "From a VIP meet & greet at Dhaka International Airport (Hazrat Shahjalal International) to hotel & car, government-request support, manpower, security, education and international careers — HR — The Mediator connects you with the services you need, coordinated by one trusted desk in Bangladesh.",
    defaultBn:
      "ঢাকা আন্তর্জাতিক বিমানবন্দরে (হযরত শাহজালাল আন্তর্জাতিক) ভিআইপি মিট অ্যান্ড গ্রিট থেকে শুরু করে হোটেল ও গাড়ি, সরকারি কাজে সহায়তা, জনবল, নিরাপত্তা, শিক্ষা ও আন্তর্জাতিক ক্যারিয়ার পর্যন্ত — এইচআর দ্য মিডিয়েটর আপনাকে প্রয়োজনীয় সেবার সাথে যুক্ত করে, বাংলাদেশে একটি বিশ্বস্ত ডেস্কের মাধ্যমে সমন্বিতভাবে।",
  },
  {
    key: "about.para1",
    label: "About — first paragraph",
    group: "About Page",
    multiline: true,
    defaultEn:
      "HR — The Mediator was built to give travellers, families, businesses and jobseekers one trusted point of contact in Bangladesh — instead of chasing separate agents for the airport, the hotel, the government office, the security desk and the training academy.",
    defaultBn:
      "এইচআর দ্য মিডিয়েটর তৈরি করা হয়েছে ভ্রমণকারী, পরিবার, ব্যবসা ও চাকরিপ্রার্থীদের বাংলাদেশে একটি বিশ্বস্ত যোগাযোগ কেন্দ্র দেওয়ার জন্য — এয়ারপোর্ট, হোটেল, সরকারি অফিস, নিরাপত্তা ডেস্ক ও প্রশিক্ষণ একাডেমির জন্য আলাদা আলাদা এজেন্টের পেছনে ছোটার বদলে।",
  },
  {
    key: "about.para2",
    label: "About — second paragraph",
    group: "About Page",
    multiline: true,
    defaultEn:
      "The company is a proud Rajshahi University Readers' Forum affiliate, drawing on a licensed staffing and consultancy practice built over years of government and corporate contracts.",
    defaultBn:
      "প্রতিষ্ঠানটি গর্বের সাথে রাজশাহী বিশ্ববিদ্যালয় রিডার্স ফোরামের সাথে যুক্ত, এবং বছরের পর বছর সরকারি ও কর্পোরেট চুক্তির অভিজ্ঞতার ওপর গড়ে ওঠা একটি লাইসেন্সপ্রাপ্ত স্টাফিং ও পরামর্শ প্র্যাকটিসের ওপর নির্ভর করে।",
  },
  {
    key: "footer.description",
    label: "Footer — company description",
    group: "Footer",
    multiline: true,
    defaultEn:
      "Your trusted service & support partner in Bangladesh — concierge, transport, government assistance, manpower, security, education and career services for individuals, families, businesses and international clients.",
    defaultBn:
      "বাংলাদেশে আপনার বিশ্বস্ত সেবা ও সহায়তা অংশীদার — কনসিয়ার্জ, পরিবহন, সরকারি সহায়তা, জনবল, নিরাপত্তা, শিক্ষা ও ক্যারিয়ার সেবা ব্যক্তি, পরিবার, ব্যবসা ও আন্তর্জাতিক গ্রাহকদের জন্য।",
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
