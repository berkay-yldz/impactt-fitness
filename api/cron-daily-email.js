import { Resend } from "resend";
import { adminDb } from "./_lib/firebaseAdmin.js";

const resend = new Resend(process.env.RESEND_API_KEY);
const MAX_USERS = 15;
const FROM_EMAIL = "Impact Fitness <onboarding@resend.dev>";
const COOLDOWN_MS = 24 * 60 * 60 * 1000;

const DAILY_TIPS = [
  "Antrenmandan önce 5 dakika dinamik ısınma yap — sakatlık riskini düşürür.",
  "Bugün su tüketimini 2.5 litreye çıkar. Yorgunluğun %60'ı dehidrasyon.",
  "Squat'ta dizlerin ayak parmaklarının çok ötesine geçmemeli.",
  "Protein hedefinin yarısını öğle saatlerine kadar tamamla.",
  "Uyku, kasın gerçek anlamda büyüdüğü andır — en az 7 saat.",
  "Push-up'ta omuzlar kulağa değil, kalçaya doğru çekik kalmalı.",
  "Cardio öncesi kafein, antrenman verimini %10-15 artırır.",
];

function tipOfTheDay() {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000,
  );
  return DAILY_TIPS[dayOfYear % DAILY_TIPS.length];
}

const SHARED_STYLES = `font-family: -apple-system, system-ui, sans-serif; max-width: 480px; margin: auto; padding: 32px; background: #18181b; color: #fafafa; border-radius: 16px;`;

function buildFreeEmailHtml() {
  const tip = tipOfTheDay();
  return `<div style="${SHARED_STYLES}">
  <h2 style="color: #f97316; margin: 0 0 8px;">Günün Fitness Haberi</h2>
  <p style="font-size: 13px; color: #a1a1aa; margin: 0 0 20px;">${new Date().toLocaleDateString("tr-TR", { day: "numeric", month: "long" })}</p>
  <p style="font-size: 16px; line-height: 1.6; margin: 0 0 24px;">${tip}</p>
  <a href="https://impactt-fitness-eran.vercel.app" style="display: inline-block; background: #f97316; color: white; text-decoration: none; padding: 12px 20px; border-radius: 8px; font-weight: 600; font-size: 14px;">Antrenmanına Başla</a>
  <p style="font-size: 13px; color: #71717a; margin: 24px 0 0; border-top: 1px solid #27272a; padding-top: 16px;">Impact Fitness — Her gün bir adım.</p>
</div>`;
}

function buildPremiumEmailHtml(user, badges) {
  const name = user.displayName ?? "Sporcu";
  const tip = tipOfTheDay();
  const streak = user.streak ?? 0;
  const streakLine = streak > 0
    ? `<div style="background: #27272a; border-left: 3px solid #f97316; padding: 12px 16px; margin: 0 0 16px; border-radius: 4px;"><span style="font-size: 13px; color: #a1a1aa;">Mevcut serin</span><br><strong style="font-size: 20px; color: #f97316;">${streak} gün 🔥</strong></div>`
    : `<div style="background: #27272a; padding: 12px 16px; margin: 0 0 16px; border-radius: 4px; font-size: 14px; color: #d4d4d8;">Bugün yeni bir başlangıç günü — ilk gününü kazan!</div>`;

  const badgesLine = badges.length > 0
    ? `<div style="margin: 0 0 16px;"><span style="font-size: 13px; color: #a1a1aa;">Aktif rozetlerin</span><br>${badges.map((b) => `<span style="display: inline-block; background: #f97316; color: white; padding: 4px 10px; border-radius: 12px; font-size: 12px; font-weight: 600; margin: 4px 4px 0 0;">⭐ ${b.title ?? b.badgeId}</span>`).join("")}</div>`
    : "";

  const goalReminder = {
    weight_loss: "Bugün küçük bir kalori açığı oluştur — 30 dk yürüyüş + sağlıklı öğle yeterli.",
    muscle_gain: "Bugün protein hedefini unutma. Antrenmanda 1 set fazla yapmaya çalış.",
    endurance: "Bugün biraz daha uzun, biraz daha hızlı. Toparlanmayı da unutma.",
  }[user.fitnessGoal] || "Bugün bir adım at — disiplin yıllar inşa eder.";

  return `<div style="${SHARED_STYLES}">
  <h2 style="color: #f97316; margin: 0 0 4px;">Selam ${name} 👋</h2>
  <p style="font-size: 13px; color: #a1a1aa; margin: 0 0 20px;">${new Date().toLocaleDateString("tr-TR", { day: "numeric", month: "long" })} — Premium</p>
  ${streakLine}
  ${badgesLine}
  <h3 style="color: #fafafa; font-size: 15px; margin: 16px 0 8px;">Günün Fitness Haberi</h3>
  <p style="font-size: 15px; line-height: 1.6; margin: 0 0 16px;">${tip}</p>
  <p style="font-size: 14px; line-height: 1.6; margin: 0 0 24px; color: #d4d4d8;"><strong style="color: #f97316;">Senin için:</strong> ${goalReminder}</p>
  <a href="https://impactt-fitness-eran.vercel.app" style="display: inline-block; background: #f97316; color: white; text-decoration: none; padding: 12px 20px; border-radius: 8px; font-weight: 600; font-size: 14px;">Bugünkü antrenmanı aç</a>
  <p style="font-size: 13px; color: #71717a; margin: 24px 0 0; border-top: 1px solid #27272a; padding-top: 16px;">Impact Fitness Premium — Sana özel.</p>
</div>`;
}

function isInCooldown(lastEmailSent) {
  if (!lastEmailSent) return false;
  const lastTime = new Date(lastEmailSent).getTime();
  if (Number.isNaN(lastTime)) return false;
  return Date.now() - lastTime < COOLDOWN_MS;
}

async function fetchBadges(uid) {
  const snap = await adminDb
    .collection("users")
    .doc(uid)
    .collection("badges")
    .get();
  return snap.docs.map((d) => d.data());
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
      cooldownSkipped: 0,
      dryRun,
      attempts: [],
    };

    for (const doc of snap.docs) {
      const user = { uid: doc.id, ...doc.data() };

      if (!user.email) {
        result.skipped++;
        result.attempts.push({ uid: user.uid, status: "no_email" });
        continue;
      }

      if (isInCooldown(user.lastEmailSent)) {
        result.cooldownSkipped++;
        result.attempts.push({
          uid: user.uid,
          email: user.email,
          status: "cooldown",
          lastEmailSent: user.lastEmailSent,
        });
        continue;
      }

      const tier = user.isPremium ? "premium" : "free";
      let html;
      if (user.isPremium) {
        const badges = await fetchBadges(user.uid);
        html = buildPremiumEmailHtml(user, badges);
      } else {
        html = buildFreeEmailHtml();
      }

      if (dryRun) {
        result.attempts.push({
          uid: user.uid,
          email: user.email,
          tier,
          status: "dryrun",
        });
        result.sent++;
        continue;
      }

      try {
        await resend.emails.send({
          from: FROM_EMAIL,
          to: user.email,
          subject: user.isPremium
            ? "Impact Fitness Premium — Günün hatırlatması"
            : "Impact Fitness — Günün Fitness Haberi",
          html,
        });
        await adminDb
          .collection("users")
          .doc(user.uid)
          .set({ lastEmailSent: new Date().toISOString() }, { merge: true });
        result.attempts.push({
          uid: user.uid,
          email: user.email,
          tier,
          status: "sent",
        });
        result.sent++;
      } catch (error) {
        result.failed++;
        result.attempts.push({
          uid: user.uid,
          email: user.email,
          tier,
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
