import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// react-router intercepts link clicks with history.pushState, which never
// triggers the browser's native "jump to #hash" behavior — so every
// `to="/#request-service"` style link needs this to actually scroll there.
// Cross-page hash links also have to wait out the page-transition animation
// (App.tsx's AnimatePresence) before the target element even exists, so this
// polls briefly instead of guessing a fixed delay.
export default function ScrollToHash() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
      return;
    }
    const id = hash.slice(1);
    let attempts = 0;
    let cancelled = false;

    const tryScroll = () => {
      if (cancelled) return;
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      } else if (attempts < 20) {
        attempts += 1;
        setTimeout(tryScroll, 50);
      }
    };
    const timer = setTimeout(tryScroll, 60);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [pathname, hash]);

  return null;
}
