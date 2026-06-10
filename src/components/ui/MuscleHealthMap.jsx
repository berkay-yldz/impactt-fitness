import { useMemo } from "react";
import { motion } from "framer-motion";
import { Activity, AlertCircle } from "lucide-react";
import { REGION_LABELS, REGION_KEYS } from "@/utils/muscleRegions";
import { getLastNDaysFrequency } from "@/utils/muscleHistory";

const getRegionColor = (count) => {
  if (count === 0) return { fill: "#A1A1AA", label: "İhmal", opacity: 0.22 };
  if (count <= 2) return { fill: "#10B981", label: "Sağlıklı", opacity: 0.9 };
  if (count <= 4) return { fill: "#F59E0B", label: "Dengeli", opacity: 0.92 };
  return { fill: "#EF4444", label: "Aşırı", opacity: 0.95 };
};

const Region = ({ color, opacity, glow, children }) => (
  <motion.g
    fill={color}
    initial={false}
    animate={{ opacity }}
    transition={{ duration: 0.4, ease: "easeOut" }}
    style={
      glow
        ? { filter: `drop-shadow(0 0 6px ${color}80)` }
        : { filter: "none" }
    }
  >
    {children}
  </motion.g>
);

export default function MuscleHealthMap() {
  const frequency = useMemo(() => getLastNDaysFrequency(7), []);

  const regionMeta = useMemo(() => {
    const map = {};
    REGION_KEYS.forEach((r) => {
      const count = frequency[r] || 0;
      map[r] = { count, ...getRegionColor(count) };
    });
    return map;
  }, [frequency]);

  const get = (r) => regionMeta[r] || { fill: "#A1A1AA", opacity: 0.22, count: 0 };
  const isWorked = (r) => get(r).count > 0;

  const neglected = useMemo(() => {
    const zeros = REGION_KEYS.filter((r) => (frequency[r] || 0) === 0);
    return zeros.map((r) => REGION_LABELS[r]);
  }, [frequency]);

  const favorite = useMemo(() => {
    let max = 0;
    let best = null;
    REGION_KEYS.forEach((r) => {
      const c = frequency[r] || 0;
      if (c > max) {
        max = c;
        best = r;
      }
    });
    return best ? { label: REGION_LABELS[best], count: max } : null;
  }, [frequency]);

  const totalWorked = useMemo(
    () => REGION_KEYS.filter((r) => (frequency[r] || 0) > 0).length,
    [frequency],
  );

  const isEmpty = totalWorked === 0;

  return (
    <div className="bg-white dark:bg-impact-surface border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 sm:p-6 shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-[11px] sm:text-xs font-black uppercase tracking-widest text-impact-primary flex items-center gap-1.5 mb-1">
            <Activity className="w-3.5 h-3.5" />
            Kas Sağlığı Haritası
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
            Son 7 gün vücudun nasıl çalıştı?
          </p>
        </div>
        <span className="text-[10px] font-black bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 px-2.5 py-1 rounded-full uppercase tracking-widest">
          {totalWorked}/8 bölge
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
        <div className="flex items-center justify-center text-zinc-400 dark:text-zinc-600">
          <svg
            viewBox="0 0 200 320"
            className="w-full max-h-[260px]"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g
              stroke="currentColor"
              strokeWidth="1.2"
              strokeOpacity="0.35"
              fill="none"
            >
              <ellipse cx="100" cy="28" rx="17" ry="20" />
              <path d="M 92 48 L 92 58 L 108 58 L 108 48" />
              <path d="M 70 62 Q 60 70 56 90 L 50 175 L 60 175 L 68 95 Q 75 80 90 76 L 110 76 Q 125 80 132 95 L 140 175 L 150 175 L 144 90 Q 140 70 130 62 Z" />
              <path d="M 68 95 L 64 175 Q 70 180 80 180 L 120 180 Q 130 180 136 175 L 132 95" />
              <path d="M 78 178 L 72 305 L 92 305 L 96 200 L 104 200 L 108 305 L 128 305 L 122 178" />
            </g>

            <Region {...get("neck")} glow={isWorked("neck")}>
              <rect x="92" y="48" width="16" height="12" rx="3" />
            </Region>

            <Region {...get("shoulders")} glow={isWorked("shoulders")}>
              <ellipse cx="64" cy="74" rx="11" ry="10" />
              <ellipse cx="136" cy="74" rx="11" ry="10" />
            </Region>

            <Region {...get("chest")} glow={isWorked("chest")}>
              <path d="M 78 76 Q 100 72 122 76 L 122 102 Q 110 110 100 110 Q 90 110 78 102 Z" />
            </Region>

            <Region {...get("arms")} glow={isWorked("arms")}>
              <path d="M 52 88 Q 50 85 56 84 L 64 86 L 66 130 L 56 132 Z" />
              <path d="M 148 88 Q 150 85 144 84 L 136 86 L 134 130 L 144 132 Z" />
              <path d="M 54 132 L 64 132 L 60 175 L 50 175 Z" />
              <path d="M 146 132 L 136 132 L 140 175 L 150 175 Z" />
            </Region>

            <Region {...get("core")} glow={isWorked("core")}>
              <rect x="86" y="112" width="28" height="52" rx="6" />
            </Region>

            <Region {...get("back")} glow={isWorked("back")}>
              <path d="M 70 100 Q 66 105 68 130 L 78 130 L 80 110 Z" />
              <path d="M 130 100 Q 134 105 132 130 L 122 130 L 120 110 Z" />
            </Region>

            <Region {...get("glutes")} glow={isWorked("glutes")}>
              <path d="M 78 168 Q 100 178 122 168 L 124 190 Q 100 198 76 190 Z" />
            </Region>

            <Region {...get("legs")} glow={isWorked("legs")}>
              <path d="M 78 195 L 74 250 L 90 250 L 94 195 Z" />
              <path d="M 122 195 L 126 250 L 110 250 L 106 195 Z" />
              <path d="M 76 255 L 74 300 L 88 300 L 90 255 Z" />
              <path d="M 124 255 L 126 300 L 112 300 L 110 255 Z" />
            </Region>
          </svg>
        </div>

        <div className="space-y-2">
          {isEmpty ? (
            <div className="flex items-start gap-2 p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800">
              <AlertCircle className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
              <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400">
                Henüz veri yok. Bir antrenman tamamla, haritan dolmaya başlasın.
              </p>
            </div>
          ) : (
            <>
              {favorite && (
                <div className="p-3 rounded-2xl bg-orange-50 dark:bg-impact-primary/10 border border-orange-200 dark:border-impact-primary/30">
                  <p className="text-[10px] font-black uppercase tracking-widest text-impact-primary mb-1">
                    Bu Hafta Favorin
                  </p>
                  <p className="text-sm font-bold text-zinc-900 dark:text-white">
                    {favorite.label}{" "}
                    <span className="text-zinc-500 font-medium">
                      · {favorite.count} kez
                    </span>
                  </p>
                </div>
              )}

              {neglected.length > 0 && (
                <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800">
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    İhmal Edilen
                  </p>
                  <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                    {neglected.slice(0, 3).join(" · ")}
                    {neglected.length > 3 && ` +${neglected.length - 3}`}
                  </p>
                </div>
              )}

              <div className="flex items-center gap-2 pt-1 flex-wrap text-[10px] font-bold">
                <span className="flex items-center gap-1 text-zinc-500">
                  <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
                  Sağlıklı
                </span>
                <span className="flex items-center gap-1 text-zinc-500">
                  <span className="w-2.5 h-2.5 rounded-sm bg-amber-500" />
                  Dengeli
                </span>
                <span className="flex items-center gap-1 text-zinc-500">
                  <span className="w-2.5 h-2.5 rounded-sm bg-red-500" />
                  Aşırı
                </span>
                <span className="flex items-center gap-1 text-zinc-500">
                  <span className="w-2.5 h-2.5 rounded-sm bg-zinc-400" />
                  İhmal
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
