import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "../components/**/*.{ts,tsx}",
    "./node_modules/@shadcn/ui/dist/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f5faff",
          100: "#e0f2ff",
          200: "#b9e1ff",
          300: "#7fc7ff",
          400: "#38a8ff",
          500: "#0d8eff",
          600: "#006fe0",
          700: "#0056b3",
          800: "#003e80",
          900: "#00284d"
        },
        surface: "#f5f5f5"
      },
      boxShadow: {
        md: "0 8px 24px rgba(15, 23, 42, 0.12)"
      },
      borderRadius: {
        xl: "1rem"
      }
    }
  },
  plugins: [animate]
};

export default config;
