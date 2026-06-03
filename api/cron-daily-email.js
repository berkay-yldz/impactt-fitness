import { Resend } from "resend";
import { adminDb } from "./_lib/firebaseAdmin.js";

const resend = new Resend(process.env.RESEND_API_KEY);
const MAX_USERS = 15;
const FROM_EMAIL = "Impact Fitness <onboarding@resend.dev>";

function buildEmailHtml(user) {
  const name = user.displayName ?? "Sporcu";
  const greeting =
    user.streak > 0
      ? `${user.streak} günlük serini koruyalım, ${name}!`
      : `Bugün yeni bir başlangıç günü, ${name}!`;

  const goalReminder =
    {
      weight_loss:
        "Bugün küçük bir kalori açığı oluştur — 30 dk yürüyüş + sağlıklı öğle yeterli.",
      muscle_gain:
        "Bugün protein hedefini unutma. Antrenmanda 1 set fazla yapmaya çalış.",
      endurance:
        "Bugün biraz daha uzun, biraz daha hızlı. Toparlanmayı da unutma.",
    }[user.fitnessGoal] || "Bugün bir adım at — disiplin yıllar inşa eder.";

  return `<div style="font-family: -apple-system, system-ui, sans-serif; max-width: 480px; margin: auto; padding: 32px; background: #18181b; color: #fafafa; border-radius: 16px;">
  <h2 style="color: #f97316; margin: 0 0 16px;">${greeting}</h2>
  <p style="font-size: 16px; line-height: 1.6; margin: 0 0 24px;">${goalReminder}</p>
  <p style="font-size: 13px; color: #71717a; margin: 0; border-top: 1px solid #27272a; padding-top: 16px;">Impact Fitness — Her gün bir adım.</p>
</div>`;
}

export default async function handler(req, res) {
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const dryRun = req.query?.dryRun === "1";

  try {
    const snap = await adminDb.collection("users").limit(MAX_USERS).get();
    const result = {
      sent: 0,
      failed: 0,
      skipped: 0,
      dryRun,
      attempts: [],
    };

    for (const doc of snap.docs) {
      const user = { uid: doc.id, ...doc.data() };
      if (!user.email) {
        result.skipped++;
        continue;
      }

      if (dryRun) {
        result.attempts.push({
          uid: user.uid,
          email: user.email,
          status: "dryrun",
        });
        result.sent++;
        continue;
      }

      try {
        await resend.emails.send({
          from: FROM_EMAIL,
          to: user.email,
          subject: "Impact Fitness — Günün hatırlatması",
          html: buildEmailHtml(user),
        });
        result.attempts.push({
          uid: user.uid,
          email: user.email,
          status: "sent",
        });
        result.sent++;
      } catch (error) {
        result.failed++;
        result.attempts.push({
          uid: user.uid,
          email: user.email,
          status: "error",
          message: String(error),
        });
        console.error(`cron email failed for ${user.uid}:`, error);
      }
    }

    return res
      .status(200)
      .json({ ok: true, ranAt: new Date().toISOString(), ...result });
  } catch (error) {
    console.error("cron-daily-email error:", error);
    return res.status(500).json({ error: "Sunucu hatasi" });
  }
}
