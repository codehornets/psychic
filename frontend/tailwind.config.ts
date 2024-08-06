import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/subframe/**/*.{js,ts,jsx,tsx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      boxShadow: {
        'selected-glow': '0 0 10px rgba(234, 88, 12, 0.75)',
      }
    },
  },
  plugins: [],
  presets: [require("./src/subframe/tailwind.config.js")],
};
export default config;
