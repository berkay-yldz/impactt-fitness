import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Activity, Dumbbell, Utensils, Camera, Crown, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Sidebar({ isOpen, setIsOpen }) {
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Postür", path: "/posture", icon: Activity }, // DÜZELTME: Premium etiketi ve taç ikonu kaldırıldı
    { name: "Kas Gelişimi", path: "/muscle", icon: Dumbbell },
    { name: "Beslenme", path: "/nutrition", icon: Utensils },
    { name: "Disiplin (Premium)", path: "/discipline", icon: Camera, premium: true },
  ];

  const SidebarContent = () => (
    <>
      <div className="flex items-center justify-between mb-8 px-2">
        <div className="flex items-center gap-2">
          <Dumbbell className="text-impact-primary w-8 h-8" />
          <h1 className="text-2xl font-black text-white tracking-tight">
            IMPACT <span className="text-transparent bg-clip-text bg-gradient-to-r from-impact-primary to-impact-secondary">AI</span>
          </h1>
        </div>
        {/* Mobilde Kapatma Butonu */}
        <button className="lg:hidden text-zinc-400 hover:text-white" onClick={() => setIsOpen(false)}>
          <X className="w-6 h-6" />
        </button>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => setIsOpen(false)} // Linke tıklayınca mobilde menüyü kapat
              className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all font-medium ${
                isActive
                  ? "bg-impact-primary/10 text-impact-primary border border-impact-primary/20"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
              {item.premium && <Crown className="w-4 h-4 ml-auto text-impact-accent" />}
            </Link>
          );
        })}
      </nav>
    </>
  );

  return (
    <>
      {/* Mobil Karartma Efekti (Overlay) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Menü Paneli (Mobilde soldan kayar, Masaüstünde sabittir) */}
      <div
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-impact-surface border-r border-zinc-800 flex flex-col p-4 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <SidebarContent />
      </div>
    </>
  );
}