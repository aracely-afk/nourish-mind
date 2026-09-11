import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

/**
 * Supabase client — null when env vars are not configured.
 * All auth/sync code guards on this being non-null so the app
 * works in local-only mode during development / before setup.
 */
export const recoveryLink = new URLSearchParams(window.location.hash.slice(1)).get('type') === 'recovery'
export const recoveryError = new URLSearchParams(window.location.hash.slice(1)).has('error')

export const supabase = (url && key) ? createClient(url, key) : null
