import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function PrivateRoute({ children }) {
  const { currentUser } = useAuth();
  // Kullanıcı yoksa zorla Auth (Giriş) sayfasına at
  return currentUser ? children : <Navigate to="/" />;
}
