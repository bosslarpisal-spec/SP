import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0C2C47",
          dark:    "#071D30",
          light:   "#1A4A6E",
        },
        secondary: {
          DEFAULT: "#97D3CD",
          dark:    "#6ABAAF",
          light:   "#C4E8E5",
        },
        accent: {
          DEFAULT: "#EFEAE6",
          dark:    "#DDD5CC",
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
