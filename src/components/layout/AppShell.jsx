import React from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import BottomNav from './BottomNav'
import { useStreak } from '../../hooks/useStreak'
import { useJourney } from '../../hooks/useJourney'

export default function AppShell() {
  useStreak()
  const { journey, currentJourneyDay, daysRemaining } = useJourney()
  const navigate = useNavigate()

  const journeyDay = journey.startDate ? currentJourneyDay() : 1
  const totalDays = journey.startDate ? (journey.length + (journey.extensionDays || 0)) : 90
  const pct = Math.min((journeyDay / totalDays) * 100, 100)

  return (
    <div className="flex flex-col min-h-[100dvh] bg-brand-warm max-w-lg mx-auto relative">
      {/* Persistent journey bar */}
      {journey.startDate && (
        <button
          onClick={() => navigate('/')}
          className="sticky top-0 z-20 w-full bg-[#1f2933] px-4 py-2 flex items-center gap-3"
          style={{ paddingTop: 'max(0.5rem, env(safe-area-inset-top))' }}
        >
          <span className="text-[#D4AF37] text-xs font-bold whitespace-nowrap">Day {journeyDay}</span>
          <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-[#D4AF37] rounded-full transition-all" style={{ width: `${pct}%` }} />
          </div>
          <span className="text-white/50 text-xs whitespace-nowrap">{daysRemaining()}d left</span>
        </button>
      )}
      <main className="flex-1 overflow-y-auto pb-[calc(56px+env(safe-area-inset-bottom))] no-scrollbar">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
