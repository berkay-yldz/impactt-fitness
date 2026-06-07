import { useState, useEffect } from "react";
import { 
  Utensils, User, LogOut, Flame, Dumbbell, HeartPulse, RefreshCw, 
  Circle, CheckCircle2, Menu, X, LayoutDashboard, Activity, Camera, Crown 
} from "lucide-react";
import foodData from "../data/kaggleFood.json";

export default function Nutrition() {
  const [meals, setMeals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeGoal, setActiveGoal] = useState("Kas Yap");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const fetchDietPlan = () => {
    setIsLoading(true);
    setTimeout(() => {
      const shuffled = [...foodData].sort(() => 0.5 - Math.random());
      const selectedFoods = shuffled.slice(0, 5);
      const mealTypes = ["SABAH", "ARA ÖĞÜN", "ÖĞLE", "ARA ÖĞÜN", "AKŞAM"];
      
      const newPlan = selectedFoods.map((item, index) => {
        const itemName = item.name || item.Name || item.food || item.Besin || item.isim || "İsimsiz Yiyecek";
        const itemCal = item.calories || item.Calories || item.kalori || item.Kalori || item.KCAL || item.kcal || item.Enerji_kcal || 0;
        const itemPro = item.protein || item.Protein || item.pro || item.PRO || item.Pro_gram || 0;
        const itemCarb = item.carbs || item.Carbs || item.karbonhidrat || item.Karbonhidrat || item.karb || item.KARB || item.Karb_gram || 0;
        const itemFat = item.fat || item.Fat || item.yag || item.Yag || item.yağ || item.Yağ || item.Yag_gram || 0;

        return { type: mealTypes[index], name: itemName, calories: itemCal, protein: itemPro, carbs: itemCarb, fat: itemFat, completed: false };
      });
      setMeals(newPlan);
      setIsLoading(false);
    }, 500);
  };

  useEffect(() => { fetchDietPlan(); }, [activeGoal]);
  const toggleMeal = (index) => { const updated = [...meals]; updated[index].completed = !updated[index].completed; setMeals(updated); };

  return (
    <div className="min-h-screen bg-white text-zinc-900 relative flex flex-col">
      
      {/* --- EKLENEN KISIM: KARANLIK ARKA PLAN (OVERLAY) --- */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 transition-opacity"
          onClick={() => setIsSidebarOpen(false)} 
        ></div>
      )}

      {/* --- EKLENEN KISIM: SİYAH YAN MENÜ (SIDEBAR) --- */}
      <div className={`fixed top-0 left-0 h-full w-[280px] bg-[#121212] text-white z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        {/* Sidebar Üst Başlık */}
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-2 text-xl font-black tracking-tighter">
            <Dumbbell className="w-6 h-6 text-orange-500" />
            IMPACT <span className="text-white">AI</span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="text-zinc-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Sidebar Linkleri */}
        <nav className="flex flex-col gap-2 px-4 mt-2 font-medium text-sm text-zinc-400">
          <a href="/" className="flex items-center gap-3 px-4 py-3.5 rounded-xl hover:bg-zinc-800 hover:text-white transition-colors">
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </a>
          <a href="/posture" className="flex items-center gap-3 px-4 py-3.5 rounded-xl hover:bg-zinc-800 hover:text-white transition-colors">
            <Activity className="w-5 h-5" /> Postür
          </a>
          <a href="/muscle" className="flex items-center gap-3 px-4 py-3.5 rounded-xl hover:bg-zinc-800 hover:text-white transition-colors">
            <Dumbbell className="w-5 h-5" /> Kas Gelişimi
          </a>
          {/* Aktif Sayfa (Turuncu yanan) */}
          <a href="/nutrition" className="flex items-center gap-3 px-4 py-3.5 rounded-xl bg-orange-500/10 text-orange-500 border border-orange-500/20 transition-colors">
            <Utensils className="w-5 h-5" /> Beslenme
          </a>
          <a href="/premium" className="flex items-center justify-between px-4 py-3.5 rounded-xl hover:bg-zinc-800 hover:text-white transition-colors">
            <div className="flex items-center gap-3">
              <Camera className="w-5 h-5" /> Disiplin (Premium)
            </div>
            <Crown className="w-4 h-4 text-orange-500" />
          </a>
        </nav>
      </div>

      {/* --- MEVCUT SAYFA İÇERİĞİ --- */}
      <header className="flex items-center justify-between p-6 border-b border-zinc-100">
        <div className="flex items-center gap-4">
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 -ml-2 hover:bg-zinc-100 rounded-lg transition-colors">
            <Menu className="w-6 h-6 text-zinc-600" />
          </button>
          <div className="flex items-center gap-3 text-xl font-black">
            <Utensils className="w-6 h-6 text-orange-500" /> Beslenme Modülü
          </div>
        </div>
        
        <div className="flex items-center gap-4 border rounded-full px-4 py-2 text-sm font-bold">
          <User className="w-4 h-4" /> Emrullah Karataş <LogOut className="w-4 h-4 ml-2 cursor-pointer" />
        </div>
      </header>

      {/* STANDARTLAŞTIRILMIŞ MAIN ETİKETİ */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 relative custom-scrollbar">
        {/* Tasarım bozulmasın diye max-w-5xl buraya eklendi */}
        <div className="max-w-5xl mx-auto pb-10">
          
          <div className="bg-white border border-zinc-100 rounded-[2rem] p-8 shadow-sm mb-12">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div>
                <h2 className="text-3xl font-black tracking-tight mb-2">Hedefine Uygun Beslen</h2>
                <p className="text-zinc-500 font-medium">Sistemin sana özel oluşturduğu makro planı.</p>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="flex bg-zinc-50 p-1.5 rounded-2xl">
                  {["Kilo Ver", "Kas Yap", "Kondisyon"].map((goal) => (
                    <button key={goal} onClick={() => setActiveGoal(goal)} className={`px-5 py-2.5 rounded-xl font-bold transition-all ${activeGoal === goal ? "bg-white shadow-sm text-orange-500" : "text-zinc-500"}`}>
                      {goal === "Kilo Ver" && <Flame className="inline w-4 h-4 mr-1" />}
                      {goal === "Kas Yap" && <Dumbbell className="inline w-4 h-4 mr-1" />}
                      {goal === "Kondisyon" && <HeartPulse className="inline w-4 h-4 mr-1" />}
                      {goal}
                    </button>
                  ))}
                </div>
                <button onClick={fetchDietPlan} className="bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-2xl shadow-lg transition-all">
                  <RefreshCw className={`w-6 h-6 ${isLoading ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>
          </div>

          <h3 className="text-2xl font-black mb-6">🍎 Günlük Öğün Listesi</h3>
          <div className="space-y-4">
            {meals.map((meal, idx) => (
              <div key={idx} className="bg-white border border-zinc-100 rounded-2xl p-5 flex items-center justify-between shadow-sm hover:border-orange-200 transition-colors">
                <div className="flex items-center gap-4">
                  <button onClick={() => toggleMeal(idx)}>{meal.completed ? <CheckCircle2 className="w-7 h-7 text-orange-500" /> : <Circle className="w-7 h-7 text-zinc-200 hover:text-orange-300" />}</button>
                  <div>
                    <p className="text-orange-500 text-[10px] font-black uppercase tracking-widest">{meal.type}</p>
                    <h4 className={`text-lg font-bold ${meal.completed ? 'text-zinc-400 line-through' : ''}`}>{meal.name}</h4>
                  </div>
                </div>
                <div className="flex items-center gap-6 px-4 py-2 bg-zinc-50 rounded-xl overflow-x-auto whitespace-nowrap">
                  <span className="text-xs font-black">KCAL {meal.calories}</span>
                  <span className="text-xs font-black text-blue-600">PRO {meal.protein}g</span>
                  <span className="text-xs font-black text-green-600">KARB {meal.carbs}g</span>
                  <span className="text-xs font-black text-orange-600">YAĞ {meal.fat}g</span>
                </div>
              </div>
            ))}
          </div>
          
        </div>
      </main>
    </div>
  );
}