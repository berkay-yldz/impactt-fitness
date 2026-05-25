import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, X, Sparkles } from "lucide-react";
import ChatBubble from "./ChatBubble";
import { useAuth } from "@/context/AuthContext";

export default function ChatWindow({ isOpen, onClose }) {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState([
    { role: "ai", content: "Selam! Ben Impact AI. Antrenman programın, beslenme düzenin veya postürün hakkında ne sormak istersin?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Yeni mesaj geldiğinde otomatik en alta kaydır
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setIsLoading(true);

    try {
      // İLİŞKİ: Eran'ın Vercel Serverless fonksiyonuna veri fırlatıyoruz
      const res = await fetch("/api/chat-rag", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: currentUser?.uid, message: userMsg })
      });
      
      if (!res.ok) throw new Error("API Hatası");
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "ai", content: data.reply }]);
    } catch (error) {
      // Backend hazır olana kadar arayüzün çökmesini engellemek için yedek (fallback) yanıt
      setTimeout(() => {
        setMessages((prev) => [...prev, { role: "ai", content: "Bağlantı kuruluyor... (Eran'ın API'si henüz yanıt vermedi ama arayüzümüz mermi gibi çalışıyor! 🚀)" }]);
        setIsLoading(false);
      }, 1500);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Arka Plan Karartması (Mobilde) */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          />

          {/* Sağdan Kayarak Açılan Chat Paneli */}
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 z-50 w-full sm:w-[400px] bg-impact-dark border-l border-zinc-800 shadow-2xl flex flex-col"
          >
            {/* Üst Header */}
            <div className="h-16 border-b border-zinc-800 bg-impact-surface px-4 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                {/* Berkay'ın yüklediği asset'i profil fotosu olarak kullanıyoruz */}
                <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 overflow-hidden flex items-center justify-center">
                  <img src="/assets/coach-idle.webp" alt="AI Coach" className="w-full h-full object-cover" onError={(e) => e.target.style.display='none'} />
                </div>
                <div>
                  <h3 className="font-bold text-white tracking-tight flex items-center gap-1">
                    IMPACT KOÇ <Sparkles className="w-3 h-3 text-impact-primary" />
                  </h3>
                  <span className="text-[10px] text-impact-primary font-medium uppercase tracking-wider">Yapay Zeka Destekli</span>
                </div>
              </div>
              <button onClick={onClose} className="p-2 text-zinc-400 hover:text-white transition-colors rounded-lg hover:bg-zinc-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mesajlaşma Alanı */}
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-impact-dark/50">
              {messages.map((msg, idx) => (
                <ChatBubble key={idx} role={msg.role} content={msg.content} />
              ))}
              
              {/* Yazıyor... Animasyonu */}
              {isLoading && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start mb-4">
                  <div className="flex gap-3 max-w-[80%]">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-impact-primary">
                      <Bot size={16} />
                    </div>
                    <div className="px-5 py-4 rounded-2xl bg-impact-surface border border-zinc-800 rounded-tl-none flex items-center gap-1.5">
                      <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-2 h-2 rounded-full bg-zinc-500" />
                      <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-2 h-2 rounded-full bg-zinc-500" />
                      <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-2 h-2 rounded-full bg-zinc-500" />
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Alanı */}
            <div className="p-4 bg-impact-surface border-t border-zinc-800">
              <form onSubmit={handleSend} className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Koçuna bir soru sor..."
                  className="w-full bg-impact-dark border border-zinc-700 rounded-full py-3 pl-4 pr-12 text-sm text-white focus:outline-none focus:border-impact-primary focus:ring-1 focus:ring-impact-primary transition-all placeholder:text-zinc-500"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="absolute right-1.5 p-2 bg-impact-primary text-black rounded-full hover:bg-impact-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
