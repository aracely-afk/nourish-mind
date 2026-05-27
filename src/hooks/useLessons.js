import { useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'
import { useJourney } from './useJourney'
import { KEYS } from '../utils/storageKeys'
import { todayStr } from '../utils/dateHelpers'

const DEFAULT = { currentDay: 1, completedLessons: [], quizScores: {}, lastCompletedDate: null }

export function useLessons() {
  const [progress, setProgress] = useLocalStorage(KEYS.LESSON_PROGRESS, DEFAULT)
  const { currentJourneyDay } = useJourney()

  const isCompleted = useCallback((day) => progress.completedLessons.includes(day), [progress])

  /**
   * A lesson is unlocked when its day number is ≤ the user's current journey day.
   * This lets users catch up on any missed lessons without a one-per-day gate.
   * Previously completed lessons are always re-readable.
   */
  const isUnlocked = useCallback((day) => {
    return day <= currentJourneyDay()
  }, [currentJourneyDay])

  /**
   * True when the lesson is beyond the user's current journey day
   * (i.e. not yet reachable — come back on a future day).
   */
  const isNotYetAvailable = useCallback((day) => {
    return day > currentJourneyDay()
  }, [currentJourneyDay])

  // Alias kept so existing page code doesn't break
  const isWaitingForTomorrow = isNotYetAvailable

  const completeLesson = useCallback((day, quizScore, quizTotal) => {
    setProgress(prev => {
      const completed = prev.completedLessons.includes(day)
        ? prev.completedLessons
        : [...prev.completedLessons, day]
      return {
        ...prev,
        completedLessons: completed,
        currentDay: Math.max(prev.currentDay, day + 1),
        lastCompletedDate: todayStr(),
        quizScores: {
          ...prev.quizScores,
          [day]: { score: quizScore, total: quizTotal, completedAt: new Date().toISOString() },
        },
      }
    })
  }, [setProgress])

  const getQuizScore = useCallback((day) => progress.quizScores[day] || null, [progress])

  return { progress, isCompleted, isUnlocked, isWaitingForTomorrow, isNotYetAvailable, completeLesson, getQuizScore }
}
