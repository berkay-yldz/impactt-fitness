import { Pose } from '@mediapipe/pose';
import { Camera } from '@mediapipe/camera_utils';

/**
 * IMPACT Fitness - MediaPipe Pose Çekirdeği
 * Anayasa Kuralı: Sadece istemci tarafında (Client-side) çalışır, video verisi sunucuya GİTMEZ.
 */

// 1. Pose Motorunu Başlatma Fonksiyonu
export const initPoseModel = (onResultsCallback) => {
  const pose = new Pose({
    locateFile: (file) => {
      // Modeli CDN üzerinden çekerek projeyi (bundle size) şişirmiyoruz
      return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
    }
  });

  pose.setOptions({
    modelComplexity: 1, // 0: Çok hızlı ama hataya açık, 1: Dengeli (Bizim için en iyisi), 2: Çok hassas ama cihazı yorar
    smoothLandmarks: true, // Titremeleri önler
    enableSegmentation: false, // Arka planı silmeye gerek yok, performansı artırır
    minDetectionConfidence: 0.6, // %60 emin olmadan insan iskeleti çizme
    minTrackingConfidence: 0.6
  });

  // Kare işlendiğinde React komponentine (CameraFeed'e) sonuçları yolla
  pose.onResults(onResultsCallback);
  
  return pose;
};

// 2. Kamerayı Başlatma ve Motora Bağlama Fonksiyonu
export const startCamera = (videoElement, poseInstance) => {
  if (!videoElement) {
    console.error("Video elementi bulunamadı!");
    return null;
  }

  const camera = new Camera(videoElement, {
    onFrame: async () => {
      try {
        // Kameradan saniyede 30 defa gelen her bir kareyi yapay zekaya yedir
        await poseInstance.send({ image: videoElement });
      } catch (error) {
        console.error("MediaPipe kare işleme hatası:", error);
      }
    },
    width: 640,
    height: 480
  });

  camera.start();
  return camera;
};

// 3. Kamerayı Güvenli Kapatma (Bellek sızıntısını önlemek için)
export const stopCamera = (cameraInstance) => {
  if (cameraInstance) {
    cameraInstance.stop();
    console.log("Kamera güvenli bir şekilde kapatıldı.");
  }
};