import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabase'
import { pullFromCloud } from '../utils/syncData'

/**
 * Tracks the current Supabase auth session.
 *
 * session === undefined  → still initializing
 * session === null       → not signed in
 * session = object       → signed in
 *
 * On SIGNED_IN: pulls data from cloud, then reloads so all hooks
 * re-initialize from the freshly-written localStorage.
 */
export function useAuth() {
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

        if (event === 'SIGNED_IN') {
          // Pull cloud data → reload so all hooks read fresh localStorage
          await pullFromCloud()
          window.location.reload()
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  return {
    session,
    loading: session === undefined,
    user: session?.user ?? null,
  }
}
