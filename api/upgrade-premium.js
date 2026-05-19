import { adminDb } from "./_lib/firebaseAdmin.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (req.headers["x-admin-secret"] !== process.env.ADMIN_SECRET) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { uid } = req.body ?? {};
  if (!uid) {
    return res.status(400).json({ error: "uid required" });
  }

  try {
    await adminDb.collection("users").doc(uid).update({ isPremium: true });
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("upgrade-premium error:", error);
    return res.status(500).json({ error: "Sunucu hatası" });
  }
}
