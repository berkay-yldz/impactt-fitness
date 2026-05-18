import { useState } from "react"

export default function App() {
  return (
    <div className="min-h-screen bg-impact-dark text-white flex flex-col items-center justify-center p-4">
      <div className="max-w-md text-center space-y-6">
        {/* Public klasöründeki görsellere doğrudan /assets/ yoluyla erişilir */}
        <img 
          src="/assets/hero.png" 
          alt="Impact AI" 
          className="w-40 h-40 mx-auto object-contain mb-2"
          onError={(e) => { e.target.style.display = 'none' }} 
        />
        
        <h1 className="text-4xl font-extrabold text-impact-primary tracking-tight">
          IMPACT AI
        </h1>
        
        <p className="text-gray-400 text-lg">
          Şantiyenin temeli sapasağlam atıldı. Gün 0 kurulumları bitti, Gün 1 kodlamasına hazırsın Emrullah!
        </p>
        
        <div className="bg-impact-surface p-4 rounded-xl border border-border text-sm text-left space-y-2 font-mono">
          <div className="flex items-center gap-2">
            <span className="text-green-500">✔</span> <span>Shadcn UI Düzeni Aktif</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-500">✔</span> <span>Tailwind CSS v3 Yapılandırması Hazır</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-500">✔</span> <span>Klasör Yapısı Anayasaya Uygun</span>
          </div>
        </div>
      </div>
    </div>
  )
}