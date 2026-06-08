import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, ShieldCheck, Lock, CalendarDays, Award, Play, Square, CheckCircle, AlertTriangle, ChevronDown, Activity, Camera as CameraIcon } from "lucide-react";
import Sidebar from "@/components/ui/Sidebar";
import PageHeader from "@/components/ui/PageHeader";
import Testimonials from "@/components/Testimonials/Testimonials";
import CameraFeed from "@/components/CameraFeed/CameraFeed";
import { toast } from "sonner";
import Lottie from "lottie-react";

import { initPose, startCamera, stopCamera, setExerciseMode } from "@/utils/mediapipeCore";
import { createRepCounter } from "@/utils/angleMath";

const SafeTestimonials = typeof Testimonials === 'function' ? Testimonials : (Testimonials?.Testimonials || null);
const SafeLottie = typeof Lottie === 'function' ? Lottie : (Lottie?.default || null);

export default function Discipline() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [fireAnimation, setFireAnimation] = useState(null);

  const currentStreak = 12;
  const activeDays = [1, 2, 3, 5, 6, 7, 8, 10, 11, 12];

  const badges = [
    { id: "b1", title: "Momentum", desc: "3 Günlük Streak", isEarned: true, icon: Flame },
    { id: "b2", title: "Haftalık Savaşçı", desc: "7 Günlük Streak", isEarned: true, icon: ShieldCheck },
    { id: "b3", title: "Azimli", desc: "10 Antrenman", isEarned: true, icon: Award },
    { id: "b4", title: "Demir İrade", desc: "30 Günlük Streak", isEarned: false, icon: Flame },
  ];

  // ============================================================
  // FORM ANALİZİ (MediaPipe Kamera) — Posture.jsx'ten taşındı
  // ============================================================
  const [countdown, setCountdown] = useState(null);
  const [baselineLandmarks, setBaselineLandmarks] = useState(null);
  const calibrateFlag = useRef(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const poseInstance = useRef(null);
  const repCounter = useRef(null);

  const [isRunning, setIsRunning] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState("squat");
  const [formStatus, setFormStatus] = useState("idle");
  const [feedbackMsg, setFeedbackMsg] = useState("Sinyal bekleniyor...");
  const [repCount, setRepCount] = useState(0);
  const targetReps = 10;

  const startCalibration = () => {
    setCountdown(3);
    let timer = 3;
    const interval = setInterval(() => {
      timer -= 1;
      if (timer > 0) {
        setCountdown(timer);
      } else {
        clearInterval(interval);
        setCountdown(null);
        calibrateFlag.current = true;
      }
    }, 1000);
  };

  useEffect(() => {
    fetch("/lottie/fire.json")
      .then((res) => res.json())
      .then((data) => setFireAnimation(data))
      .catch((err) => console.error("Ateş animasyonu yüklenemedi:", err));

    repCounter.current = createRepCounter();
    setExerciseMode(selectedExercise);

    return () => stopCamera();
  }, []);

  const handleExerciseChange = (newExercise) => {
    setSelectedExercise(newExercise);
    setExerciseMode(newExercise);
    if (repCounter.current && repCounter.current.reset) {
      repCounter.current.reset();
    }
    setRepCount(0);
    setFormStatus("idle");
    setFeedbackMsg("Sinyal bekleniyor...");
  };

  const handlePoseResults = (results, analysisResult) => {
    if (calibrateFlag.current && results.poseLandmarks) {
      setBaselineLandmarks(results.poseLandmarks);
      calibrateFlag.current = false;
      toast.success("Kalibrasyon Tamamlandı!", {
        description: "Orijinal duruşunuz başarıyla hafızaya alındı.",
      });
    }

    if (canvasRef.current && videoRef.current && results.image) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      ctx.save();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);
      ctx.restore();
    }

    if (!analysisResult) return;
    setFormStatus(analysisResult.status);
    setFeedbackMsg(analysisResult.feedback);

    if (repCounter.current && analysisResult.angle !== undefined) {
      const currentReps = repCounter.current.processAngle(analysisResult.angle);
      setRepCount(currentReps);
    }
  };

  const toggleCamera = () => {
    if (!isRunning) {
      toast.success("Kamera Sahnesi Hazırlanıyor", {
        description: "Lütfen kadraja tam olarak girmeye hazır olun.",
      });
      setIsRunning(true);
      setFormStatus("good");
      setFeedbackMsg("Model yükleniyor, lütfen bekleyin...");

      poseInstance.current = initPose(handlePoseResults);
      startCamera(videoRef.current, poseInstance.current);
    } else {
      toast.info("Antrenman Sonlandırıldı");
      setIsRunning(false);
      setFormStatus("idle");
      setFeedbackMsg("Sinyal bekleniyor...");
      setRepCount(0);

      stopCamera();
      if (repCounter.current && repCounter.current.reset) {
        repCounter.current.reset();
      }
    }
  };

  const progressPercent = Math.min((repCount / targetReps) * 100, 100);

  return (
    <div className="flex h-screen bg-zinc-50 dark:bg-impact-dark overflow-hidden text-zinc-900 dark:text-white transition-colors duration-300">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <PageHeader
          title="Disiplin & İlerleme"
          icon={ShieldCheck}
          onMenuClick={() => setIsSidebarOpen(true)}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 custom-scrollbar">
          <div className="max-w-6xl mx-auto space-y-8 pb-20">

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">

              <div className="bg-white dark:bg-impact-surface p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col items-center justify-center text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-impact-primary to-impact-secondary"></div>
                <h3 className="text-zinc-400 dark:text-zinc-500 text-xs font-bold uppercase tracking-widest mb-4">Mevcut İstikrar Serisi</h3>

                <div className="w-32 h-32 mb-2 flex items-center justify-center drop-shadow-[0_0_25px_rgba(249,115,22,0.4)]">
                  {SafeLottie && fireAnimation ? (
                    <SafeLottie animationData={fireAnimation} loop={true} className="w-full h-full object-contain" />
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

            {/* ============================================================ */}
            {/* FORM ANALİZİ BÖLÜMÜ — MediaPipe Kamera (Premium Özellik)     */}
            {/* ============================================================ */}
            <div className="bg-white dark:bg-impact-surface p-6 sm:p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <CameraIcon className="w-6 h-6 text-impact-primary" />
                <div>
                  <h3 className="text-xl font-black">Form Analizi</h3>
                  <p className="text-sm text-zinc-500">Yapay zeka koçun ile gerçek zamanlı duruş analizi</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                  <CameraFeed
                    videoRef={videoRef}
                    canvasRef={canvasRef}
                    isRunning={isRunning}
                  />

                  <div className="flex flex-col sm:flex-row gap-4 bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                    <div className="relative flex-1">
                      <select
                        value={selectedExercise}
                        onChange={(e) => handleExerciseChange(e.target.value)}
                        disabled={isRunning}
                        className="w-full appearance-none bg-white dark:bg-impact-dark border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm font-bold text-zinc-900 dark:text-white focus:outline-none focus:border-impact-primary disabled:opacity-50 cursor-pointer transition-colors"
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
                      {isRunning ? (
                        <><Square className="w-4 h-4 fill-current" /> Analizi Bitir</>
                      ) : (
                        <><Play className="w-4 h-4 fill-current" /> Kamera Aç</>
                      )}
                    </button>
                    <button
                      onClick={startCalibration}
                      disabled={!isRunning}
                      className="bg-impact-primary/10 text-impact-primary border border-impact-primary/30 font-bold py-2 px-4 rounded-xl hover:bg-impact-primary/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {countdown !== null ? `Kalibrasyon: ${countdown}` : "Hazırım"}
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-zinc-50 dark:bg-zinc-900/50 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-zinc-100 dark:bg-zinc-800">
                      <motion.div
                        className="h-full bg-impact-primary"
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercent}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>

                    <h3 className="text-zinc-400 dark:text-zinc-500 text-xs font-bold uppercase tracking-widest mb-2 mt-2">
                      Mevcut Set Tamamlama
                    </h3>
                    <div className="flex items-baseline justify-center gap-2">
                      <span className="text-6xl font-black text-zinc-900 dark:text-white tabular-nums tracking-tighter">
                        {repCount}
                      </span>
                      <span className="text-lg text-zinc-400 dark:text-zinc-500 font-medium">
                        / {targetReps}
                      </span>
                    </div>
                  </div>

                  <div className="bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                    <h3 className="text-zinc-400 dark:text-zinc-500 text-xs font-bold uppercase tracking-widest mb-3">
                      Gerçek Zamanlı Geri Bildirim
                    </h3>

                    <AnimatePresence mode="wait">
                      {formStatus === "idle" && (
                        <motion.div
                          key="idle"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-impact-surface border border-zinc-200 dark:border-zinc-800 text-zinc-400 dark:text-zinc-500"
                        >
                          <Activity className="w-5 h-5" />
                          <span className="font-semibold text-xs uppercase tracking-wider">{feedbackMsg}</span>
                        </motion.div>
                      )}

                      {formStatus === "good" && (
                        <motion.div
                          key="good"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="flex items-start gap-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                        >
                          <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                          <div>
                            <span className="block font-bold text-sm">Form Kusursuz!</span>
                            <span className="text-xs opacity-90">{feedbackMsg}</span>
                          </div>
                        </motion.div>
                      )}

                      {formStatus === "bad" && (
                        <motion.div
                          key="bad"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="flex items-start gap-3 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400"
                        >
                          <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                          <div>
                            <span className="block font-bold text-sm">Postür Sapması!</span>
                            <span className="text-xs opacity-90">{feedbackMsg}</span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-impact-surface p-6 sm:p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <Award className="w-6 h-6 text-impact-primary" />
                <h3 className="text-xl font-black">Kazanılan Rozetler</h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {badges.map((badge) => {
                  const IconComponent = badge.icon;
                  return (
                    <div key={badge.id} className={`relative p-5 rounded-2xl border flex flex-col items-center text-center transition-all duration-300 ${badge.isEarned ? "bg-zinc-50 dark:bg-zinc-900/50 border-impact-primary/30" : "bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 opacity-60 grayscale"}`}>
                      {!badge.isEarned && (
                        <div className="absolute top-3 right-3 text-zinc-400">
                          <Lock className="w-4 h-4" />
                        </div>
                      )}
                      <IconComponent className={`w-12 h-12 mb-3 ${badge.isEarned ? "text-impact-primary" : "text-zinc-400"}`} />
                      <h4 className={`text-sm font-bold ${badge.isEarned ? "text-zinc-900 dark:text-white" : "text-zinc-500"}`}>{badge.title}</h4>
                      <p className="text-[10px] text-zinc-400 uppercase tracking-widest mt-1">{badge.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-8 border-t border-zinc-200 dark:border-zinc-800 pt-8">
              {SafeTestimonials ? (
                <SafeTestimonials />
              ) : (
                <div className="p-4 bg-red-100 text-red-600 border border-red-300 rounded-xl text-center font-bold">
                  Testimonials bileşeni yüklenemedi! Lütfen dosyadaki "export" kullanımını kontrol et.
                </div>
              )}
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
