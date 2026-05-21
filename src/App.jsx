import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";

// Sayfalar
import Auth from "./pages/Auth";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import Posture from "./pages/Posture";
import Muscle from "./pages/Muscle";
import Nutrition from "./pages/Nutrition";
import Discipline from "./pages/Discipline";

// Korumalar
import PrivateRoute from "./components/ui/PrivateRoute";
import PremiumRoute from "./components/ui/PremiumRoute";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Auth />} />
        
        {/* Sadece Giriş Yapanlar */}
        <Route path="/onboarding" element={<PrivateRoute><Onboarding /></PrivateRoute>} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/muscle" element={<PrivateRoute><Muscle /></PrivateRoute>} />
        <Route path="/nutrition" element={<PrivateRoute><Nutrition /></PrivateRoute>} />
        
        {/* Sadece Premium Olanlar */}
        <Route path="/posture" element={<PremiumRoute><Posture /></PremiumRoute>} />
        <Route path="/discipline" element={<PremiumRoute><Discipline /></PremiumRoute>} />
      </Routes>
      <Toaster theme="dark" position="bottom-right" />
    </>
  );
}
