import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#316FC5",
          dark:    "#1e4f9a",
          light:   "#5a8fd4",
        },
        accent: {
          DEFAULT: "#FFF4DD",
          dark:    "#f5e2b0",
        },
      },
      fontFamily: {
        display: ["Georgia", "serif"],
        body:    ["system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
