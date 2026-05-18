/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        impact: {
          primary: "#FF6B35",
          dark: "#0D0D0D",
          surface: "#1A1A2E",
        },
      },
    },
  },
  plugins: [],
}