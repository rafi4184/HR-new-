/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Newsreader'", "serif"],
        sans: ["'IBM Plex Sans'", "system-ui", "sans-serif"],
        mono: ["'IBM Plex Mono'", "ui-monospace", "monospace"],
      },
      colors: {
        // primary navy — deepened for a more authoritative, "immigration
        // consultancy" register (headings, primary text, dark footer band)
        navy: {
          DEFAULT: "#0C2340",
          deep: "#081526",
          soft: "#2E5C8A",
        },
        // primary accent — shifted from a soft "boutique concierge" honey
        // gold to a richer, more saturated bronze-gold that reads closer
        // to an official seal/stamp. Used sparingly: primary CTA, highlights.
        // NOTE: the token is still named `gold` (avoids touching every
        // `bg-gold`/`text-gold-deep` usage across the app) but its value is
        // this deeper bronze tone, not a literal gold/yellow.
        gold: {
          DEFAULT: "#A9792D",
          deep: "#7C591E",
          pale: "#F3E9D6",
          tint: "#E6D2A8",
        },
        // Spain flag red — a new, deliberately sparing accent for
        // Spain-specific nods (flag stripes, badges, "live" tags) now that
        // the site is a Spain visa consultancy. Not used as a general CTA
        // color — red reads as "urgent/stop," not "trustworthy."
        spainRed: {
          DEFAULT: "#AA151B",
          deep: "#7E0F14",
        },
        // secondary blue — interactive elements, links, secondary accents
        brand: {
          blue: "#2E5C8A",
          navy: "#0C2340",
        },
        // bright, clean paper ground
        paper: {
          DEFAULT: "#FFFFFF",
          soft: "#F5F8FC",
          panel: "#EAF3FC",
        },
        // primary text/heading ink and supporting shades
        ink: {
          DEFAULT: "#243447",
          soft: "#3C4A5E",
          muted: "#64748B",
          faint: "#94A3B8",
        },
        border: {
          DEFAULT: "#E2E8F0",
          strong: "#CBD5E1",
        },
        mist: {
          DEFAULT: "#C2CBE3",
          soft: "#A7B2D4",
          faint: "#DADFEF",
        },
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #0C2340 0%, #2E5C8A 100%)",
        "brand-gradient-soft": "linear-gradient(135deg, rgba(12,35,64,0.06) 0%, rgba(46,92,138,0.06) 100%)",
      },
      boxShadow: {
        card: "0 2px 10px rgba(12,35,64,0.06)",
        "card-hover": "0 18px 40px rgba(12,35,64,0.12)",
        soft: "0 1px 3px rgba(12,35,64,0.08)",
      },
      borderRadius: {
        lg: "0.5rem",
        xl: "0.875rem",
        "2xl": "1.25rem",
      },
      keyframes: {
        heroUp: {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        floatBlob: {
          "0%, 100%": { transform: "translate(0,0) scale(1)" },
          "50%": { transform: "translate(-16px, 14px) scale(1.06)" },
        },
        drawCheck: {
          from: { strokeDashoffset: "48" },
          to: { strokeDashoffset: "0" },
        },
        popIn: {
          "0%": { transform: "scale(0.6)", opacity: "0" },
          "70%": { transform: "scale(1.06)", opacity: "1" },
          "100%": { transform: "scale(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-300px 0" },
          "100%": { backgroundPosition: "300px 0" },
        },
        pingSlow: {
          "0%": { transform: "scale(1)", opacity: "0.55" },
          "100%": { transform: "scale(1.35)", opacity: "0" },
        },
      },
      animation: {
        heroUp: "heroUp 0.7s cubic-bezier(.2,.8,.2,1) forwards",
        floatBlob: "floatBlob 9s ease-in-out infinite",
        drawCheck: "drawCheck 0.5s ease forwards 0.15s",
        popIn: "popIn 0.45s cubic-bezier(.2,.9,.3,1.3) forwards",
        shimmer: "shimmer 1.4s infinite",
        "ping-slow": "pingSlow 2.4s cubic-bezier(.2,.8,.2,1) infinite",
      },
    },
  },
  plugins: [],
};
