export const ACTIVITY_LEVELS = [
  {
    value: 1.2,
    label: 'Sedentary',
    desc: 'Little to no movement beyond daily life',
    examples: 'Office work, driving, watching TV, reading, gaming — sitting most of the day',
  },
  {
    value: 1.375,
    label: 'Lightly Active',
    desc: 'Light movement 1–3 days/week',
    examples: 'Casual walks, light housework, standing job, gentle stretching, 1–2 yoga classes/week',
  },
  {
    value: 1.55,
    label: 'Moderately Active',
    desc: 'Moderate exercise 3–5 days/week',
    examples: '30–60 min workouts, cycling, swimming, jogging, group fitness classes, active retail or server job',
  },
  {
    value: 1.725,
    label: 'Very Active',
    desc: 'Intense exercise most days',
    examples: 'Daily gym sessions, running 5+ miles, sports teams, personal training clients, construction or labor job',
  },
  {
    value: 1.9,
    label: 'Avid Athlete',
    desc: 'Athlete-level training or heavy physical labor',
    examples: 'Twice-daily training, competitive athletics, military training, farming, warehouse work with heavy lifting',
  },
]

export const GOALS = [
  { value: 'lose',     label: 'Lose Weight',    desc: 'Reduce body fat gradually', emoji: '🔥' },
  { value: 'maintain', label: 'Maintain Weight', desc: 'Keep current weight stable', emoji: '⚖️' },
  { value: 'gain',     label: 'Build Muscle',    desc: 'Gain lean mass over time',   emoji: '💪' },
]

export const COMMITMENT_LEVELS = [
  {
    value: 'building',
    label: 'Building Habits',
    desc: 'Starting fresh and taking it one step at a time',
    emoji: '🌱',
    recommendedDays: 90,
  },
  {
    value: 'ready',
    label: 'Ready to Change',
    desc: 'Committed and ready to make real, lasting changes',
    emoji: '🌿',
    recommendedDays: 120,
  },
  {
    value: 'allin',
    label: 'All In',
    desc: 'Fully dedicated to a complete transformation',
    emoji: '🌳',
    recommendedDays: 180,
  },
]

export const DIET_STYLES = [
  { value: 'standard',      label: 'Balanced',              desc: 'No restrictions — whole foods focus', emoji: '🥗' },
  { value: 'keto',          label: 'Keto',                  desc: 'Very low carb, high fat',             emoji: '🥑' },
  { value: 'paleo',         label: 'Paleo',                 desc: 'Whole foods, no grains or dairy',     emoji: '🥩' },
  { value: 'mediterranean', label: 'Mediterranean',         desc: 'Olive oil, fish, vegetables, legumes',emoji: '🫒' },
  { value: 'macros',        label: 'Macro Counting',        desc: 'Track protein, carbs, and fat',       emoji: '📊' },
  { value: 'intermittent',  label: 'Intermittent Fasting',  desc: 'Time-restricted eating window',       emoji: '⏱️' },
]

export const JOURNEY_LENGTHS = [90, 120, 180]

export function getRecommendedLength(goal, commitment) {
  const base = COMMITMENT_LEVELS.find(c => c.value === commitment)?.recommendedDays || 90
  if (goal === 'lose' && commitment === 'allin') return 180
  if (goal === 'maintain') return Math.min(base, 90)
  return base
}

export function calcBMR({ weightKg, heightCm, age, sex }) {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age
  return sex === 'male' ? base + 5 : base - 161
}

export function calcTDEE(bmr, activityLevel) {
  return Math.round(bmr * activityLevel)
}

// Healthy minimums per medical consensus (NIH / Academy of Nutrition and Dietetics)
export const CALORIE_FLOOR = { female: 1200, male: 1500 }

export function calcCalorieRange(tdee, goal, sex = 'female') {
  const floor = CALORIE_FLOOR[sex] ?? 1200

  let min, max
  if (goal === 'lose')  { min = tdee - 500; max = tdee - 300 }
  else if (goal === 'gain') { min = tdee + 200; max = tdee + 400 }
  else { min = tdee - 100; max = tdee + 100 }

  // Never recommend below the healthy floor
  if (min < floor) {
    min = floor
    if (max < min + 200) max = min + 200  // keep a sensible 200-cal spread
  }

  return { min: Math.round(min), max: Math.round(max) }
}

export function lbsToKg(lbs) { return parseFloat((lbs * 0.453592).toFixed(1)) }
export function kgToLbs(kg)   { return parseFloat((kg * 2.20462).toFixed(1)) }
export function ftInToCm(ft, inches) { return Math.round((ft * 12 + inches) * 2.54) }
export function cmToFtIn(cm) {
  const totalInches = cm / 2.54
  return { ft: Math.floor(totalInches / 12), inches: Math.round(totalInches % 12) }
}

export function calcBMI(weightKg, heightCm) {
  if (!weightKg || !heightCm) return null
  const h = heightCm / 100
  return parseFloat((weightKg / (h * h)).toFixed(1))
}

export function bmiCategory(bmi) {
  if (bmi < 18.5) return { label: 'Underweight', color: '#3b82f6' }
  if (bmi < 25)   return { label: 'Normal weight', color: '#22c55e' }
  if (bmi < 30)   return { label: 'Overweight', color: '#eab308' }
  return { label: 'Obese', color: '#ef4444' }
}
