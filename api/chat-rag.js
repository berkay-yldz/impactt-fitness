import {
  getUserProfile,
  getChatHistory,
  saveChatMessage,
} from "./_lib/dbAdmin.js";
import { buildSystemPrompt } from "../src/utils/promptBuilder.js";

const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { uid, message } = req.body ?? {};
    if (!uid) return res.status(400).json({ error: "uid required" });
    if (!message?.trim?.()) {
      return res.status(400).json({ error: "message required" });
    }
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "GEMINI_API_KEY missing" });
    }

    const profile = await getUserProfile(uid);
    if (!profile) {
      return res.status(404).json({ error: "User profile not found" });
    }

    const historyDesc = await getChatHistory(uid, 5);
    const historyChrono = historyDesc.slice().reverse();

    const systemPrompt = buildSystemPrompt(profile);

    const contents = historyChrono.map((m) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }],
    }));
    contents.push({ role: "user", parts: [{ text: message }] });

    const geminiRes = await fetch(
      `${GEMINI_URL}?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemPrompt }] },
          contents,
        }),
      },
    );

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error("Gemini API error:", geminiRes.status, errText);
      return res.status(502).json({ error: "AI servisi yanit veremedi" });
    }

    const geminiData = await geminiRes.json();
    const reply =
      geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!reply) {
      console.error("Gemini empty reply:", JSON.stringify(geminiData));
      return res.status(502).json({ error: "AI yanit uretemedi" });
    }

    await saveChatMessage(uid, "user", message);
    await saveChatMessage(uid, "ai", reply);

    return res.status(200).json({ reply });
  } catch (error) {
    console.error("chat-rag error:", error);
    return res.status(500).json({ error: "Sunucu hatasi" });
  }
}
