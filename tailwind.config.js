import tailwindcssAnimate from "tailwindcss-animate"

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        
        // IMPACT ANAYASASI: TURUNCU (ORANGE) TEMA
        impact: {
          dark: "#0a0a0a",     /* Derin Siyah Zemin */
          surface: "#171717",  /* Kart ve Yüzey Rengi */
          primary: "#f97316",  /* Ana Turuncu (Orange 500) */
          secondary: "#ea580c",/* Koyu Turuncu Hover (Orange 600) */
          accent: "#fdba74",   /* Açık Turuncu Detaylar (Orange 300) */
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [tailwindcssAnimate],
}
