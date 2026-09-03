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
        // dark "casework" ground — deep forest-charcoal, replacing the old navy
        navy: {
          DEFAULT: "#17241C",
          light: "#1C2C22",
          panel: "#23352A",
        },
        // primary accent — institutional forest green
        teal: {
          DEFAULT: "#2F5D3F",
          bright: "#3F7B52",
          soft: "#5A9468",
          tint: "#E9EFE3",
          pale: "#DEE8DA",
        },
        // stamp-ink accent — used for primary calls to action and seals
        gold: {
          DEFAULT: "#A6402A",
        },
        // warm case-paper ground
        cream: {
          DEFAULT: "#F3EEDF",
          card: "#FBF7EA",
          panel: "#ECE3CB",
        },
        ink: {
          DEFAULT: "#1E2A20",
          soft: "#4C5B49",
          muted: "#5B6856",
          faint: "#8A7A52",
        },
        border: {
          DEFAULT: "#DBD0AF",
          strong: "#CBBE96",
        },
        mist: {
          DEFAULT: "#B9C2AE",
          soft: "#9CAF97",
          faint: "#CBD4C0",
        },
      },
      borderRadius: {
        lg: "0.375rem",
        xl: "0.5rem",
        "2xl": "0.75rem",
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
        shimmerSweep: {
          "0%": { transform: "translateX(-120%) skewX(-20deg)" },
          "100%": { transform: "translateX(220%) skewX(-20deg)" },
        },
        stampDown: {
          "0%": { transform: "scale(2.2) rotate(-14deg)", opacity: "0" },
          "55%": { transform: "scale(0.92) rotate(-8deg)", opacity: "1" },
          "70%": { transform: "scale(1.05) rotate(-8deg)" },
          "100%": { transform: "scale(1) rotate(-8deg)", opacity: "1" },
        },
      },
      animation: {
        heroUp: "heroUp 0.7s cubic-bezier(.2,.8,.2,1) forwards",
        floatBlob: "floatBlob 9s ease-in-out infinite",
        drawCheck: "drawCheck 0.5s ease forwards 0.15s",
        popIn: "popIn 0.45s cubic-bezier(.2,.9,.3,1.3) forwards",
        shimmer: "shimmer 1.4s infinite",
        shimmerSweep: "shimmerSweep 2.6s ease-in-out infinite",
        stampDown: "stampDown 0.6s cubic-bezier(.2,.8,.2,1) forwards",
      },
    },
  },
  plugins: [],
};
