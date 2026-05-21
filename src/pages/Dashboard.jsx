import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "@/components/ui/Sidebar";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

export default function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  useEffect(() => {
    // PremiumRoute'dan gelen "openPremium" sinyalini yakala
    if (location.state?.openPremium) {
      toast.error("Premium Özellik!", { description: "Bu alana erişmek için Premium'a yükseltmelisiniz." });
      // Sinyali temizle ki sayfa yenilendiğinde tekrar çıkmasın
      navigate("/dashboard", { replace: true, state: {} });
    }
  }, [location, navigate]);

  return (
    <div className="flex h-screen bg-impact-dark overflow-hidden">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-8">
          <header>
            <h2 className="text-3xl font-bold text-white">Hoş Geldin, {currentUser.email.split('@')[0]}</h2>
            <p className="text-zinc-400">Bugün sınırlarını zorlamaya hazır mısın?</p>
          </header>
          
          <div className="p-8 rounded-2xl border border-zinc-800 bg-impact-surface/50 border-dashed text-center">
            <h3 className="text-xl font-medium text-zinc-500">Dashboard İçeriği (Gün 5 Görevi)</h3>
            <p className="text-sm text-zinc-600 mt-2">Hafta 2'de Streak alevleri ve yapay zeka buraya gelecek.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
