import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Geliştirme aşaması için sahte bir giriş yapmış kullanıcı oluşturduk
  // isPremium değerini true/false yaparak PremiumRoute testlerini yapabilirsin
  const [currentUser, setCurrentUser] = useState({
    uid: "test-user-123",
    email: "emrullah@impact.ai",
    isPremium: false 
  });

  return (
    <AuthContext.Provider value={{ currentUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
