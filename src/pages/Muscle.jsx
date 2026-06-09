import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dumbbell,
  CheckCircle2,
  Circle,
  Trophy,
  Info,
  Activity,
  XCircle,
  ArrowRight,
  Calendar,
  PlayCircle,
} from "lucide-react";
import Sidebar from "@/components/ui/Sidebar";
import PageHeader from "@/components/ui/PageHeader";
import ExerciseVideoModal from "@/components/ui/ExerciseVideoModal";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import Lottie from "lottie-react";

import { getUserProfile } from "@/services/dbService";
import { recordExerciseResult } from "@/utils/adaptiveLogic";
import programDecks from "@/data/programDecks.json";

import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/services/firebase";

const SafeLottie = Lottie && Lottie.default ? Lottie.default : Lottie;
const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 260, damping: 22 },
  },
};
const levelText = {
  beginner: "Başlangıç Seviyesi",
  intermediate: "Orta Seviye",
  advanced: "İleri Seviye",
};

export default function Muscle() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [demoExercise, setDemoExercise] = useState(null);
  const [trophyAnimation, setTrophyAnimation] = useState(null);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [programLevel, setProgramLevel] = useState("beginner");
  const [exercises, setExercises] = useState([]);
  const [isAllCompleted, setIsAllCompleted] = useState(false);
  const [activeMuscleGroup, setActiveMuscleGroup] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [currentWeek, setCurrentWeek] = useState(1);
  const [currentDay, setCurrentDay] = useState(1);

  useEffect(() => {
    const fetchUserProgram = async () => {
      if (!currentUser) return;

      try {
        const profile = await getUserProfile(currentUser.uid);
        const level = profile?.programLevel || "beginner";
        const week = profile?.currentWeek || 1; 
        const day = profile?.currentDay || 1; 

        setProgramLevel(level);
        setCurrentWeek(week);
        setCurrentDay(day);

        if (programDecks && programDecks[level]) {
          const todaysExercises = programDecks[level]
            .filter((ex) => ex.week === 1 && ex.day === day) 
            .map((ex) => ({ ...ex, isCompleted: false }));
          setExercises(todaysExercises);
        }
      } catch (error) {
        console.error("Program yüklenirken hata:", error);
        toast.error("Program yüklenemedi.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProgram();

    fetch("/lottie/trophy.json")
      .then((res) => res.json())
      .then((data) => setTrophyAnimation(data))
      .catch(() => console.error("Kupa animasyonu yüklenemedi"));
  }, [currentUser]);

  const completedCount = exercises.filter((ex) => ex.isCompleted).length;
  const progressPercentage =
    exercises.length > 0 ? (completedCount / exercises.length) * 100 : 0;

  const toggleExercise = async (id, targetMuscle) => {
    setActiveMuscleGroup(targetMuscle);

    setExercises((prev) => {
      const updated = prev.map((ex) =>
        ex.id === id ? { ...ex, isCompleted: !ex.isCompleted } : ex,
      );
      const allDone =
        updated.length > 0 && updated.every((ex) => ex.isCompleted);

      if (allDone && !isAllCompleted) {
        triggerConfetti();
        setIsAllCompleted(true);
      } else if (!allDone) {
        setIsAllCompleted(false);
      }
      return updated;
    });

    const targetEx = exercises.find((e) => e.id === id);
    if (targetEx && !targetEx.isCompleted && currentUser?.uid) {
      const result = await recordExerciseResult(currentUser.uid, id, "success", programLevel);
      
      if (result && result.upgraded) {
        toast.success("Adaptif Zeka Devrede!", {
          description: `Çok hızlı güçleniyorsun! Seviyen ${levelText[result.newLevel]} olarak anında yükseltildi.`,
          icon: "🚀",
        });
        
        setProgramLevel(result.newLevel);
        if (programDecks && programDecks[result.newLevel]) {
          const newExercises = programDecks[result.newLevel]
            .filter((ex) => ex.week === 1 && ex.day === currentDay) 
            .map((ex) => ({ ...ex, isCompleted: false }));
          setExercises(newExercises);
          setIsAllCompleted(false);
        }
      }
    }
  };

  const handleFailTest = async (id, e) => {
    e.stopPropagation();
    if (!currentUser?.uid) return;

    toast.error("Zorlanma Kaydedildi", {
      description: "Yapay zeka bunu hafızaya aldı.",
    });

    const result = await recordExerciseResult(
      currentUser.uid,
      id,
      "fail",
      programLevel,
    );

    if (result && result.downgraded) {
      toast.info("Programınız Hafifletildi!", {
        description: `Bugünkü zorlanmanızdan dolayı oturum programınız ${levelText[result.newLevel]} olarak güncellendi.`,
        icon: "🤖",
      });

      setProgramLevel(result.newLevel);
      if (programDecks && programDecks[result.newLevel]) {
        const newExercises = programDecks[result.newLevel]
          .filter((ex) => ex.week === 1 && ex.day === currentDay) 
          .map((ex) => ({ ...ex, isCompleted: false }));
        setExercises(newExercises);
        setIsAllCompleted(false);
      }
    }
  };

  const advanceToNextDay = async () => {
    if (!currentUser?.uid) return;

    let nextDay = currentDay + 1;
    let nextWeek = currentWeek;
    let nextLevel = programLevel;
    let isLevelUp = false;

    if (nextDay > 3) {
      nextDay = 1;
      nextWeek += 1;

      if (nextWeek > 4) {
        if (programLevel === "beginner") {
          nextLevel = "intermediate";
          isLevelUp = true;
        } else if (programLevel === "intermediate") {
          nextLevel = "advanced";
          isLevelUp = true;
        }
        
        nextWeek = 1; 
      }
    }

    try {
      const userRef = doc(db, "users", currentUser.uid);
      const updateData = { currentWeek: nextWeek, currentDay: nextDay };
      if (isLevelUp) updateData.programLevel = nextLevel; 
      
      await updateDoc(userRef, updateData);

      setCurrentWeek(nextWeek);
      setCurrentDay(nextDay);
      if (isLevelUp) setProgramLevel(nextLevel);
      setIsAllCompleted(false);
      setActiveMuscleGroup("");

      if (programDecks && programDecks[nextLevel]) {
        const newExercises = programDecks[nextLevel]
          .filter((ex) => ex.week === 1 && ex.day === nextDay)
          .map((ex) => ({ ...ex, isCompleted: false }));
        setExercises(newExercises);
      }

      if (isLevelUp) {
        toast.success(`Üst Sıklete Çıktın! Yeni Seviye: ${levelText[nextLevel]}`, {
          description: "Harika bir 4 hafta geçirdin, şimdi sınırları daha da zorlama vakti!",
          icon: "🔥",
        });
        triggerConfetti(); 
      } else {
        toast.success(
          `${nextWeek}. Hafta, ${nextDay}. Gün Antrenmanına Geçildi!`,
          { icon: "🗓️" }
        );
      }
    } catch (error) {
      console.error("Güncellenirken hata oluştu:", error);
      toast.error("Sonraki güne geçilemedi!");
    }
  };

  const triggerConfetti = () => {
    try {
      const fire = typeof confetti === "function" ? confetti : confetti.default;
      if (fire)
        fire({
          particleCount: 140,
          spread: 65,
          origin: { y: 0.6 },
          colors: ["#FF6B35", "#10b981", "#3b82f6"],
        });
    } catch (error) {
      console.error("Confetti hatası:", error);
    }
    toast.success("Antrenman Tamamlandı!", {
      description: "Harika iş çıkardın şampiyon!",
      icon: "🏆",
    });
  };

  return (
    <div className="flex h-screen bg-zinc-50 dark:bg-impact-dark overflow-hidden text-zinc-900 dark:text-white transition-colors duration-300">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <PageHeader
          title="Kas Gelişimi"
          icon={Dumbbell}
          onMenuClick={() => setIsSidebarOpen(true)}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 relative custom-scrollbar">
          <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-impact-surface p-5 sm:p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
              <div className="flex-1 w-full">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-xl sm:text-3xl font-black tracking-tight">
                    Günün Programı:{" "}
                    <span className="text-impact-primary">Göğüs</span>
                  </h1>
                  <span className="flex items-center gap-1.5 bg-impact-primary/10 text-impact-primary px-3 py-1 rounded-lg text-xs font-bold border border-impact-primary/20">
                    <Calendar className="w-3.5 h-3.5" />
                    Hafta {currentWeek} • Gün {currentDay}
                  </span>
                </div>

                <div className="w-full max-w-md pr-4 mt-4">
                  <div className="flex justify-between text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-2">
                    <span>İlerleme</span>
                    <span>
                      {completedCount} / {exercises.length}
                    </span>
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
                  <span className="text-sm font-bold">
                    {levelText[programLevel] || "Yükleniyor..."}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              <div className="lg:col-span-2 space-y-4">
                {isLoading ? (
                  <div className="text-center p-8 text-zinc-500">
                    Yapay Zeka programınızı hazırlıyor...
                  </div>
                ) : exercises.length === 0 ? (
                  <div className="text-center p-8 text-zinc-500 font-medium bg-white dark:bg-impact-surface rounded-2xl border border-zinc-200 dark:border-zinc-800">
                    {currentWeek}. Hafta, {currentDay}. Gün için planlanmış bir
                    hareket bulunamadı. Programın sonuna gelmiş olabilirsin!
                  </div>
                ) : (
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="space-y-3"
                  >
                    {exercises.map((ex, index) => (
                      <motion.div
                        key={ex.id}
                        variants={itemVariants}
                        onClick={() => toggleExercise(ex.id, ex.targetMuscle)}
                        className={`group cursor-pointer flex items-center justify-between p-4 sm:p-5 rounded-2xl border transition-all duration-300 shadow-sm ${ex.isCompleted ? "bg-impact-primary/5 border-impact-primary/20" : "bg-white dark:bg-impact-surface border-zinc-200 dark:border-zinc-800 hover:border-impact-primary/40"}`}
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`${ex.isCompleted ? "text-impact-primary" : "text-zinc-300 dark:text-zinc-600"}`}
                          >
                            {ex.isCompleted ? (
                              <CheckCircle2 className="w-6 h-6 sm:w-7 sm:h-7" />
                            ) : (
                              <Circle className="w-6 h-6 sm:w-7 sm:h-7" />
                            )}
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-0.5">
                              Hareket {index + 1} — {ex.targetMuscle}
                            </span>
                            <h3
                              className={`text-base sm:text-lg font-bold ${ex.isCompleted ? "text-zinc-400 line-through decoration-impact-primary/40" : ""}`}
                            >
                              {ex.name}
                            </h3>
                          </div>
                        </div>

                        <div className="flex gap-2 sm:gap-4 items-center font-black text-sm sm:text-base">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setDemoExercise(ex);
                            }}
                            className="p-1.5 sm:p-2 text-zinc-400 hover:text-impact-primary hover:bg-impact-primary/10 rounded-lg transition-colors"
                            title="Hareket demosunu izle"
                          >
                            <PlayCircle className="w-5 h-5" />
                          </button>
                          <button
                            onClick={(e) => handleFailTest(ex.id, e)}
                            className="p-1.5 sm:p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                            title="Zorlandım (Adaptif Düşürme Testi)"
                          >
                            <XCircle className="w-5 h-5" />
                          </button>

                          <div
                            className={`flex gap-2 ${ex.isCompleted ? "opacity-40" : "opacity-100"}`}
                          >
                            <div className="bg-zinc-50 dark:bg-zinc-900 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800">
                              {ex.sets}{" "}
                              <span className="text-[10px] text-zinc-400 uppercase">
                                Set
                              </span>
                            </div>
                            <div className="bg-zinc-50 dark:bg-zinc-900 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800">
                              {ex.reps}{" "}
                              <span className="text-[10px] text-zinc-400 uppercase">
                                Rep
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </div>

              <div className="space-y-6">
                <div className="bg-white dark:bg-impact-surface p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm sticky top-6">
                  <h3 className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Info className="w-4 h-4 text-impact-primary" /> Hedef Kas
                    Odak Alanı
                  </h3>
                  <div className="aspect-square bg-zinc-50 dark:bg-zinc-900/40 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-center p-4 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-impact-primary/10 via-transparent to-transparent opacity-60" />
                    <img
                      src="/assets/muscle-map.svg"
                      alt="Kas Haritası"
                      className="w-full h-full object-contain relative z-10 dark:opacity-90 dark:invert"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.parentElement.innerHTML = `<span class="text-xs text-zinc-400 font-bold uppercase tracking-widest text-center">muscle-map.svg<br/><span class="text-[10px] lowercase text-impact-primary font-black">${activeMuscleGroup || "Seçim Bekleniyor"}</span></span>`;
                      }}
                    />
                  </div>

                  <AnimatePresence mode="wait">
                    {isAllCompleted && exercises.length > 0 ? (
                      <motion.div
                        key="success-box"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="mt-6 p-6 rounded-2xl bg-impact-primary/10 border border-impact-primary/30 flex flex-col items-center justify-center gap-4 text-center"
                      >
                        <div className="w-24 h-24 drop-shadow-[0_0_20px_rgba(249,115,22,0.4)]">
                          {trophyAnimation ? (
                            <SafeLottie
                              animationData={trophyAnimation}
                              loop={true}
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <Trophy className="w-16 h-16 text-impact-primary animate-bounce mx-auto" />
                          )}
                        </div>
                        <div>
                          <p className="font-black text-lg text-white">
                            Günün Görevi Bitti!
                          </p>
                        </div>

                        <button
                          onClick={advanceToNextDay}
                          className="w-full mt-2 flex items-center justify-center gap-2 bg-impact-primary text-black font-bold py-3 px-4 rounded-xl hover:bg-impact-secondary transition-colors"
                        >
                          Sonraki Antrenmana Geç{" "}
                          <ArrowRight className="w-5 h-5" />
                        </button>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="info-box"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="mt-6 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 text-zinc-500 text-xs font-medium text-center"
                      >
                        {activeMuscleGroup
                          ? `Şu an hedeflenen bölge: ${activeMuscleGroup}`
                          : "Listeyi tamamla."}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      <ExerciseVideoModal
        isOpen={!!demoExercise}
        onClose={() => setDemoExercise(null)}
        exercise={demoExercise}
      />
    </div>
  );
}