import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Droplets, Footprints, Flame, BookOpen, ChevronRight, CheckCircle, Gift, Settings } from 'lucide-react'
import { useProfile } from '../hooks/useProfile'
import { useFoodLog } from '../hooks/useFoodLog'
import { useBiometrics } from '../hooks/useBiometrics'
import { useLessons } from '../hooks/useLessons'
import { useStreak } from '../hooks/useStreak'
import { useJourney } from '../hooks/useJourney'
import { usePoints } from '../hooks/usePoints'
import { WEEKLY_REWARD_THRESHOLD } from '../hooks/usePoints'
import CalorieRing from '../components/ui/CalorieRing'
import BottomSheet from '../components/ui/BottomSheet'
import { getGreeting, todayStr, formatDateFull } from '../utils/dateHelpers'
import { LESSONS } from '../data/lessonData'
import { LIGHT_CONFIG } from '../utils/trafficLight'

function getThisWeekDays() {
  const today = new Date()
  const dow = today.getDay()
  const monday = new Date(today)
  monday.setDate(today.getDate() - (dow === 0 ? 6 : dow - 1))
  const days = []
  for (let i = 0; i <= 6; i++) {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    if (d <= today) days.push(d.toISOString().slice(0, 10))
  }
  return days
}

export default function DashboardPage() {
  const { profile } = useProfile()
  const { getDayCalories, getDayCaloriesByLight } = useFoodLog()
  const { getDay } = useBiometrics()
  const { progress } = useLessons()
  const { streaks } = useStreak()
  const { journey, currentJourneyDay, daysRemaining } = useJourney()
  const { getDayPoints, getWeekTotal, getWeeklyWeighInBonus, hasEarnedReward, getRandomReward } = usePoints()
  const navigate = useNavigate()
  const [rewardSheet, setRewardSheet] = useState(false)
  const [completeDaySheet, setCompleteDaySheet] = useState(false)
  const [rewardIdea] = useState(() => getRandomReward())

  const today = todayStr()
  const consumed = getDayCalories(today)
  const byLight = getDayCaloriesByLight(today)
  const bio = getDay(today)
  const currentLesson = LESSONS.find(l => l.day === Math.min(progress.currentDay, 90)) || LESSONS[0]

  const remaining = Math.max(0, profile.calorieMin - consumed)
  const over = consumed > profile.calorieMax
  const inRange = consumed >= profile.calorieMin && consumed <= profile.calorieMax

  const { points: todayPts, breakdown } = getDayPoints(today)
  const weekDays = getThisWeekDays()
  const weekTotal = getWeekTotal(weekDays)
  const weekBonus = getWeeklyWeighInBonus(weekDays)
  const weekEarned = hasEarnedReward(weekDays)
  const journeyDay = journey.startDate ? currentJourneyDay() : 1
  const totalDays = journey.length + (journey.extensionDays || 0)

  const tasks = [
    { emoji: '🍽️', label: 'Meals',    done: (breakdown.anyMeal || 0) + (breakdown.allMeals || 0) > 0 },
    { emoji: '📊', label: 'In Range', done: (breakdown.inRange || 0) > 0 },
    { emoji: '📖', label: 'Lesson',   done: (breakdown.lesson || 0) > 0 },
    { emoji: '💧', label: 'Water',    done: (breakdown.water || 0) > 0 },
    { emoji: '👟', label: 'Steps',    done: (breakdown.steps || 0) > 0 },
    { emoji: '💪', label: 'Exercise', done: (breakdown.exercise || 0) > 0 },
  ]
  const tasksDone = tasks.filter(t => t.done).length

  return (
    <div className="pb-8">
      {/* Daily Verse — first thing on screen */}
      {currentLesson && (
        <div className="bg-gradient-to-br from-[#1f2933] to-[#2d3b47] px-6 py-5 text-center"
             style={{ paddingTop: 'max(1.25rem, env(safe-area-inset-top))' }}>
          <p className="text-[#f5f6f8]/85 text-sm italic leading-relaxed font-display">
            "{currentLesson.scripture.verse}"
          </p>
          <p className="text-[#D4AF37] text-xs font-medium mt-2">— {currentLesson.scripture.reference}</p>
        </div>
      )}

      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="pt-1 flex items-start justify-between">
          <div className="flex items-center gap-2">
            <img src="/icon.png" alt="" className="w-9 h-9 object-contain flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-500">{formatDateFull(today)}</p>
              <h1 className="text-xl font-bold text-gray-900 font-brand">{getGreeting()}, {profile.name || 'friend'} 👋</h1>
            </div>
          </div>
          <button onClick={() => navigate('/progress')}
                  className="p-2 bg-white rounded-xl border border-gray-100 shadow-sm text-gray-400 hover:text-brand-primary transition-colors mt-1">
            <Settings size={18} />
          </button>
        </div>

        {/* Daily Progress */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="font-semibold text-gray-800 text-sm">
                {journey.startDate ? `Day ${journeyDay} of ${totalDays}` : "Today's Progress"}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">{tasksDone} of 6 goals done today</p>
            </div>
            <span className="text-2xl font-bold text-brand-primary">
              {todayPts}<span className="text-sm font-normal text-gray-400">/10</span>
            </span>
          </div>
          <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden mb-4">
            <div className="h-full bg-gradient-to-r from-[#4B2E83] to-[#D4AF37] rounded-full transition-all"
                 style={{ width: `${(todayPts / 10) * 100}%` }} />
          </div>
          <div className="grid grid-cols-6 gap-1.5">
            {tasks.map(task => (
              <div key={task.label}
                   className={`flex flex-col items-center gap-1 py-2 rounded-xl transition-colors ${task.done ? 'bg-green-50' : 'bg-gray-50'}`}>
                <span className="text-base">{task.emoji}</span>
                <span className="text-[9px] text-gray-500 leading-tight text-center">{task.label}</span>
                {task.done
                  ? <CheckCircle size={11} className="text-green-500" />
                  : <div className="w-2.5 h-2.5 rounded-full border border-gray-300" />}
              </div>
            ))}
          </div>

          {/* Weekly reward */}
          {weekEarned && (
            <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between">
              <span className="text-xs text-gray-500">🎉 Weekly reward unlocked! ({weekTotal} pts)</span>
              <button onClick={() => setRewardSheet(true)}
                      className="flex items-center gap-1 bg-[#D4AF37] text-[#2d1a5e] text-xs font-bold px-2 py-1 rounded-lg">
                <Gift size={12} /> Claim
              </button>
            </div>
          )}
        </div>

        {/* Calorie Ring */}
        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <h2 className="font-semibold text-gray-800">Today's Calories</h2>
            <button onClick={() => navigate('/log')} className="text-xs text-brand-primary font-medium flex items-center gap-0.5">
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
              {Object.entries(byLight).map(([light, cal]) => cal > 0 ? (
                <div key={light} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: LIGHT_CONFIG[light].color }} />
                  <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${Math.min((cal / consumed) * 100, 100)}%`, backgroundColor: LIGHT_CONFIG[light].color }} />
                  </div>
                  <span className="text-xs text-gray-500 w-12 text-right">{cal} cal</span>
                </div>
              ) : null)}
            </div>
          </div>
        </div>

        {/* Today's Lesson */}
        <button onClick={() => navigate(`/lessons/${currentLesson.day}`)}
                className="w-full bg-gradient-to-r from-[#4B2E83] to-[#A88FCF] rounded-3xl p-4 text-left shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start gap-3">
            <div className="bg-white/20 rounded-xl p-2 flex-shrink-0">
              <BookOpen size={20} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[#D4AF37] text-xs font-semibold">Day {currentLesson.day} of 90</span>
                <span className="text-white/60 text-xs">· {currentLesson.readTimeMin} min</span>
              </div>
              <p className="font-semibold text-white text-sm leading-tight">{currentLesson.title}</p>
              <p className="text-white/70 text-xs mt-0.5 truncate">{currentLesson.subtitle}</p>
            </div>
            <ChevronRight size={18} className="text-white/60 flex-shrink-0 mt-0.5" />
          </div>
          <div className="mt-3 flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-[#D4AF37] rounded-full" style={{ width: `${(progress.completedLessons.length / 90) * 100}%` }} />
            </div>
            <span className="text-white/60 text-xs">{progress.completedLessons.length}/90</span>
          </div>
        </button>

        {/* Quick Stats */}
        <div className="flex gap-3">
          <StatTile icon={Droplets} label="Water" value={`${bio.waterCups}/8`} color="text-blue-500" bg="bg-blue-50" />
          <StatTile icon={Footprints} label="Steps" value={bio.steps.toLocaleString()} color="text-green-600" bg="bg-green-50" />
          <StatTile icon={Flame} label="Streak" value={`${streaks.currentLoginStreak}d`} color="text-orange-500" bg="bg-orange-50" />
        </div>

        {/* Complete My Day */}
        <button
          onClick={() => setCompleteDaySheet(true)}
          className="w-full bg-gradient-to-r from-[#1f2933] to-[#3a4a38] text-white py-4 rounded-2xl font-semibold text-base shadow-sm hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <CheckCircle size={20} />
          Complete My Day
        </button>
      </div>

      {/* Complete My Day Sheet */}
      <BottomSheet open={completeDaySheet} onClose={() => setCompleteDaySheet(false)} title="Day Summary">
        <div className="p-4 space-y-4">
          <div className="bg-gradient-to-br from-[#1f2933] to-[#3a4a38] rounded-2xl p-5 text-center text-white">
            <div className="text-4xl mb-2">{todayPts >= 8 ? '🌟' : todayPts >= 5 ? '👏' : '🌱'}</div>
            <p className="font-bold text-lg font-brand">
              {todayPts >= 8 ? 'Amazing day!' : todayPts >= 5 ? 'Great effort!' : 'Keep going!'}
            </p>
            <p className="text-white/70 text-sm mt-1">{todayPts} of 10 points earned today</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {tasks.map(task => (
              <div key={task.label} className={`flex items-center gap-2 p-3 rounded-xl ${task.done ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-100'}`}>
                <span className="text-xl">{task.emoji}</span>
                <div>
                  <p className={`text-xs font-semibold ${task.done ? 'text-green-700' : 'text-gray-400'}`}>{task.label}</p>
                  <p className="text-[10px] text-gray-400">{task.done ? 'Done ✓' : 'Not yet'}</p>
                </div>
              </div>
            ))}
          </div>

          {!tasks.every(t => t.done) && (
            <p className="text-xs text-center text-gray-400 italic">
              You still have time to complete remaining goals today.
            </p>
          )}

          <p className="text-xs text-center text-[#D4AF37] font-medium italic">
            "...be transformed by the renewing of your mind..." — Romans 12:2
          </p>

          <button onClick={() => setCompleteDaySheet(false)}
                  className="w-full bg-brand-primary text-white py-3.5 rounded-xl font-semibold hover:bg-[#3a2270] transition-colors">
            See you tomorrow 🙏
          </button>
        </div>
      </BottomSheet>

      {/* Reward sheet */}
      <BottomSheet open={rewardSheet} onClose={() => setRewardSheet(false)} title="🎁 Weekly Reward Unlocked!">
        <div className="p-4 space-y-4">
          <div className="bg-gradient-to-br from-[#4B2E83] to-[#A88FCF] rounded-2xl p-5 text-center text-white">
            <div className="text-4xl mb-2">🎉</div>
            <p className="font-bold text-lg">You earned it!</p>
            <p className="text-white/70 text-sm mt-1">{weekTotal} points this week</p>
          </div>
          <div className="bg-[#fffbeb] border border-[#D4AF37]/30 rounded-2xl p-4">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Your reward idea</p>
            <p className="font-semibold text-gray-800">{rewardIdea}</p>
          </div>
          <p className="text-xs text-gray-400 text-center italic">Celebrate yourself — you've earned it. No food required. 🙌</p>
          <button onClick={() => setRewardSheet(false)}
                  className="w-full bg-brand-primary text-white py-3.5 rounded-xl font-semibold hover:bg-[#3a2270] transition-colors">
            Awesome, thanks!
          </button>
        </div>
      </BottomSheet>
    </div>
  )
}

function StatTile({ icon: Icon, label, value, color, bg }) {
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
