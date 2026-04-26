import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#11323c",
        canvas: "#f4f2ec",
        teal: "#0d6f73",
        ocean: "#0f4c67",
        mist: "#e7f1ef",
        warm: "#f5ece4",
        success: "#2e8b57",
        warning: "#c78a18",
        quiet: "#6b7280",
        line: "#d8dde3"
      },
      boxShadow: {
        soft: "0 18px 40px rgba(17, 50, 60, 0.08)"
      },
      borderRadius: {
        card: "1.25rem"
      }
    }
  },
  plugins: []
};

export default config;
