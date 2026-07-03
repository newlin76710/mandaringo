import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        sky: {
          50: "#eefbff",
          100: "#d9f4ff",
          200: "#b3e9ff",
          300: "#7ddaff",
          400: "#3ec4f7",
          500: "#0fb6ef",
          600: "#0a91c4",
          700: "#0d729d",
          800: "#125d80",
          900: "#134d6b",
        },
        sunshine: {
          50: "#fffbea",
          100: "#fff2c2",
          200: "#ffe58a",
          300: "#ffd24d",
          400: "#ffc022",
          500: "#f9a825",
          600: "#db8309",
          700: "#b5620a",
        },
        coral: {
          50: "#fff1f0",
          100: "#ffdedb",
          200: "#ffbcb6",
          300: "#ff9089",
          400: "#fb6f72",
          500: "#f14a52",
          600: "#d9313f",
          700: "#b52236",
        },
        leaf: {
          50: "#f1fbea",
          100: "#dff5cd",
          200: "#c1eb9f",
          300: "#9adb6c",
          400: "#75c743",
          500: "#57ab2b",
          600: "#43871f",
          700: "#356a1b",
        },
        ink: "#233044",
      },
      fontFamily: {
        display: [
          "'Baloo 2'",
          "'Noto Sans TC'",
          "system-ui",
          "sans-serif",
        ],
        body: [
          "'Noto Sans TC'",
          "'Noto Sans SC'",
          "system-ui",
          "sans-serif",
        ],
      },
      borderRadius: {
        xl2: "1.5rem",
        blob: "60% 40% 55% 45% / 55% 60% 40% 45%",
      },
      boxShadow: {
        soft: "0 10px 30px -12px rgba(15, 182, 239, 0.25)",
        card: "0 8px 24px -8px rgba(35, 48, 68, 0.15)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-14px)" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(24px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "fade-up": "fade-up 0.7s ease-out both",
        wiggle: "wiggle 1.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
