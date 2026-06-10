import { useMemo } from "react";
import { motion } from "framer-motion";
import { resolveRegions, REGION_LABELS } from "@/utils/muscleRegions";

const Region = ({ active, children }) => (
  <motion.g
    fill={active ? "#FF6B35" : "currentColor"}
    initial={false}
    animate={{ opacity: active ? 1 : 0.18 }}
    transition={{ duration: 0.35, ease: "easeOut" }}
    style={{
      filter: active ? "drop-shadow(0 0 6px rgba(249,115,22,0.6))" : "none",
    }}
  >
    {children}
  </motion.g>
);

export default function MuscleMap({ activeMuscle, dayMuscles }) {
  const activeRegions = useMemo(() => {
    const fromActive = resolveRegions(activeMuscle);
    if (fromActive.length > 0) return fromActive;
    return resolveRegions(dayMuscles);
  }, [activeMuscle, dayMuscles]);

  const isActive = (region) => activeRegions.includes(region);

  const activeLabels = activeRegions.map((r) => REGION_LABELS[r]).join(" • ");

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-zinc-400 dark:text-zinc-600">
      <svg
        viewBox="0 0 200 320"
        className="w-full max-h-[260px]"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Silüet outline (vücut hatları) */}
        <g
          stroke="currentColor"
          strokeWidth="1.2"
          strokeOpacity="0.35"
          fill="none"
        >
          {/* Kafa */}
          <ellipse cx="100" cy="28" rx="17" ry="20" />
          {/* Boyun */}
          <path d="M 92 48 L 92 58 L 108 58 L 108 48" />
          {/* Gövde + omuz + kol dış hat */}
          <path d="M 70 62 Q 60 70 56 90 L 50 175 L 60 175 L 68 95 Q 75 80 90 76 L 110 76 Q 125 80 132 95 L 140 175 L 150 175 L 144 90 Q 140 70 130 62 Z" />
          {/* Gövde alt */}
          <path d="M 68 95 L 64 175 Q 70 180 80 180 L 120 180 Q 130 180 136 175 L 132 95" />
          {/* Bacaklar */}
          <path d="M 78 178 L 72 305 L 92 305 L 96 200 L 104 200 L 108 305 L 128 305 L 122 178" />
        </g>

        {/* Boyun */}
        <Region active={isActive("neck")}>
          <rect x="92" y="48" width="16" height="12" rx="3" />
        </Region>

        {/* Omuzlar (deltoidler) */}
        <Region active={isActive("shoulders")}>
          <ellipse cx="64" cy="74" rx="11" ry="10" />
          <ellipse cx="136" cy="74" rx="11" ry="10" />
        </Region>

        {/* Göğüs (pec major) */}
        <Region active={isActive("chest")}>
          <path d="M 78 76 Q 100 72 122 76 L 122 102 Q 110 110 100 110 Q 90 110 78 102 Z" />
        </Region>

        {/* Kollar (üst + alt) */}
        <Region active={isActive("arms")}>
          {/* Sol üst kol (biceps) */}
          <path d="M 52 88 Q 50 85 56 84 L 64 86 L 66 130 L 56 132 Z" />
          {/* Sağ üst kol */}
          <path d="M 148 88 Q 150 85 144 84 L 136 86 L 134 130 L 144 132 Z" />
          {/* Sol alt kol (forearm) */}
          <path d="M 54 132 L 64 132 L 60 175 L 50 175 Z" />
          {/* Sağ alt kol */}
          <path d="M 146 132 L 136 132 L 140 175 L 150 175 Z" />
        </Region>

        {/* Core (rectus abdominis) */}
        <Region active={isActive("core")}>
          <rect x="86" y="112" width="28" height="52" rx="6" />
          {/* Karın bölümleri için ince çizgiler */}
          <line
            x1="100"
            y1="118"
            x2="100"
            y2="160"
            stroke="rgba(0,0,0,0.18)"
            strokeWidth="0.8"
          />
          <line
            x1="88"
            y1="128"
            x2="112"
            y2="128"
            stroke="rgba(0,0,0,0.18)"
            strokeWidth="0.8"
          />
          <line
            x1="88"
            y1="142"
            x2="112"
            y2="142"
            stroke="rgba(0,0,0,0.18)"
            strokeWidth="0.8"
          />
        </Region>

        {/* Sırt (önden görünmez, bel/lat hizasına badge gibi koyalım) */}
        <Region active={isActive("back")}>
          {/* Sol lat */}
          <path d="M 70 100 Q 66 105 68 130 L 78 130 L 80 110 Z" />
          {/* Sağ lat */}
          <path d="M 130 100 Q 134 105 132 130 L 122 130 L 120 110 Z" />
        </Region>

        {/* Kalça (glute) — pelvis bölgesi */}
        <Region active={isActive("glutes")}>
          <path d="M 78 168 Q 100 178 122 168 L 124 190 Q 100 198 76 190 Z" />
        </Region>

        {/* Bacaklar (quads + calves) */}
        <Region active={isActive("legs")}>
          {/* Sol quad */}
          <path d="M 78 195 L 74 250 L 90 250 L 94 195 Z" />
          {/* Sağ quad */}
          <path d="M 122 195 L 126 250 L 110 250 L 106 195 Z" />
          {/* Sol baldır (calf) */}
          <path d="M 76 255 L 74 300 L 88 300 L 90 255 Z" />
          {/* Sağ baldır */}
          <path d="M 124 255 L 126 300 L 112 300 L 110 255 Z" />
        </Region>
      </svg>

      <div className="text-center min-h-[18px]">
        {activeLabels ? (
          <p className="text-[11px] font-black uppercase tracking-widest text-impact-primary">
            {activeLabels}
          </p>
        ) : (
          <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">
            Seçim bekleniyor
          </p>
        )}
      </div>
    </div>
  );
}
