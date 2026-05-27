import { supabase } from './supabase'
import { KEYS } from './storageKeys'

const ALL_KEYS = Object.values(KEYS)

/**
 * Push all nm_* localStorage keys to the user's row in Supabase.
 * Safe to call without awaiting — silently no-ops if Supabase isn't configured.
 */
export async function pushToCloud() {
  if (!supabase) return { success: false }
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false }

    const data = {}
    for (const key of ALL_KEYS) {
      const val = localStorage.getItem(key)
      if (val !== null) data[key] = val
    }

    const { error } = await supabase
      .from('user_data')
      .upsert({ id: user.id, data, updated_at: new Date().toISOString() })

    return { success: !error, error }
  } catch (e) {
    return { success: false, error: e }
  }
}

/**
 * Pull the user's data from Supabase and write it back to localStorage.
 * Returns { success, empty } — empty means the user has no cloud data yet.
 */
export async function pullFromCloud() {
  if (!supabase) return { success: false }
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false }

    const { data, error } = await supabase
      .from('user_data')
      .select('data')
      .eq('id', user.id)
      .single()

    if (error || !data?.data) return { success: false, empty: true }

    for (const [key, val] of Object.entries(data.data)) {
      if (ALL_KEYS.includes(key) && val !== null) {
        localStorage.setItem(key, val)
      }
    }
    return { success: true }
  } catch (e) {
    return { success: false, error: e }
  }
}

/**
 * Sign the user out: push data first, then clear localStorage and Supabase session.
 */
export async function signOutAndClear() {
  if (!supabase) return
  await pushToCloud()
  await supabase.auth.signOut()
  // Clear all app data from localStorage
  for (const key of ALL_KEYS) {
    localStorage.removeItem(key)
  }
}
