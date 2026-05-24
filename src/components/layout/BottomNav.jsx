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
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200"
         style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="flex items-stretch max-w-lg mx-auto">
        {TABS.map(({ to, icon: Icon, label }) => {
          const isActive = to === '/' ? location.pathname === '/' : location.pathname.startsWith(to)
          return (
            <NavLink
              key={to}
              to={to}
              className={`flex flex-col items-center justify-center flex-1 py-2 gap-0.5 min-h-[56px] transition-colors ${
                isActive ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
              <span className="text-[10px] font-medium leading-none">{label}</span>
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}
