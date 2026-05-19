import Auth from "./pages/Auth"
import { Toaster } from "@/components/ui/sonner"

export default function App() {
  return (
    <>
      <Auth />
      {/* Tüm uygulamada bildirimlerin çalışmasını sağlayan motor: */}
      <Toaster theme="dark" position="bottom-right" />
    </>
  )
}