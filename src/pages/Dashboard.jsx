import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Menu, LogOut, User as UserIcon } from "lucide-react";
import Sidebar from "@/components/ui/Sidebar";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { logoutUser } from "@/services/authService";

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobil menü state'i
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  useEffect(() => {
    // PremiumRoute'dan gelen engelleme sinyalini yakala
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
      {/* Yan Menü (State ile açılıp kapanıyor) */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Ana İçerik ve Üst Header */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* ÜST HEADER */}
        <header className="h-16 border-b border-zinc-800 bg-impact-surface flex items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-4">
            {/* Hamburger Menü Butonu (Sadece mobilde görünür) */}
            <button
              className="lg:hidden p-2 text-zinc-400 hover:text-impact-primary transition-colors"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-bold hidden sm:block">Kontrol Paneli</h2>
          </div>

          <div className="flex items-center gap-4">
            {/* Kullanıcı Profili (Avatar + İsim) */}
            <div className="flex items-center gap-3 bg-impact-dark px-3 py-1.5 rounded-full border border-zinc-800">
              <div className="w-8 h-8 rounded-full bg-impact-primary/20 flex items-center justify-center text-impact-primary">
                <UserIcon className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium text-zinc-300">
                {currentUser?.displayName || currentUser?.email?.split('@')[0] || "Sporcu"}
              </span>
            </div>
            
            {/* Çıkış Yap Butonu */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 text-zinc-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:inline font-medium">Çıkış Yap</span>
            </button>
          </div>
        </header>

        {/* ANA İÇERİK ALANI (Scroll edilebilir) */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-5xl mx-auto space-y-8">
            <header>
              <h2 className="text-3xl font-bold text-white">
                Merhaba, {currentUser?.displayName || currentUser?.email?.split('@')[0]}!
              </h2>
              <p className="text-zinc-400 mt-1">Bugün sınırlarını zorlamaya hazır mısın?</p>
            </header>
            
            <div className="p-8 rounded-2xl border border-zinc-800 bg-impact-surface/50 border-dashed text-center">
              <h3 className="text-xl font-medium text-zinc-500">Hafta 2'de içerik gelecek</h3>
              <p className="text-sm text-zinc-600 mt-2">Günlük Streak, Bugünkü Antrenman ve Beslenme Özeti buraya eklenecek.</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
