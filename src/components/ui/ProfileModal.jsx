import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, Mail, Activity, Scale, Ruler, Target, Dumbbell, Crown, Edit2, Save } from "lucide-react";
import { updateUserProfile } from "@/services/dbService";
import { toast } from "sonner";

export default function ProfileModal({ isOpen, onClose, profileData, currentUser }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    age: "",
    weight: "",
    height: "",
    programLevel: "beginner",
    fitnessGoal: "muscle_gain"
  });

  useEffect(() => {
    if (profileData) {
      setFormData({
        age: profileData.age || "",
        weight: profileData.weight || "",
        height: profileData.height || "",
        programLevel: profileData.programLevel || "beginner",
        fitnessGoal: profileData.fitnessGoal || "muscle_gain"
      });
    }
  }, [profileData]);

  const goals = { weight_loss: "Kilo Verme", muscle_gain: "Kas Gelişimi", endurance: "Kondisyon" };
  const levels = { beginner: "Başlangıç", intermediate: "Orta", advanced: "İleri" };

  const handleSave = async () => {
    if (!currentUser?.uid) return;
    setIsSaving(true);
    try {
      await updateUserProfile(currentUser.uid, {
        age: Number(formData.age),
        weight: Number(formData.weight),
        height: Number(formData.height),
        programLevel: formData.programLevel,
        fitnessGoal: formData.fitnessGoal
      });
      toast.success("Profil başarıyla güncellendi!");
      setIsEditing(false);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      toast.error("Güncelleme başarısız oldu.");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        // DÜZELTME: Sabit absolute yerine Flexbox ile tam merkezi hizalama
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6">
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            // DÜZELTME: Modal yüksekliği ekranın %85'iyle sınırlandı, flex-col eklendi
            className="relative w-full max-w-md max-h-[85vh] flex flex-col bg-white dark:bg-impact-surface border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl overflow-visible"
          >
            {/* AVATAR: Modal dışına taşacak şekilde sabitlendi */}
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 bg-zinc-100 dark:bg-zinc-900 border-4 border-white dark:border-impact-surface rounded-full flex items-center justify-center text-impact-primary shadow-sm z-20">
              <User className="w-12 h-12" />
            </div>

            {/* DÜZENLE BUTONU: Üst sağa sabitlendi */}
            <button 
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              disabled={isSaving}
              className={`absolute top-4 right-16 p-2 rounded-xl flex items-center justify-center transition-colors shadow-sm z-20 ${isEditing ? 'bg-emerald-500 hover:bg-emerald-600 text-white' : 'bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300'}`}
            >
              {isSaving ? <Activity className="w-5 h-5 animate-spin" /> : isEditing ? <Save className="w-5 h-5" /> : <Edit2 className="w-5 h-5" />}
            </button>

            {/* KAPAT BUTONU: Üst sağa sabitlendi */}
            <button 
              onClick={onClose} 
              className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 rounded-xl text-white transition-colors z-20"
            >
              <X className="w-5 h-5" />
            </button>

            {/* KAYDIRILABİLİR İÇERİK ALANI: Sadece bu div scroll edilebilir */}
            <div className="flex-1 overflow-y-auto custom-scrollbar rounded-3xl">
              
              <div className="h-24 bg-gradient-to-r from-impact-primary to-orange-400 shrink-0 rounded-t-3xl" />
              
              <div className="px-6 pb-8 relative pt-16 text-center">
                
                <h2 className="text-2xl font-black text-zinc-900 dark:text-white flex items-center justify-center gap-2">
                  {currentUser?.displayName || "Sporcu"}
                  {profileData?.isPremium && <Crown className="w-5 h-5 text-amber-500 drop-shadow-sm" />}
                </h2>
                <p className="text-sm text-zinc-500 font-medium flex items-center justify-center gap-1 mt-1">
                  <Mail className="w-4 h-4" /> {currentUser?.email || "email@gizli.com"}
                </p>

                <div className="grid grid-cols-2 gap-4 mt-8">
                  <div className="bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800 text-center">
                    <div className="flex items-center justify-center gap-2 text-zinc-500 mb-2">
                      <Activity className="w-4 h-4 text-impact-primary" /> <span className="text-xs font-bold uppercase tracking-wider">Yaş</span>
                    </div>
                    {isEditing ? (
                      <input type="number" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} className="w-full text-center bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg p-1.5 text-lg font-black text-zinc-900 dark:text-white outline-none focus:border-impact-primary" />
                    ) : (
                      <p className="text-xl font-black text-zinc-900 dark:text-white">{profileData?.age || "-"} <span className="text-sm text-zinc-400 font-medium">yaş</span></p>
                    )}
                  </div>

                  <div className="bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800 text-center">
                    <div className="flex items-center justify-center gap-2 text-zinc-500 mb-2">
                      <Scale className="w-4 h-4 text-impact-primary" /> <span className="text-xs font-bold uppercase tracking-wider">Kilo</span>
                    </div>
                    {isEditing ? (
                      <input type="number" value={formData.weight} onChange={e => setFormData({...formData, weight: e.target.value})} className="w-full text-center bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg p-1.5 text-lg font-black text-zinc-900 dark:text-white outline-none focus:border-impact-primary" />
                    ) : (
                      <p className="text-xl font-black text-zinc-900 dark:text-white">{profileData?.weight || "-"} <span className="text-sm text-zinc-400 font-medium">kg</span></p>
                    )}
                  </div>

                  <div className="bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800 text-center">
                    <div className="flex items-center justify-center gap-2 text-zinc-500 mb-2">
                      <Ruler className="w-4 h-4 text-impact-primary" /> <span className="text-xs font-bold uppercase tracking-wider">Boy</span>
                    </div>
                    {isEditing ? (
                      <input type="number" value={formData.height} onChange={e => setFormData({...formData, height: e.target.value})} className="w-full text-center bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg p-1.5 text-lg font-black text-zinc-900 dark:text-white outline-none focus:border-impact-primary" />
                    ) : (
                      <p className="text-xl font-black text-zinc-900 dark:text-white">{profileData?.height || "-"} <span className="text-sm text-zinc-400 font-medium">cm</span></p>
                    )}
                  </div>

                  <div className="bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800 text-center">
                    <div className="flex items-center justify-center gap-2 text-zinc-500 mb-2">
                      <Dumbbell className="w-4 h-4 text-impact-primary" /> <span className="text-xs font-bold uppercase tracking-wider">Seviye</span>
                    </div>
                    {isEditing ? (
                      <select value={formData.programLevel} onChange={e => setFormData({...formData, programLevel: e.target.value})} className="w-full text-center bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg p-1.5 text-sm font-black text-zinc-900 dark:text-white outline-none focus:border-impact-primary">
                        <option value="beginner">Başlangıç</option>
                        <option value="intermediate">Orta</option>
                        <option value="advanced">İleri</option>
                      </select>
                    ) : (
                      <p className="text-lg font-black text-zinc-900 dark:text-white truncate mt-1">{levels[profileData?.programLevel] || "Başlangıç"}</p>
                    )}
                  </div>
                </div>

                <div className="mt-4 bg-orange-50 dark:bg-impact-primary/10 p-4 rounded-2xl border border-orange-100 dark:border-impact-primary/20 flex items-center justify-center text-center">
                  <div className="w-full flex flex-col items-center justify-center">
                    <div className="p-3 bg-white dark:bg-impact-surface rounded-full text-impact-primary shadow-sm mb-3">
                      <Target className="w-6 h-6" />
                    </div>
                    <div className="w-full">
                      <p className="text-[10px] font-bold text-orange-600 dark:text-orange-400 uppercase tracking-widest">Ana Hedef</p>
                      {isEditing ? (
                        <select value={formData.fitnessGoal} onChange={e => setFormData({...formData, fitnessGoal: e.target.value})} className="w-full max-w-[200px] mx-auto text-center bg-white/50 dark:bg-zinc-800 border border-orange-200 dark:border-impact-primary/30 rounded-lg p-1.5 text-sm font-black text-zinc-900 dark:text-white outline-none focus:border-impact-primary mt-2 block">
                          <option value="weight_loss">Kilo Verme</option>
                          <option value="muscle_gain">Kas Gelişimi</option>
                          <option value="endurance">Kondisyon</option>
                        </select>
                      ) : (
                        <p className="text-lg font-black text-zinc-900 dark:text-white mt-1">{goals[profileData?.fitnessGoal] || "Belirtilmedi"}</p>
                      )}
                    </div>
                  </div>
                </div>
                
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}