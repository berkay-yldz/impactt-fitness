import { useState } from "react"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dumbbell, Mail, Lock, User } from "lucide-react"
import { toast } from "sonner"

export default function Auth() {
  const [isLoading, setIsLoading] = useState(false)
  
  // YENİ: Form verilerini hafızada tutacak state'ler eklendi
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [displayName, setDisplayName] = useState("")

  // GİRİŞ YAP FONKSİYONU (Gün 4'te authService buraya eklenecek)
  const handleLogin = (e) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      toast.success("Giriş Başarılı!", { description: `Hoş geldin, ${email}` })
      // Gün 4 görevi: navigate('/dashboard') buraya gelecek
    }, 1500)
  }

  // KAYIT OL FONKSİYONU (Gün 4'te authService buraya eklenecek)
  const handleRegister = (e) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      toast.success("Kayıt Başarılı!", { description: `${displayName}, profilin oluşturuldu.` })
      // Gün 4 görevi: navigate('/onboarding') buraya gelecek
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 selection:bg-orange-500/30">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }} className="w-full max-w-md space-y-8">
        
        {/* Logo ve Başlık */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 mb-4 shadow-[0_0_15px_rgba(249,115,22,0.2)]">
            <Dumbbell className="w-8 h-8 text-orange-500" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            IMPACT <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-400">AI</span>
          </h1>
          <p className="text-sm text-zinc-400">Sınırlarını zorlamaya hazır mısın?</p>
        </div>

        <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 shadow-xl w-full">
          <Tabs defaultValue="login" className="flex flex-col w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-black p-1 rounded-lg">
              <TabsTrigger value="login" className="data-[state=active]:bg-zinc-800 data-[state=active]:text-orange-500">Giriş Yap</TabsTrigger>
              <TabsTrigger value="register" className="data-[state=active]:bg-zinc-800 data-[state=active]:text-orange-500">Kayıt Ol</TabsTrigger>
            </TabsList>

            {/* GİRİŞ YAP FORMU */}
            <TabsContent value="login" className="w-full focus-visible:outline-none">
              <form onSubmit={handleLogin} className="flex flex-col gap-4 w-full">
                <div className="relative w-full">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
                  <Input type="email" placeholder="E-posta adresi" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-10 bg-black border-zinc-800 text-white h-12 focus-visible:ring-orange-500" required />
                </div>
                <div className="relative w-full">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
                  <Input type="password" placeholder="Şifre" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-10 bg-black border-zinc-800 text-white h-12 focus-visible:ring-orange-500" required />
                </div>
                <Button type="submit" className="w-full h-12 mt-2 bg-orange-500 hover:bg-orange-600 text-black font-bold text-lg transition-all" disabled={isLoading}>
                  {isLoading ? "Giriş Yapılıyor..." : "Giriş Yap"}
                </Button>
              </form>
            </TabsContent>

            {/* KAYIT OL FORMU */}
            <TabsContent value="register" className="w-full focus-visible:outline-none">
              <form onSubmit={handleRegister} className="flex flex-col gap-4 w-full">
                <div className="relative w-full">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
                  <Input type="text" placeholder="Ad Soyad" value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="w-full pl-10 bg-black border-zinc-800 text-white h-12 focus-visible:ring-orange-500" required />
                </div>
                <div className="relative w-full">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
                  <Input type="email" placeholder="E-posta adresi" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-10 bg-black border-zinc-800 text-white h-12 focus-visible:ring-orange-500" required />
                </div>
                <div className="relative w-full">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
                  <Input type="password" placeholder="Şifre" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-10 bg-black border-zinc-800 text-white h-12 focus-visible:ring-orange-500" required />
                </div>
                <Button type="submit" className="w-full h-12 mt-2 bg-orange-500 hover:bg-orange-600 text-black font-bold text-lg transition-all" disabled={isLoading}>
                  {isLoading ? "Hesap Oluşturuluyor..." : "Hesap Oluştur"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>

      </motion.div>
    </div>
  )
}