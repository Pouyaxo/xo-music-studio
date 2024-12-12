/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        background: "#000000",
        foreground: "#ffffff",
        card: "#111111",
        "card-foreground": "#ffffff",
        primary: "#3553d0",
        "primary-foreground": "#fafafa",
        secondary: "#292929",
        "secondary-foreground": "#ffffff",
        muted: "#292929",
        "muted-foreground": "#a5a5a5",
        accent: "#292929",
        "accent-foreground": "#ffffff",
        border: "#292929",
        input: "#292929",
        ring: "#292929",
      },
      fontFamily: {
        sans: ["var(--font-manrope)", "system-ui", "sans-serif"],
        gothic: ["Gothic", "var(--font-manrope)", "sans-serif"],
      },
      keyframes: {
        "card-shine": {
          "0%": {
            left: "-100%",
          },
          "50%, 100%": {
            left: "100%",
          },
        },
      },
      animation: {
        "card-shine": "card-shine 4s cubic-bezier(0.4, 0, 0.2, 1) infinite",
        "pulse-slow": "pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};
