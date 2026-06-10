import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, RotateCcw, Minus, Plus, X, Timer as TimerIcon } from "lucide-react";

const playBeep = () => {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    [0, 0.35, 0.7].forEach((delay) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 880;
      gain.gain.setValueAtTime(0.3, ctx.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + delay + 0.25);
      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + 0.3);
    });
  } catch {
    // ses çalmazsa sessizce geç
  }
};

const playTick = () => {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 1200;
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  } catch {
    // sessiz
  }
};

const CIRCUMFERENCE = 2 * Math.PI * 90;

export default function HoldTimerOverlay({
  isOpen,
  onClose,
  exerciseName,
  initialSeconds = 30,
}) {
  const [totalSeconds, setTotalSeconds] = useState(initialSeconds);
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      const init = Math.max(5, Number(initialSeconds) || 30);
      setTotalSeconds(init);
      setSecondsLeft(init);
      setIsRunning(false);
      setIsFinished(false);
    }
  }, [isOpen, initialSeconds]);

  useEffect(() => {
    if (!isRunning) return;
    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          setIsRunning(false);
          setIsFinished(true);
          playBeep();
          navigator.vibrate?.([200, 100, 200, 100, 400]);
          return 0;
        }
        if (prev <= 4) playTick();
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  const toggleRun = () => {
    if (isFinished) return;
    setIsRunning((r) => !r);
  };

  const reset = () => {
    setIsRunning(false);
    setIsFinished(false);
    setSecondsLeft(totalSeconds);
  };

  const adjust = (delta) => {
    if (isRunning) return;
    const next = Math.max(5, Math.min(600, totalSeconds + delta));
    setTotalSeconds(next);
    setSecondsLeft(next);
    setIsFinished(false);
  };

  const progress = totalSeconds > 0 ? secondsLeft / totalSeconds : 0;
  const dashOffset = CIRCUMFERENCE * (1 - progress);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 280, damping: 26 }}
            className="relative w-full max-w-md bg-white dark:bg-impact-surface rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl p-6 sm:p-8"
          >
            <button
              onClick={onClose}
              aria-label="Kapat"
              className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-1">
              <TimerIcon className="w-4 h-4 text-impact-primary" />
              <span className="text-[10px] font-black uppercase tracking-widest text-impact-primary">
                Süre Tutucu
              </span>
            </div>
            <h2 className="text-xl font-black text-zinc-900 dark:text-white mb-6 pr-8">
              {exerciseName || "Hareket"}
            </h2>

            <div className="relative flex items-center justify-center my-2">
              <svg width="220" height="220" viewBox="0 0 220 220" className="-rotate-90">
                <circle
                  cx="110"
                  cy="110"
                  r="90"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="10"
                  className="text-zinc-100 dark:text-zinc-800"
                />
                <motion.circle
                  cx="110"
                  cy="110"
                  r="90"
                  fill="none"
                  stroke="#FF6B35"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={CIRCUMFERENCE}
                  animate={{ strokeDashoffset: dashOffset }}
                  transition={{ duration: 0.9, ease: "linear" }}
                  style={{
                    filter: isRunning
                      ? "drop-shadow(0 0 8px rgba(249,115,22,0.5))"
                      : "none",
                  }}
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.span
                  key={secondsLeft}
                  initial={{ scale: 1.2, opacity: 0.4 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.25 }}
                  className={`text-6xl sm:text-7xl font-black tabular-nums ${
                    isFinished
                      ? "text-emerald-500"
                      : secondsLeft <= 4 && isRunning
                        ? "text-red-500"
                        : "text-zinc-900 dark:text-white"
                  }`}
                >
                  {secondsLeft}
                </motion.span>
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mt-1">
                  {isFinished ? "Bitti!" : "saniye"}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 mt-6">
              <button
                onClick={() => adjust(-10)}
                disabled={isRunning}
                aria-label="10 saniye azalt"
                className="flex items-center gap-1 px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold text-xs disabled:opacity-40 disabled:cursor-not-allowed hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
              >
                <Minus className="w-3.5 h-3.5" />
                10
              </button>
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest px-2">
                {totalSeconds}s
              </span>
              <button
                onClick={() => adjust(10)}
                disabled={isRunning}
                aria-label="10 saniye ekle"
                className="flex items-center gap-1 px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold text-xs disabled:opacity-40 disabled:cursor-not-allowed hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                10
              </button>
            </div>

            <div className="flex items-center justify-center gap-3 mt-5">
              <button
                onClick={reset}
                aria-label="Sıfırla"
                className="p-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
              <button
                onClick={toggleRun}
                disabled={isFinished}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-xl font-black text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(249,115,22,0.25)] ${
                  isRunning
                    ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900"
                    : "bg-impact-primary hover:bg-impact-secondary text-black"
                }`}
              >
                {isRunning ? (
                  <>
                    <Pause className="w-5 h-5" /> Duraklat
                  </>
                ) : isFinished ? (
                  <>Bitti</>
                ) : (
                  <>
                    <Play className="w-5 h-5" /> Başlat
                  </>
                )}
              </button>
            </div>

            {isFinished && (
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center text-emerald-500 dark:text-emerald-400 text-xs font-bold uppercase tracking-widest mt-4"
              >
                Süre tamamlandı 🔥 Bir sonraki sete hazır mısın?
              </motion.p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
