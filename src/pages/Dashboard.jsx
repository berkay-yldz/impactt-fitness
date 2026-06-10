import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Flame, Dumbbell, Utensils, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import Sidebar from "@/components/ui/Sidebar";
import PageHeader from "@/components/ui/PageHeader";
import StreakForest from "@/components/ui/StreakForest";
import MuscleHealthMap from "@/components/ui/MuscleHealthMap";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { getUserProfile } from "@/services/dbService";

const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.15 } } };
const cardVariants = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } } };

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [profileData, setProfileData] = useState({ streak: 0, programLevel: "beginner", fitnessGoal: "muscle_gain" });
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  useEffect(() => {
    if (location.state?.openPremium) {
      toast.error("Premium Özellik!", { description: "Bu alana erişmek için Premium'a yükseltmelisiniz." });
      navigate("/dashboard", { replace: true, state: {} });
    }
    const fetchUserData = async () => {
      if (!currentUser?.uid) return;
      try {
        const data = await getUserProfile(currentUser.uid);
        if (data) setProfileData(data);
      } catch (error) {
        console.error("Veri çekilemedi.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserData();
  }, [location, navigate, currentUser]);

  const levelText = { beginner: "Başlangıç Seviyesi", intermediate: "Orta Seviye", advanced: "İleri Seviye" };

  return (
    <div className="flex h-screen bg-zinc-50 dark:bg-impact-dark overflow-hidden text-zinc-900 dark:text-white transition-colors duration-300">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <PageHeader
          title="Anasayfa"
          onMenuClick={() => setIsSidebarOpen(true)}
          profileData={profileData}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 relative custom-scrollbar">
          <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8 pb-10">
            
            <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} className="text-2xl font-black text-zinc-900 dark:text-white mb-6" > Merhaba, {currentUser?.displayName || "Sporcu"}! Bugün hazır mısın? </motion.h2>

            <header className="mb-6 sm:mb-10">
              <motion.h2 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-2xl sm:text-3xl lg:text-4xl font-black text-zinc-900 dark:text-white tracking-tight">
                Hoş geldin, <span className="text-impact-primary">{currentUser?.displayName || "Şampiyon"}</span>!
              </motion.h2>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400 mt-2 font-medium">
                Hedeflerine bir adım daha yaklaşmak için bugünün görevlerini tamamla.
              </motion.p>
            </header>
            
            {!isLoading && (
              <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                
                <motion.div variants={cardVariants} className="group relative bg-white dark:bg-impact-surface border border-zinc-200 dark:border-zinc-800 rounded-2xl sm:rounded-3xl p-5 sm:p-6 overflow-hidden hover:border-impact-primary/50 transition-colors shadow-sm dark:shadow-none">
                  <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-impact-primary/5 rounded-bl-full -mr-8 -mt-8 sm:-mr-10 sm:-mt-10 transition-transform group-hover:scale-110" />
                  <div className="flex items-start justify-between mb-4 relative z-10">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-orange-100 dark:bg-orange-500/10 flex items-center justify-center text-orange-600 dark:text-orange-500 border border-orange-200 dark:border-orange-500/20">
                      <Flame className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <span className="text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 rounded-full">Ateşi Koru</span>
                  </div>
                  <div className="relative z-10">
                    <h3 className="text-zinc-500 dark:text-zinc-400 text-xs sm:text-sm font-medium mb-1">Günlük Seri (Streak)</h3>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-white">{profileData.streak || 0}</span>
                      <span className="text-zinc-500 font-medium text-sm">Gün</span>
                    </div>
                  </div>
                </motion.div>

                <motion.div variants={cardVariants} className="group relative bg-white dark:bg-impact-surface border border-zinc-200 dark:border-zinc-800 rounded-2xl sm:rounded-3xl p-5 sm:p-6 overflow-hidden hover:border-impact-primary/50 transition-colors cursor-pointer shadow-sm dark:shadow-none" onClick={() => navigate('/muscle')}>
                  <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-blue-500/5 rounded-bl-full -mr-8 -mt-8 sm:-mr-10 sm:-mt-10 transition-transform group-hover:scale-110" />
                  <div className="flex items-start justify-between mb-4 relative z-10">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-500 border border-blue-200 dark:border-blue-500/20">
                      <Dumbbell className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <span className="text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 rounded-full">{levelText[profileData.programLevel] || "Seviye"}</span>
                  </div>
                  <div className="relative z-10">
                    <h3 className="text-zinc-500 dark:text-zinc-400 text-xs sm:text-sm font-medium mb-1">Sıradaki Antrenman</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-white">Üst Vücut (Gün 3)</span>
                      <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-impact-primary opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </motion.div>

                <motion.div variants={cardVariants} className="group relative bg-white dark:bg-impact-surface border border-zinc-200 dark:border-zinc-800 rounded-2xl sm:rounded-3xl p-5 sm:p-6 overflow-hidden hover:border-impact-primary/50 transition-colors cursor-pointer shadow-sm dark:shadow-none md:col-span-2 lg:col-span-1" onClick={() => navigate('/nutrition')}>
                  <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-emerald-500/5 rounded-bl-full -mr-8 -mt-8 sm:-mr-10 sm:-mt-10 transition-transform group-hover:scale-110" />
                  <div className="flex items-start justify-between mb-4 relative z-10">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-500 border border-emerald-200 dark:border-emerald-500/20">
                      <Utensils className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <span className="text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 rounded-full">{profileData.fitnessGoal === "weight_loss" ? "Kilo Ver" : profileData.fitnessGoal === "muscle_gain" ? "Kas Yap" : "Kondisyon"}</span>
                  </div>
                  <div className="relative z-10">
                    <h3 className="text-zinc-500 dark:text-zinc-400 text-xs sm:text-sm font-medium mb-2">Makro Özeti</h3>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-lg p-1.5 sm:p-2 text-center border border-zinc-200 dark:border-zinc-800">
                        <div className="text-[9px] sm:text-[10px] text-zinc-500 uppercase font-bold mb-0.5 sm:mb-1">Kcal</div>
                        <div className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white">1850</div>
                      </div>
                      <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-lg p-1.5 sm:p-2 text-center border border-zinc-200 dark:border-zinc-800">
                        <div className="text-[9px] sm:text-[10px] text-zinc-500 uppercase font-bold mb-0.5 sm:mb-1">Pro</div>
                        <div className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white">140g</div>
                      </div>
                      <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-lg p-1.5 sm:p-2 text-center border border-zinc-200 dark:border-zinc-800">
                        <div className="text-[9px] sm:text-[10px] text-zinc-500 uppercase font-bold mb-0.5 sm:mb-1">Karb</div>
                        <div className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white">160g</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {!isLoading && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6"
              >
                <motion.div variants={cardVariants}>
                  <StreakForest count={profileData.totalWorkouts || 0} />
                </motion.div>
                <motion.div variants={cardVariants}>
                  <MuscleHealthMap />
                </motion.div>
              </motion.div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}