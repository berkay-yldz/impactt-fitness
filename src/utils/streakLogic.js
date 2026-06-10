/**
 * Gunluk streak (kesintisiz antrenman serisi) mantigi.
 * Antrenman tamamlandiginda cagrilir: tarihe gore streak +1 ya da reset.
 */

import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/services/firebase";

const todayKey = () => new Date().toISOString().slice(0, 10);

const daysBetween = (fromKey, toKey) => {
  const a = new Date(fromKey);
  const b = new Date(toKey);
  return Math.round((b - a) / (1000 * 60 * 60 * 24));
};

/**
 * Streak'i gerekirse artirir, ayni gun ikinci kez cagrilirsa dokunmaz,
 * 2+ gun boslukta 1'e resetler. Yeni streak degerini dondurur (veya null).
 */
export const bumpStreakIfNeeded = async (uid) => {
  if (!uid) return null;
  try {
    const userRef = doc(db, "users", uid);
    const snap = await getDoc(userRef);
    if (!snap.exists()) return null;

    const data = snap.data();
    const today = todayKey();
    const last = data.lastWorkoutDate || null;
    const currentStreak = Number(data.streak) || 0;
    const currentTotal = Number(data.totalWorkouts) || 0;

    let newStreak = currentStreak;
    if (last !== today) {
      if (!last) {
        newStreak = 1;
      } else {
        const diff = daysBetween(last, today);
        if (diff === 1) newStreak = currentStreak + 1;
        else if (diff <= 0) newStreak = Math.max(1, currentStreak);
        else newStreak = 1;
      }
    }

    const newTotal = currentTotal + 1;

    await updateDoc(userRef, {
      streak: newStreak,
      lastWorkoutDate: today,
      totalWorkouts: newTotal,
    });

    return { streak: newStreak, totalWorkouts: newTotal };
  } catch (error) {
    console.error("Streak güncellenemedi:", error);
    return null;
  }
};
