import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function PremiumRoute({ children }) {
  const { currentUser, loading } = useAuth();
  const location = useLocation();
  
  if (loading) return <div className="min-h-screen bg-impact-dark flex items-center justify-center text-impact-primary font-bold text-xl">Yükleniyor...</div>;
  
  if (!currentUser) return <Navigate to="/" />;
  
  // Kullanıcı Premium değilse Dashboard'a geri şutla ve Modal açılış sinyali gönder
  if (!currentUser.isPremium) {
    return <Navigate to="/dashboard" state={{ openPremium: true, from: location }} />;
  }

  return children;
}
