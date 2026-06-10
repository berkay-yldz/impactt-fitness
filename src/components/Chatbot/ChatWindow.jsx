import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, X, MessageSquare, Loader2, Bot } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

/**
 * IMPACT AI - Karakter Duygu Analiz Motoru
 * Yapay zekanın cümlesindeki kelimeleri okuyarak doğru animasyonu tetikler.
 */
const getCoachAsset = (text) => {
  if (!text) return "/assets/coach-thumbsup.webp";

  const lowerText = text.toLowerCase();

  // Büyük başarı ve kutlama kelimeleri
  if (
    lowerText.includes("tebrik") ||
    lowerText.includes("şampiyon") ||
    lowerText.includes("harika") ||
    lowerText.includes("mükemmel") ||
    lowerText.includes("bitti")
  ) {
    return "/assets/coach-celebrate.gif";
  }
  // Onaylama ve pozitif geri bildirim kelimeleri
  else if (
    lowerText.includes("iyi") ||
    lowerText.includes("tamam") ||
    lowerText.includes("doğru") ||
    lowerText.includes("güzel") ||
    lowerText.includes("aynen")
  ) {
    return "/assets/coach-thumbsup.webp";
  }

  // Standart bekleme/konuşma hali
  return "/assets/coach-thumbsup.webp";
};

export default function ChatWindow({ isOpen, onClose }) {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState([
    {
      role: "ai",
      content: `Selam ${currentUser?.displayName?.split(" ")[0] || "Şampiyon"}! Bugün nasıl bir antrenman planlıyoruz?`,
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Yeni mesaj geldiğinde otomatik en alta kaydır
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    const userMsg = { role: "user", content: inputText };
    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsLoading(true);

    try {
      if (!currentUser?.uid) {
        throw new Error("Kullanıcı oturumu bulunamadı");
      }

      const response = await fetch("/api/chat-rag", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: currentUser.uid,
          message: userMsg.content,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `HTTP ${response.status}`);
      }

      const { reply } = await response.json();
      if (!reply) throw new Error("Boş yanıt");

      setMessages((prev) => [...prev, { role: "ai", content: reply }]);
    } catch (error) {
      console.error("Chatbot API Hatası:", error);
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: "Şu an sunucuya bağlanamıyorum, biraz sonra tekrar dene." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-20 right-4 sm:right-8 w-[90vw] sm:w-[400px] h-[500px] max-h-[80vh] bg-white dark:bg-impact-surface border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden z-50"
        >
          {/* Üst Bar */}
          <div className="h-16 bg-impact-primary flex items-center justify-between px-4 sm:px-6 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full overflow-hidden">
                <img
                  src="/assets/coach-idle.webp"
                  alt="Rol Model"
                  className="w-full h-full rounded-full object-contain"
                />
              </div>
              <div>
                <h3 className="font-black text-black">IMPACT AI</h3>
                <p className="text-[10px] text-black/70 font-bold uppercase tracking-wider">
                  Dijital Antrenör
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-black/70 hover:text-black transition-colors rounded-full hover:bg-white/20"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mesajlaşma Alanı */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 custom-scrollbar bg-zinc-50 dark:bg-zinc-900/50">
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "ai" && (
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden shrink-0 border-2 border-impact-primary bg-zinc-100 dark:bg-impact-dark flex items-center justify-center relative">
                    {/* DİNAMİK KARAKTER RENDERİ */}
                    <img
                      src={getCoachAsset(msg.content)}
                      alt="AI Coach"
                      className="w-[99%] h-[99%] object-contain"
                    />{" "}
                  </div>
                )}

                <div
                  className={`max-w-[75%] p-3 sm:p-4 rounded-2xl text-sm ${msg.role === "user" ? "bg-zinc-900 dark:bg-white text-white dark:text-black rounded-tr-sm" : "bg-white dark:bg-impact-surface border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-tl-sm shadow-sm"}`}
                >
                  {msg.content}
                </div>
              </motion.div>
            ))}

            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden shrink-0 border-2 border-impact-primary bg-zinc-100 dark:bg-impact-dark flex items-center justify-center">
                  <img
                    src="/assets/coach-thumbsup.webp"
                    alt="AI Coach Loading"
                    className="w-full h-full object-cover scale-110 opacity-50"
                  />
                </div>
                <div className="bg-white dark:bg-impact-surface border border-zinc-200 dark:border-zinc-800 p-4 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-2">
                  <Loader2 className="w-4 h-4 text-impact-primary animate-spin" />
                  <span className="text-xs font-medium text-zinc-500">
                    Antrenör yazıyor...
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Girdi Alanı */}
          <div className="p-4 bg-white dark:bg-impact-surface border-t border-zinc-200 dark:border-zinc-800 shrink-0">
            <form onSubmit={handleSendMessage} className="flex gap-2 relative">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Yapay zekaya danış..."
                disabled={isLoading}
                className="flex-1 bg-zinc-100 dark:bg-zinc-900 border border-transparent focus:border-impact-primary/50 text-sm rounded-xl px-4 py-3 outline-none text-zinc-900 dark:text-white transition-all disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isLoading || !inputText.trim()}
                className="bg-impact-primary text-black p-3 rounded-xl hover:bg-impact-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}