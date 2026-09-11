import { useState, useEffect } from 'react'
import { supabase, recoveryLink, recoveryError } from '../utils/supabase'
import { pullFromCloud, pushToCloud } from '../utils/syncData'

/**
 * Tracks the current Supabase auth session.
 *
 * session === undefined  → still initializing
 * session === null       → not signed in
 * session = object       → signed in
 *
 * On SIGNED_IN:
 *   - If local data exists (returning user, session restore on same device):
 *     push local → cloud to sync any unsaved changes. Do NOT pull — pulling
 *     would overwrite fresh local data with potentially older cloud data.
 *     Supabase fires SIGNED_IN on every session restore (app open), so this
 *     path runs every time the user opens the app while logged in.
 *   - If no local data (new device / localStorage cleared):
 *     pull from cloud, then reload so all hooks read the restored data.
 */
export function useAuth() {
  const [recovering, setRecovering] = useState(recoveryLink || recoveryError)
  const [session, setSession] = useState(undefined)

  useEffect(() => {
    if (!supabase) {
      setSession(null)
      return
    }

    // Resolve initial session immediately
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)

        if (event === 'PASSWORD_RECOVERY') setRecovering(true)
        if (event === 'SIGNED_IN' && !recoveryLink && !recoveryError) {
          const hasLocalData = localStorage.getItem('nm_onboarded') === 'true'

          if (hasLocalData) {
            // Returning user: push local data to cloud to capture any recent
            // changes that may not have synced before the app was closed.
            pushToCloud()
          } else {
            // New device or cleared storage: restore from cloud then reload.
            await pullFromCloud()
            window.location.reload()
          }
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  return {
    session,
    recovering,
    loading: session === undefined,
    user: session?.user ?? null,
  }
}
