import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1C2951",
          dark:    "#0D1E3D",
          light:   "#243160",
        },
        secondary: {
          DEFAULT: "#E8D5A3",
          dark:    "#C4B07A",
          light:   "#F5EDD8",
        },
        accent: {
          DEFAULT: "#F8F6F1",
          dark:    "#E8E4DA",
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
