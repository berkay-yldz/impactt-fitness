import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

export async function createUserProfile(uid, data) {
  const profile = {
    email: data.email,
    displayName: data.displayName ?? null,
    age: data.age ?? null,
    weight: data.weight ?? null,
    height: data.height ?? null,
    fitnessGoal: data.fitnessGoal ?? null,
    programLevel: data.programLevel ?? "beginner",
    isPremium: false,
    streak: 0,
    workoutsCompleted: 0,
    lastWorkoutDate: null,
    createdAt: serverTimestamp(),
  };
  await setDoc(doc(db, "users", uid), profile);
  return profile;
}

export async function getUserProfile(uid) {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function updateUserProfile(uid, fields) {
  await updateDoc(doc(db, "users", uid), fields);
}

export async function getChatHistory(uid) {
  const q = query(
    collection(db, "chatHistory", uid, "messages"),
    orderBy("timestamp", "desc"),
    limit(5),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function saveChatMessage(uid, role, content) {
  await addDoc(collection(db, "chatHistory", uid, "messages"), {
    role,
    content,
    timestamp: serverTimestamp(),
  });
}

function toDayKey(date) {
  return date.toISOString().slice(0, 10);
}

export async function checkAndUpdateStreak(uid) {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return { streak: 0, alreadyCounted: false };

  const data = snap.data();
  const today = toDayKey(new Date());
  const last = data.lastWorkoutDate ?? null;

  if (last === today) {
    return { streak: data.streak ?? 0, alreadyCounted: true };
  }

  const yesterday = toDayKey(new Date(Date.now() - 86400000));
  let streak;
  if (!last) streak = 1;
  else if (last === yesterday) streak = (data.streak ?? 0) + 1;
  else streak = 1;

  const workoutsCompleted = (data.workoutsCompleted ?? 0) + 1;
  await updateDoc(ref, { streak, lastWorkoutDate: today, workoutsCompleted });
  return { streak, workoutsCompleted, alreadyCounted: false };
}

const BADGE_THRESHOLDS = [
  {
    id: "momentum",
    streak: 3,
    title: "Momentum",
    description: "3 günlük seri tamamlandı!",
  },
  {
    id: "weekly_warrior",
    streak: 7,
    title: "Haftalık Savaşçı",
    description: "Tam bir hafta kesintisiz!",
  },
  {
    id: "iron_will",
    streak: 30,
    title: "Demir İrade",
    description: "30 gün boyunca disiplin!",
  },
  {
    id: "diligent",
    workouts: 10,
    title: "Azimli",
    description: "10 antrenman tamamlandı!",
  },
];

export async function upgradeToPremium(uid, planType = "monthly") {
  const res = await fetch("/api/upgrade-premium", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ uid, planType }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error ?? "Premium yukseltme basarisiz");
  return data;
}

export async function checkBadgeEligibility(uid, userProfile) {
  const streak = userProfile?.streak ?? 0;
  const workouts = userProfile?.workoutsCompleted ?? 0;
  const newlyAwarded = [];
  for (const t of BADGE_THRESHOLDS) {
    const eligible =
      (t.streak !== undefined && streak >= t.streak) ||
      (t.workouts !== undefined && workouts >= t.workouts);
    if (!eligible) continue;
    const result = await awardBadge(uid, t.id, {
      title: t.title,
      description: t.description,
    });
    if (!result.alreadyEarned) newlyAwarded.push(t);
  }
  return newlyAwarded;
}

export async function getUserBadges(uid) {
  const snap = await getDocs(collection(db, "users", uid, "badges"));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function awardBadge(uid, badgeId, meta = {}) {
  const badgeRef = doc(db, "users", uid, "badges", badgeId);
  const existing = await getDoc(badgeRef);
  if (existing.exists()) return { alreadyEarned: true };
  await setDoc(badgeRef, {
    badgeId,
    earnedAt: serverTimestamp(),
    title: meta.title ?? badgeId,
    description: meta.description ?? "",
  });
  return { alreadyEarned: false };
}
