// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx,js,jsx}", "./playground/**/*.{ts,tsx,js,jsx}"],
  safelist: [], // optional
  // 👇 custom extractor handles template strings with new lines
  experimental: {
    optimizeUniversalDefaults: true,
  },
  plugins: [],
};
