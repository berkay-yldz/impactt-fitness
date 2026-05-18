export default async function handler(req, res) {
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  return res.status(200).json({ ok: true, ranAt: new Date().toISOString() });
}
// doğum günün kutlu olsun 
