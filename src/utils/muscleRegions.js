/**
 * targetMuscle string'lerini 8 ana vucut bolgesine eslemek icin paylasilan helper.
 * MuscleMap (sag panel siluet) + MuscleHealthMap (dashboard heatmap) ortak kullanir.
 */

export const KEYWORDS = {
  chest: ["göğüs", "gogus"],
  back: ["sırt", "sirt", "posterior", "omurga", "bel"],
  shoulders: ["omuz"],
  arms: ["triceps", "biceps", "kol", "kavrama"],
  core: ["core", "karın", "karin", "yan core"],
  legs: ["bacak", "quad", "hamstring", "calf", "baldır", "baldir"],
  glutes: ["kalça", "kalca", "glute"],
  neck: ["boyun"],
};

export const REGION_LABELS = {
  chest: "Göğüs",
  back: "Sırt",
  shoulders: "Omuz",
  arms: "Kol",
  core: "Core",
  legs: "Bacak",
  glutes: "Kalça",
  neck: "Boyun",
};

export const REGION_KEYS = Object.keys(KEYWORDS);

export const resolveRegions = (muscleString) => {
  if (!muscleString) return [];
  const lower = String(muscleString).toLowerCase();
  const matched = new Set();
  Object.entries(KEYWORDS).forEach(([region, words]) => {
    if (words.some((w) => lower.includes(w))) matched.add(region);
  });
  return [...matched];
};
