/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Fraunces'", "serif"],
        sans: ["'Inter'", "system-ui", "sans-serif"],
      },
      colors: {
        navy: {
          DEFAULT: "#0B1B2E",
          light: "#0F2438",
          panel: "#152E45",
        },
        teal: {
          DEFAULT: "#146B60",
          bright: "#1C8877",
          soft: "#2FA893",
          tint: "#EAF2F0",
          pale: "#DCEBE8",
        },
        gold: {
          DEFAULT: "#C9A227",
        },
        cream: {
          DEFAULT: "#F6F2E8",
          card: "#FCFAF5",
          panel: "#F0EAD9",
        },
        ink: {
          DEFAULT: "#16222E",
          soft: "#4A5A66",
          muted: "#5A6873",
          faint: "#8B7F63",
        },
        border: {
          DEFAULT: "#E1DACB",
          strong: "#D8D2C4",
        },
        mist: {
          DEFAULT: "#B9C4CC",
          soft: "#9FB0BC",
          faint: "#C9D2D9",
        },
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
