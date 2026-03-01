/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/react/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#006e42",
          dark: "#005c36",
          light: "#dfede8",
          50: "#e6f3ee",
          100: "#cce7dd",
          200: "#99cfbb",
          500: "#006e42",
          600: "#005c36",
        },
        winga: {
          primary: "#006e42",
          "primary-dark": "#005c36",
          "primary-light": "#dfede8",
          "primary-50": "#e6f3ee",
          "primary-100": "#cce7dd",
          "primary-200": "#99cfbb",
          background: "#ffffff",
          foreground: "#000000",
          muted: "#f3f4f6",
          "muted-foreground": "#666666",
          border: "#f0f0f0",
          ring: "#006e42",
        },
      },
      fontFamily: {
        sans: ["var(--font-hanken)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      borderRadius: {
        "winga-lg": "1rem",
        "winga-xl": "1.25rem",
        "winga-2xl": "3.125rem",
      },
      boxShadow: {
        "winga-card": "0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.06)",
        "winga-card-hover": "0 4px 6px -1px rgb(0 0 0 / 0.08), 0 2px 4px -2px rgb(0 0 0 / 0.06)",
      },
    },
  },
  darkMode: "class",
  plugins: [],
};
