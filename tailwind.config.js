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
        
        // YENİ PREMIUM NEON ZÜMRÜT PALETİ
        impact: {
          dark: "#09090B",     /* Çok derin siyah (Arka plan) */
          surface: "#18181B",  /* Koyu füme (Kartlar) */
          primary: "#10B981",  /* Zümrüt Yeşili (Ana butonlar, Streak) */
          secondary: "#059669",/* Koyu Zümrüt (Hover efektleri) */
          accent: "#8B5CF6",   /* Neon Mor (Yapay Zeka detayları) */
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
