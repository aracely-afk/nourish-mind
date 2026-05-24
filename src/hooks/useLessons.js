import { useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'
import { KEYS } from '../utils/storageKeys'

const DEFAULT = { currentDay: 1, completedLessons: [], quizScores: {} }

export function useLessons() {
  const [progress, setProgress] = useLocalStorage(KEYS.LESSON_PROGRESS, DEFAULT)

  const isCompleted = useCallback((day) => progress.completedLessons.includes(day), [progress])

  const isUnlocked = useCallback((day) => {
    if (day === 1) return true
    return progress.completedLessons.includes(day - 1)
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
        quizScores: {
          ...prev.quizScores,
          [day]: { score: quizScore, total: quizTotal, completedAt: new Date().toISOString() },
        },
      }
    })
  }, [setProgress])

  const getQuizScore = useCallback((day) => progress.quizScores[day] || null, [progress])

  return { progress, isCompleted, isUnlocked, completeLesson, getQuizScore }
}
