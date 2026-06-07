import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, LogOut, User as UserIcon, Activity, Play, Square, CheckCircle, AlertTriangle, ChevronDown } from "lucide-react";
import Sidebar from "@/components/ui/Sidebar";
import ChatWindow from "@/components/Chatbot/ChatWindow";
import CameraFeed from "@/components/CameraFeed/CameraFeed";
import { useAuth } from "@/context/AuthContext";
import { logoutUser } from "@/services/authService";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function Posture() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Berkay'ın entegrasyonda kullanacağı element referansları
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Arayüz Kontrol State'leri
  const [isRunning, setIsRunning] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState("squat"); 
  const [formStatus, setFormStatus] = useState("idle"); // idle, good, bad
  const [repCount, setRepCount] = useState(0);
  const targetReps = 10;

  const handleLogout = async () => {
    try { 
      await logoutUser(); 
      navigate("/"); 
    } catch (error) {
      toast.error("Çıkış yapılamadı");
    }
  };

  const toggleCamera = () => {
    setIsRunning(!isRunning);
    if (!isRunning) {
      toast.success("Kamera Sahnesi Hazırlanıyor", { description: "Lütfen kadraja tam olarak girmeye hazır olun." });
      setFormStatus("good"); // Berkay bağlayana kadar varsayılan arayüz gösterimi
    } else {
      toast.info("Antrenman Sonlandırıldı");
      setFormStatus("idle");
      setRepCount(0);
    }
  };

  const progressPercent = Math.min((repCount / targetReps) * 100, 100);

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
            <h2 className="text-lg sm:text-xl font-bold hidden sm:flex items-center gap-2">
              <Activity className="w-5 h-5 text-impact-primary" /> Postür Modülü 
              {/* PREMIUM span'ı buradan kaldırıldı */}
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

        {/* INTEGRATED POSTURE INTERFACE */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 relative custom-scrollbar">
          <div className="max-w-6xl mx-auto pb-20">
            <header className="mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
                Duruş & Form <span className="text-impact-primary">Analiz Laboratuvarı</span>
              </h1>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">Seviyene uygun hareketi seç ve yapay zeka eşliğinde formunu analiz et.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              
              {/* SOL SÜTUN: KAMERA PANELİ VE AYARLAR */}
              <div className="lg:col-span-2 space-y-4">
                <CameraFeed videoRef={videoRef} canvasRef={canvasRef} isRunning={isRunning} />
                
                <div className="flex flex-col sm:flex-row gap-4 bg-white dark:bg-impact-surface p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                  
                  {/* Hiyerarşik Egzersiz Listesi Dropdown */}
                  <div className="relative flex-1">
                    <select 
                      value={selectedExercise} 
                      onChange={(e) => setSelectedExercise(e.target.value)}
                      disabled={isRunning}
                      className="w-full appearance-none bg-zinc-50 dark:bg-impact-dark border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm font-bold text-zinc-900 dark:text-white focus:outline-none focus:border-impact-primary disabled:opacity-50 cursor-pointer transition-colors"
                    >
                      <option value="squat">🔥 Çömelme (Squat) Modu</option>
                      <option value="pushup">💪 Şınav (Push-up) Modu</option>
                      <option value="plank">🛡️ Karın İzometrik (Plank) Modu</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 pointer-events-none" />
                  </div>

                  <button 
                    onClick={toggleCamera}
                    className={`flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-bold text-sm transition-all sm:w-auto w-full ${
                      isRunning 
                        ? "bg-red-500/10 text-red-500 border border-red-500/30 hover:bg-red-500/20" 
                        : "bg-impact-primary text-black hover:bg-impact-secondary shadow-[0_0_15px_rgba(249,115,22,0.2)]"
                    }`}
                  >
                    {isRunning ? <><Square className="w-4 h-4 fill-current" /> Analizi Bitir</> : <><Play className="w-4 h-4 fill-current" /> Kamera Aç</>}
                  </button>
                </div>
              </div>

              {/* SAĞ SÜTUN: REPS & FEEDBACK */}
              <div className="space-y-6">
                
                {/* İlerleme ve Tekrar Paneli */}
                <div className="bg-white dark:bg-impact-surface p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm text-center relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-zinc-100 dark:bg-zinc-800">
                    <motion.div 
                      className="h-full bg-impact-primary" 
                      initial={{ width: 0 }} 
                      animate={{ width: `${progressPercent}%` }} 
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  
                  <h3 className="text-zinc-400 dark:text-zinc-500 text-xs font-bold uppercase tracking-widest mb-2 mt-2">Mevcut Set Tamamlama</h3>
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-7xl font-black text-zinc-900 dark:text-white tabular-nums tracking-tighter">{repCount}</span>
                    <span className="text-xl text-zinc-400 dark:text-zinc-500 font-medium">/ {targetReps}</span>
                  </div>
                </div>

                {/* Geri Bildirim Rozet Alanı */}
                <div className="bg-white dark:bg-impact-surface p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                  <h3 className="text-zinc-400 dark:text-zinc-500 text-xs font-bold uppercase tracking-widest mb-4">Gerçek Zamanlı Geri Bildirim</h3>
                  
                  <AnimatePresence mode="wait">
                    {formStatus === "idle" && (
                      <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-3 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-200 dark:border-zinc-800/50 text-zinc-400 dark:text-zinc-500">
                        <Activity className="w-5 h-5" />
                        <span className="font-semibold text-xs uppercase tracking-wider">Sinyal bekleniyor</span>
                      </motion.div>
                    )}
                    
                    {formStatus === "good" && (
                      <motion.div key="good" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 shadow-sm">
                        <CheckCircle className="w-5 h-5 flex-shrink-0" />
                        <div>
                          <span className="block font-bold text-sm">Form Kusursuz!</span>
                          <span className="text-xs opacity-90">Açıyı ve stabiliteyi bozmadan devam et.</span>
                        </div>
                      </motion.div>
                    )}

                    {formStatus === "bad" && (
                      <motion.div key="bad" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="flex items-center gap-3 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 shadow-sm">
                        <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                        <div>
                          <span className="block font-bold text-sm">Postür Sapması!</span>
                          <span className="text-xs opacity-90">Kalçayı biraz daha geriye almalısın.</span>
                        </div>
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