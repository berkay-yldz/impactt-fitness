import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
// 🚨 BUG ÇÖZÜLDÜ: Bot ikonu import edildi
import { Send, X, Sparkles, Bot } from "lucide-react"; 
import { useAuth } from "@/context/AuthContext";

export default function ChatWindow({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    { role: "system", content: "Merhaba! Ben Impact AI Koçun. Antrenman ve beslenme hedeflerine ulaşman için buradayım. Sana nasıl yardımcı olabilirim?" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const { currentUser } = useAuth();

  // Otomatik aşağı kaydırma mekanizması
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setInput("");

    if (!currentUser?.uid) {
      setMessages(prev => [...prev, { role: "system", content: "Önce giriş yapman gerekiyor. AI Koç sadece oturum açmış kullanıcılara cevap verir." }]);
      return;
    }

    setIsTyping(true);

    try {
      const response = await fetch("/api/chat-rag", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: currentUser.uid,
          message: userMessage
        })
      });

      const data = await response.json();

      if (!response.ok) {
        const errMsg = data?.error
          ? `Hata: ${data.error}`
          : `Sunucu ${response.status} kodu döndü.`;
        setMessages(prev => [...prev, { role: "system", content: errMsg }]);
        return;
      }

      if (!data.reply) {
        setMessages(prev => [...prev, { role: "system", content: "AI boş cevap döndürdü, tekrar dener misin?" }]);
        return;
      }

      setMessages(prev => [...prev, { role: "system", content: data.reply }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: "system", content: "Bağlantı sorunu — npm run dev'i restart et veya internet bağlantını kontrol et." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          className="fixed bottom-20 right-4 sm:right-8 w-[90vw] sm:w-[400px] h-[500px] bg-white dark:bg-impact-surface border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl flex flex-col z-50 overflow-hidden transition-colors duration-300"
        >
          {/* Header */}
          <div className="bg-impact-primary p-4 flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              <span className="font-bold tracking-tight">Impact AI Koç</span>
            </div>
            <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mesaj Listesi */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-zinc-50 dark:bg-zinc-900/50">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-impact-primary text-white rounded-tr-sm"
                    : "bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-tl-sm shadow-sm"
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            
            {/* AI Yazıyor Göstergesi */}
            {isTyping && (
              <div className="flex justify-start items-center gap-2 text-zinc-400 dark:text-zinc-500">
                <Bot size={16} className="text-impact-primary animate-pulse" />
                <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 p-4 rounded-2xl rounded-tl-sm flex gap-1.5 shadow-sm">
                  <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-1.5 h-1.5 bg-zinc-400 dark:bg-zinc-500 rounded-full" />
                  <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1.5 h-1.5 bg-zinc-400 dark:bg-zinc-500 rounded-full" />
                  <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-1.5 h-1.5 bg-zinc-400 dark:bg-zinc-500 rounded-full" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Alanı */}
          <div className="p-4 bg-white dark:bg-impact-surface border-t border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center gap-2 relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Yapay zeka koçuna sor..."
                className="flex-1 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-full px-5 py-3 text-sm focus:outline-none focus:border-impact-primary text-zinc-800 dark:text-zinc-200 transition-colors"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="absolute right-2 p-2 bg-impact-primary text-white rounded-full hover:bg-impact-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
