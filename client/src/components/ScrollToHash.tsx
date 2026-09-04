import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// react-router intercepts link clicks with history.pushState, which never
// triggers the browser's native "jump to #hash" behavior — so every
// `to="/#request-service"` style link needs this to actually scroll there.
export default function ScrollToHash() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
      return;
    }
    const id = hash.slice(1);
    const scroll = () => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    const timer = setTimeout(scroll, 60);
    return () => clearTimeout(timer);
  }, [pathname, hash]);

  return null;
}
