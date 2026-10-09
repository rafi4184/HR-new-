import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { MotionConfig } from "framer-motion";
import "./index.css";
import App from "./App";
import { LanguageProvider } from "./lib/i18n";
import { SiteContentProvider } from "./lib/siteContent";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <SiteContentProvider>
          {/* reducedMotion="user" makes every framer-motion animation site-wide
              respect the OS-level prefers-reduced-motion setting automatically. */}
          <MotionConfig reducedMotion="user">
            <App />
          </MotionConfig>
        </SiteContentProvider>
      </LanguageProvider>
    </BrowserRouter>
  </StrictMode>
);
