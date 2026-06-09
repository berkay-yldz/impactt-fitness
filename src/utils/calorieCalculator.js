/**
 * Kalori ve makro hesaplama yardimcilari.
 * Formul: Mifflin-St Jeor (en guvenilir BMR formul).
 * BMR -> TDEE (aktivite faktoru) -> Hedef sapmasi (kilo ver / al / sabit).
 */

const calculateBMR = ({ weight, height, age, gender }) => {
  const base = 10 * weight + 6.25 * height - 5 * age;
  if (gender === "male") return base + 5;
  if (gender === "female") return base - 161;
  // Belirtilmemis: erkek/kadin formul ortalamasi (~ -78)
  return base - 78;
};

const ACTIVITY_FACTOR = {
  beginner: 1.375,
  intermediate: 1.55,
  advanced: 1.725,
};

// Hedef -> gunluk kalori sapmasi
const GOAL_ADJUSTMENT = {
  weight_loss: -500,
  endurance: 0,
  muscle_gain: 300,
};

// Nutrition.jsx'teki Turkce buton etiketleri -> internal anahtar
const GOAL_LABEL_MAP = {
  "Kilo Ver": "weight_loss",
  "Kondisyon": "endurance",
  "Kas Yap": "muscle_gain",
};

export const GOAL_DESCRIPTIONS = {
  weight_loss: "Gunluk -500 kcal acik (haftada ~0.5 kg)",
  endurance: "Sabit kalori (kondisyonu koru)",
  muscle_gain: "Gunluk +300 kcal fazla (saglikli kas kazanim)",
};

/**
 * Profil bilgilerine ve aktif hedefe gore gunluk kalori ve makro hedefi hesapla.
 * @param {Object} profile - { weight, height, age, gender, programLevel, fitnessGoal }
 * @param {string} [activeGoalLabel] - "Kilo Ver" / "Kas Yap" / "Kondisyon"; verilmezse profile.fitnessGoal kullanilir
 * @returns {Object|null} { bmr, tdee, target, goalKey, macros: { protein, carbs, fat } }
 */
export const calculateCalorieTarget = (profile, activeGoalLabel) => {
  if (!profile?.weight || !profile?.height || !profile?.age) return null;

  const bmr = calculateBMR({
    weight: Number(profile.weight),
    height: Number(profile.height),
    age: Number(profile.age),
    gender: profile.gender,
  });

  const factor = ACTIVITY_FACTOR[profile.programLevel] || 1.55;
  const tdee = bmr * factor;

  const goalKey =
    GOAL_LABEL_MAP[activeGoalLabel] || profile.fitnessGoal || "endurance";
  const target = tdee + (GOAL_ADJUSTMENT[goalKey] || 0);

  // Makro dagilim: Protein 2g/kg, Yag toplam kcal'in %25, Karb kalan
  const proteinG = Math.round(Number(profile.weight) * 2);
  const proteinKcal = proteinG * 4;
  const fatKcal = target * 0.25;
  const fatG = Math.round(fatKcal / 9);
  const carbKcal = target - proteinKcal - fatKcal;
  const carbG = Math.max(0, Math.round(carbKcal / 4));

  return {
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    target: Math.round(target),
    goalKey,
    macros: { protein: proteinG, carbs: carbG, fat: fatG },
  };
};
