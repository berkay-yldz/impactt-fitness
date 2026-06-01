import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";

// ⚠️ GEÇİCİ GELİŞTİRME MODU BYPASS'I
// Emrullah arayüzünü test edebilsin diye kapıyı herkese açıyoruz!
export default function PremiumRoute({ children }) {
  return children;
}
