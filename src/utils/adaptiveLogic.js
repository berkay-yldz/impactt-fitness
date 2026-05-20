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
 */
export const checkFailureThreshold = async (userId, exerciseId, db) => {
  try {
    const logRef = collection(db, "users", userId, "exerciseLog");
    
    // Kullanıcının bu egzersizdeki en son 3 denemesini tarihe göre ters sıralı getir
    const q = query(
      logRef,
      where("exerciseId", "==", exerciseId),
      orderBy("timestamp", "desc"),
      limit(3)
    );

    const snapshot = await getDocs(q);

    // Eğer henüz 3 kere denenmemişse, doğal olarak 3 kez başarısız olmamıştır
    if (snapshot.size < 3) {
      return false;
    }

    let failureCount = 0;
    snapshot.forEach((doc) => {
      // Eğer success değeri false ise başarısızlık sayacını artır
      if (doc.data().success === false) {
        failureCount++;
      }
    });

    // Son 3 denemenin 3'ü de başarısızsa true dön (Düşürme tetiklenecek)
    return failureCount === 3;
  } catch (error) {
    console.error("Eşik kontrolü sırasında hata oluştu:", error);
    return false;
  }
};

/**
 * Kullanıcının program seviyesini bir alt zorluğa çeker.
 */
export const downgradeProgramLevel = async (userId, currentLevel, db) => {
  // Seviye düşürme haritası (Kural: advanced -> intermediate -> beginner)
  const levelMap = {
    advanced: "intermediate",
    intermediate: "beginner",
    beginner: "beginner" // En alt seviyede ise aynı kalır
  };

  const newLevel = levelMap[currentLevel];

  // Eğer zaten beginner ise gereksiz veritabanı yazma işlemi yapma
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