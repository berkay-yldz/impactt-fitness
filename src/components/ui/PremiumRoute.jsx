import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function PremiumRoute({ children }) {
  const { currentUser } = useAuth();
  
  if (!currentUser) return <Navigate to="/" />;
  
  // Kullanıcı premium değilse Dashboard'a at ve URL state ile Modal'ı açma sinyali gönder
  if (!currentUser.isPremium) {
    return <Navigate to="/dashboard" state={{ openPremium: true }} />;
  }

  return children;
}
