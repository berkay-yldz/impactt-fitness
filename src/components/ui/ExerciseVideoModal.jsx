import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Video } from "lucide-react";

export default function ExerciseVideoModal({ isOpen, onClose, exercise }) {
  if (!exercise) return null;

  const youtubeId = exercise.youtubeId;
  const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(exercise.name + " egzersiz form")}`;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 280, damping: 26 }}
            className="relative w-full max-w-2xl bg-white dark:bg-impact-surface border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="flex items-start justify-between p-5 border-b border-zinc-200 dark:border-zinc-800">
              <div className="flex-1">
                <span className="text-[10px] font-bold text-impact-primary uppercase tracking-widest">Hareket Demosu</span>
                <h3 className="text-xl font-black text-zinc-900 dark:text-white mt-1">{exercise.name}</h3>
                <div className="flex gap-3 mt-2 text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                  <span>{exercise.sets} Set</span>
                  <span>•</span>
                  <span>{exercise.reps} Tekrar</span>
                  {exercise.targetMuscle && (
                    <>
                      <span>•</span>
                      <span className="text-impact-primary">{exercise.targetMuscle}</span>
                    </>
                  )}
                </div>
              </div>
              <button
                onClick={onClose}
                aria-label="Kapat"
                className="p-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="aspect-video bg-black relative">
              {youtubeId ? (
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1`}
                  title={`${exercise.name} demo`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center p-6 bg-gradient-to-br from-zinc-900 to-zinc-800">
                  <Video className="w-16 h-16 text-red-500" />
                  <div>
                    <p className="text-white font-bold text-lg">Bu hareket için demo videosu henüz seçilmedi</p>
                    <p className="text-zinc-400 text-sm mt-1">YouTube'da hareket adıyla arama yapabilirsin</p>
                  </div>
                  <a
                    href={searchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-5 py-2.5 rounded-xl transition-colors"
                  >
                    <Video className="w-4 h-4" />
                    YouTube'da Ara
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>

            {youtubeId && (
              <div className="px-5 py-3 border-t border-zinc-200 dark:border-zinc-800 flex justify-end">
                <a
                  href={searchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-zinc-500 hover:text-impact-primary font-medium flex items-center gap-1.5 transition-colors"
                >
                  Daha fazla demo
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
