import { useState, useEffect } from "react";
import { Utensils, Flame, Dumbbell, HeartPulse, RefreshCw, Circle, CheckCircle2 } from "lucide-react";
import Sidebar from "@/components/ui/Sidebar";
import PageHeader from "@/components/ui/PageHeader";
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
    <div className="flex h-screen bg-zinc-50 dark:bg-impact-dark overflow-hidden text-zinc-900 dark:text-white transition-colors duration-300">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <PageHeader
          title="Beslenme Modülü"
          icon={Utensils}
          onMenuClick={() => setIsSidebarOpen(true)}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 relative custom-scrollbar">
          <div className="max-w-5xl mx-auto pb-10">

            <div className="bg-white dark:bg-impact-surface border border-zinc-200 dark:border-zinc-800 rounded-[2rem] p-8 shadow-sm mb-12 transition-colors duration-300">
              <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                  <h2 className="text-3xl font-black tracking-tight mb-2">Hedefine Uygun Beslen</h2>
                  <p className="text-zinc-500 dark:text-zinc-400 font-medium">Sistemin sana özel oluşturduğu makro planı.</p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex bg-zinc-100 dark:bg-impact-dark p-1.5 rounded-2xl transition-colors duration-300">
                    {["Kilo Ver", "Kas Yap", "Kondisyon"].map((goal) => (
                      <button key={goal} onClick={() => setActiveGoal(goal)} className={`px-5 py-2.5 rounded-xl font-bold transition-all ${activeGoal === goal ? "bg-white dark:bg-impact-surface shadow-sm text-orange-500" : "text-zinc-500 dark:text-zinc-400"}`}>
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
                <div key={idx} className="bg-white dark:bg-impact-surface border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 flex items-center justify-between shadow-sm hover:border-orange-200 dark:hover:border-orange-500/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <button onClick={() => toggleMeal(idx)}>{meal.completed ? <CheckCircle2 className="w-7 h-7 text-orange-500" /> : <Circle className="w-7 h-7 text-zinc-300 dark:text-zinc-700 hover:text-orange-300" />}</button>
                    <div>
                      <p className="text-orange-500 text-[10px] font-black uppercase tracking-widest">{meal.type}</p>
                      <h4 className={`text-lg font-bold ${meal.completed ? 'text-zinc-400 dark:text-zinc-600 line-through' : ''}`}>{meal.name}</h4>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 px-4 py-2 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl overflow-x-auto whitespace-nowrap transition-colors duration-300">
                    <span className="text-xs font-black">KCAL {meal.calories}</span>
                    <span className="text-xs font-black text-blue-600 dark:text-blue-400">PRO {meal.protein}g</span>
                    <span className="text-xs font-black text-green-600 dark:text-green-400">KARB {meal.carbs}g</span>
                    <span className="text-xs font-black text-orange-600 dark:text-orange-400">YAĞ {meal.fat}g</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
