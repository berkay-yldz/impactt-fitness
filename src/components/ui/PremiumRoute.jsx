import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";

export default function PremiumRoute({ children }) {
  // ⚠️ AKILLI BYPASS: Eğer localhost'ta (geliştirme aşamasında) çalışıyorsak
  // Emrullah'ın UI testleri bozulmasın diye kapıyı direkt aç!
  if (import.meta.env.DEV) {
    return children;
  }

  // BURADAN AŞAĞISI SADECE VERCEL'DE (CANLIDA) ÇALIŞIR
  const { user, loading } = useAuth(); 

  if (loading) {
    return <div className="h-screen w-full flex items-center justify-center bg-black text-white">Yükleniyor...</div>;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (!user.is_premium) {
    toast.error("Bu alan sadece Premium üyeler içindir! Disiplin Modu kilitli.");
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}