import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { Home, UtensilsCrossed, BookOpen, Activity, TrendingUp } from 'lucide-react'

const TABS = [
  { to: '/',        icon: Home,             label: 'Home'    },
  { to: '/log',     icon: UtensilsCrossed,  label: 'Log'     },
  { to: '/lessons', icon: BookOpen,         label: 'Lessons' },
  { to: '/track',   icon: Activity,         label: 'Track'   },
  { to: '/progress',icon: TrendingUp,       label: 'Progress'},
]

export default function BottomNav() {
  const location = useLocation()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100"
         style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="flex items-stretch max-w-lg mx-auto px-1">
        {TABS.map(({ to, icon: Icon, label }) => {
          const isActive = to === '/' ? location.pathname === '/' : location.pathname.startsWith(to)
          return (
            <NavLink
              key={to}
              to={to}
              className="flex flex-col items-center justify-center flex-1 py-2 gap-0.5 min-h-[56px] transition-colors"
            >
              <div className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all ${
                isActive ? 'bg-brand-pale text-brand-primary' : 'text-gray-500 hover:text-gray-700'
              }`}>
                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                <span className={`text-[10px] leading-none font-${isActive ? 'semibold' : 'medium'}`}>{label}</span>
              </div>
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}
