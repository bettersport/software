import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // BetterSport Brand Colors
        brand: {
          navy: "#0B1628",
          "navy-light": "#0D1E35",
          "navy-mid": "#112240",
          "navy-card": "#152A4A",
          "navy-border": "#1E3A5F",
        },
        primary: {
          DEFAULT: "#10B981",
          hover: "#059669",
          light: "#D1FAE5",
          50: "#ECFDF5",
          100: "#D1FAE5",
          500: "#10B981",
          600: "#059669",
          700: "#047857",
        },
        accent: {
          cyan: "#06B6D4",
          orange: "#F59E0B",
          red: "#EF4444",
          purple: "#8B5CF6",
          blue: "#3B82F6",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          dark: "#0D1E35",
          darker: "#0B1628",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Plus Jakarta Sans", "Inter", "sans-serif"],
      },
      backgroundImage: {
        "gradient-brand": "linear-gradient(135deg, #10B981 0%, #06B6D4 100%)",
        "gradient-dark": "linear-gradient(180deg, #0D1E35 0%, #0B1628 100%)",
        "gradient-card": "linear-gradient(145deg, #152A4A 0%, #112240 100%)",
        "gradient-hero": "linear-gradient(135deg, #0B1628 0%, #0D1E35 50%, #112240 100%)",
      },
      boxShadow: {
        card: "0 4px 24px rgba(0,0,0,0.25)",
        "card-hover": "0 8px 40px rgba(0,0,0,0.35)",
        glow: "0 0 20px rgba(16,185,129,0.3)",
        "glow-cyan": "0 0 20px rgba(6,182,212,0.3)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.4s ease-out",
        "slide-in-left": "slideInLeft 0.3s ease-out",
        pulse_slow: "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        shimmer: "shimmer 2s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInLeft: {
          "0%": { opacity: "0", transform: "translateX(-16px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      borderRadius: {
        "4xl": "2rem",
      },
    },
  },
  plugins: [],
};

export default config;
