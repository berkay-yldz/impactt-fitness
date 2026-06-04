import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

const API_PROXY_TARGET =
  process.env.VITE_API_PROXY_TARGET ||
  "https://impactt-fitness-eran.vercel.app"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: API_PROXY_TARGET,
        changeOrigin: true,
        secure: true,
      },
    },
  },
})
