import { doc, runTransaction } from "firebase/firestore";
import { db } from "@/services/firebase"; 

/**
 * IMPACT AI - Adaptif Zeka (Oturum Bazlı Kalibrasyon)
 * Kullanıcının kalıcı seviyesine DOKUNMAZ! Sadece anlık program zorluğunu düşürür.
 */
// YENİ: currentSessionLevel parametresi eklendi!
export const recordExerciseResult = async (uid, exerciseId, status, currentSessionLevel) => {
  try {
    const userRef = doc(db, "users", uid);

    const result = await runTransaction(db, async (transaction) => {
      const userSnap = await transaction.get(userRef);
      if (!userSnap.exists()) throw "Kullanıcı profili bulunamadı!";

      const userData = userSnap.data();
      let currentFails = userData.consecutiveFails || 0;

      // BAŞARILI DURUM: Sadece fail sayacını sıfırla
      if (status === "success") {
        transaction.update(userRef, { consecutiveFails: 0 });
        return { downgraded: false };
      }

      // BAŞARISIZ DURUM (Zorlandım)
      if (status === "fail") {
        currentFails += 1;

        if (currentFails >= 3) {
          // Yeni seviyeyi veritabanındaki değere göre değil, ekrandaki mevcut oturuma göre hesapla
          let newLevel = "beginner";
          if (currentSessionLevel === "advanced") newLevel = "intermediate";
          else if (currentSessionLevel === "intermediate") newLevel = "beginner";

          // 🚨 KRİTİK DEĞİŞİKLİK: Firebase'deki "programLevel" verisine DOKUNMUYORUZ!
          // Sadece hata sayacını sıfırlıyoruz ki döngü başa sarsın.
          transaction.update(userRef, { consecutiveFails: 0 });

          if (currentSessionLevel !== newLevel) {
              return { downgraded: true, newLevel: newLevel };
          } else {
              return { downgraded: false, newLevel: currentSessionLevel };
          }
        } else {
          transaction.update(userRef, { consecutiveFails: currentFails });
          return { downgraded: false };
        }
      }
    });

    return result;
  } catch (error) {
    console.error("Adaptif Zeka Motoru Çöktü:", error);
    return null;
  }
};