import { useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'
import { KEYS } from '../utils/storageKeys'
import { todayStr } from '../utils/dateHelpers'

const EMPTY_DAY = () => ({ breakfast: [], lunch: [], dinner: [], snacks: [] })

export function useFoodLog() {
  const [log, setLog] = useLocalStorage(KEYS.FOOD_LOG, {})

  const getDayLog = useCallback((dateStr = todayStr()) => {
    return log[dateStr] || EMPTY_DAY()
  }, [log])

  const addEntry = useCallback((dateStr, meal, entry) => {
    setLog(prev => {
      const day = prev[dateStr] || EMPTY_DAY()
      return {
        ...prev,
        [dateStr]: {
          ...day,
          [meal]: [...day[meal], { ...entry, id: crypto.randomUUID(), loggedAt: new Date().toISOString() }],
        },
      }
    })
  }, [setLog])

  const removeEntry = useCallback((dateStr, meal, entryId) => {
    setLog(prev => {
      const day = prev[dateStr] || EMPTY_DAY()
      return {
        ...prev,
        [dateStr]: {
          ...day,
          [meal]: day[meal].filter(e => e.id !== entryId),
        },
      }
    })
  }, [setLog])

  const getDayCalories = useCallback((dateStr = todayStr()) => {
    const day = getDayLog(dateStr)
    const all = [...day.breakfast, ...day.lunch, ...day.dinner, ...day.snacks]
    return all.reduce((sum, e) => sum + (e.calories || 0), 0)
  }, [getDayLog])

  const getDayCaloriesByLight = useCallback((dateStr = todayStr()) => {
    const day = getDayLog(dateStr)
    const all = [...day.breakfast, ...day.lunch, ...day.dinner, ...day.snacks]
    return all.reduce((acc, e) => {
      const light = e.trafficLight || 'green'
      acc[light] = (acc[light] || 0) + (e.calories || 0)
      return acc
    }, { green: 0, yellow: 0, orange: 0 })
  }, [getDayLog])

  return { log, getDayLog, addEntry, removeEntry, getDayCalories, getDayCaloriesByLight }
}
