# 🏋️ IMPACT FITNESS — MASTER EXECUTION PROTOCOL
### 4 Haftalık Mikro Sprint Planı | Berkay · Emrullah · Eran

> **Kurallar:** Her görev tek bir dosyaya bağlıdır. Belirsiz görev yoktur. Tüm sınır kararları plan içine gömülmüştür.

---

## HAFTA 0 — ALTYAPI & ORTAK KURULUM (Gün 0)
> Herkes aynı anda yapar — sadece bir kez, hep birlikte.

- [ ] **[ORTAK]** GitHub repo oluştur, `main` + `dev` branch aç; branch protection rule ekle (dev → main için PR zorunlu).
- [ ] **[ORTAK]** `impact-fitness/` kök dizininde `package.json` oluştur: `npm create vite@latest . -- --template react`
- [ ] **[ORTAK]** Tailwind CSS, shadcn/ui, Framer Motion kur: `npm install tailwindcss @shadcn/ui framer-motion`
- [ ] **[ORTAK]** `vite.config.js` dosyasını düzenle; `@` alias ekle (`src/` → `@/`)
- [ ] **[ORTAK]** `vercel.json` dosyasını oluştur: `api/` klasörünü serverless function dizini olarak tanımla, cron job için `"/api/cron-daily-email"` → `"0 0 * * *"` schedule ekle
- [ ] **[ORTAK]** `.env` dosyasını oluştur (`.gitignore`'a ekle). Aşağıdaki değişkenlerin iskeletini yaz:
  ```
  VITE_FIREBASE_API_KEY=
  VITE_FIREBASE_AUTH_DOMAIN=
  VITE_FIREBASE_PROJECT_ID=
  GEMINI_API_KEY=
  RESEND_API_KEY=
  ```
- [ ] **[ORTAK]** Firebase Console'da proje oluştur → Authentication (Email/Password) ve Firestore Database aç → **Firestore Security Rules'u anında şu kuralla yaz ve deploy et:**
  ```
  rules_version = '2';
  service cloud.firestore {
    match /databases/{database}/documents {
      match /{document=**} {
        allow read, write: if request.auth != null;
      }
    }
  }
  ```
  *(Bu kural 30 günlük kilitlenme bombasını devre dışı bırakır — ilk gün şart.)*

---

## 📅 HAFTA 1 — KİMLİK, ONBOARDING & VERİ İSKELETİ

### 🎯 Hafta 1 — DoD (Definition of Done)
- Kullanıcı kayıt olup giriş yapabilmeli, Onboarding formunu tamamlayabilmeli.
- Firestore'da kullanıcı dökümanı otomatik oluşturulabilmeli.
- `programDecks.json` ve `kaggleFood.json` eksiksiz ve geçerli JSON formatında repoda bulunmalı.
- Dashboard sayfası route olarak erişilebilir olmalı (içerik boş olabilir).
- Tüm sayfalar mobil-responsive olmalı.

---

### 👨‍💻 BERKAY — Hafta 1

**Gün 1 — Veri Dosyaları**
- [ ] `src/data/programDecks.json` dosyasını oluştur. Yapı:
  ```json
  {
    "beginner": [ { "week": 1, "day": 1, "exercise": "...", "sets": 3, "reps": 10, "level": "beginner" } ],
    "intermediate": [ ... ],
    "advanced": [ ... ]
  }
  ```
  Minimum: her seviyede 4 haftalık, haftada 5 gün antrenman verisi. Her egzersizde `id`, `name`, `sets`, `reps`, `restSeconds`, `targetMuscle`, `videoRef` alanları zorunlu.
- [ ] `src/data/kaggleFood.json` dosyasını oluştur. Yapı: 150 besin, her birinde `id`, `name`, `calories`, `protein`, `carbs`, `fat`, `category` (`["protein","carb","fat","veggie","fruit"]` enum'undan biri) alanları zorunlu.

**Gün 2 — Adaptif Algoritma Çekirdeği**
- [ ] `src/utils/adaptiveLogic.js` dosyasını oluştur. İçeriği:
  - `checkFailureThreshold(userId, exerciseId, firestoreRef)` → kullanıcının bir egzersizde art arda 3 başarısızlık yaşayıp yaşamadığını kontrol et; `true` dönerse seviyeyi düşür.
  - `downgradeProgramLevel(userId, currentLevel, firestoreRef)` → Firestore'daki `users/{userId}` dökümanındaki `programLevel` alanını bir seviye aşağı güncelle (`advanced→intermediate→beginner`).
  - `recordExerciseResult(userId, exerciseId, success, firestoreRef)` → Firestore'daki `users/{userId}/exerciseLog/{exerciseId}` alt koleksiyonuna sonucu yaz.

**Gün 3-4 — MediaPipe Çekirdeği**
- [ ] `src/utils/mediapipeCore.js` dosyasını oluştur:
  - `initPose()` → `@mediapipe/pose` CDN veya npm paketinden `Pose` nesnesini başlat, `modelComplexity: 1`, `smoothLandmarks: true` ayarlarını uygula.
  - `onPoseResults(results, canvasRef)` → landmark dizisini al, canvas'a çiz.
  - `startCamera(videoRef, pose)` → `getUserMedia` ile kamerayı aç, her frame için `pose.send()` çağır.
  - `stopCamera(streamRef)` → stream track'lerini durdur.
- [ ] `src/utils/angleMath.js` dosyasını oluştur:
  - `calculateAngle(a, b, c)` → üç 3D landmark noktası arasındaki açıyı derece cinsinden döndür (dirsek/diz açısı için kullanılacak).
  - `classifyPosture(landmarks)` → omuz/kalça/diz hizalamasına bakarak `"good"` veya `"bad"` döndür.

**Gün 5 — Karakter Asset Üretimi & Birim Test**
- [ ] **[KRİTİK — Emrullah'ın Hafta 2 tasarımı başlamadan önce tamamlanmalı]** DALL-E / Midjourney'de fitness karakter görseli üret: prompt → `"3D animated fitness coach character, muscular, energetic, transparent background, WebP format, cel-shaded style"`. Üretilen görselin arka planını temizle (remove.bg veya Photoshop).
- [ ] Viggle AI veya Luma AI ile hareketsiz görseli hareketlendir: motivasyon hareketi (yumruk havaya) GIF formatı.
- [ ] Assetleri `public/assets/` klasörüne ekle: `coach-idle.webp`, `coach-celebrate.gif`, `coach-thumbsup.webp`. Bu dosyalar **Hafta 2 başında Emrullah'a teslim edilecek** — Emrullah bu assetleri görmeden UI kodlamaya başlamayacak.
- [ ] `adaptiveLogic.js` ve `angleMath.js` için manuel test dosyaları yaz (`src/utils/__tests__/`); `calculateAngle` için 90° ve 180° test case'leri ekle.

---

### 🛠️ ERAN — Hafta 1

**Gün 1 — Firebase Servisleri**
- [ ] `src/services/firebase.js` dosyasını oluştur:
  - `initializeApp(firebaseConfig)` çağrısını yap.
  - `getAuth()`, `getFirestore()` instance'larını export et.
  - `firebaseConfig` nesnesini `.env` değişkenlerinden (`import.meta.env.VITE_FIREBASE_*`) oku.
- [ ] `src/services/authService.js` dosyasını oluştur:
  - `registerUser(email, password, displayName)` → Firebase Auth ile kayıt, hata mesajlarını Türkçe'ye çevir.
  - `loginUser(email, password)` → Firebase Auth ile giriş.
  - `logoutUser()` → `signOut(auth)`.
  - `onAuthChange(callback)` → `onAuthStateChanged` wrapper.

**Gün 2 — Firestore Veri Servisi**
- [ ] `src/services/dbService.js` dosyasını oluştur:
  - `createUserProfile(uid, data)` → `users/{uid}` dökümanını oluştur; `data` nesnesi: `{ email, displayName, age, weight, height, fitnessGoal, programLevel, isPremium: false, createdAt, streak: 0 }`.
  - `getUserProfile(uid)` → `users/{uid}` dökümanını çek.
  - `updateUserProfile(uid, fields)` → `updateDoc` ile kısmi güncelleme.
  - `getChatHistory(uid)` → `chatHistory/{uid}/messages` koleksiyonundan `orderBy("timestamp", "desc")` ile son 5 mesajı çek.
  - `saveChatMessage(uid, role, content)` → `chatHistory/{uid}/messages` koleksiyonuna `addDoc` ile ekle.

**Gün 3 — Auth Context**
- [ ] `src/context/AuthContext.jsx` dosyasını oluştur:
  - `AuthProvider` komponenti: `onAuthChange` ile kullanıcıyı dinle, `currentUser` state'ini yönet.
  - `useAuth()` custom hook'u export et.
  - Loading state ekle: auth durumu belirlenene kadar spinner göster.

**Gün 4 — Upgrade API Endpoint**
- [ ] `api/upgrade-premium.js` dosyasını oluştur:
  - POST isteği kabul et: `{ uid }` body'den al.
  - Firebase Admin SDK ile Firestore'daki `users/{uid}` dökümanında `isPremium: true` yaz.
  - Sahte ödeme akışı: herhangi bir `uid` gönderildiğinde direkt olarak `{ success: true }` dön. (Gerçek ödeme entegrasyonu kapsam dışı.)
  - Güvenlik: `ADMIN_SECRET` header kontrolü ekle (env'dan oku).

**Gün 5 — Review & Manuel Test**
- [ ] Firebase Auth akışını Postman veya tarayıcı konsolundan test et: kayıt → Firestore dökümanı otomatik oluştu mu? → giriş → `currentUser` context'te mi?
- [ ] `upgrade-premium.js`'i `vercel dev` ile lokal olarak çalıştır ve test et.

---

### 🎨 EMRULLAH — Hafta 1

**Gün 1 — Proje İskeleti & Design System**
- [ ] `tailwind.config.js` dosyasını düzenle: `impact` renk paleti tanımla (örn. `impact-primary: #FF6B35`, `impact-dark: #0D0D0D`, `impact-surface: #1A1A2E`).
- [ ] `src/index.css` dosyasına global CSS değişkenlerini ve font import'unu ekle (Google Fonts: `Inter` veya `DM Sans`).
- [ ] shadcn/ui init komutunu çalıştır: `npx shadcn-ui@latest init`; Button, Input, Card, Badge, Dialog, Tabs komponentlerini yükle.

**Gün 2 — Auth Sayfası**
- [ ] `src/pages/Auth.jsx` dosyasını oluştur:
  - Kayıt/Giriş arasında geçiş yapan tab yapısı (shadcn `Tabs` kullan).
  - Email + şifre input'ları (shadcn `Input` kullan).
  - Submit butonuna `authService`'i bağla (`useAuth` hook üzerinden).
  - Hata mesajlarını `toast` ile göster.
  - Başarılı girişte `/onboarding` (yeni kullanıcı) veya `/dashboard` (mevcut kullanıcı) yönlendir.
  - Framer Motion ile sayfa giriş animasyonu: `initial={{ opacity: 0, y: 20 }}` → `animate={{ opacity: 1, y: 0 }}`.

**Gün 3 — Onboarding Sayfası**
- [ ] `src/pages/Onboarding.jsx` dosyasını oluştur:
  - Çok adımlı form (3 step): Step 1 → Kişisel bilgiler (yaş, kilo, boy). Step 2 → Fitness hedefi (kilo verme/kas kazanma/kondisyon). Step 3 → Mevcut seviye (başlangıç/orta/ileri).
  - Her step için ileri/geri butonları.
  - Son adımda `dbService.createUserProfile(uid, formData)` çağır.
  - Tamamlanınca `/dashboard`'a yönlendir.
  - Step geçişlerinde Framer Motion `AnimatePresence` kullan.

**Gün 4 — Router & Layout**
- [ ] `src/main.jsx` dosyasını düzenle: `AuthProvider` ile tüm uygulamayı sar.
- [ ] `src/App.jsx` dosyasını oluştur/düzenle: `react-router-dom` ile route'ları tanımla:
  - `/` → `Auth.jsx`
  - `/onboarding` → `Onboarding.jsx` (korumalı: giriş yoksa `/`'e yönlendir)
  - `/dashboard` → `Dashboard.jsx` (korumalı)
  - `/posture` → `Posture.jsx` (**premium korumalı** — sadece `isPremium: true` kullanıcılar)
  - `/muscle` → `Muscle.jsx` (korumalı)
  - `/nutrition` → `Nutrition.jsx` (korumalı)
  - `/discipline` → `Discipline.jsx` (**premium korumalı** — sadece `isPremium: true` kullanıcılar)
- [ ] `PrivateRoute` wrapper komponenti yaz (`src/components/ui/PrivateRoute.jsx`): `useAuth` ile sadece auth kontrolü yapar; giriş yoksa `/`'e yönlendir.
- [ ] **[GÜVENLİK]** `PremiumRoute` wrapper komponenti yaz (`src/components/ui/PremiumRoute.jsx`):
  - `useAuth` ile `currentUser`'ı al → `dbService.getUserProfile(uid)` ile Firestore'dan `isPremium` alanını oku.
  - `isPremium === true` ise çocuk komponenti render et.
  - `isPremium === false` ise kullanıcıyı `/dashboard`'a yönlendir **ve** `PremiumModal`'ı otomatik olarak aç (URL state ile sinyal gönder: `navigate("/dashboard", { state: { openPremium: true } })`).
  - `PremiumRoute`, `PrivateRoute`'un içine sarılı çalışır: önce giriş kontrolü, sonra premium kontrolü.
  - **Test:** Ücretsiz kullanıcı olarak tarayıcıda elle `/discipline` yaz → `/dashboard`'a dönmeli ve ödeme modalı açılmalı.

**Gün 5 — Dashboard İskelet & Sidebar**
- [ ] `src/pages/Dashboard.jsx` dosyasını oluştur (içerik Hafta 2'de gelecek, şimdi sadece iskelet):
  - Sidebar navigasyonu: Dashboard, Posture, Muscle, Nutrition, Discipline linkleri.
  - Üst header: kullanıcı adı + avatar + çıkış butonu.
  - Ana alan: "Hafta 2'de içerik gelecek" placeholder kartı.
- [ ] Sidebar için `src/components/ui/Sidebar.jsx` komponenti yaz; mobilde hamburger menüye dönüşsün.

---

## 📅 HAFTA 2 — YAPAY ZEKA, CHATBOT & BESLENMESİ

### 🎯 Hafta 2 — DoD
- Chatbot kullanıcıyla konuşabilmeli, son 5 mesaj bağlamı Firestore'dan gelmiş olmalı.
- Diyet planı API'si çalışmalı, switch parametresine göre besin listesi değişmeli.
- Kamera feed açılıp MediaPipe pose landmark'ları görünür olmalı.
- Dashboard'da kullanıcıya özgü veriler (streak, program seviyesi) Firestore'dan yüklenmeli.

---

### 👨‍💻 BERKAY — Hafta 2

**Gün 1 — Chatbot Sistem Prompt Mimarisi**
- [ ] `api/chat-rag.js` içinde kullanılmak üzere `buildSystemPrompt(userProfile)` yardımcı fonksiyonunu yaz. Bu fonksiyon, Firestore'dan gelen `userProfile` nesnesini alarak Gemini'ye gönderilecek kişiselleştirilmiş sistem promptunu oluşturur. Prompt şablonu:
  ```
  "Sen Impact Fitness uygulamasının AI koçusun. Kullanıcı hakkında şu bilgilere sahipsin:
  - Ad: {displayName}
  - Yaş: {age}, Kilo: {weight}kg, Boy: {height}cm
  - Vücut tipi / hedef: {fitnessGoal}
  - Mevcut program seviyesi: {programLevel}
  - Günlük streak: {streak} gün
  Bu bilgileri kullanarak kişiselleştirilmiş, motive edici öneriler sun.
  Yalnızca fitness, beslenme ve antrenman konularında yardım et. Türkçe cevap ver."
  ```
  `fitnessGoal` değerlerine göre prompt'a ek bağlam ekle: `weight_loss` → kalori açığı vurgusu; `muscle_gain` → protein ve progresif aşırı yük vurgusu; `endurance` → kardio ve toparlanma vurgusu.

**Gün 2-3 — Gelişmiş Duruş Analizi (Saf Matematik — UI Yok)**
- [ ] `src/utils/angleMath.js` dosyasını genişlet; bu görevde hiçbir `.jsx` dosyasına dokunulmayacak:
  - `analyzeSquatForm(landmarks)` → diz açısı < 90° ise `{ status: "good", feedback: "Mükemmel derinlik!" }`, > 90° ise `{ status: "bad", feedback: "Daha fazla in, dizi 90°'nin altına getir." }` döndür.
  - `analyzePushupForm(landmarks)` → dirsek açısına göre form değerlendir: < 90° → "İyi form", > 90° → "Daha fazla in".
  - `analyzePlankForm(landmarks)` → omuz, kalça ve ayak bileği landmark'larının Y koordinat farkına bak; hizalama sapması > 0.05 ise `{ status: "bad", feedback: "Kalçanı düşür, vücudunu düzelt." }` döndür.
  - Her fonksiyon `{ status: "good"|"bad", feedback: "string" }` dönsün. **Hiçbir React import'u veya JSX kodu bu dosyaya girmeyecek.**

**Gün 4-5 — Rep Sayacı Algoritması (`angleMath.js`'e Merge — UI Yok)**
- [ ] `src/utils/angleMath.js` dosyasını genişlet — ayrı bir dosya oluşturulmayacak, rep sayacı mantığı doğrudan buraya eklenir:
  - `createRepCounter(thresholdUp, thresholdDown)` → factory fonksiyonu; kendi `repCount` ve `phase` state'ini kapatan bir nesne döndürür: `{ processAngle(currentAngle), reset(), getCount() }`.
  - `processAngle(currentAngle)` → açı `thresholdDown`'ın altına inince `phase = "down"`, `thresholdUp`'ın üstüne çıkınca `phase = "up"` ve `repCount++` tetikle; `{ repCount, phase: "up"|"down" }` döndür.
  - `reset()` → `repCount = 0`, `phase = null` sıfırla.
- [ ] `src/utils/__tests__/` altında `angleMath.test.js` dosyasını güncelle: `createRepCounter` için açı 170° → 60° → 170° döngüsünün 1 rep sayıp saymadığını test eden case ekle.
- [ ] **Blok kontrolü:** Bu hafta sonu `angleMath.js` bağımsız olarak `node src/utils/angleMath.js` komutuyla çalıştırılabilir ve tüm fonksiyonlar dummy landmark verisiyle test edilebilir olmalı. Emrullah'ın sayfaları olmadan algoritma kendi başına ayakta durmalı.

---

### 🛠️ ERAN — Hafta 2

**Gün 1-2 — Chatbot RAG API**
- [ ] `api/chat-rag.js` dosyasını oluştur:
  - POST isteği: `{ uid, message }` body'den al.
  - `dbService.getUserProfile(uid)` → kullanıcı profil verisini Firestore'dan çek (`age`, `weight`, `height`, `fitnessGoal`, `programLevel`, `streak`).
  - `dbService.getChatHistory(uid)` → son 5 mesajı Firestore'dan çek.
  - `buildSystemPrompt(userProfile)` → Berkay'ın yazdığı fonksiyonu import et; kullanıcı profilini sistem prompt'una göm.
  - Gemini 1.5 Flash API'sine istek at: `system` rolüne `buildSystemPrompt` çıktısını ver, `messages` dizisine Firestore'dan gelen son 5 mesajı + mevcut kullanıcı mesajını ekle.
  - Yanıtı `dbService.saveChatMessage()` ile Firestore'a kaydet.
  - `{ reply: "..." }` olarak dön.
  - **GÜVENLİK:** `GEMINI_API_KEY` asla response body'ye sızdırılmayacak; sadece sunucu tarafında `process.env.GEMINI_API_KEY` ile kullanılacak.

**Gün 3 — Diyet API**
- [ ] `api/generate-diet.js` dosyasını oluştur:
  - POST isteği: `{ uid, goal, switchSeed }` body'den al. (`switchSeed`: frontend'den gelen rastgelelik parametresi)
  - `kaggleFood.json`'ı import et (150 besin).
  - `goal` parametresine göre besinleri filtrele: `"weight_loss"` → kalorisi 300'ün altındakiler; `"muscle_gain"` → protein >15g olanlar; `"endurance"` → carb >20g olanlar.
  - Filtrelenmiş listeyi `switchSeed` ile Fisher-Yates shuffle algoritmasıyla karıştır.
  - Günlük 5 öğün oluştur: sabah, öğle, ara öğün x2, akşam — her öğün için filtreli listeden farklı bir besin seç.
  - `{ meals: [...] }` olarak dön.

**Gün 4 — Cron Job: Günlük Email**
- [ ] `api/cron-daily-email.js` dosyasını oluştur:
  - `vercel.json`'daki schedule (`"0 0 * * *"`) bu endpointi tetikleyecek.
  - Firestore'dan tüm kullanıcıları çek (maksimum 15 test kullanıcısı — Vercel'in 10 saniyelik sınırını aşmamak için).
  - Her kullanıcı için: streak bilgisini kontrol et → email içeriği oluştur (motivasyon mesajı + günlük egzersiz hatırlatması).
  - Resend API ile email gönder: `resend.emails.send({ from: "...", to: user.email, subject: "...", html: "..." })`.
  - **Sınır yönetimi:** `Promise.all` yerine `for...of` döngüsü kullan; her iterasyonda `await` ile sıralı işle (10s sınırını aşmamak için).

**Gün 5 — Test & Hata Yönetimi**
- [ ] `api/chat-rag.js` için Vercel lokal ortamında (`vercel dev`) test et: Gemini'nin cevap verdiğini ve Firestore'a kaydolduğunu doğrula.
- [ ] `api/generate-diet.js` için Postman ile `goal: "weight_loss"` ve `goal: "muscle_gain"` test et.
- [ ] Tüm API endpointlerine try-catch + `500` status response ekle.

---

### 🎨 EMRULLAH — Hafta 2

**Gün 1-2 — Chatbot Komponenti**
- [ ] `src/components/Chatbot/ChatWindow.jsx` dosyasını oluştur:
  - Mesaj listesi: kullanıcı mesajları sağda (mavi), AI yanıtları solda (gri) — chat balonu tasarımı.
  - Input alanı + gönder butonu.
  - Gönder butona tıklanınca `api/chat-rag.js`'e fetch at: `fetch("/api/chat-rag", { method: "POST", body: JSON.stringify({ uid, message }) })`.
  - AI yazıyor göstergesi: 3 nokta animasyonu (Framer Motion `animate: { y: [0, -5, 0] }`).
  - Yeni mesaj gelince liste otomatik aşağı kaydır (`useEffect` + `scrollIntoView`).
- [ ] `src/components/Chatbot/ChatBubble.jsx` dosyasını oluştur: `role` prop'una göre farklı stil uygula.
- [ ] Chatbot'u `Dashboard.jsx`'in sağ kenar paneline entegre et (açılır-kapanır drawer şeklinde).

**Gün 3 — Nutrition Sayfası**
- [ ] `src/pages/Nutrition.jsx` dosyasını oluştur:
  - Üst kısım: "Diyet Planını Yenile" butonu + goal toggle (3 seçenek: kilo verme / kas / kondisyon).
  - Buton tıklanınca `api/generate-diet.js`'e fetch at, `switchSeed: Date.now()` gönder.
  - Gelen 5 öğünü kart grid'inde göster (shadcn `Card` kullan).
  - Yüklenirken skeleton loader (shadcn `Skeleton` kullan).

**Gün 4 — Dashboard İçerik Kartları**
- [ ] `src/pages/Dashboard.jsx` dosyasını güncelle:
  - `dbService.getUserProfile(uid)` çağrısıyla Firestore'dan kullanıcı verisini yükle.
  - `useLocation()` ile `state.openPremium` gelip gelmediğini kontrol et; `true` ise `PremiumModal`'ı otomatik aç (bu `PremiumRoute`'un yönlendirme sinyalidir).
  - "Günlük Streak" kartı: ateş emojisi + gün sayısı.
  - "Bugünkü Antrenman" kartı: `programDecks.json`'dan kullanıcının seviyesine göre günün egzersizi.
  - "Beslenme Özeti" kartı: son diyet planından makro özeti.
  - "AI Koç" butonu: chatbot drawer'ını açsın.
  - Kartlar `stagger` animasyonuyla sırayla belirsin (Framer Motion `variants` + `staggerChildren`).

**Gün 5 — Responsive & Polish**
- [ ] `Dashboard.jsx` ve `Nutrition.jsx`'in mobil görünümünü Tailwind breakpoint'leri (`sm:`, `md:`, `lg:`) ile düzenle.
- [ ] Dark mode için Tailwind `dark:` prefix'ini tüm kartlara uygula (sistem teması algılama).

---

## 📅 HAFTA 3 — GELİŞMİŞ ÖZELLİKLER, KAS & DİSİPLİN

### 🎯 Hafta 3 — DoD
- Posture sayfası MediaPipe ile gerçek zamanlı duruş analizi yapabilmeli ve anlık geri bildirim vermeli.
- Muscle sayfası günlük antrenman programını adaptif olarak göstermeli; egzersiz tamamlama akışı çalışmalı.
- Discipline sayfası streak takibini ve başarı rozet sistemini çalışır halde sunmalı.
- Premium Modal ve ödeme akışı (sahte) çalışmalı.

---

### 👨‍💻 BERKAY — Hafta 3

**Gün 1-2 — MediaPipe & `Posture.jsx` Entegrasyonu (Emrullah'ın Gün 1-2 çıktısına bağımlı)**
- [ ] **Ön koşul:** Emrullah'ın `src/pages/Posture.jsx` ve `src/components/CameraFeed/CameraFeed.jsx` dosyaları branch'e merge edilmiş olmalı. Merge olmadan bu göreve başlanmaz.
- [ ] `src/utils/mediapipeCore.js` dosyasındaki `initPose()` ve `startCamera()` fonksiyonlarını `src/pages/Posture.jsx` ile entegre et:
  - Video element ref'i ve canvas ref'i `Posture.jsx`'ten `mediapipeCore`'a pas.
  - `onPoseResults` callback'inde `angleMath.classifyPosture(landmarks)` çağır.
  - Sonucu state'e yaz: `postureStatus: "good" | "bad"`.
- [ ] `src/utils/mediapipeCore.js` dosyasına `setExerciseMode(mode)` fonksiyonu ekle: `"squat"`, `"pushup"`, `"plank"` modlarına göre hangi `angleMath` analiz fonksiyonunun çağrılacağını belirle.
- [ ] `Posture.jsx`'te `createRepCounter` fonksiyonunu `angleMath.js`'ten import et; `useRef` içinde instance sakla, her frame'de `angleMath.calculateAngle()` sonucunu `counter.processAngle()` fonksiyonuna ilet; dönen `repCount`'u state'e yaz — Emrullah'ın hazırladığı sayaç gösterim alanına bağla.

**Gün 3 — Adaptif Program & `Muscle.jsx` Entegrasyonu (Emrullah'ın Gün 3 çıktısına bağımlı)**
- [ ] **Ön koşul:** Emrullah'ın `src/pages/Muscle.jsx` dosyası branch'e merge edilmiş olmalı.
- [ ] `src/pages/Muscle.jsx` içinde program mantığını bağla: `dbService.getUserProfile(uid)`'den `programLevel` oku → `programDecks.json`'dan ilgili seviyeyi çek → o günkü antrenmanı Emrullah'ın hazırladığı liste komponentine prop olarak ilet.
- [ ] Egzersiz tamamlandığında `adaptiveLogic.recordExerciseResult()` çağrısını `Muscle.jsx`'teki "Tamamlandı" checkbox'ına bağla.
- [ ] Adaptif düşürme mantığını test et: manuel olarak 3 başarısız sonuç kaydet, `downgradeProgramLevel()`'ın çalıştığını Firestore Console'dan doğrula; seviye düştüğünde Emrullah'ın toast bildiriminin tetiklendiğini gözlemle.

**Gün 4-5 — Ses Geri Bildirimi & Kalibrasyon**
- [ ] `src/utils/mediapipeCore.js` dosyasına basit ses geri bildirimi ekle: `"good"` form algılandığında Web Audio API ile kısa bip sesi; `"bad"` için farklı ton.
- [ ] Kalibrasyon modu: kullanıcı "Hazırım" butonuna basınca 3 saniyelik geri sayım başlasın, bu sürede MediaPipe referans pozu kaydetsin (`baselineLandmarks` state'e yaz).

---

### 🛠️ ERAN — Hafta 3

**Gün 1 — Streak Sistemi Backend Mantığı**
- [ ] `src/services/dbService.js` dosyasına ekle:
  - `checkAndUpdateStreak(uid)` → `users/{uid}` dökümanından `lastWorkoutDate` oku; eğer dün ise streak'i 1 artır ve `lastWorkoutDate`'i bugüne güncelle; eğer birden fazla gün atlandıysa streak'i 0'a sıfırla.
  - `getUserBadges(uid)` → `users/{uid}/badges` alt koleksiyonunu çek.
  - `awardBadge(uid, badgeId)` → yeni rozet dökümanı oluştur: `{ badgeId, earnedAt, title, description }`.

**Gün 2 — Badge Tetikleyiciler**
- [ ] `src/services/dbService.js` dosyasına ekle:
  - `checkBadgeEligibility(uid, userProfile)` → mevcut streak ve tamamlanan antrenman sayısına göre rozet hak etme durumunu kontrol et.
  - Rozet eşikleri: 3 gün streak → "Momentum", 7 gün → "Haftalık Savaşçı", 30 gün → "Demir İrade", 10 antrenman → "Azimli".

**Gün 3 — Premium Modal API Entegrasyonu**
- [ ] `api/upgrade-premium.js` dosyasını gözden geçir ve son halini ver:
  - Sahte ödeme: frontend'den gelen `{ uid, planType }` isteğini al.
  - Direkt `isPremium: true` ve `premiumSince: new Date().toISOString()` Firestore'a yaz.
  - Başarı yanıtı: `{ success: true, message: "Premium aktivasyon başarılı!" }`.
- [ ] `src/services/dbService.js` dosyasına `upgradeToPremium(uid)` fonksiyonu ekle: `api/upgrade-premium.js`'e fetch at.

**Gün 4-5 — Cron Job Geliştirme & Resend Email (Ücretsiz / Premium Ayrımı)**
- [ ] `api/cron-daily-email.js` dosyasını genişlet:
  - Firestore'dan `lastEmailSent` alanını kontrol et — aynı kullanıcıya 24 saat içinde 2 email gitmesin.
  - Her kullanıcının `isPremium` alanını oku; buna göre **iki farklı şablon** uygula:
    - **Ücretsiz kullanıcı** → yalnızca genel "Günün Fitness Haberi" içeren şablon gönder: günlük bir fitness ipucu + uygulamaya davet CTA butonu. Streak ve rozet bilgisi bu emailde YER ALMAZ.
    - **Premium kullanıcı** → kişiselleştirilmiş şablon gönder: Günün Fitness Haberi'ne ek olarak `streak_day` (mevcut seri gün sayısı) ve `yıldız` durumu (aktif rozetler) HTML'e gömülür; kullanıcı adıyla selamlama satırı eklenir.
  - İki şablonu aynı dosya içinde `buildFreeEmailHTML(userData)` ve `buildPremiumEmailHTML(userData)` fonksiyonları olarak tanımla; `isPremium` koşuluna göre ilgili fonksiyonu çağır.
  - Resend API ile `impact@yourdomain.com` adresinden gönder.
  - İşlem tamamlanınca `users/{uid}` içindeki `lastEmailSent` alanını güncelle.

---

### 🎨 EMRULLAH — Hafta 3

**Gün 1-2 — Posture Sayfası UI**
- [ ] `src/pages/Posture.jsx` dosyasını oluştur (Berkay'ın `mediapipeCore.js` fonksiyonlarını kullan):
  - Sol panel: `CameraFeed` komponenti.
  - Sağ panel: form analizi sonuçları, rep sayacı, anlık geri bildirim badge'i.
  - Egzersiz seçim dropdown'u: squat / push-up / plank.
  - Form durumu: yeşil animasyonlu badge ("İyi Form!") / kırmızı ("Formu Düzelt!").
  - Rep sayacı: büyük sayısal gösterim + progress bar (set tamamlama yüzdesi).

**Gün 3 — Muscle Sayfası UI**
- [ ] `src/pages/Muscle.jsx` dosyasını oluştur:
  - Günün antrenman listesi: egzersiz adı, set/rep, hedef kas grubu.
  - Her egzersiz için "Tamamlandı" checkbox'ı → `adaptiveLogic.recordExerciseResult()` tetikle.
  - Egzersiz sırası tamamlanınca konfeti animasyonu (CSS veya `canvas-confetti` kütüphanesi).
  - Program seviyesi badge'i (Başlangıç/Orta/İleri) — seviye düşünce toast bildirimi.
  - Muscle map SVG'si: tıklanan egzersizin hedef kasını vurgula (`public/assets/muscle-map.svg`).

**Gün 4 — Discipline Sayfası UI**
- [ ] `src/pages/Discipline.jsx` dosyasını oluştur:
  - Streak sayacı: büyük ateş animasyonu + gün sayısı (Framer Motion `scale` animasyonu).
  - Aktivite takvimi: aylık grid, tamamlanan günler yeşil hücre ile gösterilsin.
  - Rozet koleksiyonu: kazanılan rozetler renkli, henüz kazanılmayanlar grilendirilmiş (lock ikonu).
  - `src/components/Testimonials/Testimonials.jsx` statik başarı hikayeleri komponenti ekle: 6 kart, her birinde kullanıcı adı, fotoğraf placeholder, dönüşüm hikayesi.

**Gün 5 — Premium Modal**
- [ ] `src/pages/PremiumModal.jsx` dosyasını oluştur (shadcn `Dialog` kullan):
  - İki plan: Aylık / Yıllık (yıllık %40 indirimli badge'i ile).
  - Özellik listesi: AI Koç, Detaylı Analitik, Sınırsız Program, Öncelikli Destek.
  - "Şimdi Geç" butonu → `api/upgrade-premium.js`'e istek at → başarı toast → modal kapat → Dashboard yeniden yüklensin.
  - Framer Motion ile modal açılış animasyonu: `scale` + `opacity` spring efekti.

---

## 📅 HAFTA 4 — ENTEGRASYON, POLİSH & DEPLOYMENT

### 🎯 Hafta 4 — DoD
- Tüm sayfalar birbiriyle entegre çalışmalı; hiçbir dummy data kalmamış olmalı.
- Vercel'e production deployment tamamlanmış olmalı.
- Lighthouse skoru: Performance > 85, Accessibility > 90.
- Cron job Vercel'de aktif ve email gönderimi doğrulanmış olmalı.
- Karakter assetleri (`coach-idle.webp`, `coach-celebrate.gif`) tüm sayfalarda doğru konumda görünmeli (Hafta 1'de üretildi, Hafta 4'te entegrasyon doğrulandı).
- Manuel end-to-end test tamamlanmış olmalı (kayıt → onboarding → dashboard → chatbot → antrenman → diyet).

---

### 👨‍💻 BERKAY — Hafta 4

**Gün 1-2 — Karakter Asset Entegrasyonu & Son Dokunuşlar**
- [ ] ~~Asset üretimi~~ → **Bu görev Hafta 1 Gün 5'e alındı.** `public/assets/` klasöründe `coach-idle.webp`, `coach-celebrate.gif`, `coach-thumbsup.webp` dosyalarının eksiksiz olduğunu doğrula.
- [ ] `src/components/Chatbot/ChatWindow.jsx`'te AI mesajlarının yanında `coach-idle.webp` görünüyor mu, `coach-celebrate.gif` doğru animasyon zamanlamasında mı — son kontrol yap ve gerekiyorsa boyut/pozisyon ayarla.

**Gün 3 — Performance Optimizasyon**
- [ ] `src/utils/mediapipeCore.js` dosyasında frame rate kontrolü ekle: kamera feed'ini 30fps'te kilitle (`requestAnimationFrame` throttle).
- [ ] `src/data/kaggleFood.json` ve `programDecks.json` dosyalarını `useMemo` + lazy import ile yükle (ilk sayfa yükleme süresini düşür).

**Gün 4-5 — End-to-End Test & Bug Fix**
- [ ] Tüm kritik kullanıcı yollarını manuel test et:
  - [ ] Kayıt → Onboarding → Dashboard akışı
  - [ ] Chatbot: 6 mesaj gönder, 5. mesajdan sonra context window'un doğru çalıştığını Firestore'dan doğrula
  - [ ] Antrenman tamamlama → streak güncelleme → rozet tetikleme
  - [ ] Kamera açma → MediaPipe başlatma → rep sayma → form analizi
  - [ ] Diyet planı yenileme → shuffle algoritmasının her seferinde farklı plan ürettiğini doğrula
- [ ] Tespit edilen bug'ları fix et.

---

### 🛠️ ERAN — Hafta 4

**Gün 1 — Vercel Production Deployment**
- [ ] Vercel CLI ile projeyi bağla: `vercel link`.
- [ ] Vercel Dashboard'dan tüm environment variable'ları ekle (`.env` içindeki tüm değişkenler).
- [ ] `vercel --prod` ile ilk production deploy'u gerçekleştir.
- [ ] `vercel.json` dosyasını doğrula: `crons` alanı doğru syntax'ta mı?
- [ ] Vercel Dashboard'dan Cron Jobs sekmesini kontrol et: `cron-daily-email` görünüyor mu?

**Gün 2 — Firestore Güvenlik Kuralları Finalizasyonu**
- [ ] Firestore Security Rules'u üretim için sıkılaştır:
  ```
  match /users/{userId} {
    allow read, write: if request.auth != null && request.auth.uid == userId;
  }
  match /chatHistory/{userId}/messages/{messageId} {
    allow read, write: if request.auth != null && request.auth.uid == userId;
  }
  ```
- [ ] Firebase Console'dan kuralları deploy et ve Rules Playground'da test et.

**Gün 3 — Resend Domain Doğrulama & Email Test**
- [ ] Resend Dashboard'dan domain'i doğrula (DNS kayıtlarını ekle).
- [ ] Cron job'ı manuel olarak tetikle (`vercel cron run`): email ulaşıyor mu?
- [ ] Email HTML şablonunun mobil görünümünü test et (Gmail + Apple Mail).

**Gün 4-5 — Monitoring & Son Kontroller**
- [ ] Vercel Analytics'i aktif et (Dashboard → Analytics sekmesi).
- [ ] Firebase Console'dan kullanım metriklerini kontrol et: Authentication active users, Firestore read/write sayıları.
- [ ] `api/` altındaki tüm serverless function'ların Vercel Function Logs'ta hatasız çalıştığını doğrula.
- [ ] Rate limit simülasyonu: `chat-rag.js`'e aynı kullanıcıdan 20 istek at, Gemini API limitine takılıyor mu?

---

### 🎨 EMRULLAH — Hafta 4

**Gün 1-2 — Landing Page & Onboarding Polish**
- [ ] `src/pages/Auth.jsx` dosyasını güncelle: sağ panelde `coach-celebrate.gif` asset'ini göster; `public/assets/` klasöründen yükle.
- [ ] `src/pages/Onboarding.jsx`'in progress indicator'ını iyileştir: step çubuğu animasyonlu ilerlesin.
- [ ] `src/components/Testimonials/Testimonials.jsx` komponenti `Auth.jsx` landing bölümüne ekle (giriş yapmamış kullanıcılar görsün).

**Gün 3 — Lottie Animasyonları**
- [ ] `public/lottie/` klasörüne fitness temalı Lottie JSON dosyaları ekle (LottieFiles.com'dan ücretsiz: dumbbell, fire, trophy animasyonları).
- [ ] `Discipline.jsx`'teki streak sayacında `lottie-react` ile fire animasyonu oynat.
- [ ] `Muscle.jsx`'teki egzersiz tamamlama ekranında trophy Lottie animasyonu ekle.

**Gün 4 — Lighthouse & Accessibility Fix**
- [ ] Chrome DevTools Lighthouse raporu çalıştır.
- [ ] Tüm `<img>` etiketlerine `alt` attribute ekle.
- [ ] Keyboard navigasyonu test et: Tab sırası mantıklı mı? Focus visible stilini Tailwind ile ekle (`focus:ring-2 focus:ring-impact-primary`).
- [ ] Renk kontrast oranlarını kontrol et (WCAG AA: 4.5:1 minimum).
- [ ] Büyük JSON dosyaları (`kaggleFood.json`) için `React.lazy` + `Suspense` uygula.

**Gün 5 — Son UI Polish & Demo Hazırlığı**
- [ ] Tüm sayfalarda tutarlı boşluk (spacing) ve tipografi kontrolü yap.
- [ ] `404.jsx` sayfası oluştur: motivasyon temalı "Sayfa Bulunamadı" mesajı + Dashboard'a dönüş butonu.
- [ ] `src/pages/Dashboard.jsx` üst kısmına hoş geldin mesajı ekle: `"Merhaba, {displayName}! Bugün hazır mısın?"` — Framer Motion ile typewriter efekti.
- [ ] Demo için test kullanıcısı oluştur: hem normal hem premium durumu test edilebilir olsun.

---

## 📋 GENEL PROJE KONTROLLERİ

### 🔒 Güvenlik Checklist
- [ ] `.env` dosyası `.gitignore`'da mı? ✓
- [ ] `GEMINI_API_KEY` hiçbir frontend dosyasında görünüyor mu? ✓ (Sadece `api/` klasöründe)
- [ ] Firestore rules `auth != null` kontrolü yapıyor mu? ✓
- [ ] `api/upgrade-premium.js` header token kontrolü aktif mi? ✓

### 📁 Tamamlanması Gereken Dosya Listesi (Toplam)
```
api/
  ✅ cron-daily-email.js
  ✅ chat-rag.js
  ✅ generate-diet.js
  ✅ upgrade-premium.js
src/data/
  ✅ programDecks.json
  ✅ kaggleFood.json
src/context/
  ✅ AuthContext.jsx
src/services/
  ✅ firebase.js
  ✅ authService.js
  ✅ dbService.js
src/utils/
  ✅ mediapipeCore.js
  ✅ angleMath.js         ← rep sayacı mantığı burada (createRepCounter)
  ✅ adaptiveLogic.js
src/components/
  ui/
    ✅ Sidebar.jsx
    ✅ PrivateRoute.jsx
    ✅ PremiumRoute.jsx    ← isPremium kontrolü; Posture + Discipline route'larını korur
  Chatbot/
    ✅ ChatWindow.jsx
    ✅ ChatBubble.jsx
  Testimonials/
    ✅ Testimonials.jsx
  CameraFeed/
    ✅ CameraFeed.jsx
src/pages/
  ✅ Auth.jsx
  ✅ Onboarding.jsx
  ✅ Dashboard.jsx
  ✅ Posture.jsx
  ✅ Muscle.jsx
  ✅ Nutrition.jsx
  ✅ Discipline.jsx
  ✅ PremiumModal.jsx
public/
  assets/
    ✅ coach-idle.webp
    ✅ coach-celebrate.gif
    ✅ coach-thumbsup.webp
    ✅ muscle-map.svg
  lottie/
    ✅ fire.json
    ✅ trophy.json
    ✅ dumbbell.json
```

### ⚡ Kritik Bağımlılık Zinciri
```
Eran: firebase.js + authService.js
    → Emrullah: Auth.jsx + AuthContext.jsx kullanabilir
    → Eran: dbService.js
        → Berkay: adaptiveLogic.js Firestore'a yazabilir
        → Eran: chat-rag.js Firestore'dan okuyabilir
            → Emrullah: ChatWindow.jsx API'yi çağırabilir
Berkay: programDecks.json + kaggleFood.json
    → Eran: generate-diet.js JSON'ı kullanabilir
        → Emrullah: Nutrition.jsx API'yi çağırabilir
Berkay: mediapipeCore.js + angleMath.js
    → Emrullah: Posture.jsx + CameraFeed.jsx entegre edilebilir
```

---

*Son güncelleme: Impact Fitness Master Execution Protocol v1.2 — Operasyonel Zamanlama & Güvenlik Revizyonu*
*Toplam görev: ~122 checkbox | Süre: 4 Hafta | Ekip: Berkay · Emrullah · Eran*
*v1.1 değişiklikleri: `fitnessKnowledge.json` kaldırıldı → profil bazlı sistem promptu | `repCounter.js` → `angleMath.js`'e merge | `poseWorker.js` ihtimali kaldırıldı | Email ücretsiz/premium ayrımı netleştirildi*
*v1.2 değişiklikleri: Karakter asset üretimi Hafta 1 Gün 5'e öne çekildi | `PremiumRoute.jsx` eklendi → `/discipline` ve `/posture` URL manipülasyonuna karşı korumalı*
