/**
 * Tamamlanan hareketlerin targetMuscle'lerini localStorage'a gunluk kaydeder.
 * Dashboard'daki MuscleHealthMap son 7 gunluk frekansi okur.
 */

import { resolveRegions, REGION_KEYS } from "./muscleRegions";

const KEY = "impact_muscle_history_v1";
const RETENTION_DAYS = 30;

const todayKey = () => new Date().toISOString().slice(0, 10);

const readAll = () => {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(KEY) || "{}");
  } catch {
    return {};
  }
};

const writeAll = (data) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    // sessız geç (quota / private mode)
  }
};

const prune = (data) => {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - RETENTION_DAYS);
  const cutoffKey = cutoff.toISOString().slice(0, 10);
  Object.keys(data).forEach((k) => {
    if (k < cutoffKey) delete data[k];
  });
  return data;
};

/**
 * Bir hareketi bugunun listesine ekler. Ayni gun ayni kas grubu birden cok eklenebilir
 * (sayim = frekans cogalır).
 */
export const recordCompletedMuscle = (muscleString) => {
  if (!muscleString) return;
  const data = readAll();
  const today = todayKey();
  if (!data[today]) data[today] = [];
  data[today].push(String(muscleString));
  writeAll(prune(data));
};

/**
 * Son N gun (default 7) icin her vucut bolgesinin toplam frekansini dondurur.
 * { chest: 3, back: 1, core: 5, ... }
 */
export const getLastNDaysFrequency = (n = 7) => {
  const data = readAll();
  const frequency = {};
  REGION_KEYS.forEach((r) => (frequency[r] = 0));

  const today = new Date();
  for (let i = 0; i < n; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const muscles = data[key] || [];
    muscles.forEach((m) => {
      resolveRegions(m).forEach((r) => {
        frequency[r] = (frequency[r] || 0) + 1;
      });
    });
  }

  return frequency;
};

/**
 * Test/demo amacli — gunce mevcut kayit yoksa son 7 gunden rastgele birkac kayit uretir.
 * Sadece kayit hic yoksa cagrilir (ilk kullanim).
 */
export const seedDemoHistory = () => {
  const data = readAll();
  if (Object.keys(data).length > 0) return;
  const demoMuscles = ["Core", "Sırt", "Omuz", "Bacak"];
  const today = new Date();
  for (let i = 1; i < 5; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    data[key] = [demoMuscles[i % demoMuscles.length]];
  }
  writeAll(data);
};
