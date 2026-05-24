import React, { useState } from 'react'
import { Footprints, Droplets, Weight, Dumbbell, Plus, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'
import { useBiometrics } from '../hooks/useBiometrics'
import { todayStr, formatDate, addDays, isToday } from '../utils/dateHelpers'
import BottomSheet from '../components/ui/BottomSheet'

const EXERCISE_TYPES = ['Walk', 'Run', 'Cycling', 'Swimming', 'Yoga', 'Weight Training', 'HIIT', 'Dancing', 'Other']

export default function BiometricsPage() {
  const [date, setDate] = useState(todayStr())
  const { getDay, updateDay, addExercise, removeExercise } = useBiometrics()
  const [exSheet, setExSheet] = useState(false)
  const [exForm, setExForm] = useState({ type: 'Walk', durationMin: '', caloriesBurned: '' })
  const bio = getDay(date)

  function handleAddExercise() {
    if (!exForm.durationMin) return
    addExercise(date, { type: exForm.type, durationMin: Number(exForm.durationMin), caloriesBurned: Number(exForm.caloriesBurned) || 0 })
    setExSheet(false)
    setExForm({ type: 'Walk', durationMin: '', caloriesBurned: '' })
  }

  return (
    <div className="pb-4">
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-gray-100 px-4 py-3">
        <h1 className="font-semibold text-gray-900">Track</h1>
        <div className="flex items-center justify-between mt-2">
          <button onClick={() => setDate(d => addDays(d,-1))} className="p-1 rounded-full hover:bg-gray-100"><ChevronLeft size={20} className="text-gray-500" /></button>
          <span className={`text-sm font-medium ${isToday(date) ? 'text-indigo-600' : 'text-gray-700'}`}>{isToday(date) ? 'Today' : formatDate(date)}</span>
          <button onClick={() => setDate(d => addDays(d,1))} disabled={isToday(date)} className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-30"><ChevronRight size={20} className="text-gray-500" /></button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Steps */}
        <Section icon={Footprints} iconBg="bg-green-50" iconColor="text-green-600" title="Steps">
          <div className="flex items-center gap-3">
            <input type="number" min="0" value={bio.steps || ''} onChange={e => updateDay(date, { steps: Number(e.target.value) || 0 })}
                   placeholder="0" className={inputCls} />
            <span className="text-sm text-gray-500 flex-shrink-0">steps</span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 rounded-full transition-all" style={{ width: `${Math.min((bio.steps/10000)*100,100)}%` }} />
            </div>
            <span className="text-xs text-gray-400">{bio.steps.toLocaleString()} / 10,000</span>
          </div>
        </Section>

        {/* Water */}
        <Section icon={Droplets} iconBg="bg-blue-50" iconColor="text-blue-500" title="Water Intake">
          <div className="grid grid-cols-8 gap-1.5 mt-1">
            {Array.from({length: 8}, (_, i) => (
              <button key={i} onClick={() => updateDay(date, { waterCups: bio.waterCups === i+1 ? i : i+1 })}
                      className={`aspect-square rounded-lg flex items-center justify-center text-lg transition-colors ${i < bio.waterCups ? 'bg-blue-100' : 'bg-gray-100'}`}>
                {i < bio.waterCups ? '🥤' : '⬜'}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">{bio.waterCups} of 8 cups · Tap to log</p>
        </Section>

        {/* Weight */}
        <Section icon={Weight} iconBg="bg-purple-50" iconColor="text-purple-600" title="Weight (optional)">
          <div className="flex items-center gap-3">
            <input type="number" step="0.1" min="50" max="500" value={bio.weightKg != null ? bio.weightKg : ''} onChange={e => updateDay(date, { weightKg: e.target.value ? parseFloat(e.target.value) : null })}
                   placeholder="lbs" className={inputCls} />
            <span className="text-sm text-gray-500 flex-shrink-0">lbs</span>
          </div>
          <p className="text-[10px] text-gray-400 mt-1">Weight fluctuates daily by 2-5 lbs. That's normal! Track the trend, not the number.</p>
        </Section>

        {/* Exercise */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-50">
            <div className="w-8 h-8 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0">
              <Dumbbell size={16} className="text-orange-500" />
            </div>
            <h3 className="font-medium text-sm text-gray-800 flex-1">Exercise</h3>
          </div>
          {bio.exercise.length === 0 ? (
            <p className="text-xs text-gray-400 px-4 py-3">No exercise logged</p>
          ) : (
            <div className="divide-y divide-gray-50">
              {bio.exercise.map(e => (
                <div key={e.id} className="flex items-center gap-3 px-4 py-2.5">
                  <div className="flex-1">
                    <p className="text-sm text-gray-800">{e.type}</p>
                    <p className="text-xs text-gray-400">{e.durationMin} min{e.caloriesBurned > 0 ? ` · ${e.caloriesBurned} cal burned` : ''}</p>
                  </div>
                  <button onClick={() => removeExercise(date, e.id)} className="p-1 text-gray-300 hover:text-red-400"><Trash2 size={15} /></button>
                </div>
              ))}
            </div>
          )}
          <button onClick={() => setExSheet(true)}
                  className="w-full flex items-center gap-2 px-4 py-3 text-indigo-600 text-sm font-medium hover:bg-indigo-50 transition-colors border-t border-gray-50">
            <Plus size={16} /> Log exercise
          </button>
        </div>
      </div>

      <BottomSheet open={exSheet} onClose={() => setExSheet(false)} title="Log Exercise">
        <div className="p-4 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">Type</label>
            <div className="grid grid-cols-3 gap-2">
              {EXERCISE_TYPES.map(t => (
                <button key={t} onClick={() => setExForm(f => ({...f, type: t}))}
                        className={`py-2 px-3 rounded-xl text-xs font-medium border transition-colors ${exForm.type===t ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-700 border-gray-200'}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Duration (min)</label>
              <input type="number" value={exForm.durationMin} onChange={e => setExForm(f => ({...f, durationMin: e.target.value}))}
                     placeholder="30" className={inputCls} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Cal burned (est.)</label>
              <input type="number" value={exForm.caloriesBurned} onChange={e => setExForm(f => ({...f, caloriesBurned: e.target.value}))}
                     placeholder="optional" className={inputCls} />
            </div>
          </div>
          <button onClick={handleAddExercise} disabled={!exForm.durationMin}
                  className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-semibold disabled:opacity-40 hover:bg-indigo-700 transition-colors">
            Save Exercise
          </button>
        </div>
      </BottomSheet>
    </div>
  )
}

function Section({ icon: Icon, iconBg, iconColor, title, children }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
          <Icon size={16} className={iconColor} />
        </div>
        <h3 className="font-medium text-sm text-gray-800">{title}</h3>
      </div>
      {children}
    </div>
  )
}

const inputCls = 'w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-400'
