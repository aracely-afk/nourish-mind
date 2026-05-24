import React, { useState } from 'react'
import { Plus, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'
import { useFoodLog } from '../hooks/useFoodLog'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useProfile } from '../hooks/useProfile'
import { KEYS } from '../utils/storageKeys'
import { todayStr, formatDate, addDays, isToday } from '../utils/dateHelpers'
import { FOODS, searchFoods, calcCaloriesForGrams } from '../data/foodDatabase'
import { TrafficDot } from '../components/ui/TrafficLightBadge'
import TrafficLightBadge from '../components/ui/TrafficLightBadge'
import BottomSheet from '../components/ui/BottomSheet'
import SearchBar from '../components/ui/SearchBar'
import ProgressBar from '../components/ui/ProgressBar'

const MEALS = ['breakfast', 'lunch', 'dinner', 'snacks']
const MEAL_LABELS = { breakfast: '☀️ Breakfast', lunch: '🌤️ Lunch', dinner: '🌙 Dinner', snacks: '🍎 Snacks' }

export default function FoodLogPage() {
  const [date, setDate] = useState(todayStr())
  const { getDayLog, addEntry, removeEntry, getDayCalories } = useFoodLog()
  const { profile } = useProfile()
  const [customFoods] = useLocalStorage(KEYS.CUSTOM_FOODS, [])

  const [sheet, setSheet] = useState(null) // { meal }
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState(null)
  const [grams, setGrams] = useState('')
  const [addCustomOpen, setAddCustomOpen] = useState(false)
  const [customForm, setCustomForm] = useState({ name: '', caloriesPer100g: '', trafficLight: 'green' })
  const [, setCustomFoods] = useLocalStorage(KEYS.CUSTOM_FOODS, [])

  const dayLog = getDayLog(date)
  const totalCal = getDayCalories(date)
  const allFoods = [...FOODS, ...customFoods.map(f => ({ ...f, keywords: f.name.toLowerCase().split(' ') }))]
  const results = searchFoods(query, filter).concat(
    query ? customFoods.filter(f => f.name.toLowerCase().includes(query.toLowerCase())) : []
  ).slice(0, 30)

  function openAdd(meal) { setSheet({ meal }); setQuery(''); setFilter('all'); setSelected(null); setGrams('') }
  function closeSheet() { setSheet(null); setSelected(null); setGrams('') }

  function handleAdd() {
    if (!selected || !grams) return
    const g = parseFloat(grams)
    if (isNaN(g) || g <= 0) return
    addEntry(date, sheet.meal, {
      foodId: selected.id,
      name: selected.name,
      grams: g,
      calories: calcCaloriesForGrams(selected, g),
      trafficLight: selected.trafficLight,
    })
    closeSheet()
  }

  function saveCustomFood() {
    if (!customForm.name || !customForm.caloriesPer100g) return
    const food = {
      id: 'custom_' + Date.now(),
      name: customForm.name,
      caloriesPer100g: parseFloat(customForm.caloriesPer100g),
      trafficLight: customForm.trafficLight,
      isCustom: true,
      category: 'custom',
      servingSizeG: 100, servingLabel: '100g',
      createdAt: new Date().toISOString(),
    }
    setCustomFoods(prev => [food, ...prev])
    setCustomForm({ name: '', caloriesPer100g: '', trafficLight: 'green' })
    setAddCustomOpen(false)
  }

  const inRange = totalCal >= profile.calorieMin && totalCal <= profile.calorieMax
  const pct = profile.calorieMax > 0 ? Math.min(totalCal / profile.calorieMax, 1) : 0

  return (
    <div className="pb-4">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-gray-100">
        <div className="px-4 py-3">
          <h1 className="font-semibold text-gray-900">Food Log</h1>
          <div className="flex items-center justify-between mt-2">
            <button onClick={() => setDate(d => addDays(d, -1))} className="p-1 rounded-full hover:bg-gray-100"><ChevronLeft size={20} className="text-gray-500" /></button>
            <span className={`text-sm font-medium ${isToday(date) ? 'text-indigo-600' : 'text-gray-700'}`}>
              {isToday(date) ? 'Today' : formatDate(date)}
            </span>
            <button onClick={() => setDate(d => addDays(d, 1))} disabled={isToday(date)}
                    className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-30"><ChevronRight size={20} className="text-gray-500" /></button>
          </div>
        </div>
        {/* Calorie summary bar */}
        <div className="px-4 pb-3">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span className={inRange ? 'text-green-600 font-medium' : totalCal > profile.calorieMax ? 'text-red-500 font-medium' : 'text-gray-600'}>
              {totalCal.toLocaleString()} cal eaten
            </span>
            <span>Goal: {profile.calorieMin}–{profile.calorieMax}</span>
          </div>
          <ProgressBar value={totalCal} max={profile.calorieMax || 1700}
                       color={totalCal > profile.calorieMax ? 'bg-red-400' : inRange ? 'bg-green-500' : 'bg-indigo-500'} />
        </div>
      </div>

      {/* Meals */}
      <div className="p-4 space-y-4">
        {MEALS.map(meal => {
          const entries = dayLog[meal] || []
          const mealCal = entries.reduce((s, e) => s + e.calories, 0)
          return (
            <div key={meal} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50">
                <span className="font-medium text-sm text-gray-800">{MEAL_LABELS[meal]}</span>
                <span className="text-xs text-gray-400">{mealCal > 0 ? `${mealCal} cal` : '0 cal'}</span>
              </div>
              {entries.length === 0 ? (
                <p className="text-xs text-gray-400 px-4 py-3">Nothing logged yet</p>
              ) : (
                <div className="divide-y divide-gray-50">
                  {entries.map(e => (
                    <div key={e.id} className="flex items-center gap-3 px-4 py-2.5">
                      <TrafficDot light={e.trafficLight} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-800 truncate">{e.name}</p>
                        <p className="text-xs text-gray-400">{e.grams}g</p>
                      </div>
                      <span className="text-sm font-medium text-gray-700 w-14 text-right">{e.calories} cal</span>
                      <button onClick={() => removeEntry(date, meal, e.id)} className="p-1 text-gray-300 hover:text-red-400 transition-colors">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <button onClick={() => openAdd(meal)}
                      className="w-full flex items-center gap-2 px-4 py-3 text-indigo-600 text-sm font-medium hover:bg-indigo-50 transition-colors border-t border-gray-50">
                <Plus size={16} /> Add food
              </button>
            </div>
          )
        })}
      </div>

      {/* Add Food Sheet */}
      <BottomSheet open={!!sheet} onClose={closeSheet} title={sheet ? `Add to ${MEAL_LABELS[sheet.meal]}` : ''}>
        <div className="p-4 space-y-3">
          <SearchBar value={query} onChange={setQuery} autoFocus />
          {/* Filter tabs */}
          <div className="flex gap-2">
            {['all','green','yellow','orange'].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize ${filter===f ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                {f}
              </button>
            ))}
          </div>
          {/* Results */}
          {!selected ? (
            <div className="space-y-1 max-h-64 overflow-y-auto no-scrollbar">
              {results.length === 0 && <p className="text-sm text-gray-400 text-center py-4">No foods found</p>}
              {results.map(f => (
                <button key={f.id} onClick={() => { setSelected(f); setGrams(String(f.servingSizeG)) }}
                        className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 text-left transition-colors">
                  <TrafficDot light={f.trafficLight} size={10} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 truncate">{f.name}</p>
                    <p className="text-xs text-gray-400">{f.caloriesPer100g} cal/100g · {f.servingLabel}</p>
                  </div>
                  <TrafficLightBadge light={f.trafficLight} size="xs" />
                </button>
              ))}
              <button onClick={() => setAddCustomOpen(true)}
                      className="w-full text-center py-3 text-indigo-600 text-sm font-medium hover:bg-indigo-50 rounded-xl transition-colors">
                + Add custom food
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
                <TrafficDot light={selected.trafficLight} size={10} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{selected.name}</p>
                  <p className="text-xs text-gray-500">{selected.caloriesPer100g} cal per 100g</p>
                </div>
                <button onClick={() => setSelected(null)} className="text-xs text-gray-400 hover:text-gray-600">Change</button>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Grams</label>
                <input type="number" value={grams} onChange={e => setGrams(e.target.value)} min="1"
                       className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                <p className="text-xs text-gray-400 mt-1">
                  ≈ {grams ? Math.round((selected.caloriesPer100g/100)*parseFloat(grams)||0) : 0} calories
                </p>
              </div>
              <button onClick={handleAdd}
                      className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-semibold hover:bg-indigo-700 transition-colors">
                Add to Log
              </button>
            </div>
          )}
        </div>
      </BottomSheet>

      {/* Custom Food Sheet */}
      <BottomSheet open={addCustomOpen} onClose={() => setAddCustomOpen(false)} title="Add Custom Food">
        <div className="p-4 space-y-3">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Food name</label>
            <input type="text" value={customForm.name} onChange={e => setCustomForm(f => ({...f, name: e.target.value}))}
                   placeholder="e.g. Mom's Soup" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Calories per 100g</label>
            <input type="number" value={customForm.caloriesPer100g} onChange={e => setCustomForm(f => ({...f, caloriesPer100g: e.target.value}))}
                   placeholder="e.g. 150" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Category</label>
            <div className="flex gap-2">
              {['green','yellow','orange'].map(l => (
                <button key={l} onClick={() => setCustomForm(f => ({...f, trafficLight: l}))}
                        className={`flex-1 py-2 rounded-xl text-xs font-medium transition-colors capitalize border ${customForm.trafficLight===l ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-200 text-gray-600'}`}>
                  {l}
                </button>
              ))}
            </div>
          </div>
          <button onClick={saveCustomFood} disabled={!customForm.name || !customForm.caloriesPer100g}
                  className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-semibold disabled:opacity-40 hover:bg-indigo-700 transition-colors">
            Save Custom Food
          </button>
        </div>
      </BottomSheet>
    </div>
  )
}
