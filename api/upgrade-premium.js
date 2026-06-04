import { adminDb } from "./_lib/firebaseAdmin.js";

const VALID_PLANS = ["monthly", "yearly"];

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { uid, planType } = req.body ?? {};
  if (!uid) return res.status(400).json({ error: "uid required" });
  if (planType && !VALID_PLANS.includes(planType)) {
    return res.status(400).json({ error: "planType monthly | yearly olmali" });
  }

  try {
    await adminDb
      .collection("users")
      .doc(uid)
      .set(
        {
          isPremium: true,
          premiumPlanType: planType ?? "monthly",
          premiumSince: new Date().toISOString(),
        },
        { merge: true },
      );
    return res.status(200).json({
      success: true,
      message: "Premium aktivasyon başarılı!",
    });
  } catch (error) {
    console.error("upgrade-premium error:", error);
    return res.status(500).json({ error: "Sunucu hatası" });
  }
}
