export const ACTIVITY_LEVELS = [
  { value: 1.2,   label: 'Sedentary',         desc: 'Desk job, little or no exercise' },
  { value: 1.375, label: 'Lightly Active',     desc: 'Light exercise 1-3 days/week' },
  { value: 1.55,  label: 'Moderately Active',  desc: 'Moderate exercise 3-5 days/week' },
  { value: 1.725, label: 'Very Active',         desc: 'Hard exercise 6-7 days/week' },
  { value: 1.9,   label: 'Extra Active',        desc: 'Physical job or twice-daily training' },
]

export const GOALS = [
  { value: 'lose',     label: 'Lose Weight',    desc: 'Reduce body fat gradually', emoji: '🔥' },
  { value: 'maintain', label: 'Maintain Weight', desc: 'Keep current weight stable',  emoji: '⚖️' },
  { value: 'gain',     label: 'Build Muscle',    desc: 'Gain lean mass over time',   emoji: '💪' },
]

export function calcBMR({ weightKg, heightCm, age, sex }) {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age
  return sex === 'male' ? base + 5 : base - 161
}

export function calcTDEE(bmr, activityLevel) {
  return Math.round(bmr * activityLevel)
}

export function calcCalorieRange(tdee, goal) {
  if (goal === 'lose')     return { min: tdee - 500, max: tdee - 300 }
  if (goal === 'gain')     return { min: tdee + 200, max: tdee + 400 }
  return { min: tdee - 100, max: tdee + 100 }
}

export function lbsToKg(lbs) { return parseFloat((lbs * 0.453592).toFixed(1)) }
export function kgToLbs(kg)   { return parseFloat((kg * 2.20462).toFixed(1)) }
export function ftInToCm(ft, inches) { return Math.round((ft * 12 + inches) * 2.54) }
export function cmToFtIn(cm) {
  const totalInches = cm / 2.54
  return { ft: Math.floor(totalInches / 12), inches: Math.round(totalInches % 12) }
}
