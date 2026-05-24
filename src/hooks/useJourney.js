import { useCallback } from 'react'
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

export function useJourney() {
  const [journey, setJourney] = useLocalStorage(KEYS.JOURNEY, DEFAULT_JOURNEY)

  const currentJourneyDay = useCallback(() => {
    if (!journey.startDate) return 1
    const start = new Date(journey.startDate)
    const today = new Date()
    const daysSinceStart = Math.floor((today - start) / (1000 * 60 * 60 * 24))
    return Math.max(1, daysSinceStart - journey.pausedDays + 1)
  }, [journey])

  const totalDays = journey.length + journey.extensionDays

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
    const pausedStart = new Date(journey.pausedDate)
    const today = new Date()
    const daysPaused = Math.floor((today - pausedStart) / (1000 * 60 * 60 * 24))
    setJourney(prev => ({
      ...prev,
      isPaused: false,
      pausedDate: null,
      pausedDays: prev.pausedDays + daysPaused,
    }))
  }, [journey, setJourney])

  const extendJourney = useCallback((days) => {
    setJourney(prev => ({ ...prev, extensionDays: prev.extensionDays + days }))
  }, [setJourney])

  // Restart keeps dietStyle, commitmentLevel, length but resets start date
  // Caller is responsible for clearing food log, biometrics, lesson progress
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
