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
