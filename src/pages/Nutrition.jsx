import { useState, useEffect, useMemo } from "react";
import { Utensils, Flame, Dumbbell, HeartPulse, RefreshCw, Circle, CheckCircle2, Replace, Target } from "lucide-react";
import Sidebar from "@/components/ui/Sidebar";
import PageHeader from "@/components/ui/PageHeader";
import FoodSelectorModal from "@/components/ui/FoodSelectorModal";
import { useAuth } from "@/context/AuthContext";
import { getUserProfile } from "@/services/dbService";
import { calculateCalorieTarget, GOAL_DESCRIPTIONS } from "@/utils/calorieCalculator";
import foodData from "../data/kaggleFood.json";

const MEAL_TYPES = ["SABAH", "ARA ÖĞÜN", "ÖĞLE", "ARA ÖĞÜN", "AKŞAM"];

export default function Nutrition() {
  const [meals, setMeals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeGoal, setActiveGoal] = useState("Kas Yap");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [editingMealIndex, setEditingMealIndex] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser?.uid) return;
    getUserProfile(currentUser.uid)
      .then((data) => { if (data) setProfileData(data); })
      .catch((err) => console.error("Profil çekilemedi:", err));
  }, [currentUser]);

  const calorieTarget = useMemo(
    () => calculateCalorieTarget(profileData, activeGoal),
    [profileData, activeGoal]
  );

  const fetchDietPlan = () => {
    setIsLoading(true);
    setTimeout(() => {
      const shuffled = [...foodData].sort(() => 0.5 - Math.random());
      const selectedFoods = shuffled.slice(0, 5);

      const newPlan = selectedFoods.map((item, index) => ({
        type: MEAL_TYPES[index],
        name: item.name,
        calories: item.calories,
        protein: item.protein,
        carbs: item.carbs,
        fat: item.fat,
        completed: false,
      }));
      setMeals(newPlan);
      setIsLoading(false);
    }, 500);
  };

  useEffect(() => { fetchDietPlan(); }, [activeGoal]);

  const toggleMeal = (index) => {
    const updated = [...meals];
    updated[index].completed = !updated[index].completed;
    setMeals(updated);
  };

  const replaceMeal = (food) => {
    if (editingMealIndex === null) return;
    const updated = [...meals];
    updated[editingMealIndex] = {
      ...updated[editingMealIndex],
      name: food.name,
      calories: food.calories,
      protein: food.protein,
      carbs: food.carbs,
      fat: food.fat,
    };
    setMeals(updated);
  };

  const totals = useMemo(() => {
    return meals.reduce(
      (acc, m) => ({
        calories: acc.calories + (m.calories || 0),
        protein: acc.protein + (m.protein || 0),
        carbs: acc.carbs + (m.carbs || 0),
        fat: acc.fat + (m.fat || 0),
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  }, [meals]);

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
                  <p className="text-zinc-500 dark:text-zinc-400 font-medium">Sistem öneriyor, sen istediğin gibi düzenle.</p>
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
                  <button onClick={fetchDietPlan} className="bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-2xl shadow-lg transition-all" title="Yeni rastgele plan öner">
                    <RefreshCw className={`w-6 h-6 ${isLoading ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>
            </div>

            {/* Günlük Kalori Hedefi — BMR/TDEE'den hesaplandı */}
            {calorieTarget ? (
              <div className="bg-gradient-to-br from-impact-primary/10 via-white dark:via-impact-surface to-orange-500/5 border border-impact-primary/30 rounded-3xl p-6 shadow-sm mb-6 relative overflow-hidden">
                <div className="absolute -top-16 -right-16 w-48 h-48 bg-impact-primary/10 rounded-full blur-3xl" />
                <div className="relative flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-2 bg-impact-primary text-black rounded-xl">
                        <Target className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-black text-impact-primary uppercase tracking-widest">Günlük Kalori Hedefin</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-black text-zinc-900 dark:text-white tabular-nums">{totals.calories}</span>
                      <span className="text-2xl text-zinc-400 font-bold tabular-nums">/ {calorieTarget.target}</span>
                      <span className="text-sm text-zinc-500 font-medium">kcal</span>
                    </div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium mt-1.5">
                      {GOAL_DESCRIPTIONS[calorieTarget.goalKey]} • TDEE {calorieTarget.tdee} kcal
                    </p>
                  </div>

                  <div className="text-right">
                    {totals.calories <= calorieTarget.target ? (
                      <p className="text-xs text-zinc-500 font-medium">Kalan</p>
                    ) : (
                      <p className="text-xs text-red-500 font-medium">Aştın</p>
                    )}
                    <p className={`text-2xl font-black tabular-nums ${totals.calories <= calorieTarget.target ? "text-emerald-600 dark:text-emerald-400" : "text-red-500"}`}>
                      {totals.calories <= calorieTarget.target ? "+" : "-"}{Math.abs(calorieTarget.target - totals.calories)} <span className="text-xs text-zinc-400 font-medium">kcal</span>
                    </p>
                  </div>
                </div>

                <div className="mt-5 h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${totals.calories > calorieTarget.target ? "bg-red-500" : "bg-impact-primary"}`}
                    style={{ width: `${Math.min(100, (totals.calories / calorieTarget.target) * 100)}%` }}
                  />
                </div>
              </div>
            ) : meals.length > 0 && (
              <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-2xl p-4 mb-6 text-center text-xs font-medium text-amber-700 dark:text-amber-300">
                💡 Profilini tamamla (yaş, kilo, boy, cinsiyet), kalori hedefin otomatik hesaplansın.
              </div>
            )}

            {/* Makro Kartları (hedef varsa X / Y, yoksa sadece toplam) */}
            {meals.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
                <div className="bg-white dark:bg-impact-surface border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 shadow-sm">
                  <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1">Protein</p>
                  <p className="text-xl font-black text-zinc-900 dark:text-white tabular-nums">
                    {totals.protein.toFixed(0)}
                    {calorieTarget && <span className="text-sm text-zinc-400 font-bold"> / {calorieTarget.macros.protein}</span>}
                    <span className="text-xs text-zinc-400 font-medium"> g</span>
                  </p>
                  {calorieTarget && (
                    <div className="mt-2 h-1 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.min(100, (totals.protein / calorieTarget.macros.protein) * 100)}%` }} />
                    </div>
                  )}
                </div>
                <div className="bg-white dark:bg-impact-surface border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 shadow-sm">
                  <p className="text-[10px] font-black text-green-500 uppercase tracking-widest mb-1">Karbonhidrat</p>
                  <p className="text-xl font-black text-zinc-900 dark:text-white tabular-nums">
                    {totals.carbs.toFixed(0)}
                    {calorieTarget && <span className="text-sm text-zinc-400 font-bold"> / {calorieTarget.macros.carbs}</span>}
                    <span className="text-xs text-zinc-400 font-medium"> g</span>
                  </p>
                  {calorieTarget && (
                    <div className="mt-2 h-1 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: `${Math.min(100, (totals.carbs / calorieTarget.macros.carbs) * 100)}%` }} />
                    </div>
                  )}
                </div>
                <div className="bg-white dark:bg-impact-surface border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 shadow-sm">
                  <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-1">Yağ</p>
                  <p className="text-xl font-black text-zinc-900 dark:text-white tabular-nums">
                    {totals.fat.toFixed(0)}
                    {calorieTarget && <span className="text-sm text-zinc-400 font-bold"> / {calorieTarget.macros.fat}</span>}
                    <span className="text-xs text-zinc-400 font-medium"> g</span>
                  </p>
                  {calorieTarget && (
                    <div className="mt-2 h-1 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full bg-orange-500 rounded-full" style={{ width: `${Math.min(100, (totals.fat / calorieTarget.macros.fat) * 100)}%` }} />
                    </div>
                  )}
                </div>
              </div>
            )}

            <h3 className="text-2xl font-black mb-6">🍎 Günlük Öğün Listesi</h3>
            <div className="space-y-4">
              {meals.map((meal, idx) => (
                <div key={idx} className="bg-white dark:bg-impact-surface border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 flex items-center justify-between shadow-sm hover:border-orange-200 dark:hover:border-orange-500/50 transition-colors">
                  <div className="flex items-center gap-4 min-w-0">
                    <button onClick={() => toggleMeal(idx)}>{meal.completed ? <CheckCircle2 className="w-7 h-7 text-orange-500" /> : <Circle className="w-7 h-7 text-zinc-300 dark:text-zinc-700 hover:text-orange-300" />}</button>
                    <div className="min-w-0">
                      <p className="text-orange-500 text-[10px] font-black uppercase tracking-widest">{meal.type}</p>
                      <h4 className={`text-lg font-bold truncate ${meal.completed ? 'text-zinc-400 dark:text-zinc-600 line-through' : ''}`}>{meal.name}</h4>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="hidden sm:flex items-center gap-6 px-4 py-2 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl overflow-x-auto whitespace-nowrap transition-colors duration-300">
                      <span className="text-xs font-black">KCAL {meal.calories}</span>
                      <span className="text-xs font-black text-blue-600 dark:text-blue-400">PRO {meal.protein}g</span>
                      <span className="text-xs font-black text-green-600 dark:text-green-400">KARB {meal.carbs}g</span>
                      <span className="text-xs font-black text-orange-600 dark:text-orange-400">YAĞ {meal.fat}g</span>
                    </div>
                    <button
                      onClick={() => setEditingMealIndex(idx)}
                      className="p-2.5 bg-orange-500/10 text-orange-500 border border-orange-500/30 rounded-xl hover:bg-orange-500 hover:text-white transition-colors shrink-0"
                      title="Bu öğünü değiştir"
                    >
                      <Replace className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      <FoodSelectorModal
        isOpen={editingMealIndex !== null}
        onClose={() => setEditingMealIndex(null)}
        onSelect={replaceMeal}
        mealType={editingMealIndex !== null ? meals[editingMealIndex]?.type : null}
      />
    </div>
  );
}
