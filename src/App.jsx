import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { Loader2 } from "lucide-react"; 

// Korumalar
import PrivateRoute from "./components/ui/PrivateRoute";
import PremiumRoute from "./components/ui/PremiumRoute";

// EKLENDİ: NotFound sayfası importu
import NotFound from "./pages/404"; 

// Sayfalar
const Auth = lazy(() => import("./pages/Auth"));
const Onboarding = lazy(() => import("./pages/Onboarding"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Posture = lazy(() => import("./pages/Posture"));
const Muscle = lazy(() => import("./pages/Muscle"));
const Nutrition = lazy(() => import("./pages/Nutrition"));
const Discipline = lazy(() => import("./pages/Discipline"));

const PageLoader = () => (
  <div className="flex h-screen w-full items-center justify-center bg-zinc-50 dark:bg-impact-dark">
    <Loader2 className="w-10 h-10 text-impact-primary animate-spin" />
  </div>
);

export default function App() {
  return (
    <>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Auth />} />
          
          <Route path="/onboarding" element={<PrivateRoute><Onboarding /></PrivateRoute>} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/muscle" element={<PrivateRoute><Muscle /></PrivateRoute>} />
          <Route path="/nutrition" element={<PrivateRoute><Nutrition /></PrivateRoute>} />
          
          <Route path="/posture" element={<PrivateRoute><Posture /></PrivateRoute>} />
          
          <Route path="/discipline" element={<PremiumRoute><Discipline /></PremiumRoute>} />

          {/* EKLENDİ: Tüm tanımlanmamış yollar artık 404 sayfasına yönlenir */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <Toaster position="bottom-right" />
    </>
  );
}