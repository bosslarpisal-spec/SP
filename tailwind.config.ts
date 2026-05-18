import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2C2419",
          dark:    "#1E1810",
          light:   "#4A3C2C",
        },
        secondary: {
          DEFAULT: "#C09A5B",
          dark:    "#A08040",
          light:   "#E8D5B0",
        },
        accent: {
          DEFAULT: "#F7F4EE",
          dark:    "#EDE8DF",
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
