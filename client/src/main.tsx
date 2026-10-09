import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
import { LanguageProvider } from "./lib/i18n";
import { SiteContentProvider } from "./lib/siteContent";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <SiteContentProvider>
          <App />
        </SiteContentProvider>
      </LanguageProvider>
    </BrowserRouter>
  </StrictMode>
);
