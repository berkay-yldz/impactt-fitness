# impactt-fitness

Bu repo, Impact Fitness projesinin tek gerçeği (Single Source of Truth) ve merkezidir. Proje **Vercel Serverless (Monorepo)** mimarisiyle çalışmaktadır.

## 🏗️ KLASÖR MİMARİSİ (Strict Structure)
Frontend (React) ve Backend (Serverless API) aynı çatı altındadır. Klasör sınırlarını ihlal etmek yasaktır.

📂 impact-fitness/
├── 📂 api/                # [ERAN] Vercel Serverless Functions (Backend)
│   ├── chat-rag.js        # Gemini AI servisi
│   ├── cron-daily-email.js
│   └── generate-diet.js
├── 📂 src/                # [EMRULLAH] Vite + React (Frontend)
│   ├── 📂 components/     # Tekrar kullanılabilir UI parçaları
│   ├── 📂 pages/          # Sayfa görünümleri (Auth, Dashboard, vb.)
│   ├── 📂 services/       # Firebase ve API fetch işlemleri
│   ├── 📂 utils/          # Mediapipe ve Matematik fonksiyonları
│   └── 📂 data/           # Statik JSON dosyaları
├── 📄 vercel.json         # Vercel yapılandırması ve Cron Job kuralları
├── 📄 .gitignore          # Asla pushlanmayacaklar (.env)
└── 📄 README.md           # Proje Anayasası


## 📜 PROJE ANAYASASI (Kırmızı Çizgiler)

1. **Tech Stack Donduruldu:** Firebase NoSQL, Vercel Serverless, React (Vite), TailwindCSS, MediaPipe. Başka bir teknoloji önermek (Supabase, Next.js vb.) yasaktır.
2. **Branch Kuralı:** `main` branch'ine doğrudan kod pushlamak KESİNLİKLE YASAKTIR. Tüm geliştirmeler `dev` branch'inde yapılır.
3. **.env Güvenliği:** Firebase Private Key veya Gemini API Key gibi şifreler asla GitHub'a pushlanamaz. Pushlayan kahve ısmarlar.
4. **Bağımsız İlerleme:** Frontend backend'i, backend frontend'i beklemez. API hazır değilse frontend "dummy" data (console.log) ile sayfayı bitirip geçer. 

*Detaylı 4 Haftalık Görev Dağılımı (Master Execution Protocol) WhatsApp grubunda sabitlenmiştir.*


