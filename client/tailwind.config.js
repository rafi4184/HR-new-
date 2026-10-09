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
        // brand indigo-blue (from the logo gradient) — primary text, headings,
        // dark footer band. Token name kept as "navy" for compatibility with
        // the many existing text-navy/bg-navy usages across components.
        navy: {
          DEFAULT: "#2B3A7E",
          deep: "#1A2252",
          soft: "#4A58A8",
        },
        // brand teal-green (from the logo gradient) — accent, CTAs, highlights.
        // Token name kept as "gold" for compatibility with existing usages;
        // it now carries the green half of the brand gradient.
        gold: {
          DEFAULT: "#2FBF8F",
          deep: "#1E9A70",
          pale: "#E3F9F0",
          tint: "#C8F0E0",
        },
        // raw brand gradient endpoints, for bg-gradient-to-r from-brand-blue to-brand-green
        brand: {
          blue: "#2B3A7E",
          green: "#2FBF8F",
        },
        // bright, clean paper ground
        paper: {
          DEFAULT: "#FFFFFF",
          soft: "#F7F9FC",
          panel: "#F0F3FA",
        },
        // primary text/heading ink (blue family) and supporting shades
        ink: {
          DEFAULT: "#1A2451",
          soft: "#3D4A85",
          muted: "#636FA0",
          faint: "#96A0C7",
        },
        border: {
          DEFAULT: "#E3E7F3",
          strong: "#CDD3E8",
        },
        mist: {
          DEFAULT: "#C2CBE3",
          soft: "#A7B2D4",
          faint: "#DADFEF",
        },
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #2B3A7E 0%, #2FBF8F 100%)",
        "brand-gradient-soft": "linear-gradient(135deg, rgba(43,58,126,0.08) 0%, rgba(47,191,143,0.08) 100%)",
      },
      boxShadow: {
        card: "0 2px 10px rgba(27,34,82,0.07)",
        "card-hover": "0 18px 40px rgba(27,34,82,0.14)",
        soft: "0 1px 3px rgba(27,34,82,0.09)",
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
      },
      animation: {
        heroUp: "heroUp 0.7s cubic-bezier(.2,.8,.2,1) forwards",
        floatBlob: "floatBlob 9s ease-in-out infinite",
        drawCheck: "drawCheck 0.5s ease forwards 0.15s",
        popIn: "popIn 0.45s cubic-bezier(.2,.9,.3,1.3) forwards",
        shimmer: "shimmer 1.4s infinite",
      },
    },
  },
  plugins: [],
};
