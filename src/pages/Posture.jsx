import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  Play,
  Square,
  CheckCircle,
  AlertTriangle,
  ChevronDown,
} from "lucide-react";
import Sidebar from "@/components/ui/Sidebar";
import PageHeader from "@/components/ui/PageHeader";
import CameraFeed from "@/components/CameraFeed/CameraFeed";
import { toast } from "sonner";

// 🚨 BERKAY'IN MOTORU: MediaPipe ve Matematik Fonksiyonları İçe Aktarıldı
import {
  initPose,
  startCamera,
  stopCamera,
  setExerciseMode,
} from "@/utils/mediapipeCore";
import { createRepCounter } from "@/utils/angleMath";

export default function Posture() {
  // KALİBRASYON MOTORU STATE'LERİ
  const [countdown, setCountdown] = useState(null);
  const [baselineLandmarks, setBaselineLandmarks] = useState(null);
  const calibrateFlag = useRef(false);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // DOM ve MediaPipe Referansları
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const poseInstance = useRef(null); // MediaPipe modelini tutar
  const repCounter = useRef(null); // Matematiksel tekrar sayacını tutar

  // Arayüz ve Analiz State'leri
  const [isRunning, setIsRunning] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState("squat");
  const [formStatus, setFormStatus] = useState("idle"); // idle, good, bad
  const [feedbackMsg, setFeedbackMsg] = useState("Sinyal bekleniyor..."); // Dinamik yapay zeka mesajı
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
        calibrateFlag.current = true; // Süre bitti! Bir sonraki karede pozu yakala.
      }
    }, 1000);
  };

  // 1. ADIM: Sayaç Fabrikasını Başlat ve MediaPipe motoruna ilk egzersiz modunu bildir
  useEffect(() => {
    repCounter.current = createRepCounter();
    setExerciseMode(selectedExercise);

    // Güvenlik Koruması: Kullanıcı kamerayı açık unutup sayfadan çıkarsa kamerayı kapat
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

  // 3. ADIM: Canlı Analiz Köprüsü (MediaPipe -> angleMath -> Arayüz)
  // 3. ADIM: Canlı Analiz Köprüsü ve Ekrana Çizim (MediaPipe -> Canvas -> UI)
  const handlePoseResults = (results, analysisResult) => {
    // KALİBRASYON KAPAN KAPANI: Sayaç bittiyse ve iskelet varsa, pozu dondur ve kaydet!
    if (calibrateFlag.current && results.poseLandmarks) {
      setBaselineLandmarks(results.poseLandmarks);
      calibrateFlag.current = false;
      toast.success("Kalibrasyon Tamamlandı!", {
        description: "Orijinal duruşunuz başarıyla hafızaya alındı.",
      });
      console.log("KAYDEDİLEN REFERANS POZ:", results.poseLandmarks);
    }

    // --- 1. GÖRÜNTÜYÜ VİTRİNE (CANVAS'A) ÇİZME OPERASYONU ---
    if (canvasRef.current && videoRef.current && results.image) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      // Tuval boyutlarını, kameradan gelen orijinal boyutlarla eşitle
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;

      ctx.save();
      // Önceki kareyi temizle
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Aynalama Efekti: Kullanıcı sağ elini kaldırınca ekranda da sağ el kalksın
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);

      // Yapay Zekanın gördüğü o anlık kareyi tuvale bas!
      ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);
      ctx.restore();
    }

    // --- 2. MATEMATİKSEL SONUÇLARI ARAYÜZE AKTARMA ---
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

      // Motoru Ateşle
      poseInstance.current = initPose(handlePoseResults);
      startCamera(videoRef.current, poseInstance.current);
    } else {
      toast.info("Antrenman Sonlandırıldı");
      setIsRunning(false);
      setFormStatus("idle");
      setFeedbackMsg("Sinyal bekleniyor...");
      setRepCount(0);

      // Motoru Durdur
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
          title="Postür Modülü"
          icon={Activity}
          onMenuClick={() => setIsSidebarOpen(true)}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 relative custom-scrollbar">
          <div className="max-w-6xl mx-auto pb-20">
            <header className="mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
                Duruş & Form{" "}
                <span className="text-impact-primary">Analiz Laboratuvarı</span>
              </h1>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
                Seviyene uygun hareketi seç ve yapay zeka eşliğinde formunu
                analiz et.
              </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              <div className="lg:col-span-2 space-y-4">
                <CameraFeed
                  videoRef={videoRef}
                  canvasRef={canvasRef}
                  isRunning={isRunning}
                />

                <div className="flex flex-col sm:flex-row gap-4 bg-white dark:bg-impact-surface p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                  <div className="relative flex-1">
                    <select
                      value={selectedExercise}
                      onChange={(e) => handleExerciseChange(e.target.value)}
                      disabled={isRunning}
                      className="w-full appearance-none bg-zinc-50 dark:bg-impact-dark border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm font-bold text-zinc-900 dark:text-white focus:outline-none focus:border-impact-primary disabled:opacity-50 cursor-pointer transition-colors"
                    >
                      <option value="squat">🔥 Çömelme (Squat) Modu</option>
                      <option value="pushup">💪 Şınav (Push-up) Modu</option>
                      <option value="plank">
                        🛡️ Karın İzometrik (Plank) Modu
                      </option>
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
                      <>
                        <Square className="w-4 h-4 fill-current" /> Analizi
                        Bitir
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-current" /> Kamera Aç
                      </>
                    )}
                  </button>
                  <button
                    onClick={startCalibration}
                    className="bg-impact-primary text-black font-bold py-2 px-4 rounded-xl hover:opacity-80"
                  >
                    {countdown !== null
                      ? `Kalibrasyon: ${countdown}`
                      : "Hazırım (Kalibrasyon)"}
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white dark:bg-impact-surface p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm text-center relative overflow-hidden">
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
                    <span className="text-7xl font-black text-zinc-900 dark:text-white tabular-nums tracking-tighter">
                      {repCount}
                    </span>
                    <span className="text-xl text-zinc-400 dark:text-zinc-500 font-medium">
                      / {targetReps}
                    </span>
                  </div>
                </div>

                <div className="bg-white dark:bg-impact-surface p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                  <h3 className="text-zinc-400 dark:text-zinc-500 text-xs font-bold uppercase tracking-widest mb-4">
                    Gerçek Zamanlı Geri Bildirim
                  </h3>

                  <AnimatePresence mode="wait">
                    {formStatus === "idle" && (
                      <motion.div
                        key="idle"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-3 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-200 dark:border-zinc-800/50 text-zinc-400 dark:text-zinc-500"
                      >
                        <Activity className="w-5 h-5" />
                        <span className="font-semibold text-xs uppercase tracking-wider">
                          {feedbackMsg}
                        </span>
                      </motion.div>
                    )}

                    {formStatus === "good" && (
                      <motion.div
                        key="good"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 shadow-sm"
                      >
                        <CheckCircle className="w-5 h-5 flex-shrink-0" />
                        <div>
                          <span className="block font-bold text-sm">
                            Form Kusursuz!
                          </span>
                          <span className="text-xs opacity-90">
                            {feedbackMsg}
                          </span>
                        </div>
                      </motion.div>
                    )}

                    {formStatus === "bad" && (
                      <motion.div
                        key="bad"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="flex items-center gap-3 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 shadow-sm"
                      >
                        <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                        <div>
                          <span className="block font-bold text-sm">
                            Postür Sapması!
                          </span>
                          <span className="text-xs opacity-90">
                            {feedbackMsg}
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
