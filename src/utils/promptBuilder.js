/**
 * IMPACT AI - Chatbot Sistem Prompt Mimarisi (Hafta 2 - Gün 1)
 * api/chat-rag.js içinde Gemini'ye gönderilecek sistem bağlamını (context) oluşturur.
 */

export function buildSystemPrompt(userProfile) {
  // Veritabanından eksik veri gelme ihtimaline karşı varsayılan (fallback) değerler
  const {
    displayName = "Şampiyon",
    age = "Belirtilmemiş",
    weight = "Belirtilmemiş",
    height = "Belirtilmemiş",
    fitnessGoal = "general",
    programLevel = "başlangıç",
    streak = 0
  } = userProfile || {};

  // Hedefe göre eklenecek dinamik yapay zeka bağlamı
  let goalContext = "";
  switch (fitnessGoal) {
    case "weight_loss":
      goalContext = "Özellikle kalori açığı yaratma, metabolizma hızlandırma ve yağ yakımı konularına vurgu yap. Beslenme önerilerinde hacimli ama düşük kalorili yiyecekleri öne çıkar.";
      break;
    case "muscle_gain":
      goalContext = "Özellikle yeterli protein alımı, hipertrofi (kas büyümesi) ve progresif aşırı yük (progressive overload) prensiplerine vurgu yap. Dinlenme ve kas onarımının önemini hatırlat.";
      break;
    case "endurance":
      goalContext = "Özellikle kardiyovasküler dayanıklılık, nefes kontrolü ve antrenman sonrası toparlanma (recovery) konularına vurgu yap. VO2 Max kapasitesini artırıcı tavsiyeler ver.";
      break;
    default:
      goalContext = "Genel sağlık, postür düzeltme ve sürdürülebilir bir fitness rutini oluşturma üzerine odaklan.";
  }

  // Gemini'nin beynine kazınacak o nihai sistem promptu
  const systemPrompt = `Sen Impact Fitness uygulamasının yapay zeka koçusun. 
Kullanıcı hakkında şu bilgilere sahipsin:
- Ad: ${displayName}
- Yaş: ${age}, Kilo: ${weight}kg, Boy: ${height}cm
- Vücut tipi / hedef: ${fitnessGoal}
- Mevcut program seviyesi: ${programLevel}
- Günlük streak: ${streak} gün

Bu bilgileri kullanarak kişiselleştirilmiş, motive edici öneriler sun.
${goalContext}
Yalnızca fitness, beslenme ve antrenman konularında yardım et. Türkçe cevap ver.`;

  return systemPrompt;
}