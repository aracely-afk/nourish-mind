import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useLocalStorage } from './hooks/useLocalStorage'
import { KEYS } from './utils/storageKeys'
import AppShell from './components/layout/AppShell'
import OnboardingPage from './pages/OnboardingPage'
import DashboardPage from './pages/DashboardPage'
import FoodLogPage from './pages/FoodLogPage'
import FoodExplorerPage from './pages/FoodExplorerPage'
import LessonsPage from './pages/LessonsPage'
import LessonDetailPage from './pages/LessonDetailPage'
import BiometricsPage from './pages/BiometricsPage'
import ProgressPage from './pages/ProgressPage'

export default function App() {
  const [onboarded] = useLocalStorage(KEYS.ONBOARDED, false)

  return (
    <BrowserRouter>
      <Routes>
        {!onboarded ? (
          <Route path="*" element={<OnboardingPage />} />
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
