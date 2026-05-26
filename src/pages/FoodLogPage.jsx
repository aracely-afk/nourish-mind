import React, { useState } from 'react'
import { Plus, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'
import { useFoodLog } from '../hooks/useFoodLog'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useProfile } from '../hooks/useProfile'
import { KEYS } from '../utils/storageKeys'
import { todayStr, formatDate, addDays, isToday } from '../utils/dateHelpers'
import { FOODS, searchFoods } from '../data/foodDatabase'
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
  const [savedMeals, setSavedMeals] = useLocalStorage(KEYS.SAVED_MEALS, [])

  // Sheet state
  const [sheet, setSheet] = useState(null) // { meal }
  const [sheetTab, setSheetTab] = useState('foods') // 'foods' | 'meals'

  // Food search state
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState(null)
  const [servings, setServings] = useState(1)

  // Create meal state
  const [creatingMeal, setCreatingMeal] = useState(false)
  const [mealName, setMealName] = useState('')
  const [mealIngredients, setMealIngredients] = useState([])

  // Custom food
  const [addCustomOpen, setAddCustomOpen] = useState(false)
  const [customForm, setCustomForm] = useState({ name: '', caloriesPer100g: '', trafficLight: 'green' })
  const [, setCustomFoods] = useLocalStorage(KEYS.CUSTOM_FOODS, [])

  const dayLog = getDayLog(date)
  const totalCal = getDayCalories(date)
  const results = searchFoods(query, filter).concat(
    query ? customFoods.filter(f => f.name.toLowerCase().includes(query.toLowerCase())) : []
  ).slice(0, 30)

  function openAdd(meal) {
    setSheet({ meal })
    setQuery(''); setFilter('all'); setSelected(null); setServings(1)
    setSheetTab('foods'); setCreatingMeal(false); setMealName(''); setMealIngredients([])
  }

  function closeSheet() {
    setSheet(null); setSelected(null); setServings(1)
    setCreatingMeal(false); setMealName(''); setMealIngredients([])
  }

  function handleAdd() {
    if (!selected) return
    const grams = selected.servingSizeG * servings
    addEntry(date, sheet.meal, {
      foodId: selected.id,
      name: selected.name,
      grams: Math.round(grams),
      calories: Math.round((selected.caloriesPer100g / 100) * grams),
      trafficLight: selected.trafficLight,
    })
    closeSheet()
  }

  function handleAddToMeal() {
    if (!selected) return
    const grams = selected.servingSizeG * servings
    const calories = Math.round((selected.caloriesPer100g / 100) * grams)
    setMealIngredients(prev => [...prev, {
      id: Date.now() + Math.random(),
      foodId: selected.id,
      name: selected.name,
      grams: Math.round(grams),
      calories,
      trafficLight: selected.trafficLight,
      servings,
      servingLabel: selected.servingLabel,
    }])
    setSelected(null)
    setServings(1)
    setQuery('')
  }

  function saveMeal() {
    if (!mealName.trim() || mealIngredients.length === 0) return
    const newMeal = {
      id: 'meal_' + Date.now(),
      name: mealName.trim(),
      ingredients: mealIngredients,
      totalCalories: mealIngredients.reduce((s, i) => s + i.calories, 0),
      createdAt: new Date().toISOString(),
    }
    setSavedMeals(prev => [newMeal, ...prev])
    setCreatingMeal(false)
    setMealName('')
    setMealIngredients([])
    setSheetTab('meals')
  }

  function logSavedMeal(savedMeal) {
    savedMeal.ingredients.forEach(ing => {
      addEntry(date, sheet.meal, {
        foodId: ing.foodId,
        name: ing.name,
        grams: ing.grams,
        calories: ing.calories,
        trafficLight: ing.trafficLight,
      })
    })
    closeSheet()
  }

  function deleteSavedMeal(mealId) {
    setSavedMeals(prev => prev.filter(m => m.id !== mealId))
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
  const mealTotalCal = mealIngredients.reduce((s, i) => s + i.calories, 0)

  const sheetTitle = creatingMeal
    ? 'Create New Meal'
    : sheet ? `Add to ${MEAL_LABELS[sheet.meal]}` : ''

  return (
    <div className="pb-4">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-gray-100">
        <div className="px-4 py-3">
          <h1 className="font-semibold text-gray-900 font-brand">Food Log</h1>
          <div className="flex items-center justify-between mt-2">
            <button onClick={() => setDate(d => addDays(d, -1))} className="p-1 rounded-full hover:bg-gray-100"><ChevronLeft size={20} className="text-gray-500" /></button>
            <span className={`text-sm font-medium ${isToday(date) ? 'text-brand-primary' : 'text-gray-700'}`}>
              {isToday(date) ? 'Today' : formatDate(date)}
            </span>
            <button onClick={() => setDate(d => addDays(d, 1))} disabled={isToday(date)}
                    className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-30"><ChevronRight size={20} className="text-gray-500" /></button>
          </div>
        </div>
        <div className="px-4 pb-3">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span className={inRange ? 'text-green-600 font-medium' : totalCal > profile.calorieMax ? 'text-red-500 font-medium' : 'text-gray-600'}>
              {totalCal.toLocaleString()} cal eaten
            </span>
            <span>Goal: {profile.calorieMin}–{profile.calorieMax}</span>
          </div>
          <ProgressBar value={totalCal} max={profile.calorieMax || 1700}
                       color={totalCal > profile.calorieMax ? 'bg-red-400' : inRange ? 'bg-green-500' : 'bg-brand-pale0'} />
        </div>
      </div>

      {/* Meal cards */}
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
                      className="w-full flex items-center gap-2 px-4 py-3 text-brand-primary text-sm font-medium hover:bg-brand-pale transition-colors border-t border-gray-50">
                <Plus size={16} /> Add food
              </button>
            </div>
          )
        })}
      </div>

      {/* Add Food / Meals Sheet */}
      <BottomSheet open={!!sheet} onClose={closeSheet} title={sheetTitle}>
        <div className="p-4 space-y-3">

          {/* ── CREATE MEAL FLOW ── */}
          {creatingMeal ? (
            <div className="space-y-3">
              <button
                onClick={() => { setCreatingMeal(false); setSelected(null); setQuery(''); setMealIngredients([]); setMealName('') }}
                className="flex items-center gap-1 text-brand-primary text-sm font-medium"
              >
                ← Back to My Meals
              </button>

              <input
                type="text"
                value={mealName}
                onChange={e => setMealName(e.target.value)}
                placeholder="Meal name (e.g. Chelly's Yogurt Bowl)"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-secondary"
              />

              {/* Ingredient list */}
              {mealIngredients.length > 0 && (
                <div className="bg-gray-50 rounded-xl p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Ingredients</p>
                    <span className="text-xs font-bold text-brand-primary">{mealTotalCal} cal total</span>
                  </div>
                  {mealIngredients.map((ing, i) => (
                    <div key={ing.id} className="flex items-center gap-2">
                      <TrafficDot light={ing.trafficLight} size={8} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-700 truncate">{ing.name}</p>
                        <p className="text-[10px] text-gray-400">{ing.servings} × {ing.servingLabel}</p>
                      </div>
                      <span className="text-xs text-gray-500 w-12 text-right">{ing.calories} cal</span>
                      <button onClick={() => setMealIngredients(prev => prev.filter((_, j) => j !== i))}
                              className="p-0.5 text-gray-300 hover:text-red-400 transition-colors">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Ingredient search */}
              {!selected ? (
                <div className="space-y-2">
                  <SearchBar value={query} onChange={setQuery} placeholder="Search ingredient..." />
                  <div className="flex gap-2">
                    {['all','green','yellow','orange'].map(f => (
                      <button key={f} onClick={() => setFilter(f)}
                              className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize ${filter===f ? 'bg-brand-primary text-white' : 'bg-gray-100 text-gray-600'}`}>
                        {f}
                      </button>
                    ))}
                  </div>
                  <div className="space-y-1 max-h-36 overflow-y-auto no-scrollbar">
                    {!query && <p className="text-xs text-gray-400 text-center py-2">Search for an ingredient above</p>}
                    {query && results.length === 0 && <p className="text-sm text-gray-400 text-center py-3">No foods found</p>}
                    {results.map(f => (
                      <button key={f.id} onClick={() => { setSelected(f); setServings(1) }}
                              className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 text-left transition-colors">
                        <TrafficDot light={f.trafficLight} size={8} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-800 truncate">{f.name}</p>
                          <p className="text-xs text-gray-400">{f.servingLabel} · {Math.round((f.caloriesPer100g / 100) * f.servingSizeG)} cal</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <TrafficDot light={selected.trafficLight} size={8} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{selected.name}</p>
                      <p className="text-xs text-gray-500">1 serving = {selected.servingLabel}</p>
                    </div>
                    <button onClick={() => setSelected(null)} className="text-xs text-brand-primary font-medium">Change</button>
                  </div>
                  <div className="flex items-center justify-center gap-6 py-1">
                    <button onClick={() => setServings(s => Math.max(0.5, Math.round((s - 0.5) * 2) / 2))}
                            className="w-10 h-10 rounded-full bg-gray-100 text-gray-700 text-xl font-bold flex items-center justify-center hover:bg-gray-200 active:scale-95 transition-all">−</button>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-brand-primary">{servings}</div>
                      <div className="text-xs text-gray-400">serving{servings !== 1 ? 's' : ''}</div>
                    </div>
                    <button onClick={() => setServings(s => Math.round((s + 0.5) * 2) / 2)}
                            className="w-10 h-10 rounded-full bg-brand-primary text-white text-xl font-bold flex items-center justify-center hover:bg-[#3a2270] active:scale-95 transition-all">+</button>
                  </div>
                  <div className="text-center">
                    <span className="text-2xl font-bold text-gray-900">
                      {Math.round((selected.caloriesPer100g / 100) * selected.servingSizeG * servings)}
                    </span>
                    <span className="text-gray-400 text-sm ml-1">calories</span>
                  </div>
                  <button onClick={handleAddToMeal}
                          className="w-full bg-brand-primary text-white py-3.5 rounded-xl font-semibold hover:bg-[#3a2270] transition-colors">
                    + Add to Meal
                  </button>
                </div>
              )}

              {/* Save meal button */}
              <button
                onClick={saveMeal}
                disabled={!mealName.trim() || mealIngredients.length === 0}
                className="w-full bg-gradient-to-r from-[#4B2E83] to-[#A88FCF] text-white py-4 rounded-xl font-semibold disabled:opacity-40 transition-all"
              >
                Save Meal{mealIngredients.length > 0 ? ` (${mealIngredients.length} item${mealIngredients.length !== 1 ? 's' : ''}, ${mealTotalCal} cal)` : ''}
              </button>
            </div>

          ) : (
            <>
              {/* ── TAB BAR ── */}
              <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
                <button
                  onClick={() => { setSheetTab('foods'); setSelected(null); setServings(1) }}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${sheetTab === 'foods' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}
                >
                  Foods
                </button>
                <button
                  onClick={() => { setSheetTab('meals'); setSelected(null); setServings(1) }}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${sheetTab === 'meals' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}
                >
                  My Meals{savedMeals.length > 0 && <span className="ml-1 text-brand-primary font-bold">({savedMeals.length})</span>}
                </button>
              </div>

              {/* ── FOODS TAB ── */}
              {sheetTab === 'foods' && (
                <>
                  <SearchBar value={query} onChange={setQuery} autoFocus />
                  <div className="flex gap-2">
                    {['all','green','yellow','orange'].map(f => (
                      <button key={f} onClick={() => setFilter(f)}
                              className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize ${filter===f ? 'bg-brand-primary text-white' : 'bg-gray-100 text-gray-600'}`}>
                        {f}
                      </button>
                    ))}
                  </div>
                  {!selected ? (
                    <div className="space-y-1 max-h-64 overflow-y-auto no-scrollbar">
                      {results.length === 0 && <p className="text-sm text-gray-400 text-center py-4">No foods found</p>}
                      {results.map(f => (
                        <button key={f.id} onClick={() => { setSelected(f); setServings(1) }}
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
                              className="w-full text-center py-3 text-brand-primary text-sm font-medium hover:bg-brand-pale rounded-xl transition-colors">
                        + Add custom food
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                        <TrafficDot light={selected.trafficLight} size={10} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800 truncate">{selected.name}</p>
                          <p className="text-xs text-gray-500">1 serving = {selected.servingLabel}</p>
                        </div>
                        <button onClick={() => setSelected(null)} className="text-xs text-brand-primary font-medium">Change</button>
                      </div>
                      <div className="bg-white border border-gray-200 rounded-2xl p-4">
                        <p className="text-xs text-gray-500 mb-3 text-center">How many servings?</p>
                        <div className="flex items-center justify-center gap-6">
                          <button
                            onClick={() => setServings(s => Math.max(0.5, Math.round((s - 0.5) * 2) / 2))}
                            className="w-11 h-11 rounded-full bg-gray-100 text-gray-700 text-xl font-bold flex items-center justify-center hover:bg-gray-200 active:scale-95 transition-all"
                          >−</button>
                          <div className="text-center">
                            <div className="text-3xl font-bold text-brand-primary">{servings}</div>
                            <div className="text-xs text-gray-400">serving{servings !== 1 ? 's' : ''}</div>
                          </div>
                          <button
                            onClick={() => setServings(s => Math.round((s + 0.5) * 2) / 2)}
                            className="w-11 h-11 rounded-full bg-brand-primary text-white text-xl font-bold flex items-center justify-center hover:bg-[#3a2270] active:scale-95 transition-all"
                          >+</button>
                        </div>
                      </div>
                      <div className="text-center py-1">
                        <span className="text-2xl font-bold text-gray-900">
                          {Math.round((selected.caloriesPer100g / 100) * selected.servingSizeG * servings)}
                        </span>
                        <span className="text-gray-400 text-sm ml-1">calories</span>
                      </div>
                      <button onClick={handleAdd}
                              className="w-full bg-brand-primary text-white py-4 rounded-xl font-semibold hover:bg-[#3a2270] transition-colors text-base">
                        Add to Log
                      </button>
                    </div>
                  )}
                </>
              )}

              {/* ── MY MEALS TAB ── */}
              {sheetTab === 'meals' && (
                <div className="space-y-3">
                  {savedMeals.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="text-4xl mb-3">🍽️</div>
                      <p className="text-sm font-medium text-gray-700">No saved meals yet</p>
                      <p className="text-xs text-gray-400 mt-1">Save your go-to combos for quick logging</p>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-64 overflow-y-auto no-scrollbar">
                      {savedMeals.map(meal => (
                        <div key={meal.id} className="bg-gray-50 rounded-xl p-3">
                          <div className="flex items-start justify-between mb-1">
                            <p className="text-sm font-semibold text-gray-800 flex-1 pr-2">{meal.name}</p>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <span className="text-xs text-brand-primary font-bold">{meal.totalCalories} cal</span>
                              <button onClick={() => deleteSavedMeal(meal.id)} className="p-0.5 text-gray-300 hover:text-red-400 transition-colors">
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>
                          <p className="text-xs text-gray-400 mb-2 line-clamp-1">
                            {meal.ingredients.map(i => i.name).join(', ')}
                          </p>
                          <button
                            onClick={() => logSavedMeal(meal)}
                            className="w-full bg-brand-primary text-white py-2 rounded-lg text-sm font-semibold hover:bg-[#3a2270] transition-colors"
                          >
                            Log This Meal
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <button
                    onClick={() => { setCreatingMeal(true); setMealName(''); setMealIngredients([]); setSelected(null); setQuery(''); setFilter('all') }}
                    className="w-full border-2 border-dashed border-brand-secondary text-brand-primary py-3 rounded-xl text-sm font-medium hover:bg-brand-pale transition-colors"
                  >
                    + Create New Meal
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </BottomSheet>

      {/* Custom Food Sheet */}
      <BottomSheet open={addCustomOpen} onClose={() => setAddCustomOpen(false)} title="Add Custom Food">
        <div className="p-4 space-y-3">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Food name</label>
            <input type="text" value={customForm.name} onChange={e => setCustomForm(f => ({...f, name: e.target.value}))}
                   placeholder="e.g. Mom's Soup" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-secondary" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Calories per 100g</label>
            <input type="number" value={customForm.caloriesPer100g} onChange={e => setCustomForm(f => ({...f, caloriesPer100g: e.target.value}))}
                   placeholder="e.g. 150" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-secondary" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Category</label>
            <div className="flex gap-2">
              {['green','yellow','orange'].map(l => (
                <button key={l} onClick={() => setCustomForm(f => ({...f, trafficLight: l}))}
                        className={`flex-1 py-2 rounded-xl text-xs font-medium transition-colors capitalize border ${customForm.trafficLight===l ? 'border-brand-primary bg-brand-pale text-indigo-700' : 'border-gray-200 text-gray-600'}`}>
                  {l}
                </button>
              ))}
            </div>
          </div>
          <button onClick={saveCustomFood} disabled={!customForm.name || !customForm.caloriesPer100g}
                  className="w-full bg-brand-primary text-white py-3.5 rounded-xl font-semibold disabled:opacity-40 hover:bg-[#3a2270] transition-colors">
            Save Custom Food
          </button>
        </div>
      </BottomSheet>
    </div>
  )
}
