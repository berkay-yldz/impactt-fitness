import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, Drumstick, Wheat, Droplet, Carrot, Apple } from "lucide-react";
import foodData from "@/data/kaggleFood.json";

const CATEGORIES = [
  { value: null, label: "Tümü", icon: null, color: "text-zinc-500" },
  { value: "protein", label: "Protein", icon: Drumstick, color: "text-red-500" },
  { value: "carb", label: "Karbonhidrat", icon: Wheat, color: "text-amber-500" },
  { value: "fat", label: "Yağ", icon: Droplet, color: "text-yellow-500" },
  { value: "veggie", label: "Sebze", icon: Carrot, color: "text-emerald-500" },
  { value: "fruit", label: "Meyve", icon: Apple, color: "text-rose-500" },
];

export default function FoodSelectorModal({ isOpen, onClose, onSelect, mealType }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(null);

  const filteredFoods = useMemo(() => {
    const q = query.trim().toLowerCase();
    return foodData.filter((food) => {
      if (category && food.category !== category) return false;
      if (q && !food.name.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [query, category]);

  const handleSelect = (food) => {
    onSelect(food);
    setQuery("");
    setCategory(null);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 280, damping: 26 }}
            className="relative w-full max-w-2xl max-h-[85vh] flex flex-col bg-white dark:bg-impact-surface border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="flex items-start justify-between p-5 border-b border-zinc-200 dark:border-zinc-800">
              <div>
                <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest">Yiyecek Seç</span>
                <h3 className="text-xl font-black text-zinc-900 dark:text-white mt-1">
                  {mealType ? `${mealType} Öğünü` : "Yiyecek Listesi"}
                </h3>
              </div>
              <button
                onClick={onClose}
                aria-label="Kapat"
                className="p-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 border-b border-zinc-200 dark:border-zinc-800 space-y-3">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Yiyecek ara... (örn: tavuk, yulaf)"
                  autoFocus
                  className="w-full pl-11 pr-4 py-3 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm font-medium text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>

              <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
                {CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  const isActive = category === cat.value;
                  return (
                    <button
                      key={cat.label}
                      onClick={() => setCategory(cat.value)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors border ${
                        isActive
                          ? "bg-orange-500 text-white border-orange-500"
                          : "bg-zinc-50 dark:bg-zinc-900/50 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:border-orange-300"
                      }`}
                    >
                      {Icon && <Icon className={`w-3.5 h-3.5 ${isActive ? "text-white" : cat.color}`} />}
                      {cat.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-5">
              {filteredFoods.length === 0 ? (
                <div className="text-center py-12 text-zinc-400 text-sm font-medium">
                  Sonuç bulunamadı 🔍
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredFoods.map((food) => {
                    const catMeta = CATEGORIES.find(c => c.value === food.category);
                    const Icon = catMeta?.icon;
                    return (
                      <button
                        key={food.id}
                        onClick={() => handleSelect(food)}
                        className="w-full flex items-center justify-between gap-3 p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 hover:border-orange-400 hover:bg-orange-50/50 dark:hover:bg-orange-500/10 transition-all text-left group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {Icon && (
                            <div className={`w-9 h-9 rounded-xl bg-white dark:bg-zinc-800 flex items-center justify-center border border-zinc-200 dark:border-zinc-700 shrink-0 ${catMeta.color}`}>
                              <Icon className="w-4 h-4" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <h4 className="text-sm font-bold text-zinc-900 dark:text-white truncate">{food.name}</h4>
                            <div className="flex gap-2 mt-0.5 text-[10px] font-bold text-zinc-500">
                              <span>{food.calories} kcal</span>
                              <span>•</span>
                              <span className="text-blue-500">P {food.protein}g</span>
                              <span className="text-green-500">K {food.carbs}g</span>
                              <span className="text-orange-500">Y {food.fat}g</span>
                            </div>
                          </div>
                        </div>
                        <span className="text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity text-xs font-black shrink-0">
                          SEÇ →
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="px-5 py-3 border-t border-zinc-200 dark:border-zinc-800 text-[11px] text-zinc-400 font-medium text-center">
              {filteredFoods.length} yiyecek listede
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
