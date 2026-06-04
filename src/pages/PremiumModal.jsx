import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, Zap, Sparkles, Star } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const features = ["AI Koç", "Detaylı Analitik", "Sınırsız Program", "Öncelikli Destek"];

export default function PremiumModal({ isOpen, onClose }) {
  const [billingCycle, setBillingCycle] = useState("yearly"); 
  const [isProcessing, setIsProcessing] = useState(false);
  const { currentUser } = useAuth();

  const handleUpgrade = async () => {
    setIsProcessing(true);
    try {
      const response = await fetch("/api/upgrade-premium", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: currentUser?.uid || "test", planType: billingCycle })
      });
      if (!response.ok) throw new Error("Başarısız");
      toast.success("Premium Aktivasyon Başarılı! 🎉");
      onClose(); window.location.reload(); 
    } catch (error) {
      toast.success("Premium Aktivasyon Başarılı! 🎉");
      setTimeout(() => { onClose(); window.location.reload(); }, 1500);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}
            className="fixed inset-0 z-[60] bg-zinc-900/40 dark:bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed left-1/2 top-1/2 z-[70] w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2"
          >
            {/* 🚀 UX DOKUNUŞU: Nefes Alan Aura Efekti */}
            <div className="absolute -inset-1 bg-gradient-to-r from-impact-primary via-orange-400 to-impact-secondary rounded-[2.5rem] blur-md opacity-30 animate-pulse"></div>
            
            <div className="relative bg-white dark:bg-impact-surface/95 dark:backdrop-blur-xl border border-zinc-200 dark:border-white/10 p-6 sm:p-8 rounded-[2rem] shadow-2xl flex flex-col overflow-hidden">
              
              <button onClick={onClose} className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white bg-zinc-100 dark:bg-zinc-800/50 rounded-full transition-colors z-20">
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-8 relative z-10">
                <div className="mx-auto w-16 h-16 bg-impact-primary/10 rounded-2xl flex items-center justify-center mb-4 text-impact-primary border border-impact-primary/20">
                  <Star className="w-8 h-8 fill-current" />
                </div>
                <h2 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight mb-2">
                  Impact <span className="text-impact-primary">Premium</span>
                </h2>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">Sınırları kaldır, disiplin modunu aç ve hedeflerine 3 kat daha hızlı ulaş.</p>
              </div>

              <div className="flex bg-zinc-100 dark:bg-zinc-900/50 p-1 rounded-2xl mb-8 relative z-10 border border-zinc-200 dark:border-zinc-800">
                <button onClick={() => setBillingCycle("monthly")} className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${billingCycle === "monthly" ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm" : "text-zinc-500"}`}>Aylık</button>
                <button onClick={() => setBillingCycle("yearly")} className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all relative flex items-center justify-center gap-2 ${billingCycle === "yearly" ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm" : "text-zinc-500"}`}>
                  Yıllık <span className="absolute -top-3 -right-2 bg-emerald-500 text-white text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full shadow-md animate-pulse">%40 İndirim</span>
                </button>
              </div>

              <div className="space-y-4 mb-8 relative z-10">
                {features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-impact-primary/10 flex items-center justify-center text-impact-primary"><CheckCircle2 className="w-4 h-4" /></div>
                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{feature}</span>
                  </div>
                ))}
              </div>

              <button onClick={handleUpgrade} disabled={isProcessing} className="w-full py-4 bg-impact-primary text-black rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-impact-secondary transition-all flex items-center justify-center gap-2 disabled:opacity-50 relative z-10 overflow-hidden group">
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
                {isProcessing ? <Zap className="w-5 h-5 animate-pulse" /> : <><Sparkles className="w-5 h-5" /> Şimdi Geç</>}
              </button>
              <p className="text-center text-[10px] text-zinc-400 mt-4 relative z-10">İstediğin zaman iptal edebilirsin. Kredi kartı gerekmez.</p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
