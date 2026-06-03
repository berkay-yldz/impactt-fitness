import { useState } from "react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, Lock, User } from "lucide-react"
import { toast } from "sonner" 
import { loginUser, registerUser } from "@/services/authService"

export default function Auth() {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [displayName, setDisplayName] = useState("")
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const res = await loginUser(email, password)
      if (res.success) {
        toast.success("Giriş Başarılı!", { description: "Uygulama paneline yönlendiriliyorsunuz." })
        navigate('/dashboard')
      }
    } catch (err) {
      toast.error("Giriş başarısız oldu. Şifreni kontrol et.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const res = await registerUser(email, password, displayName)
      if (res.success) {
        toast.success("Kayıt Başarılı!", { description: "Lütfen profil anketini tamamla." })
        navigate('/onboarding')
      }
    } catch (err) {
      toast.error("Kayıt başarısız. Bu e-posta zaten kullanımda olabilir.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-impact-dark flex selection:bg-impact-primary/30">
      
      {/* SOL PANEL - FORM BÖLÜMÜ */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }} className="w-full max-w-md space-y-8">
          <div className="text-center space-y-2 mb-8">
            <h1 className="text-4xl font-extrabold tracking-tight text-white">
              IMPACT <span className="text-impact-primary">AI</span>
            </h1>
            <p className="text-sm text-zinc-400">Sınırlarını zorlamaya hazır mısın?</p>
          </div>

          <div className="bg-impact-surface p-8 rounded-2xl border border-zinc-800/50 shadow-2xl backdrop-blur-sm w-full">
            <Tabs defaultValue="login" className="flex flex-col w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8 bg-impact-dark p-1 rounded-lg border border-zinc-800/50">
                <TabsTrigger value="login" className="data-[state=active]:bg-zinc-800 data-[state=active]:text-impact-primary transition-all">Giriş Yap</TabsTrigger>
                <TabsTrigger value="register" className="data-[state=active]:bg-zinc-800 data-[state=active]:text-impact-primary transition-all">Kayıt Ol</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="w-full focus-visible:outline-none">
                <form onSubmit={handleLogin} className="flex flex-col gap-5 w-full">
                  <div className="relative w-full group">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500 group-focus-within:text-impact-primary transition-colors" />
                    <Input type="email" placeholder="E-posta adresi" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-11 bg-impact-dark/50 border-zinc-800 text-white h-12 focus-visible:ring-1 focus-visible:ring-impact-primary focus-visible:border-impact-primary transition-all" required />
                  </div>
                  <div className="relative w-full group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500 group-focus-within:text-impact-primary transition-colors" />
                    <Input type="password" placeholder="Şifre" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-11 bg-impact-dark/50 border-zinc-800 text-white h-12 focus-visible:ring-1 focus-visible:ring-impact-primary focus-visible:border-impact-primary transition-all" required />
                  </div>
                  <Button type="submit" className="w-full h-12 mt-4 bg-impact-primary hover:bg-impact-primary/90 text-black font-bold text-lg transition-all shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_30px_rgba(249,115,22,0.5)]" disabled={isLoading}>
                    {isLoading ? "Giriş Yapılıyor..." : "Giriş Yap"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register" className="w-full focus-visible:outline-none">
                <form onSubmit={handleRegister} className="flex flex-col gap-5 w-full">
                  <div className="relative w-full group">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500 group-focus-within:text-impact-primary transition-colors" />
                    <Input type="text" placeholder="Ad Soyad" value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="w-full pl-11 bg-impact-dark/50 border-zinc-800 text-white h-12 focus-visible:ring-1 focus-visible:ring-impact-primary focus-visible:border-impact-primary transition-all" required />
                  </div>
                  <div className="relative w-full group">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500 group-focus-within:text-impact-primary transition-colors" />
                    <Input type="email" placeholder="E-posta adresi" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-11 bg-impact-dark/50 border-zinc-800 text-white h-12 focus-visible:ring-1 focus-visible:ring-impact-primary focus-visible:border-impact-primary transition-all" required />
                  </div>
                  <div className="relative w-full group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500 group-focus-within:text-impact-primary transition-colors" />
                    <Input type="password" placeholder="Şifre" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-11 bg-impact-dark/50 border-zinc-800 text-white h-12 focus-visible:ring-1 focus-visible:ring-impact-primary focus-visible:border-impact-primary transition-all" required />
                  </div>
                  <Button type="submit" className="w-full h-12 mt-4 bg-impact-primary hover:bg-impact-primary/90 text-black font-bold text-lg transition-all shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_30px_rgba(249,115,22,0.5)]" disabled={isLoading}>
                    {isLoading ? "Hesap Oluşturuluyor..." : "Hesap Oluştur"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </div>
        </motion.div>
      </div>

      {/* SAĞ PANEL - KARAKTER ASSET'İ (Sadece Masaüstünde Görünür) */}
      <div className="hidden lg:flex w-1/2 bg-zinc-950 relative overflow-hidden items-center justify-center border-l border-zinc-900">
        <div className="absolute w-[500px] h-[500px] bg-impact-primary/10 rounded-full blur-[120px]" />
        
        <motion.img 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ duration: 0.8, delay: 0.2 }}
          src="/assets/coach-celebrate.gif" 
          alt="Impact AI Coach" 
          className="relative z-10 max-w-md w-full object-contain drop-shadow-[0_0_30px_rgba(249,115,22,0.15)]"
        />
      </div>

    </div>
  )
}