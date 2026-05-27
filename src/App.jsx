import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useLocalStorage } from './hooks/useLocalStorage'
import { useAuth } from './hooks/useAuth'
import { supabase } from './utils/supabase'
import { pushToCloud, pullFromCloud } from './utils/syncData'
import { KEYS } from './utils/storageKeys'
import AppShell from './components/layout/AppShell'
import AuthPage from './pages/AuthPage'
import OnboardingPage from './pages/OnboardingPage'
import DashboardPage from './pages/DashboardPage'
import FoodLogPage from './pages/FoodLogPage'
import FoodExplorerPage from './pages/FoodExplorerPage'
import LessonsPage from './pages/LessonsPage'
import LessonDetailPage from './pages/LessonDetailPage'
import BiometricsPage from './pages/BiometricsPage'
import ProgressPage from './pages/ProgressPage'

export default function App() {
  const [onboarded, setOnboarded] = useLocalStorage(KEYS.ONBOARDED, false)
  const { session, loading } = useAuth()

  // ── Periodic cloud sync (every 2 min while signed in) ──
  useEffect(() => {
    if (!supabase || !session) return

    // Push on tab hide (user switches apps / closes browser)
    function onHide() {
      if (document.visibilityState === 'hidden') pushToCloud()
    }
    document.addEventListener('visibilitychange', onHide)

    // Push every 2 minutes
    const interval = setInterval(pushToCloud, 2 * 60 * 1000)

    return () => {
      document.removeEventListener('visibilitychange', onHide)
      clearInterval(interval)
    }
  }, [session])

  // ── If user has a valid session but no local data, pull from cloud ──
  // (handles: opened on a new device, or localStorage was cleared)
  useEffect(() => {
    if (!supabase || !session || onboarded) return
    pullFromCloud().then(result => {
      if (result.success) window.location.reload()
    })
  }, [session, onboarded])

  // ── No Supabase configured → original local-only behavior ──
  if (!supabase) {
    return (
      <BrowserRouter>
        <Routes>
          {!onboarded ? (
            <Route path="*" element={<OnboardingPage onFinish={() => setOnboarded(true)} />} />
          ) : (
            <Route element={<AppShell />}>
              <Route index element={<DashboardPage />} />
              <Route path="log" element={<FoodLogPage />} />
              <Route path="explore" element={<FoodExplorerPage />} />
              <Route path="lessons" element={<LessonsPage />} />
              <Route path="lessons/:day" element={<LessonDetailPage />} />
              <Route path="track" element={<BiometricsPage />} />
              <Route path="progress" element={<ProgressPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          )}
        </Routes>
      </BrowserRouter>
    )
  }

  // ── Supabase configured ──

  // Still resolving the initial session
  if (loading) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center"
           style={{ background: 'linear-gradient(to bottom, #1f2933 0%, #5e6b5a 100%)' }}>
        <div className="text-center">
          <img src="/icon.png" alt="" className="w-16 h-16 object-contain mx-auto mb-4 animate-pulse"
               onError={e => { e.target.style.display = 'none' }} />
          <p className="text-[#D4AF37] font-brand text-lg">NourishMind</p>
        </div>
      </div>
    )
  }

  // Not signed in → show auth screen
  if (!session) {
    return <AuthPage />
  }

  // Signed in → gate on onboarding
  return (
    <BrowserRouter>
      <Routes>
        {!onboarded ? (
          <Route path="*" element={<OnboardingPage onFinish={() => setOnboarded(true)} />} />
        ) : (
          <Route element={<AppShell />}>
            <Route index element={<DashboardPage />} />
            <Route path="log" element={<FoodLogPage />} />
            <Route path="explore" element={<FoodExplorerPage />} />
            <Route path="lessons" element={<LessonsPage />} />
            <Route path="lessons/:day" element={<LessonDetailPage />} />
            <Route path="track" element={<BiometricsPage />} />
            <Route path="progress" element={<ProgressPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        )}
      </Routes>
    </BrowserRouter>
  )
}
