import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function PrivateRoute({ children }) {
  const { currentUser, loading } = useAuth();
  
  if (loading) return <div className="min-h-screen bg-impact-dark flex items-center justify-center text-impact-primary font-bold text-xl">Yükleniyor...</div>;
  
  return currentUser ? children : <Navigate to="/" />;
}
