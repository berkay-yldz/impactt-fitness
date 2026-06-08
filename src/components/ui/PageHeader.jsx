import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, LogOut, User as UserIcon, Sparkles, Sun, Moon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { logoutUser } from "@/services/authService";
import { getUserProfile } from "@/services/dbService";
import ChatWindow from "@/components/Chatbot/ChatWindow";
import ProfileModal from "@/components/ui/ProfileModal";

export default function PageHeader({ title, icon: Icon, onMenuClick, profileData: externalProfileData }) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profileData, setProfileData] = useState(externalProfileData || null);
  const { currentUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    if (externalProfileData) { setProfileData(externalProfileData); return; }
    if (!currentUser?.uid) return;
    getUserProfile(currentUser.uid)
      .then((data) => { if (data) setProfileData(data); })
      .catch((err) => console.error("Profil verisi çekilemedi:", err));
  }, [currentUser, externalProfileData]);

  const handleLogout = async () => {
    try { await logoutUser(); navigate("/"); }
    catch (error) { console.error("Logout hatası:", error); }
  };

  return (
    <>
      <header className="h-16 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-impact-surface flex items-center justify-between px-4 sm:px-6 lg:px-8 transition-colors duration-300">
        <div className="flex items-center gap-4">
          <button
            className="lg:hidden p-2 text-zinc-500 dark:text-zinc-400 hover:text-impact-primary transition-colors"
            onClick={onMenuClick}
            aria-label="Menüyü aç"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h2 className="text-lg sm:text-xl font-bold hidden sm:flex items-center gap-2">
            {Icon && <Icon className="w-5 h-5 text-impact-primary" />}
            {title}
          </h2>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setIsChatOpen(true)}
            className="flex items-center gap-2 bg-impact-primary/10 hover:bg-impact-primary/20 text-impact-primary border border-impact-primary/30 px-3 py-1.5 rounded-full transition-all font-medium text-sm"
          >
            <Sparkles className="w-4 h-4" />
            <span className="hidden sm:inline">AI Koç</span>
          </button>

          <button
            onClick={toggleTheme}
            aria-label="Tema değiştir"
            className="p-2 text-zinc-500 dark:text-zinc-400 hover:text-impact-primary rounded-lg transition-colors"
          >
            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          <button
            onClick={() => setIsProfileModalOpen(true)}
            className="hidden md:flex items-center gap-2 bg-zinc-100 dark:bg-impact-dark px-3 py-1.5 rounded-full border border-zinc-200 dark:border-zinc-800 ml-2 transition-colors duration-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-impact-primary"
          >
            <div className="w-6 h-6 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 dark:text-zinc-400">
              <UserIcon className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              {currentUser?.displayName || "Sporcu"}
            </span>
          </button>

          <button
            onClick={handleLogout}
            aria-label="Çıkış yap"
            className="p-2 text-zinc-500 dark:text-zinc-400 hover:text-red-500 rounded-lg transition-colors ml-1"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      <ChatWindow isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profileData={profileData}
        currentUser={currentUser}
      />
    </>
  );
}
