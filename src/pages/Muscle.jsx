import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, LogOut, User as UserIcon, Dumbbell, CheckCircle2, Circle, Trophy, Info, Activity } from "lucide-react";
import Sidebar from "@/components/ui/Sidebar";
import ChatWindow from "@/components/Chatbot/ChatWindow";
import { useAuth } from "@/context/AuthContext";
import { logoutUser } from "@/services/authService";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import confetti from "canvas-confetti"; 

const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const itemVariants = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 22 } } };

export default function Muscle() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [programLevel, setProgramLevel] = useState("beginner"); 
  const [exercises, setExercises] = useState([
    { id: "ex1", name: "Incline Dumbbell Press", sets: 3, reps: 10, targetMuscle: "Üst Göğüs", isCompleted: false },
    { id: "ex2", name: "Flat Bench Press", sets: 3, reps: 10, targetMuscle: "Orta Göğüs", isCompleted: false },
    { id: "ex3", name: "Cable Fly", sets: 4, reps: 12, targetMuscle: "Alt Göğüs", isCompleted: false },
    { id: "ex4", name: "Overhead Triceps Extension", sets: 3, reps: 12, targetMuscle: "Arka Kol", isCompleted: false },
  ]);
  const [isAllCompleted, setIsAllCompleted] = useState(false);
  const [activeMuscleGroup, setActiveMuscleGroup] = useState("");

  // 🚀 UX DOKUNUŞU: İlerleme Yüzdesi Hesaplama
  const completedCount = exercises.filter(ex => ex.isCompleted).length;
  const progressPercentage = (completedCount / exercises.length) * 100;

  const handleLogout = async () => { try { await logoutUser(); navigate("/"); } catch (error) {} };

  const toggleExercise = (id, targetMuscle) => {
    setActiveMuscleGroup(targetMuscle);
    setExercises(prev => {
      const updated = prev.map(ex => ex.id === id ? { ...ex, isCompleted: !ex.isCompleted } : ex);
      const allDone = updated.every(ex => ex.isCompleted);
      
      if (allDone && !isAllCompleted) { triggerConfetti(); setIsAllCompleted(true); } 
      else if (!allDone) { setIsAllCompleted(false); }
      return updated;
    });
  };

  const triggerConfetti = () => {
    confetti({ particleCount: 140, spread: 65, origin: { y: 0.6 }, colors: ['#FF6B35', '#10b981', '#3b82f6'] });
    toast.success("Antrenman Tamamlandı!", { description: "Tebrikler, bugünün hedeflerine ulaştın!", icon: "🏆" });
  };

  const levelText = { beginner: "Başlangıç Seviyesi", intermediate: "Orta Seviye", advanced: "İleri Seviye" };

  return (
    <div className="flex h-screen bg-zinc-50 dark:bg-impact-dark overflow-hidden text-zinc-900 dark:text-white transition-colors duration-300">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <header className="h-16 border-b border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-impact-surface/50 backdrop-blur-md flex items-center justify-between px-4 sm:px-6 lg:px-8 z-10">
          <div className="flex items-center gap-4">
            <button className="lg:hidden p-2 text-zinc-500 hover:text-impact-primary" onClick={() => setIsSidebarOpen(true)}><Menu className="w-6 h-6" /></button>
            <h2 className="text-lg sm:text-xl font-bold hidden sm:flex items-center gap-2"><Dumbbell className="w-5 h-5 text-impact-primary" /> Kas Gelişimi</h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-zinc-100 dark:bg-impact-dark px-3 py-1.5 rounded-full border border-zinc-200 dark:border-zinc-800">
              <UserIcon className="w-4 h-4 text-zinc-500" />
              <span className="text-sm font-medium">{currentUser?.displayName || "Emrullah"}</span>
            </div>
            <button onClick={handleLogout} className="p-2 text-zinc-500 hover:text-red-500 rounded-lg"><LogOut className="w-5 h-5" /></button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 custom-scrollbar">
          <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8 pb-20">
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-impact-surface p-5 sm:p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
              <div className="flex-1 w-full">
                <h1 className="text-xl sm:text-3xl font-black tracking-tight mb-4">Günün Programı: <span className="text-impact-primary">Göğüs</span></h1>
                
                {/* 🚀 UX DOKUNUŞU: Dinamik Animasyonlu Progress Bar */}
                <div className="w-full max-w-md pr-4">
                  <div className="flex justify-between text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-2">
                    <span>İlerleme</span>
                    <span>{completedCount} / {exercises.length}</span>
                  </div>
                  <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-900 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }} 
                      animate={{ width: `${progressPercentage}%` }} 
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className="h-full bg-impact-primary rounded-full shadow-[0_0_10px_rgba(249,115,22,0.5)]"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4 shrink-0">
                <div className="flex items-center gap-2 px-4 py-2 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl">
                  <Activity className="w-4 h-4 text-impact-primary" />
                  <span className="text-sm font-bold">{levelText[programLevel]}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              <div className="lg:col-span-2 space-y-4">
                <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-3">
                  {exercises.map((ex, index) => (
                    <motion.div 
                      key={ex.id} variants={itemVariants} onClick={() => toggleExercise(ex.id, ex.targetMuscle)}
                      className={`group cursor-pointer flex items-center justify-between p-4 sm:p-5 rounded-2xl border transition-all duration-300 shadow-sm ${ex.isCompleted ? "bg-impact-primary/5 border-impact-primary/20" : "bg-white dark:bg-impact-surface border-zinc-200 dark:border-zinc-800 hover:border-impact-primary/40"}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`${ex.isCompleted ? "text-impact-primary" : "text-zinc-300 dark:text-zinc-600"}`}>
                          {ex.isCompleted ? <CheckCircle2 className="w-6 h-6 sm:w-7 h-7" /> : <Circle className="w-6 h-6 sm:w-7 h-7" />}
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-0.5">Hareket {index + 1} — {ex.targetMuscle}</span>
                          <h3 className={`text-base sm:text-lg font-bold ${ex.isCompleted ? "text-zinc-400 line-through decoration-impact-primary/40" : ""}`}>{ex.name}</h3>
                        </div>
                      </div>
                      <div className={`flex gap-4 items-center font-black text-sm sm:text-base ${ex.isCompleted ? "opacity-40" : "opacity-100"}`}>
                        <div className="bg-zinc-50 dark:bg-zinc-900 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800">{ex.sets} <span className="text-[10px] text-zinc-400 uppercase">Set</span></div>
                        <div className="bg-zinc-50 dark:bg-zinc-900 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800">{ex.reps} <span className="text-[10px] text-zinc-400 uppercase">Rep</span></div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              <div className="space-y-6">
                <div className="bg-white dark:bg-impact-surface p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm sticky top-6">
                  <h3 className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2"><Info className="w-4 h-4 text-impact-primary" /> Hedef Kas Odak Alanı</h3>
                  <div className="aspect-square bg-zinc-50 dark:bg-zinc-900/40 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-center p-4 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-impact-primary/10 via-transparent to-transparent opacity-60" />
                    <img src="/assets/muscle-map.svg" alt="Kas Haritası" className="w-full h-full object-contain relative z-10 dark:opacity-90 dark:invert" 
                      onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = `<span class="text-xs text-zinc-400 font-bold uppercase tracking-widest text-center">muscle-map.svg<br/><span class="text-[10px] lowercase text-impact-primary font-black">${activeMuscleGroup || "Seçim Bekleniyor"}</span></span>`; }}
                    />
                  </div>
                  <AnimatePresence mode="wait">
                    {isAllCompleted ? (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 p-4 rounded-2xl bg-impact-primary/10 border border-impact-primary/30 flex items-center gap-3 text-impact-primary">
                        <Trophy className="w-5 h-5 animate-bounce" />
                        <div><p className="font-bold text-sm">Günün Kas Görevi Bitti!</p></div>
                      </motion.div>
                    ) : (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 text-zinc-500 text-xs font-medium text-center">
                        {activeMuscleGroup ? `Şu an hedeflenen bölge: ${activeMuscleGroup}` : "Listeyi tamamla."}
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
