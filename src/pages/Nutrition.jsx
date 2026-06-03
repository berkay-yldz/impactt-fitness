import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, LogOut, User as UserIcon, RefreshCcw, Flame, Dumbbell, HeartPulse, CheckCircle2, Circle, Utensils } from "lucide-react";
import Sidebar from "@/components/ui/Sidebar";
import ChatWindow from "@/components/Chatbot/ChatWindow";
import { useAuth } from "@/context/AuthContext";
import { logoutUser } from "@/services/authService";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function Nutrition() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // "weight_loss", "muscle_gain", "endurance"
  const [goal, setGoal] = useState("muscle_gain"); 
  const [meals, setMeals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleLogout = async () => {
    try { await logoutUser(); navigate("/"); } catch (error) {}
  };

  const generateDietPlan = async () => {
    setIsLoading(true);
    try {
      // Vercel Serverless Function'a (Eran'ın API'sine) istek atıyoruz [ANAYASA UYUMU]
      const response = await fetch("/api/generate-diet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: currentUser?.uid || "test-user-uid",
          goal: goal,
          switchSeed: Date.now()
        })
      });

      if (!response.ok) throw new Error("API yanıt vermedi");
      
      const data = await response.json();
      
      // Öğünleri state'e yaz
      setMeals(data.meals.map(meal => ({ ...meal, isEaten: false })));
      
      // 🚨 ERAN'IN FİX 1: Başarılı senaryoda loading'i kapat!
      setIsLoading(false);
      toast.success("Diyet Planı Yenilendi", { description: "Hedefine uygun yeni menün hazırlandı." });

    } catch (error) {
      console.warn("Backend API bağlantısı yok, dummy veri yükleniyor...");
      // Backend kapalıysa (npm run dev ile açıldıysa) arayüz çökmesin diye dummy data
      setTimeout(() => {
        setMeals([
          { id: "m1", type: "SABAH", name: "4 Yumurta & Yulaf Ezmesi", cal: 550, pro: 35, carb: 45, fat: 12, isEaten: false },
          { id: "m2", type: "ARA ÖĞÜN", name: "Protein Shake & Muz", cal: 250, pro: 25, carb: 30, fat: 3, isEaten: false },
          { id: "m3", type: "ÖĞLE", name: "Izgara Tavuk & Esmer Pirinç", cal: 600, pro: 40, carb: 65, fat: 10, isEaten: false },
          { id: "m4", type: "ARA ÖĞÜN", name: "Çiğ Badem & Yeşil Elma", cal: 200, pro: 6, carb: 20, fat: 14, isEaten: false },
          { id: "m5", type: "AKŞAM", name: "Izgara Somon & Kuşkonmaz", cal: 500, pro: 35, carb: 10, fat: 25, isEaten: false }
        ]);
        // Eran'ın bahsettiği catch bloğundaki loading kapatma
        setIsLoading(false);
      }, 800);
    }
  };

  // 🚨 ERAN'IN FİX 2 (UX BUG): Bağımlılık dizisine [goal] eklendi.
  // Artık kullanıcı "Kilo Ver" veya "Kas Yap" dediği an buton basmasına gerek kalmadan menü yenilenecek.
  useEffect(() => {
    generateDietPlan();
  }, [goal]);

  const toggleMeal = (id) => {
    setMeals(prev => prev.map(meal => meal.id === id ? { ...meal, isEaten: !meal.isEaten } : meal));
  };

  return (
    <div className="flex h-screen bg-zinc-50 dark:bg-impact-dark overflow-hidden text-zinc-900 dark:text-white transition-colors duration-300">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* HEADER */}
        <header className="h-16 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-impact-surface flex items-center justify-between px-4 sm:px-6 lg:px-8 transition-colors duration-300">
          <div className="flex items-center gap-4">
            <button className="lg:hidden p-2 text-zinc-500 hover:text-impact-primary" onClick={() => setIsSidebarOpen(true)}>
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-bold hidden sm:flex items-center gap-2">
              <Utensils className="w-5 h-5 text-impact-primary" /> Beslenme Modülü
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-zinc-100 dark:bg-impact-dark px-3 py-1.5 rounded-full border border-zinc-200 dark:border-zinc-800">
              <UserIcon className="w-4 h-4 text-zinc-500" />
              <span className="text-sm font-medium">{currentUser?.displayName || "Emrullah Karataş"}</span>
            </div>
            <button onClick={handleLogout} className="p-2 text-zinc-500 hover:text-red-500 rounded-lg">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* ANA İÇERİK */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 custom-scrollbar">
          <div className="max-w-4xl mx-auto space-y-8 pb-20">
            
            {/* HEDEF VE YENİLEME PANELİ */}
            <div className="bg-white dark:bg-impact-surface p-6 sm:p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight mb-2">Hedefine Uygun Beslen</h1>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">Sistemin sana özel oluşturduğu makro planı.</p>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center gap-4">
                {/* Goal Toggle [ANAYASA UYUMU] */}
                <div className="flex bg-zinc-100 dark:bg-zinc-900 p-1 rounded-xl w-full sm:w-auto">
                  <button 
                    onClick={() => setGoal("weight_loss")}
                    className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${goal === "weight_loss" ? "bg-white dark:bg-zinc-800 shadow-sm text-zinc-900 dark:text-white" : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"}`}
                  >
                    <Flame className="w-4 h-4" /> <span className="hidden sm:inline">Kilo Ver</span>
                  </button>
                  <button 
                    onClick={() => setGoal("muscle_gain")}
                    className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${goal === "muscle_gain" ? "bg-white dark:bg-zinc-800 shadow-sm text-impact-primary" : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"}`}
                  >
                    <Dumbbell className="w-4 h-4" /> <span className="hidden sm:inline">Kas Yap</span>
                  </button>
                  <button 
                    onClick={() => setGoal("endurance")}
                    className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${goal === "endurance" ? "bg-white dark:bg-zinc-800 shadow-sm text-zinc-900 dark:text-white" : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"}`}
                  >
                    <HeartPulse className="w-4 h-4" /> <span className="hidden sm:inline">Kondisyon</span>
                  </button>
                </div>

                <button 
                  onClick={generateDietPlan}
                  disabled={isLoading}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-impact-primary text-black rounded-xl font-bold hover:bg-impact-secondary transition-colors disabled:opacity-50"
                >
                  <RefreshCcw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} /> Planı Yenile
                </button>
              </div>
            </div>

            {/* ÖĞÜN LİSTESİ */}
            <div>
              <h2 className="text-xl font-black mb-6 flex items-center gap-2">🍎 Günlük Öğün Listesi</h2>
              
              <div className="space-y-4">
                {isLoading ? (
                  /* Skeleton Loader [ANAYASA UYUMU] */
                  [1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="h-28 bg-zinc-200 dark:bg-zinc-800 rounded-2xl animate-pulse"></div>
                  ))
                ) : (
                  /* Gerçek Diyet Kartları [ANAYASA UYUMU] */
                  meals.map((meal) => (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      key={meal.id}
                      onClick={() => toggleMeal(meal.id)}
                      className={`cursor-pointer p-5 sm:p-6 rounded-2xl border transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                        meal.isEaten 
                          ? "bg-impact-primary/5 border-impact-primary/20 dark:border-impact-primary/30" 
                          : "bg-white dark:bg-impact-surface border-zinc-200 dark:border-zinc-800 hover:border-impact-primary/40"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`mt-1 transition-colors duration-300 ${meal.isEaten ? "text-impact-primary" : "text-zinc-300 dark:text-zinc-600"}`}>
                          {meal.isEaten ? <CheckCircle2 className="w-7 h-7" /> : <Circle className="w-7 h-7" />}
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-impact-primary uppercase tracking-widest">{meal.type}</span>
                          <h3 className={`text-lg font-bold mt-1 ${meal.isEaten ? "text-zinc-400 line-through decoration-impact-primary/40" : ""}`}>
                            {meal.name}
                          </h3>
                        </div>
                      </div>

                      {/* Makro Değerleri */}
                      <div className={`flex items-center gap-4 sm:gap-6 bg-zinc-50 dark:bg-zinc-900/50 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 ${meal.isEaten ? "opacity-40" : "opacity-100"}`}>
                        <div className="text-center">
                          <span className="block text-xl font-black">{meal.cal}</span>
                          <span className="text-[9px] text-zinc-500 uppercase tracking-widest">Kcal</span>
                        </div>
                        <div className="w-px h-8 bg-zinc-200 dark:bg-zinc-700"></div>
                        <div className="flex gap-4 text-xs font-bold">
                          <div>
                            <span className="text-zinc-400 text-[10px] uppercase block mb-1">Pro</span>
                            <div className="flex items-center gap-1"><div className="w-6 h-1.5 rounded-full bg-blue-500"></div>{meal.pro}g</div>
                          </div>
                          <div>
                            <span className="text-zinc-400 text-[10px] uppercase block mb-1">Karb</span>
                            <div className="flex items-center gap-1"><div className="w-6 h-1.5 rounded-full bg-emerald-500"></div>{meal.carb}g</div>
                          </div>
                          <div>
                            <span className="text-zinc-400 text-[10px] uppercase block mb-1">Yağ</span>
                            <div className="flex items-center gap-1"><div className="w-6 h-1.5 rounded-full bg-amber-500"></div>{meal.fat}g</div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>

          </div>
        </main>
        
        <ChatWindow isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      </div>
    </div>
  );
}
