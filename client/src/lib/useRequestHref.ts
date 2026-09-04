import { useLocation } from "react-router-dom";
import { SERVICE_PAGE_LIST } from "../data/servicePages";

const SERVICE_PATHS = new Set(SERVICE_PAGE_LIST.map((p) => p.path));

// Global CTAs (header/footer/final-cta) should keep visitors on the page
// they're already reading — service pages have their own booking section —
// instead of always bouncing back to the homepage's booking section.
export function useRequestHref() {
  const { pathname } = useLocation();
  return SERVICE_PATHS.has(pathname) ? `${pathname}#service-request` : "/#request-service";
}
