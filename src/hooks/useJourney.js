import { useCallback, useEffect } from 'react'
import { useLocalStorage } from './useLocalStorage'
import { KEYS } from '../utils/storageKeys'
import { todayStr } from '../utils/dateHelpers'

const DEFAULT_JOURNEY = {
  length: 90,
  startDate: null,
  commitmentLevel: 'building',
  dietStyle: 'standard',
  isPaused: false,
  pausedDate: null,
  pausedDays: 0,
  extensionDays: 0,
  weightTrackingEnabled: false,
  edScreeningAnswer: null,
}

/**
 * Count calendar days between a stored date string and today, using LOCAL dates.
 *
 * date-only strings like "2026-05-27" are parsed by new Date() as UTC midnight,
 * which causes off-by-one errors for US users. Appending 'T00:00:00' forces
 * local-midnight parsing. We then compare calendar dates (ignoring clock time)
 * so DST transitions never affect the day count.
 */
function calendarDaysSince(startDateStr) {
  if (!startDateStr) return 0
  const start  = new Date(startDateStr + 'T00:00:00')
  const today  = new Date()
  // Strip clock time from both so we're comparing pure calendar days
  const s = new Date(start.getFullYear(), start.getMonth(), start.getDate())
  const t = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  return Math.max(0, Math.floor((t - s) / (1000 * 60 * 60 * 24)))
}

export function useJourney() {
  const [journey, setJourney] = useLocalStorage(KEYS.JOURNEY, DEFAULT_JOURNEY)

  /**
   * Auto-heal: if startDate is missing but lessons have already been completed
   * (can happen when onboarding was skipped or data was partially lost), infer
   * the start date from when the earliest quiz was submitted.
   *
   * This runs once on mount (guarded by journey.startDate dependency) and
   * writes the inferred date back to localStorage so future calls are correct.
   *
   * Day progression is purely calendar-based — midnight advances the day,
   * regardless of points or tasks earned.
   */
  useEffect(() => {
    if (journey.startDate) return // already set, nothing to do

    try {
      const lp = JSON.parse(localStorage.getItem(KEYS.LESSON_PROGRESS) || '{}')
      const scores = Object.values(lp.quizScores || {})
      if (scores.length === 0) return

      // Find the earliest quiz completion timestamp
      const earliest = scores
        .map(s => s.completedAt)
        .filter(Boolean)
        .sort()[0]
      if (!earliest) return

      // Convert the UTC ISO timestamp to a LOCAL date string
      const d = new Date(earliest)
      const localDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

      setJourney(prev => prev.startDate ? prev : {
        ...DEFAULT_JOURNEY,
        ...prev,
        startDate: localDate,
      })
    } catch (e) { /* ignore parse errors */ }
  }, [journey.startDate, setJourney])

  /**
   * The current journey day advances at midnight, calendar-day style.
   * Day 1 = the calendar day the user tapped "Begin My Journey".
   * Day 2 = the next calendar day (midnight), regardless of tasks completed.
   * No points, no quiz completion, no food log required to advance.
   */
  const currentJourneyDay = useCallback(() => {
    if (!journey.startDate) return 1
    const days = calendarDaysSince(journey.startDate)
    return Math.max(1, days - (journey.pausedDays || 0) + 1)
  }, [journey])

  const totalDays = journey.length + (journey.extensionDays || 0)

  const daysRemaining = useCallback(() => {
    return Math.max(0, totalDays - currentJourneyDay() + 1)
  }, [totalDays, currentJourneyDay])

  const journeyPhase = useCallback(() => {
    const day = currentJourneyDay()
    if (day <= 30) return 1
    if (day <= 60) return 2
    return 3
  }, [currentJourneyDay])

  const pauseJourney = useCallback(() => {
    if (journey.isPaused) return
    setJourney(prev => ({ ...prev, isPaused: true, pausedDate: todayStr() }))
  }, [journey.isPaused, setJourney])

  const resumeJourney = useCallback(() => {
    if (!journey.isPaused || !journey.pausedDate) return
    const daysPaused = calendarDaysSince(journey.pausedDate)
    setJourney(prev => ({
      ...prev,
      isPaused: false,
      pausedDate: null,
      pausedDays: (prev.pausedDays || 0) + daysPaused,
    }))
  }, [journey, setJourney])

  const extendJourney = useCallback((days) => {
    setJourney(prev => ({ ...prev, extensionDays: (prev.extensionDays || 0) + days }))
  }, [setJourney])

  const restartJourney = useCallback(() => {
    setJourney(prev => ({
      ...prev,
      startDate: todayStr(),
      isPaused: false,
      pausedDate: null,
      pausedDays: 0,
      extensionDays: 0,
    }))
  }, [setJourney])

  const updateJourney = useCallback((updates) => {
    setJourney(prev => ({ ...prev, ...updates }))
  }, [setJourney])

  const initJourney = useCallback((settings) => {
    setJourney({
      ...DEFAULT_JOURNEY,
      ...settings,
      startDate: todayStr(),
    })
  }, [setJourney])

  return {
    journey,
    currentJourneyDay,
    totalDays,
    daysRemaining,
    journeyPhase,
    pauseJourney,
    resumeJourney,
    extendJourney,
    restartJourney,
    updateJourney,
    initJourney,
  }
}
