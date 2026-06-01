import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, LogOut, User as UserIcon, Utensils, Flame, Dumbbell, Activity, RefreshCw, CheckCircle2, Apple } from "lucide-react";
import Sidebar from "@/components/ui/Sidebar";
import ChatWindow from "@/components/Chatbot/ChatWindow";
import { useAuth } from "@/context/AuthContext";
import { logoutUser } from "@/services/authService";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } } };

export default function Nutrition() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [goal, setGoal] = useState("muscle_gain");
  const [meals, setMeals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [completedMeals, setCompletedMeals] = useState({});

  const handleLogout = async () => {
    try { await logoutUser(); navigate("/"); } catch (error) {}
  };

  const generateDietPlan = async () => {
    setIsLoading(true);
    setCompletedMeals({});
    try {
      const res = await fetch("/api/generate-diet", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ uid: currentUser?.uid, goal, switchSeed: Date.now() }) });
      if (!res.ok) throw new Error("API Henüz Hazır Değil");
      const data = await res.json();
      setMeals(data.meals);
    } catch (error) {
      setTimeout(() => {
        const dummyMeals = [
          { id: 1, type: "Sabah", name: goal === "weight_loss" ? "Yulaf & Orman Meyveleri" : "4 Yumurta & Yulaf", calories: goal === "weight_loss" ? 320 : 550, protein: goal === "weight_loss" ? 15 : 35, carbs: 45, fat: 12 },
          { id: 2, type: "Ara Öğün", name: "Protein Shake & Muz", calories: 250, protein: 25, carbs: 30, fat: 3 },
          { id: 3, type: "Öğle", name: goal === "weight_loss" ? "Izgara Tavuk Salata" : "Tavuk Göğsü & Pirinç", calories: goal === "weight_loss" ? 350 : 600, protein: 40, carbs: goal === "weight_loss" ? 15 : 65, fat: 10 },
          { id: 4, type: "Ara Öğün", name: "Lor Peyniri & Badem", calories: 200, protein: 18, carbs: 5, fat: 14 },
          { id: 5, type: "Akşam", name: "Izgara Somon & Kuşkonmaz", calories: 450, protein: 35, carbs: 10, fat: 22 },
        ];
        setMeals(dummyMeals);
        setIsLoading(false);
      }, 1200);
    }
  };

  useEffect(() => { generateDietPlan(); }, []);

  const toggleMeal = (id) => {
    setCompletedMeals(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    /* GÜN 5 POLISH: Açık/Koyu Tema ve Mobil Paddingler (sm, md, lg) */
    <div className="flex h-screen bg-zinc-50 dark:bg-impact-dark overflow-hidden text-zinc-900 dark:text-white transition-colors duration-300">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <header className="h-16 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-impact-surface flex items-center justify-between px-4 sm:px-6 lg:px-8 transition-colors duration-300">
          <div className="flex items-center gap-4">
            <button className="lg:hidden p-2 text-zinc-500 dark:text-zinc-400 hover:text-impact-primary transition-colors" onClick={() => setIsSidebarOpen(true)}>
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-lg sm:text-xl font-bold hidden sm:block flex items-center gap-2">
              <Utensils className="w-5 h-5 text-impact-primary" /> Beslenme
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-zinc-100 dark:bg-impact-dark px-3 py-1.5 rounded-full border border-zinc-200 dark:border-zinc-800 ml-2">
              <div className="w-6 h-6 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 dark:text-zinc-400">
                <UserIcon className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{currentUser?.displayName || "Sporcu"}</span>
            </div>
            <button onClick={handleLogout} className="p-2 text-zinc-500 dark:text-zinc-400 hover:text-red-500 rounded-lg transition-colors ml-1">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 relative custom-scrollbar">
          <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 pb-20">
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6 bg-white/80 dark:bg-impact-surface/40 p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-zinc-200 dark:border-zinc-800/50 backdrop-blur-md shadow-sm dark:shadow-none transition-colors duration-300">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white mb-1 sm:mb-2">Hedefine Uygun Beslen</h1>
                <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">Sistemin sana özel oluşturduğu makro planı.</p>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full md:w-auto">
                <div className="flex w-full sm:w-auto bg-zinc-100 dark:bg-impact-dark p-1 rounded-xl border border-zinc-200 dark:border-zinc-800 transition-colors duration-300">
                  <button onClick={() => setGoal("weight_loss")} className={`flex-1 sm:flex-none flex justify-center items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${goal === "weight_loss" ? "bg-white dark:bg-zinc-800 text-impact-primary shadow-sm" : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"}`}><Flame className="w-3 h-3 sm:w-4 sm:h-4" /> Kilo Ver</button>
                  <button onClick={() => setGoal("muscle_gain")} className={`flex-1 sm:flex-none flex justify-center items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${goal === "muscle_gain" ? "bg-white dark:bg-zinc-800 text-impact-primary shadow-sm" : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"}`}><Dumbbell className="w-3 h-3 sm:w-4 sm:h-4" /> Kas Yap</button>
                  <button onClick={() => setGoal("endurance")} className={`flex-1 sm:flex-none flex justify-center items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${goal === "endurance" ? "bg-white dark:bg-zinc-800 text-impact-primary shadow-sm" : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"}`}><Activity className="w-3 h-3 sm:w-4 sm:h-4" /> Kondisyon</button>
                </div>
                <button onClick={generateDietPlan} disabled={isLoading} className="flex items-center gap-2 bg-impact-primary text-black px-4 sm:px-6 py-2.5 rounded-xl font-bold hover:bg-impact-secondary transition-all disabled:opacity-50 shadow-[0_0_15px_rgba(249,115,22,0.3)] w-full sm:w-auto justify-center text-sm sm:text-base">
                  <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
                  {isLoading ? "Yenileniyor..." : "Planı Yenile"}
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2 px-1 sm:px-2 text-zinc-900 dark:text-white transition-colors duration-300">
                <Apple className="w-4 h-4 sm:w-5 sm:h-5 text-impact-primary" /> Günlük Öğün Listesi
              </h2>
              {isLoading ? (
                <div className="space-y-3 sm:space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-24 sm:h-28 bg-white/50 dark:bg-impact-surface/30 rounded-2xl border border-zinc-200 dark:border-zinc-800/50 animate-pulse flex p-3 sm:p-4 items-center gap-3 sm:gap-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
                      <div className="flex-1 space-y-2 sm:space-y-3">
                        <div className="h-3 sm:h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-1/3" />
                        <div className="h-2 sm:h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-2/3" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-3 sm:space-y-4">
                  {meals.map((meal) => {
                    const isDone = completedMeals[meal.id];
                    return (
                      <motion.div key={meal.id} variants={itemVariants} className={`group relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl border transition-all duration-300 shadow-sm dark:shadow-none ${isDone ? "bg-impact-primary/5 border-impact-primary/30" : "bg-white dark:bg-impact-surface/60 border-zinc-200 dark:border-zinc-800 hover:border-impact-primary/50 dark:hover:border-zinc-700"}`}>
                        <div className="flex items-center gap-3 sm:gap-4">
                          <button onClick={() => toggleMeal(meal.id)} className={`flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border-2 transition-all ${isDone ? "bg-impact-primary border-impact-primary text-black shadow-[0_0_10px_rgba(249,115,22,0.4)]" : "border-zinc-300 dark:border-zinc-600 text-transparent hover:border-impact-primary"}`}>
                            <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />
                          </button>
                          <div>
                            <span className="text-[10px] sm:text-xs font-bold text-impact-primary uppercase tracking-wider">{meal.type}</span>
                            <h3 className={`text-base sm:text-lg font-bold transition-colors duration-300 ${isDone ? "text-zinc-400 dark:text-zinc-500 line-through decoration-impact-primary/50" : "text-zinc-900 dark:text-white"}`}>{meal.name}</h3>
                          </div>
                        </div>
                        <div className={`flex items-center gap-3 sm:gap-6 bg-zinc-50 dark:bg-impact-dark/50 px-3 sm:px-4 py-2 sm:py-3 rounded-xl border border-zinc-200 dark:border-zinc-800/50 transition-all duration-300 ${isDone ? "opacity-50" : "opacity-100"}`}>
                          <div className="text-center min-w-[40px] sm:min-w-[50px]">
                            <div className="text-base sm:text-lg font-black text-zinc-900 dark:text-white">{meal.calories}</div>
                            <div className="text-[9px] sm:text-[10px] text-zinc-500 font-medium uppercase">Kcal</div>
                          </div>
                          <div className="w-px h-6 sm:h-8 bg-zinc-200 dark:bg-zinc-800" />
                          <div className="flex gap-2 sm:gap-4">
                            <div className="space-y-1"><div className="flex justify-between text-[9px] sm:text-[10px] text-zinc-500 dark:text-zinc-400 font-medium"><span>Pro</span> <span className="text-zinc-900 dark:text-white">{meal.protein}g</span></div><div className="w-12 sm:w-16 h-1 sm:h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden"><div className="h-full bg-blue-500" style={{ width: `${(meal.protein / 50) * 100}%` }} /></div></div>
                            <div className="space-y-1"><div className="flex justify-between text-[9px] sm:text-[10px] text-zinc-500 dark:text-zinc-400 font-medium"><span>Karb</span> <span className="text-zinc-900 dark:text-white">{meal.carbs}g</span></div><div className="w-12 sm:w-16 h-1 sm:h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden"><div className="h-full bg-emerald-500" style={{ width: `${(meal.carbs / 70) * 100}%` }} /></div></div>
                            <div className="space-y-1"><div className="flex justify-between text-[9px] sm:text-[10px] text-zinc-500 dark:text-zinc-400 font-medium"><span>Yağ</span> <span className="text-zinc-900 dark:text-white">{meal.fat}g</span></div><div className="w-12 sm:w-16 h-1 sm:h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden"><div className="h-full bg-yellow-500" style={{ width: `${(meal.fat / 30) * 100}%` }} /></div></div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </div>
          </div>
        </main>
        <ChatWindow isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      </div>
    </div>
  );
}
