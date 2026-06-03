import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs, 
  serverTimestamp 
} from "firebase/firestore";

// ============================================================================
// 1. VERİTABANI (KALICI HAFIZA) İŞLEMLERİ
// ============================================================================

/**
 * Kullanıcının bir egzersizdeki sonucunu (başarılı/başarısız) veritabanına kaydeder.
 */
export const recordExerciseResult = async (userId, exerciseId, success, db) => {
  try {
    const logRef = collection(db, "users", userId, "exerciseLog");
    await addDoc(logRef, {
      exerciseId: exerciseId,
      success: success,
      timestamp: serverTimestamp()
    });
    console.log(`Sonuç kaydedildi: ${exerciseId} - Başarı: ${success}`);
    return true;
  } catch (error) {
    console.error("Egzersiz sonucu kaydedilemedi:", error);
    return false;
  }
};

/**
 * Kullanıcının belirli bir egzersizde art arda 3 kez başarısız olup olmadığını kontrol eder.
 * (Not: Bu fonksiyon genel antrenman geçmişi içindir, canlı kamera anında kullanılmaz.)
 */
export const checkFailureThreshold = async (userId, exerciseId, db) => {
  try {
    const logRef = collection(db, "users", userId, "exerciseLog");
    const q = query(
      logRef,
      where("exerciseId", "==", exerciseId),
      orderBy("timestamp", "desc"),
      limit(3)
    );
    const snapshot = await getDocs(q);

    if (snapshot.size < 3) return false;

    let failureCount = 0;
    snapshot.forEach((doc) => {
      if (doc.data().success === false) failureCount++;
    });

    return failureCount === 3;
  } catch (error) {
    console.error("Eşik kontrolü sırasında hata oluştu:", error);
    return false;
  }
};

/**
 * Kullanıcının program seviyesini bir alt zorluğa çeker ve veritabanına kaydeder.
 */
export const downgradeProgramLevel = async (userId, currentLevel, db) => {
  const levelMap = {
    advanced: "intermediate",
    intermediate: "beginner",
    beginner: "beginner" 
  };

  const newLevel = levelMap[currentLevel];

  if (newLevel === currentLevel) {
    console.log("Kullanıcı zaten en alt seviyede (beginner), düşürülemez.");
    return currentLevel;
  }

  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      programLevel: newLevel
    });
    console.log(`Kullanıcı seviyesi düşürüldü: ${currentLevel} -> ${newLevel}`);
    return newLevel;
  } catch (error) {
    console.error("Seviye düşürme işlemi başarısız oldu:", error);
    return null;
  }
};

// ============================================================================
// 2. CANLI KAMERA (EDGE AI) SIFIR GECİKME MEKANİZMASI
// ============================================================================

/**
 * IMPACT AI - Canlı Adaptif Zorluk Motoru
 * Kameradan saniyede 30 kez gelen (good/bad) verilerini RAM üzerinde sayar.
 * 3 Hata olduğunda veritabanı fonksiyonunu (downgradeProgramLevel) tetikler.
 */
export const createLiveAdaptiveLogic = (userId, db, initialLevel = "intermediate") => {
  let consecutiveFailures = 0;
  let currentLevel = initialLevel;
  let isDowngrading = false; // Veritabanı yazılırken çoklu tetiklenmeyi önler (Lock)

  return async (performanceStatus) => {
    // İşlem devam ediyorsa veya zaten en alt seviyedeyse hiç yorma
    if (isDowngrading) return { levelChanged: false, currentLevel, message: "Seviye güncelleniyor..." };
    if (currentLevel === "beginner" && performanceStatus === "bad") {
      return { levelChanged: false, currentLevel, message: "Pes etme, başlangıç seviyesindesin!" };
    }

    if (performanceStatus === "good") {
      consecutiveFailures = 0;
      return { levelChanged: false, currentLevel, message: "Aynen böyle devam, form kusursuz!" };
    }

    if (performanceStatus === "bad") {
      consecutiveFailures += 1;

      // 3 Kere Hata Yapıldıysa Kalıcı Olarak Veritabanını Güncelle!
      if (consecutiveFailures >= 3) {
        isDowngrading = true; // DB işlemini kilitle
        
        const newLevel = await downgradeProgramLevel(userId, currentLevel, db);
        
        consecutiveFailures = 0; // Sayacı sıfırla
        isDowngrading = false;   // Kilidi aç

        if (newLevel && newLevel !== currentLevel) {
          currentLevel = newLevel;
          return { 
            levelChanged: true, 
            currentLevel, 
            message: `⚠️ 3 Kere formu bozdun! Sakatlanmamak için seviyen kalıcı olarak ${newLevel.toUpperCase()} yapıldı.` 
          };
        }
      }

      // Hata yaptı ama henüz 3 olmadı (1/3, 2/3)
      return {
        levelChanged: false,
        currentLevel,
        message: `Form bozuk! (Dikkat: ${consecutiveFailures}/3 Hata)`
      };
    }
    
    return { levelChanged: false, currentLevel, message: "" };
  };
};