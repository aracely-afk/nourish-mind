import { useEffect } from 'react'
import { useLocalStorage } from './useLocalStorage'
import { KEYS } from '../utils/storageKeys'
import { todayStr, addDays } from '../utils/dateHelpers'

const DEFAULT = { currentLoginStreak: 0, longestLoginStreak: 0, currentLessonStreak: 0, lastLessonDate: null, lastLoginDate: null }

export function useStreak() {
  const [streaks, setStreaks] = useLocalStorage(KEYS.STREAKS, DEFAULT)

  useEffect(() => {
    const today = todayStr()
    if (streaks.lastLoginDate === today) return

    setStreaks(prev => {
      const yesterday = addDays(today, -1)
      const continued = prev.lastLoginDate === yesterday
      const current = continued ? prev.currentLoginStreak + 1 : 1
      return {
        ...prev,
        lastLoginDate: today,
        currentLoginStreak: current,
        longestLoginStreak: Math.max(prev.longestLoginStreak, current),
      }
    })
  }, []) // intentionally run once on mount

  const recordLessonComplete = () => {
    const today = todayStr()
    setStreaks(prev => {
      if (prev.lastLessonDate === today) return prev
      const yesterday = addDays(today, -1)
      const continued = prev.lastLessonDate === yesterday
      const current = continued ? prev.currentLessonStreak + 1 : 1
      return { ...prev, lastLessonDate: today, currentLessonStreak: current }
    })
  }

  return { streaks, recordLessonComplete }
}
