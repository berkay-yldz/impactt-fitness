import Onboarding from "./pages/Onboarding"
import { Toaster } from "@/components/ui/sonner"

export default function App() {
  return (
    <>
      {/* Geçici olarak Auth yerine Onboarding ekranını gösteriyoruz */}
      <Onboarding />
      <Toaster theme="dark" position="bottom-right" />
    </>
  )
}