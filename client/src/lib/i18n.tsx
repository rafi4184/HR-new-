import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "en" | "bn";

const STORAGE_KEY = "hr_lang";

function readStored(): Lang {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v === "bn" ? "bn" : "en";
  } catch {
    return "en";
  }
}

const LanguageContext = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({
  lang: "en",
  setLang: () => {},
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(readStored);

  useEffect(() => {
    document.documentElement.lang = lang === "bn" ? "bn" : "en";
  }, [lang]);

  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* ignore */
    }
  };

  return <LanguageContext.Provider value={{ lang, setLang }}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  return useContext(LanguageContext);
}

// Pick the current-language value out of a { en, bn } pair — the shared
// shape every entry in translations.ts uses.
export function useT<T>(pair: { en: T; bn: T }): T {
  const { lang } = useLanguage();
  return pair[lang];
}

type Pair<X> = { en: X; bn: X };

// Resolve a whole object of { en, bn } pairs (a section of translations.ts)
// into plain values for the current language in one call, e.g.
// const T = useDict(header) → T.tagline is already the right-language string.
export function useDict<D extends Record<string, Pair<unknown>>>(
  dict: D
): { [K in keyof D]: D[K]["en"] } {
  const { lang } = useLanguage();
  const out = {} as { [K in keyof D]: D[K]["en"] };
  for (const key in dict) {
    out[key] = dict[key][lang] as D[typeof key]["en"];
  }
  return out;
}
