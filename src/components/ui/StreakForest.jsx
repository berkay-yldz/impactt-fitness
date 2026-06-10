import { motion } from "framer-motion";
import { Flame, Sparkles } from "lucide-react";

const Sapling = ({ delay = 0 }) => (
  <motion.svg
    initial={{ scale: 0, y: 8 }}
    animate={{ scale: 1, y: 0 }}
    transition={{ delay, type: "spring", stiffness: 240, damping: 18 }}
    viewBox="0 0 32 60"
    className="w-6 sm:w-8 h-auto shrink-0 drop-shadow-sm"
  >
    <rect x="14" y="40" width="4" height="16" fill="#78350F" rx="1.5" />
    <ellipse cx="16" cy="35" rx="11" ry="9" fill="#10B981" />
    <ellipse cx="10" cy="41" rx="6" ry="5" fill="#059669" />
    <ellipse cx="22" cy="41" rx="6" ry="5" fill="#059669" />
  </motion.svg>
);

const Tree = ({ delay = 0, glow = false }) => (
  <motion.svg
    initial={{ scale: 0, y: 16 }}
    animate={{ scale: 1, y: 0 }}
    transition={{ delay, type: "spring", stiffness: 200, damping: 18 }}
    viewBox="0 0 80 120"
    className="w-12 sm:w-16 h-auto shrink-0 drop-shadow-md"
    style={glow ? { filter: "drop-shadow(0 0 8px rgba(16,185,129,0.45))" } : {}}
  >
    <rect x="36" y="76" width="8" height="38" fill="#78350F" rx="2" />
    <ellipse cx="40" cy="62" rx="28" ry="22" fill="#10B981" />
    <ellipse cx="24" cy="70" rx="16" ry="14" fill="#059669" />
    <ellipse cx="56" cy="70" rx="16" ry="14" fill="#059669" />
    <ellipse cx="40" cy="42" rx="20" ry="16" fill="#34D399" />
    <circle cx="32" cy="52" r="2" fill="#FDE68A" opacity="0.7" />
    <circle cx="50" cy="64" r="1.5" fill="#FDE68A" opacity="0.7" />
    <circle cx="40" cy="36" r="1.5" fill="#FDE68A" opacity="0.7" />
  </motion.svg>
);

export default function StreakForest({ count = 0 }) {
  const total = Number(count) || 0;
  const fullTrees = Math.min(7, Math.floor(total / 7));
  const saplings = total >= 49 ? 0 : total % 7;
  const bonusDays = total >= 50 ? total - 49 : 0;
  const toNextTree = total === 0 ? 7 : 7 - saplings;
  const isEmpty = total === 0;

  let milestoneLabel = "";
  if (total >= 365) milestoneLabel = "Yılın Atleti 🏆";
  else if (total >= 100) milestoneLabel = "Efsane Sezon 🔥";
  else if (total >= 30) milestoneLabel = "Aylık Şampiyon ⭐";
  else if (total >= 7) milestoneLabel = "İlk Orman ✨";

  return (
    <div className="relative bg-gradient-to-b from-sky-100 via-emerald-50 to-emerald-200 dark:from-sky-950/40 dark:via-emerald-950/40 dark:to-emerald-900/60 rounded-3xl border border-emerald-200 dark:border-emerald-900/60 p-6 sm:p-8 overflow-hidden shadow-sm">
      <div className="absolute top-5 left-6 w-14 h-6 bg-white/70 dark:bg-white/10 rounded-full blur-md" />
      <div className="absolute top-10 right-10 w-20 h-7 bg-white/60 dark:bg-white/10 rounded-full blur-md" />
      <motion.div
        animate={{ x: [0, 30, 0], opacity: [0.5, 0.7, 0.5] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-6 left-1/2 w-10 h-4 bg-white/50 dark:bg-white/8 rounded-full blur-sm"
      />

      <div className="relative z-10 flex items-start justify-between gap-4 mb-3">
        <div>
          <h3 className="text-[11px] sm:text-xs font-black uppercase tracking-widest text-emerald-700 dark:text-emerald-300 mb-1 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Antrenman Orman
          </h3>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black text-emerald-900 dark:text-emerald-50">
              {total}
            </span>
            <span className="text-sm font-bold text-emerald-700 dark:text-emerald-300">
              antrenman
            </span>
            {total > 0 && (
              <Flame className="w-5 h-5 text-orange-500 ml-1 animate-pulse" />
            )}
          </div>
        </div>

        {milestoneLabel && (
          <span className="text-[10px] sm:text-[11px] font-black bg-amber-500 text-white px-3 py-1.5 rounded-full uppercase tracking-widest shadow-md whitespace-nowrap">
            {milestoneLabel}
          </span>
        )}
      </div>

      <div className="relative h-32 sm:h-40 mt-2">
        <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-emerald-500/35 via-emerald-400/20 to-transparent dark:from-emerald-700/45 dark:via-emerald-700/20 rounded-b-2xl pointer-events-none" />

        <div className="relative h-full flex items-end justify-center gap-2 sm:gap-3 px-2 z-10">
          {isEmpty ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center gap-2 pb-3"
            >
              <span className="text-5xl">🌱</span>
              <p className="text-xs sm:text-sm font-bold text-emerald-800 dark:text-emerald-200 text-center max-w-xs">
                Ormanın daha çorak. Bir antrenman tamamla, ilk fidanını dik!
              </p>
            </motion.div>
          ) : (
            <>
              {Array.from({ length: fullTrees }).map((_, i) => (
                <Tree
                  key={`tree-${i}`}
                  delay={i * 0.08}
                  glow={i === fullTrees - 1}
                />
              ))}
              {Array.from({ length: saplings }).map((_, i) => (
                <Sapling
                  key={`sapling-${i}`}
                  delay={fullTrees * 0.08 + i * 0.05}
                />
              ))}
              {bonusDays > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring" }}
                  className="self-end mb-2 text-[10px] font-black bg-amber-500 text-white px-2 py-1 rounded-full"
                >
                  +{bonusDays}
                </motion.span>
              )}
            </>
          )}
        </div>
      </div>

      {!isEmpty && (
        <div className="relative z-10 mt-4 flex items-center justify-between text-[11px] font-bold">
          <span className="text-emerald-800 dark:text-emerald-200">
            🌳 {fullTrees} ağaç · 🌱 {saplings} fidan
          </span>
          <span className="text-emerald-700 dark:text-emerald-300">
            {fullTrees >= 7
              ? "Orman tamam 🎉"
              : `${toNextTree} antrenman sonra yeni ağaç`}
          </span>
        </div>
      )}
    </div>
  );
}
