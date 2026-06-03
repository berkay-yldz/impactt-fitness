/**
 * IMPACT AI - Gelişmiş Postür ve Açı Hesaplama Motoru
 * Saf Matematik Modülü - React veya UI içermez.
 */

// 1. TEMEL GEOMETRİ: 3 Nokta Arası Açı Hesaplama
export const calculateAngle = (pointA, pointB, pointC) => {
  if (!pointA || !pointB || !pointC) return 0;

  const radians = Math.atan2(pointC.y - pointB.y, pointC.x - pointB.x) - 
                  Math.atan2(pointA.y - pointB.y, pointA.x - pointB.x);
  
  let angle = Math.abs(radians * 180.0 / Math.PI);
  if (angle > 180.0) angle = 360.0 - angle;
  
  return Math.round(angle);
};

// ============================================================================
// HAREKET ANALİZ MODÜLLERİ (MediaPipe Landmark Endeksleri Kullanılır)
// Her fonksiyon kesinlikle { status: "good"|"bad", feedback: "string" } döner.
// ============================================================================

// 2. SQUAT ANALİZİ
export const analyzeSquatForm = (landmarks) => {
  // Koordinatların varlık kontrolü
  if (!landmarks || !landmarks[24] || !landmarks[26] || !landmarks[28]) {
    return { status: "bad", feedback: "Kamera açısı yetersiz." };
  }
  
  // Sağ bacak: Kalça(24) - Diz(26) - Ayak Bileği(28)
  const hip = landmarks[24];
  const knee = landmarks[26];
  const ankle = landmarks[28];
  
  const kneeAngle = calculateAngle(hip, knee, ankle);

  // Master Plan Kuralı: Diz açısı <= 90° ise "good", > 90° ise "bad"
  if (kneeAngle <= 90) {
    return { status: "good", feedback: "Mükemmel derinlik!" };
  } else {
    return { status: "bad", feedback: "Daha fazla in, dizi 90°'nin altına getir." };
  }
};

// 3. ŞINAV (PUSHUP) ANALİZİ
export const analyzePushupForm = (landmarks) => {
  // Koordinatların varlık kontrolü
  if (!landmarks || !landmarks[12] || !landmarks[14] || !landmarks[16]) {
    return { status: "bad", feedback: "Tam vücudunu göremiyorum." };
  }

  // Sağ Kol: Omuz(12) - Dirsek(14) - Bilek(16)
  const shoulder = landmarks[12];
  const elbow = landmarks[14];
  const wrist = landmarks[16];
  
  const elbowAngle = calculateAngle(shoulder, elbow, wrist);

  // Master Plan Kuralı: Dirsek açısı < 90° ise "good", > 90° ise "bad"
  if (elbowAngle < 90) {
    return { status: "good", feedback: "İyi form" };
  } else {
    return { status: "bad", feedback: "Daha fazla in" };
  }
};

// 4. PLANK ANALİZİ
export const analyzePlankForm = (landmarks) => {
  // Koordinatların varlık kontrolü
  if (!landmarks || !landmarks[12] || !landmarks[24] || !landmarks[28]) {
    return { status: "bad", feedback: "Plank için pozisyon al." };
  }

  const shoulder = landmarks[12];
  const hip = landmarks[24];
  const ankle = landmarks[28];

  // Omuz, kalça ve ayak bileği Y koordinatları arasındaki maksimum sapmayı bul
  const maxDifference = Math.max(
    Math.abs(shoulder.y - hip.y),
    Math.abs(hip.y - ankle.y),
    Math.abs(shoulder.y - ankle.y)
  );

  // Master Plan Kuralı: Hizalama sapması > 0.05 ise "bad"
  if (maxDifference > 0.05) {
    return { status: "bad", feedback: "Kalçanı düşür, vücudunu düzelt." };
  } else {
    return { status: "good", feedback: "Mükemmel form!" };
  }
};