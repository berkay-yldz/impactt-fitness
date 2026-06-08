import { analyzeSquatForm, analyzePushupForm, analyzePlankForm } from "./angleMath";

/**
 * IMPACT Fitness - MediaPipe Pose Çekirdeği (CDN/Window Yöntemi + SES MOTORU)
 */

let camera = null;
let currentExerciseMode = "squat"; 

// --- SES MOTORU (Web Audio API) ---
let audioCtx = null;
let lastBeepTime = 0;
let lastStatus = null;

const playTone = (status) => {
  // Sadece "good" (iyi form) veya "bad" (bozuk form) için ses çıkar
  if (status !== "good" && status !== "bad") return;
  
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();

    const now = Date.now();
    // Tarayıcıyı çökertmemek ve makinalı tüfek gibi ötmemesi için "Throttle" (Fren) mekanizması:
    // Eğer durum aynıysa 2 saniyede bir öt. Ama durum değişirse (İyi -> Kötü) ANINDA öt!
    if (status === lastStatus && now - lastBeepTime < 2000) return;
    
    lastBeepTime = now;
    lastStatus = status;

    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    if (status === "good") {
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(800, audioCtx.currentTime); // İnce, pozitif "Bip"
      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.15); 
    } else if (status === "bad") {
      oscillator.type = "sawtooth";
      oscillator.frequency.setValueAtTime(250, audioCtx.currentTime); // Kalın, uyarıcı "Bızzz"
      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.3); 
    }
  } catch (error) {
    console.warn("Ses motoru için ekrana tıklanması gerekiyor:", error);
  }
};

export const setExerciseMode = (mode) => {
  if (["squat", "pushup", "plank"].includes(mode)) {
    currentExerciseMode = mode;
  }
};

export const initPose = (onResultsCallback) => {
  const Pose = window.Pose;
  if (!Pose) {
    console.error("MediaPipe CDN yüklenemedi!");
    return null;
  }

  const pose = new Pose({ locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}` });

  pose.setOptions({
    modelComplexity: 1, 
    smoothLandmarks: true, 
    enableSegmentation: false, 
    minDetectionConfidence: 0.6, 
    minTrackingConfidence: 0.6
  });

  pose.onResults((results) => {
    const landmarks = results.poseLandmarks;
    let analysisResult = { status: "idle", feedback: "Kadraja girin..." };

    if (landmarks) {
      if (currentExerciseMode === "squat") analysisResult = analyzeSquatForm(landmarks);
      else if (currentExerciseMode === "pushup") analysisResult = analyzePushupForm(landmarks);
      else if (currentExerciseMode === "plank") analysisResult = analyzePlankForm(landmarks);
      
      // YAPAY ZEKA KARAR VERDİĞİ AN SES MOTORUNU TETİKLE!
      playTone(analysisResult.status);
    }
    onResultsCallback(results, analysisResult);
  });
  
  return pose;
};

export const startCamera = (videoElement, poseInstance) => {
  const Camera = window.Camera;
  if (!videoElement || !Camera || !poseInstance) return null;

  // 🚨 PERFORMANS FRENİ (THROTTLE): 30 FPS Kilidi
  let lastFrameTime = 0;
  const TARGET_FPS = 30;
  const FRAME_MIN_TIME = 1000 / TARGET_FPS; // Her kare arası minimum ~33.3 milisaniye

  camera = new Camera(videoElement, {
    onFrame: async () => {
      const now = performance.now();
      // Eğer bir önceki kareden bu yana 33.3ms geçmediyse, bu kareyi atla (İşlemciyi yorma!)
      if (now - lastFrameTime >= FRAME_MIN_TIME) {
        lastFrameTime = now;
        await poseInstance.send({ image: videoElement });
      }
    },
    width: 640, height: 480
  });

  camera.start();
  return camera;
};

export const stopCamera = () => {
  if (camera) { camera.stop(); camera = null; }
};