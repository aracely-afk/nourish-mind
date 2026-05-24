import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Droplets, Footprints, Flame, BookOpen, ChevronRight } from 'lucide-react'
import { useProfile } from '../hooks/useProfile'
import { useFoodLog } from '../hooks/useFoodLog'
import { useBiometrics } from '../hooks/useBiometrics'
import { useLessons } from '../hooks/useLessons'
import { useStreak } from '../hooks/useStreak'
import CalorieRing from '../components/ui/CalorieRing'
import { getGreeting, todayStr, formatDateFull } from '../utils/dateHelpers'
import { LESSONS } from '../data/lessonData'
import { LIGHT_CONFIG } from '../utils/trafficLight'

export default function DashboardPage() {
  const { profile } = useProfile()
  const { getDayCalories, getDayCaloriesByLight } = useFoodLog()
  const { getDay } = useBiometrics()
  const { progress, isUnlocked } = useLessons()
  const { streaks } = useStreak()
  const navigate = useNavigate()

  const today = todayStr()
  const consumed = getDayCalories(today)
  const byLight = getDayCaloriesByLight(today)
  const bio = getDay(today)
  const currentLesson = LESSONS.find(l => l.day === Math.min(progress.currentDay, 30)) || LESSONS[0]

  const remaining = Math.max(0, profile.calorieMin - consumed)
  const over = consumed > profile.calorieMax

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="pt-2">
        <p className="text-sm text-gray-500">{formatDateFull(today)}</p>
        <h1 className="text-xl font-bold text-gray-900">{getGreeting()}, {profile.name || 'friend'} 👋</h1>
      </div>

      {/* Calorie Ring */}
      <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-1">
          <h2 className="font-semibold text-gray-800">Today's Calories</h2>
          <button onClick={() => navigate('/log')} className="text-xs text-indigo-600 font-medium flex items-center gap-0.5">
            Log food <ChevronRight size={14} />
          </button>
        </div>
        <div className="flex items-center gap-4">
          <CalorieRing consumed={consumed} min={profile.calorieMin || 1400} max={profile.calorieMax || 1700} size={160} />
          <div className="flex-1 space-y-2">
            <div className="text-sm text-gray-600">
              {over
                ? <span className="text-red-500 font-medium">Over by {(consumed - profile.calorieMax).toLocaleString()} cal</span>
                : remaining > 0
                  ? <span className="text-green-600 font-medium">{remaining.toLocaleString()} cal remaining to minimum</span>
                  : <span className="text-green-600 font-medium">In your range ✓</span>
              }
            </div>
            {/* Traffic light breakdown */}
            {Object.entries(byLight).map(([light, cal]) => cal > 0 ? (
              <div key={light} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: LIGHT_CONFIG[light].color }} />
                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${Math.min((cal/consumed)*100,100)}%`, backgroundColor: LIGHT_CONFIG[light].color }} />
                </div>
                <span className="text-xs text-gray-500 w-12 text-right">{cal} cal</span>
              </div>
            ) : null)}
          </div>
        </div>
      </div>

      {/* Today's Lesson */}
      <button onClick={() => navigate(`/lessons/${currentLesson.day}`)}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl p-4 text-left shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-start gap-3">
          <div className="bg-white/20 rounded-xl p-2 flex-shrink-0">
            <BookOpen size={20} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-indigo-200 text-xs font-medium">Day {currentLesson.day} of 30</span>
              <span className="text-indigo-300 text-xs">· {currentLesson.readTimeMin} min</span>
            </div>
            <p className="font-semibold text-white text-sm leading-tight">{currentLesson.title}</p>
            <p className="text-indigo-200 text-xs mt-0.5 truncate">{currentLesson.subtitle}</p>
          </div>
          <ChevronRight size={18} className="text-indigo-200 flex-shrink-0 mt-0.5" />
        </div>
        <div className="mt-3 flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-white/60 rounded-full" style={{ width: `${(progress.completedLessons.length/30)*100}%` }} />
          </div>
          <span className="text-indigo-200 text-xs">{progress.completedLessons.length}/30</span>
        </div>
      </button>

      {/* Quick Stats */}
      <div className="flex gap-3">
        <StatTile icon={Droplets} label="Water" value={`${bio.waterCups}/8`} sub="cups" color="text-blue-500" bg="bg-blue-50" />
        <StatTile icon={Footprints} label="Steps" value={bio.steps.toLocaleString()} color="text-green-600" bg="bg-green-50" />
        <StatTile icon={Flame} label="Streak" value={`${streaks.currentLoginStreak}d`} sub="days" color="text-orange-500" bg="bg-orange-50" />
      </div>

      {/* Motivation scripture */}
      {currentLesson && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <p className="text-sm text-amber-800 italic leading-relaxed">"{currentLesson.scripture.verse}"</p>
          <p className="text-xs text-amber-600 mt-1 font-medium">— {currentLesson.scripture.reference}</p>
        </div>
      )}
    </div>
  )
}

function StatTile({ icon: Icon, label, value, sub, color, bg }) {
  return (
    <div className="flex-1 bg-white rounded-2xl p-3 border border-gray-100 shadow-sm flex flex-col items-center gap-1">
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${bg}`}>
        <Icon size={16} className={color} />
      </div>
      <span className="text-base font-bold text-gray-900 leading-none">{value}</span>
      <span className="text-[10px] text-gray-500">{label}</span>
    </div>
  )
}
