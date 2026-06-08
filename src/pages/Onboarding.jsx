import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { ArrowRight, ArrowLeft, Flame, Dumbbell, Activity, Target, TrendingUp, Zap } from "lucide-react"
import { useAuth } from "@/context/AuthContext" 
import { createUserProfile } from "@/services/dbService" 

const variants = {
  enter: (direction) => ({ x: direction > 0 ? 50 : -50, opacity: 0 }),
  center: { zIndex: 1, x: 0, opacity: 1 },
  exit: (direction) => ({ zIndex: 0, x: direction < 0 ? 50 : -50, opacity: 0 })
}

const SelectionCard = ({ icon: Icon, title, desc, selected, onSelect }) => (
  <div
    onClick={onSelect}
    className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-4 ${
      selected
        ? "border-impact-primary bg-impact-primary/10 shadow-[0_0_15px_rgba(249,115,22,0.15)]"
        : "border-zinc-800 bg-impact-surface hover:border-impact-primary/50"
    }`}
  >
    <div className={`p-3 rounded-lg ${selected ? "bg-impact-primary text-black" : "bg-impact-dark text-zinc-400"}`}>
      <Icon size={24} />
    </div>
    <div className="text-left">
      <h3 className={`font-bold ${selected ? "text-impact-primary" : "text-white"}`}>{title}</h3>
      <p className="text-sm text-zinc-400">{desc}</p>
    </div>
  </div>
)

export default function Onboarding() {
  const [step, setStep] = useState(1)
  const [direction, setDirection] = useState(1)
  const navigate = useNavigate()
  const { currentUser } = useAuth() 
  
  const [formData, setFormData] = useState({
    age: "", weight: "", height: "", fitnessGoal: "", programLevel: ""
  })

  const nextStep = () => { setDirection(1); setStep((s) => s + 1) }
  const prevStep = () => { setDirection(-1); setStep((s) => s - 1) }

  const finishOnboarding = async () => {
    try {
      const profileData = {
        email: currentUser.email,
        displayName: currentUser.email.split('@')[0],
        age: Number(formData.age),
        weight: Number(formData.weight),
        height: Number(formData.height),
        fitnessGoal: formData.fitnessGoal,
        programLevel: formData.programLevel,
        isPremium: currentUser.isPremium,
        createdAt: new Date().toISOString(),
        streak: 0
      }

      await createUserProfile(currentUser.uid, profileData)
      
      toast.success("Profilin Başarıyla Hazırlandı!", { description: "Yapay zeka koçun kişisel programını oluşturuyor..." })
      setTimeout(() => navigate('/dashboard'), 1500) 
    } catch (err) {
      toast.error("Profil kaydedilirken hata oluştu.")
    }
  }

  const selectCard = (field, value) => setFormData({ ...formData, [field]: value })

  return (
    <div className="min-h-screen bg-impact-dark flex flex-col items-center justify-center p-4 selection:bg-impact-primary/30 overflow-hidden">
      <div className="w-full max-w-md">
        
        {/* --- YENİLENEN PROGRESS BAR BÖLÜMÜ --- */}
        <div className="mb-8 space-y-3">
          <div className="flex justify-between text-sm font-bold text-zinc-400">
            <span className="text-white">Adım {step} <span className="text-zinc-500">/ 3</span></span>
            <span className="text-impact-primary">% {Math.round((step / 3) * 100)}</span>
          </div>
          <div className="h-2.5 w-full bg-impact-surface rounded-full overflow-hidden border border-zinc-800/80 shadow-inner relative">
            <motion.div 
              className="absolute top-0 left-0 h-full bg-impact-primary shadow-[0_0_10px_rgba(249,115,22,0.6)]"
              initial={{ width: 0 }}
              animate={{ width: `${(step / 3) * 100}%` }}
              transition={{ type: "spring", stiffness: 60, damping: 12 }}
            >
              <div className="absolute top-0 right-0 bottom-0 w-6 bg-gradient-to-l from-white/30 to-transparent" />
            </motion.div>
          </div>
        </div>
        {/* -------------------------------------- */}

        <div className="relative min-h-[440px]">
          <AnimatePresence mode="wait" custom={direction}>
            
            {step === 1 && (
              <motion.div key="step1" custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="absolute w-full space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-extrabold text-white mb-2">Fiziksel Metriklerin</h2>
                  <p className="text-zinc-400 text-sm">Yapay zeka algoritmasının seni doğru tanıyabilmesi için temel verilerin.</p>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-zinc-400 ml-1">Yaş</label>
                    <Input type="number" placeholder="Örn: 23" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} className="mt-1 bg-impact-surface border-zinc-800 text-white text-lg h-12 focus-visible:ring-impact-primary" required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-zinc-400 ml-1">Kilo (kg)</label>
                      <Input type="number" placeholder="Örn: 78" value={formData.weight} onChange={e => setFormData({...formData, weight: e.target.value})} className="mt-1 bg-impact-surface border-zinc-800 text-white text-lg h-12 focus-visible:ring-impact-primary" required />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-zinc-400 ml-1">Boy (cm)</label>
                      <Input type="number" placeholder="Örn: 182" value={formData.height} onChange={e => setFormData({...formData, height: e.target.value})} className="mt-1 bg-impact-surface border-zinc-800 text-white text-lg h-12 focus-visible:ring-impact-primary" required />
                    </div>
                  </div>
                </div>
                <Button onClick={nextStep} disabled={!formData.age || !formData.weight || !formData.height} className="w-full bg-impact-primary hover:opacity-90 text-black font-bold text-lg h-12 mt-4 transition-all">
                  İleri <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="absolute w-full space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-extrabold text-white mb-2">Ana Hedefin Ne?</h2>
                  <p className="text-zinc-400 text-sm">Diyet ve antrenman modüllerin bu seçime göre kişiselleştirilecek.</p>
                </div>
                <div className="space-y-3">
                  <SelectionCard icon={Flame} title="Kilo Verme" desc="Kalori açığı ve yağ yakımı odaklı program." selected={formData.fitnessGoal === "weight_loss"} onSelect={() => selectCard("fitnessGoal", "weight_loss")} />
                  <SelectionCard icon={Dumbbell} title="Kas Kazanma" desc="Progresif aşırı yük ve yüksek protein odaklı." selected={formData.fitnessGoal === "muscle_gain"} onSelect={() => selectCard("fitnessGoal", "muscle_gain")} />
                  <SelectionCard icon={Activity} title="Kondisyon / Fit Kalma" desc="Dayanıklılık ve esneklik odaklı dengeli yaşam." selected={formData.fitnessGoal === "endurance"} onSelect={() => selectCard("fitnessGoal", "endurance")} />
                </div>
                <div className="flex gap-3 mt-8">
                  <Button onClick={prevStep} variant="outline" className="w-1/3 bg-transparent border-zinc-800 text-white hover:bg-impact-surface h-12">
                    <ArrowLeft className="mr-2 h-5 w-5" /> Geri
                  </Button>
                  <Button onClick={nextStep} disabled={!formData.fitnessGoal} className="w-2/3 bg-impact-primary hover:opacity-90 text-black font-bold text-lg h-12 transition-all">
                    İleri <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="absolute w-full space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-extrabold text-white mb-2">Spor Geçmişin Nedir?</h2>
                  <p className="text-zinc-400 text-sm">Egzersizlerin zorluk aşamaları spor geçmişine göre hizalanacak.</p>
                </div>
                <div className="space-y-3">
                  <SelectionCard icon={Target} title="Başlangıç Seviyesi" desc="Daha önce düzenli olarak spor yapmadım." selected={formData.programLevel === "beginner"} onSelect={() => selectCard("programLevel", "beginner")} />
                  <SelectionCard icon={TrendingUp} title="Orta Seviye" desc="Temel hareketleri biliyorum, ara sıra antrenman yaparım." selected={formData.programLevel === "intermediate"} onSelect={() => selectCard("programLevel", "intermediate")} />
                  <SelectionCard icon={Zap} title="İleri Seviye" desc="Uzun süredir düzenli ve disiplinli çalışıyorum." selected={formData.programLevel === "advanced"} onSelect={() => selectCard("programLevel", "advanced")} />
                </div>
                <div className="flex gap-3 mt-8">
                  <Button onClick={prevStep} variant="outline" className="w-1/3 bg-transparent border-zinc-800 text-white hover:bg-impact-surface h-12">
                    <ArrowLeft className="mr-2 h-5 w-5" /> Geri
                  </Button>
                  <Button onClick={finishOnboarding} disabled={!formData.programLevel} className="w-2/3 bg-impact-primary hover:opacity-90 text-black font-bold text-lg h-12 transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                    Profili Tamamla
                  </Button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}