/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg0: "var(--bg-0)",
        bg1: "var(--bg-1)",
        bg2: "var(--bg-2)",
        bg3: "var(--bg-3)",
        stroke0: "var(--stroke-0)",
        stroke1: "var(--stroke-1)",
        text0: "var(--text-0)",
        text1: "var(--text-1)",
        text2: "var(--text-2)",
        accent0: "var(--accent-0)",
        accent1: "var(--accent-1)",
        accentSoft: "var(--accent-soft)",
        danger0: "var(--danger-0)",
        dangerSoft: "var(--danger-soft)",
      },
      borderRadius: {
        lg: "var(--radius-lg)",
        md: "var(--radius-md)",
        sm: "var(--radius-sm)",
      },
      boxShadow: {
        glass: "var(--shadow-0)",
        card: "var(--shadow-1)",
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "\"SF Pro Display\"",
          "\"SF Pro Text\"",
          "Inter",
          "Segoe UI",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
