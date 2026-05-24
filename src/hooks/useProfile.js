import { useLocalStorage } from './useLocalStorage'
import { KEYS } from '../utils/storageKeys'

const DEFAULT_PROFILE = {
  name: '',
  age: 30,
  sex: 'female',
  weightKg: 70,
  heightCm: 165,
  activityLevel: 1.375,
  goal: 'lose',
  tdee: 0,
  calorieMin: 0,
  calorieMax: 0,
}

export function useProfile() {
  const [profile, setProfile] = useLocalStorage(KEYS.PROFILE, DEFAULT_PROFILE)
  return { profile, setProfile }
}
