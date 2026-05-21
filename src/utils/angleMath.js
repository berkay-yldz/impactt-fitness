/**
 * IMPACT Fitness - Postür ve Açı Hesaplama Motoru
 * MediaPipe'tan gelen koordinatları alır, eklem açılarını hesaplar ve form kontrolü yapar.
 */

/**
 * 3 nokta arasındaki açıyı (derece cinsinden) hesaplar.
 * @param {Object} pointA - Başlangıç noktası (Örn: Omuz) {x, y}
 * @param {Object} pointB - Köşe/Merkez noktası (Örn: Dirsek) {x, y}
 * @param {Object} pointC - Uç noktası (Örn: El Bileği) {x, y}
 * @returns {number} - 0 ile 180 derece arasında bir açı değeri
 */
export const calculateAngle = (pointA, pointB, pointC) => {
  if (!pointA || !pointB || !pointC) return 0;

  // Radyan cinsinden açıyı hesapla
  const radians = Math.atan2(pointC.y - pointB.y, pointC.x - pointB.x) - 
                  Math.atan2(pointA.y - pointB.y, pointA.x - pointB.x);
  
  // Radyanı dereceye çevir
  let angle = Math.abs(radians * 180.0 / Math.PI);
  
  // İç açıyı aldığımızdan emin ol (180 dereceden büyükse tümlerini al)
  if (angle > 180.0) {
    angle = 360.0 - angle;
  }
  
  return Math.round(angle);
};

/**
 * Hesaplanmış bir açının, hedeflenen "nizami form" aralığında olup olmadığını kontrol eder.
 * @param {number} currentAngle - Anlık hesaplanan açı
 * @param {number} targetMin - Kabul edilebilir minimum açı
 * @param {number} targetMax - Kabul edilebilir maksimum açı
 * @returns {boolean} - Form doğruysa true, bozuksa false döner
 */
export const isPostureCorrect = (currentAngle, targetMin, targetMax) => {
  return currentAngle >= targetMin && currentAngle <= targetMax;
};

/**
 * (Opsiyonel Helper) Vücudun sağ veya sol tarafındaki y ekseni hizalamasını kontrol eder.
 * Örneğin; sırtın dik olup olmadığını (omuz ve kalça y ekseni farkını) anlamak için.
 */
export const calculateVerticalAlignment = (topPoint, bottomPoint) => {
  if (!topPoint || !bottomPoint) return 0;
  const deltaX = Math.abs(topPoint.x - bottomPoint.x);
  return deltaX; // Bu değer 0'a ne kadar yakınsa vücut o kadar diktir.
};