import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "./firebaseAdmin.js";

export async function getUserProfile(uid) {
  const snap = await adminDb.collection("users").doc(uid).get();
  return snap.exists ? { id: snap.id, ...snap.data() } : null;
}

export async function getChatHistory(uid, max = 5) {
  const snap = await adminDb
    .collection("chatHistory")
    .doc(uid)
    .collection("messages")
    .orderBy("timestamp", "desc")
    .limit(max)
    .get();
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function saveChatMessage(uid, role, content) {
  await adminDb
    .collection("chatHistory")
    .doc(uid)
    .collection("messages")
    .add({
      role,
      content,
      timestamp: FieldValue.serverTimestamp(),
    });
}
