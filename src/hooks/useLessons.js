import { useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'
import { KEYS } from '../utils/storageKeys'
import { todayStr } from '../utils/dateHelpers'

const DEFAULT = { currentDay: 1, completedLessons: [], quizScores: {}, lastCompletedDate: null }

export function useLessons() {
  const [progress, setProgress] = useLocalStorage(KEYS.LESSON_PROGRESS, DEFAULT)

  const isCompleted = useCallback((day) => progress.completedLessons.includes(day), [progress])

  /** True when a lesson can be opened.
   *  - Completed lessons: always accessible (revisit any time)
   *  - Next lesson: accessible only if no lesson was finished today
   *  - Future lessons beyond next: locked
   */
  const isUnlocked = useCallback((day) => {
    // Already completed — always re-readable
    if (day === 1 || progress.completedLessons.includes(day)) return true
    // Next lesson: open only if the daily one-lesson limit hasn't been hit
    if (day === progress.currentDay) {
      return progress.lastCompletedDate !== todayStr()
    }
    return false
  }, [progress])

  /** True when the next lesson exists but is gated until tomorrow */
  const isWaitingForTomorrow = useCallback((day) => {
    return day === progress.currentDay &&
      progress.lastCompletedDate === todayStr() &&
      !progress.completedLessons.includes(day)
  }, [progress])

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

  return { progress, isCompleted, isUnlocked, isWaitingForTomorrow, completeLesson, getQuizScore }
}
