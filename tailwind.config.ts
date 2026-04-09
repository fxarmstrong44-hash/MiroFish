import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        accent: {
          DEFAULT: "#c9a84c",
          dim: "#8b7332",
        },
        gold: {
          50: "#fdf8e8",
          100: "#f9edc4",
          200: "#f0d78c",
          300: "#e6be53",
          400: "#c9a84c",
          500: "#a88a3a",
          600: "#876e2e",
          700: "#665323",
          800: "#4a3c1a",
          900: "#2e2510",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      borderRadius: {
        "xl": "12px",
        "2xl": "16px",
        "3xl": "24px",
      },
      animation: {
        "fade-in-up": "fadeInUp 0.6s ease-out forwards",
        "pulse-ring": "pulseRing 1.5s ease-out infinite",
        "scroll": "scroll 30s linear infinite",
        "glow": "glowPulse 2s ease-in-out infinite alternate",
      },
      keyframes: {
        fadeInUp: {
          from: { opacity: "0", transform: "translateY(30px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        pulseRing: {
          "0%": { transform: "scale(0.8)", opacity: "1" },
          "100%": { transform: "scale(2)", opacity: "0" },
        },
        scroll: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        glowPulse: {
          from: { boxShadow: "0 0 20px rgba(201, 168, 76, 0.2)" },
          to: { boxShadow: "0 0 40px rgba(201, 168, 76, 0.4)" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};

export default config;
