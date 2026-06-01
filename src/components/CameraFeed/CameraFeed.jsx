import { motion } from "framer-motion";
import { Camera } from "lucide-react";

export default function CameraFeed({ videoRef, canvasRef, isRunning }) {
  return (
    <div className="relative w-full aspect-[4/3] sm:aspect-video bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-sm transition-colors duration-300">
      
      {/* Kamera Pasifken Gösterilecek Arayüz */}
      {!isRunning && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-400 dark:text-zinc-600 z-10 bg-zinc-50/50 dark:bg-black/40 backdrop-blur-sm">
          <motion.div 
            animate={{ scale: [1, 1.05, 1] }} 
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            <Camera className="w-12 h-12 mb-3 text-impact-primary opacity-80" />
          </motion.div>
          <p className="text-sm font-bold tracking-widest uppercase text-zinc-800 dark:text-zinc-200">Kamera Bekletiliyor</p>
          <p className="text-xs mt-1 text-zinc-500 dark:text-zinc-400 font-medium">Analizi başlatmak için aşağıdaki butona tıkla</p>
        </div>
      )}
      
      {/* Berkay'ın MediaPipe Motoruna Bağlayacağı Gizli Video Elementi */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover hidden"
        playsInline
      ></video>
      
      {/* Berkay'ın Eklem Koordinatlarını Çizeceği Şeffaf Canvas Katmanı */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover z-20 pointer-events-none"
      ></canvas>

      {/* Disiplin Modu Aktif Çerçevesi */}
      {isRunning && (
        <div className="absolute inset-0 z-30 pointer-events-none border-[3px] border-impact-primary/40 rounded-3xl animate-pulse" />
      )}
    </div>
  );
}
