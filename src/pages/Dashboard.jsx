import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Menu, LogOut, User as UserIcon, Sparkles } from "lucide-react";
import Sidebar from "@/components/ui/Sidebar";
import ChatWindow from "@/components/Chatbot/ChatWindow";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { logoutUser } from "@/services/authService";

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false); // CHATBOT AÇ/KAPA STATE'İ
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  useEffect(() => {
    if (location.state?.openPremium) {
      toast.error("Premium Özellik!", { description: "Bu alana erişmek için Premium'a yükseltmelisiniz." });
      navigate("/dashboard", { replace: true, state: {} });
    }
  }, [location, navigate]);

  const handleLogout = async () => {
    try {
      await logoutUser();
      toast.success("Çıkış yapıldı", { description: "Yine bekleriz!" });
      navigate("/");
    } catch (error) {
      toast.error("Çıkış yapılamadı");
    }
  };

  return (
    <div className="flex h-screen bg-impact-dark overflow-hidden text-white">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <header className="h-16 border-b border-zinc-800 bg-impact-surface flex items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-4">
            <button className="lg:hidden p-2 text-zinc-400 hover:text-impact-primary transition-colors" onClick={() => setIsSidebarOpen(true)}>
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-bold hidden sm:block">Kontrol Paneli</h2>
          </div>

          <div className="flex items-center gap-3">
            {/* AI KOÇ BUTONU */}
            <button 
              onClick={() => setIsChatOpen(true)}
              className="flex items-center gap-2 bg-impact-primary/10 hover:bg-impact-primary/20 text-impact-primary border border-impact-primary/30 px-3 py-1.5 rounded-full transition-all font-medium text-sm shadow-[0_0_10px_rgba(249,115,22,0.2)]"
            >
              <Sparkles className="w-4 h-4" />
              <span className="hidden sm:inline">AI Koç</span>
            </button>

            <div className="hidden sm:flex items-center gap-2 bg-impact-dark px-3 py-1.5 rounded-full border border-zinc-800 ml-2">
              <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400">
                <UserIcon className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium text-zinc-300">
                {currentUser?.displayName || "Sporcu"}
              </span>
            </div>
            
            <button onClick={handleLogout} className="p-2 text-zinc-400 hover:text-red-500 rounded-lg transition-colors ml-1">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-8 relative">
          <div className="max-w-5xl mx-auto space-y-8">
            <header>
              <h2 className="text-3xl font-bold text-white">
                Hoş geldin, <span className="text-impact-primary">{currentUser?.displayName || "Şampiyon"}</span>!
              </h2>
              <p className="text-zinc-400 mt-1">Bugün sınırlarını zorlamaya hazır mısın?</p>
            </header>
            
            <div className="p-8 rounded-2xl border border-zinc-800 bg-impact-surface/50 border-dashed text-center">
              <h3 className="text-xl font-medium text-zinc-500">Hafta 2 İçerikleri (Streak & Beslenme) buraya gelecek</h3>
            </div>
          </div>
        </main>
        
        {/* CHATBOT ÇEKMECESİ BİLEŞENİ */}
        <ChatWindow isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
        
      </div>
    </div>
  );
}
