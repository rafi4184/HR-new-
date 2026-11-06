import { useLanguage } from "../../lib/i18n";

export default function LanguageToggle({ className = "" }: { className?: string }) {
  const { lang, setLang } = useLanguage();

  return (
    <div className={`inline-flex items-center rounded-full border border-border-strong p-0.5 text-[12px] font-medium ${className}`}>
      <button
        onClick={() => setLang("en")}
        aria-pressed={lang === "en"}
        className={`px-2.5 py-1 rounded-full transition-colors ${lang === "en" ? "bg-navy text-white" : "text-ink-faint"}`}
      >
        EN
      </button>
      <button
        onClick={() => setLang("bn")}
        aria-pressed={lang === "bn"}
        className={`px-2.5 py-1 rounded-full transition-colors ${lang === "bn" ? "bg-navy text-white" : "text-ink-faint"}`}
      >
        বাং
      </button>
    </div>
  );
}
