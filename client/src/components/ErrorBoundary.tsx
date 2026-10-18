import { Component, type ErrorInfo, type ReactNode } from "react";
import { Phone, MessageCircle, RotateCw } from "lucide-react";
import LogoMark from "./ui/Logo";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

const RELOAD_FLAG = "hrm-chunk-reload-attempted";

function isChunkLoadError(error: unknown): boolean {
  const msg = error instanceof Error ? error.message : String(error);
  return /dynamically imported module|Failed to fetch|Loading chunk|ChunkLoadError/i.test(msg);
}

// Catches render-time crashes anywhere in the tree so a single broken
// component shows a friendly recovery screen instead of a blank white page.
// Also recovers automatically from the one most common real-world cause of
// a "broken" site on phones: a visitor has the page open from before a new
// deploy, so their browser tries to fetch an old JS chunk that no longer
// exists. That isn't a real bug, so it gets one silent reload instead of
// scaring the visitor with an error screen.
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (isChunkLoadError(error)) {
      let alreadyTried = false;
      try {
        alreadyTried = sessionStorage.getItem(RELOAD_FLAG) === "1";
      } catch {
        // sessionStorage can throw in locked-down/private browsing contexts
      }
      if (!alreadyTried) {
        try {
          sessionStorage.setItem(RELOAD_FLAG, "1");
        } catch {
          // ignore — worst case this reloads more than once
        }
        window.location.reload();
        return;
      }
    }
    console.error("Unhandled render error:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center px-6 bg-paper-soft">
          <div className="max-w-sm w-full text-center">
            <LogoMark size={40} className="mx-auto mb-6" />
            <h1 className="font-display text-xl text-navy mb-2">Something went wrong</h1>
            <p className="text-[14px] text-ink-muted leading-relaxed mb-7">
              This page hit an unexpected error. Reloading usually fixes it — or reach us directly below.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold text-[14px] bg-navy text-white hover:bg-navy/90 transition-colors mb-3"
            >
              <RotateCw size={15} />
              Reload the page
            </button>
            <div className="flex gap-3">
              <a
                href="tel:+8801717013150"
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full font-medium text-[13.5px] border border-border text-ink-soft hover:border-navy hover:text-navy transition-colors"
              >
                <Phone size={14} />
                Call us
              </a>
              <a
                href="https://wa.me/8801717013150"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full font-medium text-[13.5px] border border-border text-ink-soft hover:border-[#25D366] hover:text-[#25D366] transition-colors"
              >
                <MessageCircle size={14} />
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
