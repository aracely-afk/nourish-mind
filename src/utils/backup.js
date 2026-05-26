import { KEYS } from './storageKeys'

const ALL_KEYS = Object.values(KEYS)

/**
 * Encode all localStorage nm_* data into a single portable backup string.
 * Uses base64 over a JSON payload so it survives copy/paste without corruption.
 */
export function generateBackup() {
  const data = {}
  for (const key of ALL_KEYS) {
    try {
      const val = window.localStorage.getItem(key)
      if (val !== null) data[key] = val
    } catch {}
  }
  const payload = JSON.stringify({ v: 1, ts: Date.now(), d: data })
  // encodeURIComponent/escape handles emoji and non-ASCII chars in names
  try {
    return btoa(unescape(encodeURIComponent(payload)))
  } catch {
    return btoa(payload)
  }
}

/**
 * Parse a backup string and return { data, name, ts } or null if invalid.
 */
export function parseBackup(code) {
  try {
    const raw = decodeURIComponent(escape(atob(code.trim())))
    const payload = JSON.parse(raw)
    if (!payload.d) return null
    const profileRaw = payload.d[KEYS.PROFILE]
    const profile = profileRaw ? JSON.parse(profileRaw) : null
    const lessonRaw = payload.d[KEYS.LESSON_PROGRESS]
    const lessons = lessonRaw ? JSON.parse(lessonRaw) : null
    return {
      data: payload.d,
      name: profile?.name || null,
      lessonsCompleted: lessons?.completedLessons?.length ?? 0,
      currentDay: lessons?.currentDay ?? 1,
      ts: payload.ts,
    }
  } catch {
    return null
  }
}

/**
 * Write all keys from a backup string back to localStorage.
 * Returns true on success, false on invalid code.
 */
export function restoreBackup(code) {
  const parsed = parseBackup(code)
  if (!parsed) return false
  for (const [key, val] of Object.entries(parsed.data)) {
    if (ALL_KEYS.includes(key)) {
      try {
        window.localStorage.setItem(key, val)
      } catch {}
    }
  }
  return true
}
