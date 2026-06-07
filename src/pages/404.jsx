import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-zinc-50 dark:bg-impact-dark text-zinc-900 dark:text-white p-4 text-center">
      <motion.h1 
        initial={{ scale: 0 }} 
        animate={{ scale: 1 }} 
        className="text-9xl font-black text-impact-primary"
      >
        404
      </motion.h1>
      <p className="text-xl font-bold mt-4">Bu sayfa henüz antrenman programına dahil değil!</p>
      <Button 
        onClick={() => navigate("/dashboard")} 
        className="mt-8 bg-impact-primary hover:bg-impact-secondary text-black font-bold"
      >
        Dashboard'a Dön
      </Button>
    </div>
  );
}