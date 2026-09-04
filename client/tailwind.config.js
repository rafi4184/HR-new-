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
        // deep navy — primary text, headings, and the dark footer band
        navy: {
          DEFAULT: "#0F2540",
          deep: "#0A1B30",
          soft: "#1B3A5C",
        },
        // subtle premium gold accent
        gold: {
          DEFAULT: "#C9973B",
          deep: "#A97C24",
          pale: "#FBF1DC",
          tint: "#F4E6C8",
        },
        // bright, clean paper ground
        paper: {
          DEFAULT: "#FFFFFF",
          soft: "#F7F9FC",
          panel: "#F1F4F9",
        },
        // primary text/heading ink (navy family) and supporting shades
        ink: {
          DEFAULT: "#132A46",
          soft: "#3B5573",
          muted: "#5E7690",
          faint: "#8598AC",
        },
        border: {
          DEFAULT: "#E5EAF1",
          strong: "#D3DBE6",
        },
        mist: {
          DEFAULT: "#C7D3E0",
          soft: "#AEC0D4",
          faint: "#DCE4EE",
        },
      },
      boxShadow: {
        card: "0 2px 10px rgba(15,37,64,0.06)",
        "card-hover": "0 18px 40px rgba(15,37,64,0.12)",
        soft: "0 1px 3px rgba(15,37,64,0.08)",
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
