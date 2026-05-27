import React, { useState } from 'react'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import { useFoodLog } from '../hooks/useFoodLog'
import { useBiometrics } from '../hooks/useBiometrics'
import { useProfile } from '../hooks/useProfile'
import { useLessons } from '../hooks/useLessons'
import { useStreak } from '../hooks/useStreak'
import { useJourney } from '../hooks/useJourney'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { KEYS } from '../utils/storageKeys'
import { getLast7Days, getLast30Days, todayStr } from '../utils/dateHelpers'
import {
  COMMITMENT_LEVELS, DIET_STYLES, ACTIVITY_LEVELS, GOALS,
  lbsToKg, kgToLbs, ftInToCm, cmToFtIn,
  calcBMR, calcTDEE, calcCalorieRange, calcBMI,
  calcWeightGoalEstimate,
} from '../utils/calorieCalc'
import BottomSheet from '../components/ui/BottomSheet'
import { Pause, Play, RefreshCw, Plus, AlertTriangle, Download, RotateCcw, Copy, Check, Target, User, LogOut } from 'lucide-react'
import { generateBackup, parseBackup, restoreBackup } from '../utils/backup'
import { signOutAndClear } from '../utils/syncData'

export default function ProgressPage() {
  const [range, setRange] = useState('week')
  const { getDayCalories } = useFoodLog()
  const { getDay } = useBiometrics()
  const { profile, setProfile } = useProfile()
  const { progress } = useLessons()
  const { streaks } = useStreak()
  const {
    journey, currentJourneyDay, totalDays, daysRemaining,
    pauseJourney, resumeJourney, extendJourney, restartJourney, updateJourney,
  } = useJourney()
  const [, setFoodLog] = useLocalStorage(KEYS.FOOD_LOG, {})
  const [, setBiometrics] = useLocalStorage(KEYS.BIOMETRICS, {})
  const [, setLessonProgress] = useLocalStorage(KEYS.LESSON_PROGRESS, {})

  const [journeySheet, setJourneySheet] = useState(false)
  const [confirmAction, setConfirmAction] = useState(null) // 'pause'|'resume'|'restart'|'extend'
  const [confirmed, setConfirmed] = useState(false)
  const [extendDays, setExtendDays] = useState(30)

  // My Goals sheet
  const [goalsSheet, setGoalsSheet] = useState(false)
  const [goalsForm, setGoalsForm] = useState(null)
  const [goalsSaved, setGoalsSaved] = useState(false)

  // My Profile sheet
  const [profileSheet, setProfileSheet] = useState(false)
  const [profileForm, setProfileForm] = useState(null)
  const [profileBackupCode, setProfileBackupCode] = useState('')
  const [profileCopied, setProfileCopied] = useState(false)
  const [profileSaved, setProfileSaved] = useState(false)

  // Backup / restore state
  const [backupSheet, setBackupSheet] = useState(false)
  const [backupCode, setBackupCode] = useState('')
  const [copied, setCopied] = useState(false)
  const [restoreMode, setRestoreMode] = useState(false)
  const [restoreInput, setRestoreInput] = useState('')
  const [restorePreview, setRestorePreview] = useState(null)
  const [restoreError, setRestoreError] = useState('')
  const [restoreDone, setRestoreDone] = useState(false)

  function openBackupSheet() {
    setBackupCode(generateBackup())
    setRestoreMode(false)
    setRestoreInput('')
    setRestorePreview(null)
    setRestoreError('')
    setRestoreDone(false)
    setBackupSheet(true)
  }

  function handleCopy() {
    navigator.clipboard.writeText(backupCode).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  function handleRestoreInput(val) {
    setRestoreInput(val)
    setRestoreError('')
    setRestoreDone(false)
    if (val.trim().length > 20) {
      setRestorePreview(parseBackup(val))
    } else {
      setRestorePreview(null)
    }
  }

  function handleRestoreConfirm() {
    const ok = restoreBackup(restoreInput)
    if (ok) {
      setRestoreDone(true)
      setTimeout(() => window.location.reload(), 1200)
    } else {
      setRestoreError('That code doesn\'t look right. Double-check and try again.')
    }
  }

  // ── My Goals handlers ──
  function openGoalsSheet() {
    const { ft, inches } = cmToFtIn(profile.heightCm || 165)
    setGoalsForm({
      weightLbs: String(Math.round(kgToLbs(profile.weightKg || 70))),
      age: String(profile.age || 30),
      heightFt: String(ft),
      heightIn: String(inches),
      activityLevel: profile.activityLevel || 1.375,
      goal: profile.goal || 'lose',
      goalWeightLbs: profile.goalWeightLbs ? String(profile.goalWeightLbs) : '',
    })
    setGoalsSaved(false)
    setGoalsSheet(true)
  }

  function saveGoals() {
    if (!goalsForm) return
    const weightKg = lbsToKg(Number(goalsForm.weightLbs) || 70)
    const heightCm = ftInToCm(Number(goalsForm.heightFt) || 5, Number(goalsForm.heightIn) || 5)
    const age = Number(goalsForm.age) || 30
    const bmr = calcBMR({ weightKg, heightCm, age, sex: profile.sex || 'female' })
    const tdee = calcTDEE(bmr, goalsForm.activityLevel)
    const { min, max } = calcCalorieRange(tdee, goalsForm.goal, profile.sex || 'female')
    const bmi = calcBMI(weightKg, heightCm)
    setProfile(prev => ({
      ...prev,
      weightKg, heightCm, age,
      activityLevel: goalsForm.activityLevel,
      goal: goalsForm.goal,
      goalWeightLbs: goalsForm.goalWeightLbs ? parseFloat(goalsForm.goalWeightLbs) : null,
      tdee, calorieMin: min, calorieMax: max, bmi,
    }))
    setGoalsSaved(true)
    setTimeout(() => { setGoalsSaved(false); setGoalsSheet(false) }, 1200)
  }

  // ── My Profile handlers ──
  function openProfileSheet() {
    setProfileForm({ name: profile.name || '', age: String(profile.age || 30) })
    setProfileBackupCode(generateBackup())
    setProfileCopied(false)
    setProfileSaved(false)
    setProfileSheet(true)
  }

  function saveProfileForm() {
    if (!profileForm) return
    setProfile(prev => ({
      ...prev,
      name: profileForm.name,
      age: Number(profileForm.age) || prev.age,
    }))
    setProfileSaved(true)
    setTimeout(() => { setProfileSaved(false); setProfileSheet(false) }, 1200)
  }

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

  const avgCal = calData.filter(d => d.calories > 0).length > 0
    ? Math.round(calData.reduce((s, d) => s + d.calories, 0) / calData.filter(d => d.calories > 0).length)
    : 0

  const loggedDays = calData.filter(d => d.calories > 0).length
  const inRangeDays = calData.filter(d => d.calories >= (profile.calorieMin || 0) && d.calories <= (profile.calorieMax || 9999) && d.calories > 0).length

  const calBarColor = (entry) => {
    if (entry.calories === 0) return '#e2e8f0'
    if (entry.calories > entry.max) return '#ef4444'
    if (entry.calories >= entry.min) return '#22c55e'
    return '#A88FCF'
  }

  function handleConfirmedAction() {
    if (confirmAction === 'pause') pauseJourney()
    else if (confirmAction === 'resume') resumeJourney()
    else if (confirmAction === 'extend') extendJourney(extendDays)
    else if (confirmAction === 'restart') {
      // Keep weight log (biometrics.weightKg entries) and profile; clear everything else
      setFoodLog({})
      setLessonProgress({ currentDay: 1, completedLessons: [], quizScores: {} })
      restartJourney()
    }
    setConfirmAction(null)
    setConfirmed(false)
    setJourneySheet(false)
  }

  // Live weight-goal estimate for My Goals sheet
  let goalsEstimate = null
  if (goalsForm && goalsForm.goal === 'lose' && goalsForm.goalWeightLbs) {
    const wKg = lbsToKg(Number(goalsForm.weightLbs) || 70)
    const hCm = ftInToCm(Number(goalsForm.heightFt) || 5, Number(goalsForm.heightIn) || 5)
    const age = Number(goalsForm.age) || 30
    const bmr = calcBMR({ weightKg: wKg, heightCm: hCm, age, sex: profile.sex || 'female' })
    const previewTdee = calcTDEE(bmr, goalsForm.activityLevel)
    const { min, max } = calcCalorieRange(previewTdee, goalsForm.goal, profile.sex || 'female')
    goalsEstimate = calcWeightGoalEstimate({
      goal: goalsForm.goal,
      goalWeightLbs: parseFloat(goalsForm.goalWeightLbs),
      weightKg: wKg, age,
      activityLevel: goalsForm.activityLevel,
      tdee: previewTdee, calorieMin: min, calorieMax: max,
    })
  }

  // Estimate for main progress page (uses saved profile)
  const pageEstimate = calcWeightGoalEstimate(profile)

  const journeyDay = journey.startDate ? currentJourneyDay() : 1
  const commitmentLabel = COMMITMENT_LEVELS.find(c => c.value === journey.commitmentLevel)?.label || 'Building Habits'
  const dietLabel = DIET_STYLES.find(d => d.value === journey.dietStyle)?.label || 'Balanced'

  return (
    <div className="pb-4">
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-gray-100 px-4 py-3">
        <h1 className="font-semibold text-gray-900 font-brand">Progress</h1>
        <div className="flex gap-2 mt-2 overflow-x-auto no-scrollbar pb-0.5">
          {['week', 'month'].map(r => (
            <button key={r} onClick={() => setRange(r)}
                    className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors capitalize ${range === r ? 'bg-brand-primary text-white' : 'bg-gray-100 text-gray-600'}`}>
              {r === 'week' ? 'This Week' : 'This Month'}
            </button>
          ))}
          <button onClick={openGoalsSheet}
                  className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-brand-pale text-brand-primary border border-brand-secondary/30 transition-colors hover:bg-brand-secondary/20">
            <Target size={11} /> My Goals
          </button>
          <button onClick={openProfileSheet}
                  className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-gray-50 text-gray-700 border border-gray-200 transition-colors hover:bg-gray-100">
            <User size={11} /> My Profile
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-3">
          <StatBox label="Avg Calories" value={avgCal > 0 ? avgCal.toLocaleString() : '—'} />
          <StatBox label="In Range" value={`${inRangeDays}d`} />
          <StatBox label="Lessons" value={`${progress.completedLessons.length}/90`} />
        </div>

        {/* Weight goal estimate card */}
        {pageEstimate && (
          <div className="bg-gradient-to-r from-brand-primary to-brand-secondary rounded-2xl p-4 text-white">
            <p className="text-white/60 text-[10px] uppercase tracking-wide mb-1">⏱ Estimated Time to Goal</p>
            <p className="font-bold text-2xl">{pageEstimate.rangeLabel}</p>
            <p className="text-white/80 text-sm mt-0.5">
              to lose {pageEstimate.lbsToLose} lbs · ~{pageEstimate.lbsPerWeek} lbs/wk
            </p>
            <p className="text-white/40 text-[10px] mt-2 italic">Results vary — consistency is the key factor.</p>
          </div>
        )}

        {/* Journey Banner */}
        {journey.startDate && (
          <div className={`rounded-2xl p-4 ${journey.isPaused ? 'bg-amber-50 border border-amber-200' : 'bg-gradient-to-r from-[#4B2E83] to-[#A88FCF]'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-xs font-medium uppercase tracking-wide mb-0.5 ${journey.isPaused ? 'text-amber-600' : 'text-[#D4AF37]'}`}>
                  {journey.isPaused ? '⏸ Journey Paused' : 'Your Journey'}
                </p>
                <p className={`font-bold text-lg ${journey.isPaused ? 'text-amber-800' : 'text-white'}`}>
                  Day {journeyDay} / {totalDays}
                </p>
                <p className={`text-xs ${journey.isPaused ? 'text-amber-600' : 'text-white/60'}`}>
                  {journey.isPaused ? 'Resume when ready' : `${daysRemaining()} days remaining · ${commitmentLabel} · ${dietLabel}`}
                </p>
              </div>
              <button onClick={() => setJourneySheet(true)}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${journey.isPaused ? 'bg-amber-600 text-white' : 'bg-white/20 text-white hover:bg-white/30'}`}>
                Manage
              </button>
            </div>
            {!journey.isPaused && (
              <div className="mt-3 h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-[#D4AF37] rounded-full"
                     style={{ width: `${Math.min((journeyDay / totalDays) * 100, 100)}%` }} />
              </div>
            )}
          </div>
        )}

        {/* Calorie Chart */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <h2 className="font-semibold text-gray-800 text-sm mb-1">Daily Calories</h2>
          <p className="text-xs text-gray-400 mb-3">Target range: {profile.calorieMin}–{profile.calorieMax} cal</p>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={calData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 9, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 9, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid #e2e8f0' }}
                       formatter={(v) => [`${v} cal`, 'Calories']} />
              <ReferenceLine y={profile.calorieMin} stroke="#22c55e" strokeDasharray="4 2" strokeWidth={1} />
              <ReferenceLine y={profile.calorieMax} stroke="#ef4444" strokeDasharray="4 2" strokeWidth={1} />
              <Bar dataKey="calories" radius={[4, 4, 0, 0]} fill="#A88FCF" label={false}
                   cell={(entry) => <rect fill={calBarColor(entry)} />} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-4 mt-2">
            {[['#22c55e', 'In range'], ['#A88FCF', 'Below range'], ['#ef4444', 'Over range'], ['#e2e8f0', 'Not logged']].map(([c, l]) => (
              <div key={l} className="flex items-center gap-1">
                <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: c }} />
                <span className="text-[10px] text-gray-400">{l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Weight Chart */}
        {weightData.length > 1 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <h2 className="font-semibold text-gray-800 text-sm mb-3">Weight Trend</h2>
            <ResponsiveContainer width="100%" height={140}>
              <LineChart data={weightData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 9, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 9, fill: '#94a3b8' }} tickLine={false} axisLine={false} domain={['dataMin - 2', 'dataMax + 2']} />
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid #e2e8f0' }}
                         formatter={(v) => [`${v} lbs`, 'Weight']} />
                <Line type="monotone" dataKey="weight" stroke="#4B2E83" strokeWidth={2} dot={{ fill: '#4B2E83', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
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
                  <div className={`w-full aspect-square rounded-xl flex items-center justify-center text-xs font-medium transition-colors ${logged ? 'bg-brand-primary text-white' : 'bg-gray-100 text-gray-400'}`}>
                    {logged ? '✓' : ''}
                  </div>
                  <span className="text-[9px] text-gray-400">{d.slice(8)}</span>
                </div>
              )
            })}
          </div>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
            <div className="text-center">
              <p className="text-lg font-bold text-brand-primary">{streaks.currentLoginStreak}</p>
              <p className="text-[10px] text-gray-400">current streak</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-brand-secondary">{streaks.longestLoginStreak}</p>
              <p className="text-[10px] text-gray-400">best streak</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-green-600">{progress.completedLessons.length}</p>
              <p className="text-[10px] text-gray-400">lessons done</p>
            </div>
          </div>
        </div>
        {/* Backup & Restore */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <div className="flex items-center gap-2 mb-1">
            <Download size={15} className="text-brand-primary" />
            <h2 className="font-semibold text-gray-800 text-sm">Backup &amp; Restore</h2>
          </div>
          <p className="text-xs text-gray-400 mb-3 leading-relaxed">
            Save a backup code to your Notes app or email. If you ever clear your browser or switch devices, paste it back to restore your full journey.
          </p>
          <div className="flex gap-2">
            <button
              onClick={openBackupSheet}
              className="flex-1 flex items-center justify-center gap-2 bg-brand-primary text-white py-3 rounded-xl text-sm font-semibold hover:bg-[#3a2270] transition-colors"
            >
              <Download size={15} /> Create Backup
            </button>
            <button
              onClick={() => { setRestoreMode(true); setBackupCode(''); setBackupSheet(true) }}
              className="flex-1 flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-3 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors"
            >
              <RotateCcw size={15} /> Restore
            </button>
          </div>
        </div>
      </div>

      {/* Journey Management Sheet */}
      <BottomSheet open={journeySheet} onClose={() => { setJourneySheet(false); setConfirmAction(null); setConfirmed(false) }} title="Journey Settings">
        {confirmAction ? (
          <div className="p-4 space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3">
              <AlertTriangle size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-800 text-sm">
                  {confirmAction === 'restart' ? 'This will reset your journey' :
                   confirmAction === 'extend' ? `Add ${extendDays} days to your journey` :
                   confirmAction === 'pause' ? 'Pause your journey' : 'Resume your journey'}
                </p>
                <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                  {confirmAction === 'restart'
                    ? 'Your food log and lesson progress will be cleared. Your profile and weekly weight milestones will be kept. This cannot be undone.'
                    : confirmAction === 'extend'
                    ? `Your journey will extend to ${totalDays + extendDays} total days. Your progress and settings will not change.`
                    : confirmAction === 'pause'
                    ? 'Your journey timer will pause. Come back when you\'re ready to resume — your progress is saved.'
                    : 'Your journey timer will resume from where you left off.'}
                </p>
              </div>
            </div>

            {confirmAction === 'extend' && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Days to add</p>
                <div className="flex gap-2">
                  {[30, 60, 90].map(d => (
                    <button key={d} onClick={() => setExtendDays(d)}
                            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-colors ${extendDays === d ? 'bg-brand-primary text-white border-brand-primary' : 'bg-white text-gray-700 border-gray-200'}`}>
                      +{d}d
                    </button>
                  ))}
                </div>
              </div>
            )}

            <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer">
              <input type="checkbox" checked={confirmed} onChange={e => setConfirmed(e.target.checked)}
                     className="w-4 h-4 accent-brand-primary" />
              <span className="text-sm text-gray-700">I understand and want to proceed</span>
            </label>

            <div className="flex gap-2">
              <button onClick={() => { setConfirmAction(null); setConfirmed(false) }}
                      className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium text-sm">
                Cancel
              </button>
              <button onClick={handleConfirmedAction} disabled={!confirmed}
                      className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-colors disabled:opacity-40 ${confirmAction === 'restart' ? 'bg-red-500 text-white' : 'bg-brand-primary text-white'}`}>
                Confirm
              </button>
            </div>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            <div className="bg-brand-pale rounded-2xl p-3 text-sm text-brand-primary">
              Day {journeyDay} of {totalDays} · {commitmentLabel} · {dietLabel}
            </div>

            {!journey.isPaused ? (
              <ActionRow icon={Pause} label="Pause Journey" desc="Freeze your timer due to injury or life changes"
                         color="text-amber-600" bg="bg-amber-50"
                         onPress={() => setConfirmAction('pause')} />
            ) : (
              <ActionRow icon={Play} label="Resume Journey" desc="Pick up where you left off"
                         color="text-green-600" bg="bg-green-50"
                         onPress={() => setConfirmAction('resume')} />
            )}

            <ActionRow icon={Plus} label="Extend Journey" desc="Add 30, 60, or 90 more days"
                       color="text-brand-primary" bg="bg-brand-pale"
                       onPress={() => setConfirmAction('extend')} />

            <ActionRow icon={RefreshCw} label="Restart Journey" desc="Start fresh — keeps your profile and weight history"
                       color="text-red-500" bg="bg-red-50"
                       onPress={() => setConfirmAction('restart')} />

            <div className="pt-2">
              <p className="text-xs text-gray-400 text-center">Changes take effect immediately and cannot be undone without restarting.</p>
            </div>
          </div>
        )}
      </BottomSheet>

      {/* My Goals Sheet */}
      <BottomSheet open={goalsSheet} onClose={() => setGoalsSheet(false)} title="My Goals">
        {goalsForm && (
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">Current weight (lbs)</label>
                <input type="number" value={goalsForm.weightLbs}
                       onChange={e => setGoalsForm(f => ({ ...f, weightLbs: e.target.value }))}
                       className={inputCls} />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">Age</label>
                <input type="number" min="16" max="80" value={goalsForm.age}
                       onChange={e => setGoalsForm(f => ({ ...f, age: e.target.value }))}
                       className={inputCls} />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1">Height</label>
              <div className="flex gap-2">
                <div className="flex-1">
                  <input type="number" min="4" max="7" value={goalsForm.heightFt}
                         onChange={e => setGoalsForm(f => ({ ...f, heightFt: e.target.value }))}
                         placeholder="ft" className={inputCls} />
                  <span className="text-[10px] text-gray-400 pl-1">feet</span>
                </div>
                <div className="flex-1">
                  <input type="number" min="0" max="11" value={goalsForm.heightIn}
                         onChange={e => setGoalsForm(f => ({ ...f, heightIn: e.target.value }))}
                         placeholder="in" className={inputCls} />
                  <span className="text-[10px] text-gray-400 pl-1">inches</span>
                </div>
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 block mb-2">Activity level</label>
              <div className="space-y-1.5">
                {ACTIVITY_LEVELS.map(a => (
                  <button key={a.value} onClick={() => setGoalsForm(f => ({ ...f, activityLevel: a.value }))}
                          className={`w-full text-left px-3 py-2.5 rounded-xl border text-sm transition-colors ${goalsForm.activityLevel === a.value ? 'border-brand-primary bg-brand-pale text-brand-primary' : 'border-gray-200 bg-white text-gray-700'}`}>
                    <span className="font-medium">{a.label}</span>
                    <span className="text-xs opacity-60 ml-1">— {a.desc}</span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 block mb-2">Goal</label>
              <div className="grid grid-cols-3 gap-2">
                {GOALS.map(g => (
                  <button key={g.value} onClick={() => setGoalsForm(f => ({ ...f, goal: g.value, goalWeightLbs: g.value !== 'lose' ? '' : f.goalWeightLbs }))}
                          className={`py-2.5 rounded-xl border text-center text-xs font-medium transition-colors ${goalsForm.goal === g.value ? 'border-brand-primary bg-brand-pale text-brand-primary' : 'border-gray-200 bg-white text-gray-600'}`}>
                    <div className="text-lg mb-0.5">{g.emoji}</div>{g.label}
                  </button>
                ))}
              </div>
            </div>
            {goalsForm.goal === 'lose' && (
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">Goal weight (lbs) — optional</label>
                <input type="number" min="80" max="500" value={goalsForm.goalWeightLbs}
                       onChange={e => setGoalsForm(f => ({ ...f, goalWeightLbs: e.target.value }))}
                       placeholder="e.g. 145" className={inputCls} />
              </div>
            )}
            {/* Live estimate */}
            {goalsEstimate && (
              <div className="bg-brand-pale border border-brand-secondary/30 rounded-2xl p-3">
                <p className="text-xs text-brand-primary font-semibold mb-0.5">⏱ Estimated time to goal</p>
                <p className="text-xl font-bold text-brand-primary">{goalsEstimate.rangeLabel}</p>
                <p className="text-xs text-gray-500 mt-0.5">to lose {goalsEstimate.lbsToLose} lbs · ~{goalsEstimate.lbsPerWeek} lbs/wk</p>
                <p className="text-[10px] text-gray-400 mt-1 italic">Individual results vary. Consistency matters most.</p>
              </div>
            )}
            <button onClick={saveGoals}
                    className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all ${goalsSaved ? 'bg-green-500 text-white' : 'bg-brand-primary text-white hover:bg-[#3a2270]'}`}>
              {goalsSaved ? '✓ Saved!' : 'Save Goals'}
            </button>
          </div>
        )}
      </BottomSheet>

      {/* My Profile Sheet */}
      <BottomSheet open={profileSheet} onClose={() => setProfileSheet(false)} title="My Profile">
        {profileForm && (
          <div className="p-4 space-y-4">
            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1">First name</label>
              <input type="text" value={profileForm.name}
                     onChange={e => setProfileForm(f => ({ ...f, name: e.target.value }))}
                     placeholder="Your name" className={inputCls} />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1">Age</label>
              <input type="number" min="16" max="80" value={profileForm.age}
                     onChange={e => setProfileForm(f => ({ ...f, age: e.target.value }))}
                     className={inputCls} />
            </div>
            <button onClick={saveProfileForm}
                    className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all ${profileSaved ? 'bg-green-500 text-white' : 'bg-brand-primary text-white hover:bg-[#3a2270]'}`}>
              {profileSaved ? '✓ Saved!' : 'Save Profile'}
            </button>
            {/* Sign out */}
            <div className="border-t border-gray-100 pt-4">
              <button
                onClick={() => {
                  if (window.confirm('Sign out? Your progress is saved to your account.')) {
                    signOutAndClear().then(() => window.location.reload())
                  }
                }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm text-red-500 bg-red-50 hover:bg-red-100 transition-all"
              >
                <LogOut size={15} /> Sign Out
              </button>
              <p className="text-[10px] text-gray-400 text-center mt-2">
                Your data is saved to your account and will be here when you sign back in.
              </p>
            </div>
          </div>
        )}
      </BottomSheet>

      {/* Backup / Restore Sheet */}
      <BottomSheet
        open={backupSheet}
        onClose={() => setBackupSheet(false)}
        title={restoreMode ? 'Restore Journey' : 'Backup My Journey'}
      >
        <div className="p-4 space-y-4">
          {!restoreMode ? (
            <>
              <p className="text-sm text-gray-500 leading-relaxed">
                Copy this code and save it somewhere safe — your Notes app, an email to yourself, or anywhere you won't lose it. You'll need it to restore your journey.
              </p>
              <div className="relative">
                <textarea
                  readOnly
                  value={backupCode}
                  rows={5}
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-xs font-mono text-gray-700 focus:outline-none resize-none select-all"
                  onFocus={e => e.target.select()}
                />
              </div>
              <button
                onClick={handleCopy}
                className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm transition-all ${
                  copied ? 'bg-green-500 text-white' : 'bg-brand-primary text-white hover:bg-[#3a2270]'
                }`}
              >
                {copied ? <><Check size={16} /> Copied!</> : <><Copy size={16} /> Copy Code</>}
              </button>
              <p className="text-[10px] text-gray-400 text-center leading-relaxed">
                This code contains all your progress, food logs, and lessons. Keep it private.
              </p>
              <button
                onClick={() => setRestoreMode(true)}
                className="w-full text-xs text-gray-400 text-center py-1 hover:text-gray-600 transition-colors"
              >
                Want to restore instead?
              </button>
            </>
          ) : (
            <>
              <p className="text-sm text-gray-500 leading-relaxed">
                Paste your backup code below to restore your journey. This will overwrite your current data.
              </p>
              <textarea
                value={restoreInput}
                onChange={e => handleRestoreInput(e.target.value)}
                placeholder="Paste your backup code here..."
                rows={5}
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-xs font-mono text-gray-700 placeholder-gray-300 focus:outline-none focus:border-brand-secondary resize-none"
              />
              {restoreError && <p className="text-red-500 text-xs">{restoreError}</p>}
              {restorePreview && !restoreError && (
                <div className="bg-green-50 border border-green-200 rounded-2xl p-3">
                  <p className="text-green-700 text-xs font-semibold mb-0.5">Journey found</p>
                  {restorePreview.name && <p className="text-gray-800 font-medium text-sm">{restorePreview.name}'s Journey</p>}
                  <p className="text-gray-500 text-xs">Day {restorePreview.currentDay} · {restorePreview.lessonsCompleted} lessons completed</p>
                </div>
              )}
              {restoreDone && (
                <div className="bg-green-50 border border-green-200 rounded-2xl p-3 text-center">
                  <p className="text-green-700 font-semibold text-sm">Restored! Reloading...</p>
                </div>
              )}
              <button
                onClick={handleRestoreConfirm}
                disabled={!restoreInput.trim() || restoreDone}
                className="w-full bg-brand-primary text-white py-3.5 rounded-xl font-semibold text-sm disabled:opacity-40 hover:bg-[#3a2270] transition-colors"
              >
                Restore &amp; Reload
              </button>
            </>
          )}
        </div>
      </BottomSheet>
    </div>
  )
}

const inputCls = 'w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-secondary focus:border-transparent'

function StatBox({ label, value }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3 text-center">
      <p className="text-xl font-bold text-gray-900">{value}</p>
      <p className="text-[10px] text-gray-500 mt-0.5">{label}</p>
    </div>
  )
}

function ActionRow({ icon: Icon, label, desc, color, bg, onPress }) {
  return (
    <button onClick={onPress}
            className="w-full flex items-center gap-3 p-4 bg-white rounded-2xl border border-gray-100 text-left hover:shadow-sm transition-shadow">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${bg}`}>
        <Icon size={16} className={color} />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-800">{label}</p>
        <p className="text-xs text-gray-400">{desc}</p>
      </div>
      <ChevronRight size={16} className="text-gray-300" />
    </button>
  )
}

function ChevronRight({ size, className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="9 18 15 12 9 6" />
    </svg>
  )
}
