import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, LogOut, User as UserIcon, Flame, ShieldCheck, Lock, CalendarDays, Award } from "lucide-react";
import Sidebar from "@/components/ui/Sidebar";
import ChatWindow from "@/components/Chatbot/ChatWindow";
// AKTİF EDİLDİ: Başarı Hikayeleri (Testimonials) bileşeni artık sayfaya dahil.
import Testimonials from "@/components/Testimonials/Testimonials"; 
import { useAuth } from "@/context/AuthContext";
import { logoutUser } from "@/services/authService";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";

export default function Discipline() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [fireAnimation, setFireAnimation] = useState(null); 
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const currentStreak = 12;
  const activeDays = [1, 2, 3, 5, 6, 7, 8, 10, 11, 12]; 

  const badges = [
    { id: "b1", title: "Momentum", desc: "3 Günlük Streak", isEarned: true, icon: Flame },
    { id: "b2", title: "Haftalık Savaşçı", desc: "7 Günlük Streak", isEarned: true, icon: ShieldCheck },
    { id: "b3", title: "Azimli", desc: "10 Antrenman", isEarned: true, icon: Award },
    { id: "b4", title: "Demir İrade", desc: "30 Günlük Streak", isEarned: false, icon: Flame },
  ];

  useEffect(() => {
    fetch("/lottie/fire.json")
      .then((res) => res.json())
      .then((data) => setFireAnimation(data))
      .catch((err) => console.error("Ateş animasyonu yüklenemedi:", err));
  }, []);

  const handleLogout = async () => {
    try { await logoutUser(); navigate("/"); } catch (error) {}
  };

  return (
    <div className="flex h-screen bg-zinc-50 dark:bg-impact-dark overflow-hidden text-zinc-900 dark:text-white transition-colors duration-300">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <header className="h-16 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-impact-surface flex items-center justify-between px-4 sm:px-6 lg:px-8 transition-colors duration-300">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-2 text-zinc-500 hover:text-impact-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-impact-primary rounded-lg" 
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-bold hidden sm:flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-impact-primary" /> Disiplin & İlerleme
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-zinc-100 dark:bg-impact-dark px-3 py-1.5 rounded-full border border-zinc-200 dark:border-zinc-800">
              <UserIcon className="w-4 h-4 text-zinc-500" />
              <span className="text-sm font-medium">{currentUser?.displayName || "Emrullah"}</span>
            </div>
            <button 
              onClick={handleLogout} 
              className="p-2 text-zinc-500 hover:text-red-500 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 custom-scrollbar">
          <div className="max-w-6xl mx-auto space-y-8 pb-20">
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              
              <div className="bg-white dark:bg-impact-surface p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col items-center justify-center text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-impact-primary to-impact-secondary"></div>
                <h3 className="text-zinc-400 dark:text-zinc-500 text-xs font-bold uppercase tracking-widest mb-4">Mevcut İstikrar Serisi</h3>
                
                <div className="w-32 h-32 mb-2 flex items-center justify-center drop-shadow-[0_0_25px_rgba(249,115,22,0.4)]">
                  {fireAnimation ? (
                    <Lottie animationData={fireAnimation} loop={true} className="w-full h-full object-contain" />
                  ) : (
                    <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}>
                      <Flame className="w-24 h-24 text-impact-primary" fill="currentColor" />
                    </motion.div>
                  )}
                </div>
                
                <div className="flex items-baseline gap-2">
                  <span className="text-7xl font-black tracking-tighter tabular-nums">{currentStreak}</span>
                  <span className="text-xl text-zinc-400 font-bold">GÜN</span>
                </div>
                <p className="text-sm text-zinc-500 mt-3 font-medium">Harika gidiyorsun, seriyi bozma!</p>
              </div>

              <div className="lg:col-span-2 bg-white dark:bg-impact-surface p-6 sm:p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-black">Aylık Aktivite</h3>
                    <p className="text-sm text-zinc-500">Bu ayki antrenman yoğunluğun</p>
                  </div>
                  <CalendarDays className="w-8 h-8 text-zinc-200 dark:text-zinc-700" />
                </div>
                
                <div className="grid grid-cols-7 gap-2 sm:gap-3">
                  {Array.from({ length: 30 }).map((_, i) => {
                    const day = i + 1;
                    const isActive = activeDays.includes(day);
                    return (
                      <div 
                        key={i} 
                        className={`aspect-square rounded-lg flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                          isActive 
                            ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.15)]" 
                            : "bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-400 dark:text-zinc-600"
                        }`}
                      >
                        {day}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-impact-surface p-6 sm:p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <Award className="w-6 h-6 text-impact-primary" />
                <h3 className="text-xl font-black">Kazanılan Rozetler</h3>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {badges.map((badge) => (
                  <div key={badge.id} className={`relative p-5 rounded-2xl border flex flex-col items-center text-center transition-all duration-300 ${badge.isEarned ? "bg-zinc-50 dark:bg-zinc-900/50 border-impact-primary/30" : "bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 opacity-60 grayscale"}`}>
                    {!badge.isEarned && (
                      <div className="absolute top-3 right-3 text-zinc-400">
                        <Lock className="w-4 h-4" />
                      </div>
                    )}
                    <badge.icon className={`w-12 h-12 mb-3 ${badge.isEarned ? "text-impact-primary" : "text-zinc-400"}`} />
                    <h4 className={`text-sm font-bold ${badge.isEarned ? "text-zinc-900 dark:text-white" : "text-zinc-500"}`}>{badge.title}</h4>
                    <p className="text-[10px] text-zinc-400 uppercase tracking-widest mt-1">{badge.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* AKTİF EDİLDİ: Başarı Hikayeleri (Testimonials) alanı yorumdan çıkarıldı. */}
            <div className="mt-8 border-t border-zinc-200 dark:border-zinc-800 pt-8">
              <Testimonials />
            </div>

          </div>
        </main>
        
        <ChatWindow isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      </div>
    </div>
  );
}