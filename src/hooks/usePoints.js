import { useCallback } from 'react'
import { useFoodLog } from './useFoodLog'
import { useBiometrics } from './useBiometrics'
import { useLessons } from './useLessons'
import { useProfile } from './useProfile'
import { useLocalStorage } from './useLocalStorage'
import { KEYS } from '../utils/storageKeys'

export const DAILY_MAX = 10
export const WEEKLY_REWARD_THRESHOLD = 55

export const REWARD_IDEAS = [
  'A relaxing bubble bath or spa evening at home',
  'New workout gear or activewear',
  'A massage or facial appointment',
  'Buy a book you\'ve been wanting to read',
  'A fun day trip or hike somewhere new',
  'New journal or planner',
  'A fresh bouquet of flowers for yourself',
  'Movie night with your favorite film',
  'A new candle, essential oil, or diffuser',
  'Treat yourself to a manicure or pedicure',
  'Sign up for a class you\'ve been curious about',
  'New music playlist + dance session',
  'Cozy self-care basket (face mask, tea, etc.)',
  'A long walk in a park or nature trail',
  'New kitchen gadget that supports your goals',
]

export function usePoints() {
  const { getDayLog, getDayCalories } = useFoodLog()
  const { getDay } = useBiometrics()
  const { progress: lessonProgress } = useLessons()
  const { profile } = useProfile()
  const [weightLog] = useLocalStorage(KEYS.WEIGHT_LOG, {})

  const getDayPoints = useCallback((date) => {
    const log = getDayLog(date)
    const bio = getDay(date)
    const totalCal = getDayCalories(date)
    const breakdown = {}
    let points = 0

    // Meals: 1 pt any meal, +1 for all 4
    const MEALS = ['breakfast', 'lunch', 'dinner', 'snacks']
    const loggedCount = MEALS.filter(m => log[m]?.length > 0).length
    if (loggedCount >= 1) { breakdown.anyMeal = 1; points += 1 }
    if (loggedCount === 4) { breakdown.allMeals = 1; points += 1 }

    // In range: 2 pts
    if (totalCal > 0 && totalCal >= (profile.calorieMin || 0) && totalCal <= (profile.calorieMax || 9999)) {
      breakdown.inRange = 2; points += 2
    }

    // Water: 1 pt for 6+ cups
    if (bio.waterCups >= 6) { breakdown.water = 1; points += 1 }

    // Steps: 1 pt for 7,500+
    if (bio.steps >= 7500) { breakdown.steps = 1; points += 1 }

    // Exercise: 1 pt if explicitly logged OR steps >= 5,000 (walking 2+ miles counts)
    if (bio.exercise?.length > 0 || bio.steps >= 5000) { breakdown.exercise = 1; points += 1 }

    // Lesson completed today: 2 pts
    const completedToday = Object.values(lessonProgress.quizScores || {}).some(s =>
      s.completedAt && s.completedAt.startsWith(date)
    )
    if (completedToday) { breakdown.lesson = 2; points += 2 }

    return { points: Math.min(points, DAILY_MAX), breakdown }
  }, [getDayLog, getDayCalories, getDay, profile, lessonProgress])

  // dates: array of date strings for the week
  const getWeekPoints = useCallback((dates) => {
    return dates.reduce((total, date) => total + getDayPoints(date).points, 0)
  }, [getDayPoints])

  // +1 bonus if user weighed in any day this week
  const getWeeklyWeighInBonus = useCallback((dates) => {
    return dates.some(d => {
      const bio = getDay(d)
      return bio.weightKg !== null && bio.weightKg !== undefined
    }) ? 1 : 0
  }, [getDay])

  const getWeekTotal = useCallback((dates) => {
    return getWeekPoints(dates) + getWeeklyWeighInBonus(dates)
  }, [getWeekPoints, getWeeklyWeighInBonus])

  const hasEarnedReward = useCallback((dates) => {
    return getWeekTotal(dates) >= WEEKLY_REWARD_THRESHOLD
  }, [getWeekTotal])

  const getRandomReward = useCallback(() => {
    return REWARD_IDEAS[Math.floor(Math.random() * REWARD_IDEAS.length)]
  }, [])

  return {
    getDayPoints,
    getWeekPoints,
    getWeeklyWeighInBonus,
    getWeekTotal,
    hasEarnedReward,
    getRandomReward,
    DAILY_MAX,
    WEEKLY_REWARD_THRESHOLD,
  }
}
