import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, LogOut, User as UserIcon, Dumbbell, CheckCircle2, Circle, Trophy, Info, Activity } from "lucide-react";
import Sidebar from "@/components/ui/Sidebar";
import ChatWindow from "@/components/Chatbot/ChatWindow";
import { useAuth } from "@/context/AuthContext";
import { logoutUser } from "@/services/authService";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import confetti from "canvas-confetti"; // Paketi artık güvenle direkt import edebiliriz

// [VARYASYONLAR] Framer Motion akıcı giriş animasyonları
const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 22 } }
};

export default function Muscle() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // [ANAYASA UYUMU] Berkay'ın programLevel durumuna göre okuyup güncelleyeceği state
  const [programLevel, setProgramLevel] = useState("beginner"); 

  // [ANAYASA UYUMU] Günün antrenman listesi
  const [exercises, setExercises] = useState([
    { id: "ex1", name: "Incline Dumbbell Press", sets: 3, reps: 10, targetMuscle: "Üst Göğüs", isCompleted: false },
    { id: "ex2", name: "Flat Bench Press", sets: 3, reps: 10, targetMuscle: "Orta Göğüs", isCompleted: false },
    { id: "ex3", name: "Cable Fly", sets: 4, reps: 12, targetMuscle: "Alt Göğüs", isCompleted: false },
    { id: "ex4", name: "Overhead Triceps Extension", sets: 3, reps: 12, targetMuscle: "Arka Kol", isCompleted: false },
  ]);
  const [isAllCompleted, setIsAllCompleted] = useState(false);

  // [MOCK BÖLGESİ] Tıklanan son egzersizin kas grubunu saklar (Muscle map vurgusu için)
  const [activeMuscleGroup, setActiveMuscleGroup] = useState("");

  const handleLogout = async () => {
    try { await logoutUser(); navigate("/"); } catch (error) {}
  };

  // [LOGIC TETİKLEYİCİ] Checkbox işaretleme akışı
  const toggleExercise = (id, targetMuscle) => {
    setActiveMuscleGroup(targetMuscle);
    
    setExercises(prev => {
      const updated = prev.map(ex => ex.id === id ? { ...ex, isCompleted: !ex.isCompleted } : ex);
      const allDone = updated.every(ex => ex.isCompleted);
      
      // [ANAYASA UYUMU] Tüm egzersizler bittiğinde konfeti patlar
      if (allDone && !isAllCompleted) {
        triggerConfetti();
        setIsAllCompleted(true);
      } else if (!allDone) {
        setIsAllCompleted(false);
      }
      
      return updated;
    });
  };

  // [ANAYASA UYUMU] canvas-confetti entegrasyonu
  const triggerConfetti = () => {
    confetti({
      particleCount: 140,
      spread: 65,
      origin: { y: 0.6 },
      colors: ['#FF6B35', '#10b981', '#3b82f6']
    });
    toast.success("Antrenman Tamamlandı!", { 
      description: "Tebrikler, bugünün tüm kas gelişim hedeflerine ulaştın!", 
      icon: "🏆" 
    });
  };

  // [MOCK ADAPTİF TOAST TESTİ] Seviye düşürme mekanizması UI testi
  const simulateLevelDowngrade = () => {
    toast.error("Program Seviyesi Düştü!", {
      description: "Art arda 3 başarısız tekrar saptandı. Sistem otomatik olarak bir alt zorluğa adapte oldu.",
      duration: 5000
    });
  };

  const levelText = { beginner: "Başlangıç Seviyesi", intermediate: "Orta Seviye", advanced: "İleri Seviye" };

  return (
    <div className="flex h-screen bg-zinc-50 dark:bg-impact-dark overflow-hidden text-zinc-900 dark:text-white transition-colors duration-300">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* HEADER */}
        <header className="h-16 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-impact-surface flex items-center justify-between px-4 sm:px-6 lg:px-8 transition-colors duration-300">
          <div className="flex items-center gap-4">
            <button className="lg:hidden p-2 text-zinc-500 dark:text-zinc-400 hover:text-impact-primary" onClick={() => setIsSidebarOpen(true)}>
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-lg sm:text-xl font-bold hidden sm:block flex items-center gap-2">
              <Dumbbell className="w-5 h-5 text-impact-primary" /> Kas Gelişimi Modülü
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-zinc-100 dark:bg-impact-dark px-3 py-1.5 rounded-full border border-zinc-200 dark:border-zinc-800 ml-2">
              <div className="w-6 h-6 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-zinc-500">
                <UserIcon className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{currentUser?.displayName || "Sporcu"}</span>
            </div>
            <button onClick={handleLogout} className="p-2 text-zinc-500 hover:text-red-500 rounded-lg ml-1 transition-colors">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* ANA İÇERİK ALANI */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 relative custom-scrollbar">
          <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8 pb-20">
            
            {/* Üst Bilgilendirme ve Seviye Rozet Kartı */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-impact-surface p-5 sm:p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm transition-colors duration-300">
              <div>
                <h1 className="text-xl sm:text-3xl font-black text-zinc-900 dark:text-white tracking-tight">Günün Programı: <span className="text-impact-primary">Hipertrofi / Göğüs</span></h1>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Egzersizleri tamamladıkça yanlarındaki kutucukları işaretle.</p>
              </div>
              
              {/* [ANAYASA UYUMU] Program seviyesi badge'i */}
              <div className="flex items-center gap-4">
                <button 
                  onClick={simulateLevelDowngrade} 
                  className="text-[10px] text-zinc-400 underline opacity-40 hover:opacity-100 transition-opacity"
                >
                  (Test) Seviye Düşür
                </button>
                <div className="flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl w-fit">
                  <Activity className="w-4 h-4 text-impact-primary" />
                  <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300">{levelText[programLevel]}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              
              {/* SOL SÜTUN: INTERAKTIF EGZERSİZ LİSTESİ */}
              <div className="lg:col-span-2 space-y-4">
                <h2 className="text-base font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest px-1">Egzersiz Reçetesi</h2>
                <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-3">
                  {exercises.map((ex, index) => (
                    <motion.div 
                      key={ex.id} 
                      variants={itemVariants}
                      onClick={() => toggleExercise(ex.id, ex.targetMuscle)}
                      className={`group cursor-pointer flex items-center justify-between p-4 sm:p-5 rounded-2xl border transition-all duration-300 shadow-sm ${
                        ex.isCompleted 
                          ? "bg-impact-primary/5 border-impact-primary/20 dark:border-impact-primary/30" 
                          : "bg-white dark:bg-impact-surface border-zinc-200 dark:border-zinc-800 hover:border-impact-primary/40 dark:hover:border-zinc-700"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        {/* [ANAYASA UYUMU] Tamamlandı Checkbox Alanı */}
                        <div className={`transition-colors duration-300 ${ex.isCompleted ? "text-impact-primary" : "text-zinc-300 dark:text-zinc-600 group-hover:text-impact-primary/60"}`}>
                          {ex.isCompleted ? <CheckCircle2 className="w-6 h-6 sm:w-7 h-7" /> : <Circle className="w-6 h-6 sm:w-7 h-7" />}
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block mb-0.5">Hareket {index + 1} — {ex.targetMuscle}</span>
                          <h3 className={`text-base sm:text-lg font-bold transition-colors duration-300 ${ex.isCompleted ? "text-zinc-400 dark:text-zinc-500 line-through decoration-impact-primary/40" : "text-zinc-900 dark:text-white"}`}>
                            {ex.name}
                          </h3>
                        </div>
                      </div>
                      
                      {/* Set ve Rep Bilgileri */}
                      <div className={`flex gap-4 items-center font-black text-sm sm:text-base transition-opacity duration-300 ${ex.isCompleted ? "opacity-40" : "opacity-100"}`}>
                        <div className="bg-zinc-100 dark:bg-zinc-900 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800">
                          {ex.sets} <span className="text-[10px] font-bold text-zinc-400 uppercase ml-0.5">Set</span>
                        </div>
                        <div className="bg-zinc-100 dark:bg-zinc-900 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800">
                          {ex.reps} <span className="text-[10px] font-bold text-zinc-400 uppercase ml-0.5">Tekrar</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              {/* SAĞ SÜTUN: MUSCLE MAP (KAS HARİTASI) */}
              <div className="space-y-6">
                <div className="bg-white dark:bg-impact-surface p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm sticky top-6">
                  <h3 className="text-zinc-400 dark:text-zinc-400 text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Info className="w-4 h-4 text-impact-primary" /> Hedef Kas Odak Alanı
                  </h3>
                  
                  {/* [ANAYASA UYUMU] Muscle-map.svg alanı */}
                  <div className="aspect-square bg-zinc-50 dark:bg-zinc-900/40 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-center p-4 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-impact-primary/5 via-transparent to-transparent opacity-60" />
                    <img 
                      src="/assets/muscle-map.svg" 
                      alt="Kas Haritası" 
                      className="w-full h-full object-contain relative z-10 dark:opacity-90 drop-shadow-md dark:invert" 
                      onError={(e) => { 
                        e.target.style.display = 'none'; 
                        e.target.parentElement.innerHTML = `<span class="text-xs text-zinc-400 font-bold uppercase tracking-widest text-center">muscle-map.svg<br/><span class="text-[10px] lowercase text-impact-primary font-black">${activeMuscleGroup || "Seçim Bekleniyor"}</span></span>`;
                      }}
                    />
                  </div>

                  {/* Alt Bildirim Paneli */}
                  <AnimatePresence mode="wait">
                    {isAllCompleted ? (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 p-4 rounded-2xl bg-impact-primary/10 border border-impact-primary/30 flex items-center gap-3 text-impact-primary">
                        <Trophy className="w-5 h-5 flex-shrink-0 animate-bounce" />
                        <div>
                          <p className="font-bold text-sm">Günün Kas Görevi Bitti!</p>
                          <p className="text-xs opacity-90">Tüm seriler başarıyla tamamlandı.</p>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 text-zinc-500 text-xs font-medium text-center">
                        {activeMuscleGroup ? `Şu an hedeflenen bölge: ${activeMuscleGroup}` : "Günü başarıyla kapatmak için listedeki tüm antrenmanları tamamla."}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

            </div>
          </div>
        </main>
        
        <ChatWindow isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      </div>
    </div>
  );
}
