import { useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'
import { KEYS } from '../utils/storageKeys'
import { todayStr } from '../utils/dateHelpers'

const EMPTY_DAY = () => ({ steps: 0, waterCups: 0, weightKg: null, exercise: [] })

export function useBiometrics() {
  const [data, setData] = useLocalStorage(KEYS.BIOMETRICS, {})

  const getDay = useCallback((dateStr = todayStr()) => {
    return data[dateStr] || EMPTY_DAY()
  }, [data])

  const updateDay = useCallback((dateStr, updates) => {
    setData(prev => ({
      ...prev,
      [dateStr]: { ...(prev[dateStr] || EMPTY_DAY()), ...updates },
    }))
  }, [setData])

  const addExercise = useCallback((dateStr, entry) => {
    setData(prev => {
      const day = prev[dateStr] || EMPTY_DAY()
      return {
        ...prev,
        [dateStr]: {
          ...day,
          exercise: [...day.exercise, { ...entry, id: crypto.randomUUID(), loggedAt: new Date().toISOString() }],
        },
      }
    })
  }, [setData])

  const removeExercise = useCallback((dateStr, id) => {
    setData(prev => {
      const day = prev[dateStr] || EMPTY_DAY()
      return {
        ...prev,
        [dateStr]: { ...day, exercise: day.exercise.filter(e => e.id !== id) },
      }
    })
  }, [setData])

  return { data, getDay, updateDay, addExercise, removeExercise }
}
