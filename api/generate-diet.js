import { readFileSync } from "fs";
import path from "path";

const foodData = JSON.parse(
  readFileSync(path.join(process.cwd(), "src/data/kaggleFood.json"), "utf-8"),
);

function mulberry32(seed) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function fisherYatesShuffle(array, rng) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

const MEAL_SLOTS = ["Sabah", "Ara Öğün", "Öğle", "Ara Öğün", "Akşam"];

const FILTERS = {
  weight_loss: (f) => f.calories < 300,
  muscle_gain: (f) => f.protein > 15,
  endurance: (f) => f.carbs > 20,
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { uid, goal, switchSeed } = req.body ?? {};

    if (!uid) {
      return res.status(400).json({ error: "uid required" });
    }
    if (!FILTERS[goal]) {
      return res.status(400).json({
        error: "goal must be weight_loss | muscle_gain | endurance",
      });
    }

    const seed = Number(switchSeed) || Date.now();
    const filtered = foodData.filter(FILTERS[goal]);

    if (filtered.length < MEAL_SLOTS.length) {
      return res.status(500).json({ error: "Yeterli besin bulunamadı" });
    }

    const rng = mulberry32(seed);
    const shuffled = fisherYatesShuffle(filtered, rng);

    const meals = MEAL_SLOTS.map((type, idx) => {
      const food = shuffled[idx];
      return {
        id: idx + 1,
        type,
        name: food.name,
        calories: food.calories,
        protein: food.protein,
        carbs: food.carbs,
        fat: food.fat,
      };
    });

    return res.status(200).json({ meals });
  } catch (error) {
    console.error("generate-diet error:", error);
    return res.status(500).json({ error: "Sunucu hatası" });
  }
}
