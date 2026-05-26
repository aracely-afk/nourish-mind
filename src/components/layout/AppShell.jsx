import React from 'react'
import { Outlet } from 'react-router-dom'
import BottomNav from './BottomNav'
import { useStreak } from '../../hooks/useStreak'

export default function AppShell() {
  useStreak()
  return (
    <div className="flex flex-col min-h-[100dvh] bg-brand-warm max-w-lg mx-auto relative">
      <main className="flex-1 overflow-y-auto pb-[calc(56px+env(safe-area-inset-bottom))] no-scrollbar">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
