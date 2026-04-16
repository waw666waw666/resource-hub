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
        'notion-white': '#ffffff',
        'notion-warm': '#f6f5f4',
        'notion-dark': '#31302e',
        'notion-gray': '#615d59',
        'notion-muted': '#a39e98',
        'notion-blue': '#0075de',
        'notion-blue-hover': '#005bab',
        'notion-border': 'rgba(0,0,0,0.1)',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 18px rgba(0,0,0,0.04), 0 2px 7px rgba(0,0,0,0.02), 0 0.5px 3px rgba(0,0,0,0.01)',
        'card-hover': '0 8px 24px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.03)',
      },
      borderRadius: {
        'card': '12px',
        'card-lg': '16px',
      },
    },
  },
  plugins: [],
};
export default config;
