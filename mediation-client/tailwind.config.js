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
        // deep luxury ground
        obsidian: {
          DEFAULT: "#05070C",
          950: "#05070C",
          900: "#0A0E17",
          800: "#0F1421",
        },
        // gilded accent — the "confidential, elite" signal color
        gild: {
          DEFAULT: "#C9A24B",
          bright: "#E8C877",
          soft: "#D9BE84",
        },
        glass: {
          border: "rgba(255,255,255,0.10)",
          fill: "rgba(255,255,255,0.05)",
        },
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(201,162,75,0.35), 0 0 40px rgba(201,162,75,0.18)",
        "glow-lg": "0 0 0 1px rgba(201,162,75,0.4), 0 8px 60px rgba(201,162,75,0.25)",
        card: "0 20px 60px rgba(0,0,0,0.5)",
      },
      backdropBlur: {
        xl2: "32px",
      },
      keyframes: {
        floatY: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.55", transform: "scale(0.92)" },
        },
        shimmerSweep: {
          "0%": { transform: "translateX(-120%) skewX(-20deg)" },
          "100%": { transform: "translateX(220%) skewX(-20deg)" },
        },
        drawLine: {
          from: { strokeDashoffset: "1000" },
          to: { strokeDashoffset: "0" },
        },
      },
      animation: {
        floatY: "floatY 5.5s ease-in-out infinite",
        floatYSlow: "floatY 8s ease-in-out infinite",
        pulseSoft: "pulseSoft 2.2s ease-in-out infinite",
        shimmerSweep: "shimmerSweep 2.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
