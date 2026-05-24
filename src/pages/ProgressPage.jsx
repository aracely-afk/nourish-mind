import React, { useState } from 'react'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import { useFoodLog } from '../hooks/useFoodLog'
import { useBiometrics } from '../hooks/useBiometrics'
import { useProfile } from '../hooks/useProfile'
import { useLessons } from '../hooks/useLessons'
import { useStreak } from '../hooks/useStreak'
import { getLast7Days, getLast30Days, todayStr, addDays } from '../utils/dateHelpers'

export default function ProgressPage() {
  const [range, setRange] = useState('week')
  const { getDayCalories } = useFoodLog()
  const { getDay } = useBiometrics()
  const { profile } = useProfile()
  const { progress } = useLessons()
  const { streaks } = useStreak()

  const days = range === 'week' ? getLast7Days() : getLast30Days()

  const calData = days.map(d => ({
    date: d.slice(5),
    calories: getDayCalories(d),
    min: profile.calorieMin || 1400,
    max: profile.calorieMax || 1700,
  }))

  const weightData = days
    .map(d => ({ date: d.slice(5), weight: getDay(d).weightKg }))
    .filter(d => d.weight !== null)

  const avgCal = calData.length > 0
    ? Math.round(calData.reduce((s, d) => s + d.calories, 0) / calData.filter(d => d.calories > 0).length || 0)
    : 0

  const loggedDays = calData.filter(d => d.calories > 0).length
  const inRangeDays = calData.filter(d => d.calories >= (profile.calorieMin||0) && d.calories <= (profile.calorieMax||9999) && d.calories > 0).length

  const calBarColor = (entry) => {
    if (entry.calories === 0) return '#e2e8f0'
    if (entry.calories > entry.max) return '#ef4444'
    if (entry.calories >= entry.min) return '#22c55e'
    return '#6366f1'
  }

  return (
    <div className="pb-4">
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-gray-100 px-4 py-3">
        <h1 className="font-semibold text-gray-900">Progress</h1>
        <div className="flex gap-2 mt-2">
          {['week','month'].map(r => (
            <button key={r} onClick={() => setRange(r)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors capitalize ${range===r ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
              {r === 'week' ? 'This Week' : 'This Month'}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-3">
          <StatBox label="Avg Calories" value={avgCal > 0 ? avgCal.toLocaleString() : '—'} />
          <StatBox label="In Range" value={`${inRangeDays}d`} />
          <StatBox label="Lessons" value={`${progress.completedLessons.length}/30`} />
        </div>

        {/* Calorie Chart */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <h2 className="font-semibold text-gray-800 text-sm mb-1">Daily Calories</h2>
          <p className="text-xs text-gray-400 mb-3">
            Target range: {profile.calorieMin}–{profile.calorieMax} cal
          </p>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={calData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 9, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 9, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid #e2e8f0' }}
                formatter={(v) => [`${v} cal`, 'Calories']}
              />
              <ReferenceLine y={profile.calorieMin} stroke="#22c55e" strokeDasharray="4 2" strokeWidth={1} />
              <ReferenceLine y={profile.calorieMax} stroke="#ef4444" strokeDasharray="4 2" strokeWidth={1} />
              <Bar dataKey="calories" radius={[4,4,0,0]} fill="#6366f1"
                   label={false}
                   cell={(entry) => <rect fill={calBarColor(entry)} />} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-4 mt-2">
            {[['#22c55e','In range'], ['#6366f1','Below range'], ['#ef4444','Over range'], ['#e2e8f0','Not logged']].map(([c,l]) => (
              <div key={l} className="flex items-center gap-1">
                <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: c }} />
                <span className="text-[10px] text-gray-400">{l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Weight Chart */}
        {weightData.length > 1 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <h2 className="font-semibold text-gray-800 text-sm mb-3">Weight Trend</h2>
            <ResponsiveContainer width="100%" height={140}>
              <LineChart data={weightData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 9, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 9, fill: '#94a3b8' }} tickLine={false} axisLine={false} domain={['dataMin - 2', 'dataMax + 2']} />
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid #e2e8f0' }}
                         formatter={(v) => [`${v} lbs`, 'Weight']} />
                <Line type="monotone" dataKey="weight" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: '#8b5cf6', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
        {weightData.length <= 1 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center">
            <p className="text-sm text-gray-400">Log your weight in the Track tab to see your weight trend here.</p>
          </div>
        )}

        {/* Streak Calendar */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <h2 className="font-semibold text-gray-800 text-sm mb-3">7-Day Log Streak</h2>
          <div className="flex gap-2">
            {getLast7Days().map(d => {
              const cal = getDayCalories(d)
              const logged = cal > 0
              return (
                <div key={d} className="flex-1 flex flex-col items-center gap-1">
                  <div className={`w-full aspect-square rounded-xl flex items-center justify-center text-xs font-medium transition-colors ${logged ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                    {logged ? '✓' : ''}
                  </div>
                  <span className="text-[9px] text-gray-400">{d.slice(8)}</span>
                </div>
              )
            })}
          </div>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
            <div className="text-center">
              <p className="text-lg font-bold text-indigo-600">{streaks.currentLoginStreak}</p>
              <p className="text-[10px] text-gray-400">current streak</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-purple-600">{streaks.longestLoginStreak}</p>
              <p className="text-[10px] text-gray-400">best streak</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-green-600">{progress.completedLessons.length}</p>
              <p className="text-[10px] text-gray-400">lessons done</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatBox({ label, value }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3 text-center">
      <p className="text-xl font-bold text-gray-900">{value}</p>
      <p className="text-[10px] text-gray-500 mt-0.5">{label}</p>
    </div>
  )
}
