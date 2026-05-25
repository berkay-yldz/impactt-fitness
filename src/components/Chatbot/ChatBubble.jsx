import { motion } from "framer-motion";
import { User, Bot } from "lucide-react";

export default function ChatBubble({ role, content }) {
  const isUser = role === "user";
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 15, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`flex w-full mb-6 ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div className={`flex gap-3 max-w-[85%] ${isUser ? "flex-row-reverse" : "flex-row"}`}>
        
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-lg ${
          isUser ? "bg-impact-primary text-black" : "bg-zinc-800 text-impact-primary border border-zinc-700"
        }`}>
          {isUser ? <User size={16} strokeWidth={2.5} /> : <Bot size={16} />}
        </div>
        
        {/* Mesaj Kutusu */}
        <div className={`px-4 py-3 rounded-2xl shadow-md ${
          isUser 
            ? "bg-impact-primary text-black rounded-tr-none font-medium" 
            : "bg-impact-surface border border-zinc-800 text-zinc-200 rounded-tl-none"
        }`}>
          <p className="text-sm whitespace-pre-wrap leading-relaxed">{content}</p>
        </div>
        
      </div>
    </motion.div>
  );
}
