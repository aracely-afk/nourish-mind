import React, { useState, useEffect, useRef } from 'react'
import { Plus, Trash2, ChevronLeft, ChevronRight, ScanLine, Loader, CheckCircle2, Globe } from 'lucide-react'
import { useFoodLog } from '../hooks/useFoodLog'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useProfile } from '../hooks/useProfile'
import { KEYS } from '../utils/storageKeys'
import { todayStr, formatDate, addDays, isToday } from '../utils/dateHelpers'
import { pushToCloud } from '../utils/syncData'
import { FOODS, searchFoods } from '../data/foodDatabase'
import { searchFoodsOnline } from '../utils/searchFoodsOnline'
import { TrafficDot } from '../components/ui/TrafficLightBadge'
import TrafficLightBadge from '../components/ui/TrafficLightBadge'
import BottomSheet from '../components/ui/BottomSheet'
import SearchBar from '../components/ui/SearchBar'
import ProgressBar from '../components/ui/ProgressBar'
import BarcodeScanner from '../components/ui/BarcodeScanner'

// ── Open Food Facts lookup ────────────────────────────────────────────────────
async function lookupBarcode(barcode) {
  try {
    const res = await fetch(
      `https://world.openfoodfacts.org/api/v2/product/${barcode}.json?fields=product_name,product_name_en,brands,serving_size,serving_quantity,nutriments`,
      { signal: AbortSignal.timeout(10000) }
    )
    if (!res.ok) return null
    const data = await res.json()
    if (data.status !== 1 || !data.product) return null

    const p = data.product
    const n = p.nutriments || {}

    // Try kcal first, fall back to converting kJ
    const cal100g =
      n['energy-kcal_100g'] ??
      (n['energy-kj_100g'] ? Math.round(n['energy-kj_100g'] / 4.184) : null)
    if (!cal100g) return null

    const servingSizeG  = parseFloat(p.serving_quantity) || 100
    const servingLabel  = p.serving_size || '1 serving'
    const productName   = p.product_name || p.product_name_en || 'Unknown Product'
    const brandName     = p.brands ? p.brands.split(',')[0].trim() : null
    const displayName   = brandName ? `${productName} (${brandName})` : productName
    const trafficLight  = cal100g < 300 ? 'green' : cal100g < 500 ? 'yellow' : 'orange'

    return {
      id:             `barcode_${barcode}`,
      name:           displayName,
      brand:          brandName,
      barcode,
      caloriesPer100g: Math.round(cal100g),
      servingSizeG,
      servingLabel,
      proteinG: n.proteins_100g        ?? null,
      carbsG:   n.carbohydrates_100g   ?? null,
      fatG:     n.fat_100g             ?? null,
      trafficLight,
      isCustom:  true,
      category:  'custom',
    }
  } catch {
    return null
  }
}

const MEALS = ['breakfast', 'lunch', 'dinner', 'snacks']
const MEAL_LABELS = { breakfast: '☀️ Breakfast', lunch: '🌤️ Lunch', dinner: '🌙 Dinner', snacks: '🍎 Snacks' }

export default function FoodLogPage() {
  const [date, setDate] = useState(todayStr())
  const { getDayLog, addEntry, removeEntry, getDayCalories, isDayDone, markDayDone } = useFoodLog()
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
  const [customForm, setCustomForm] = useState({
    name: '', brand: '', servingLabel: '', calories: '',
    proteinG: '', carbsG: '', fatG: '', trafficLight: 'green',
  })
  const [, setCustomFoods] = useLocalStorage(KEYS.CUSTOM_FOODS, [])

  // Barcode scanner
  const [scannerOpen, setScannerOpen] = useState(false)
  const [scanLoading, setScanLoading] = useState(false)
  const [scanError, setScanError] = useState(null) // 'not_found' | 'error' | null

  // Online food search (Open Food Facts)
  const [onlineResults, setOnlineResults] = useState([])
  const [onlineLoading, setOnlineLoading] = useState(false)
  const onlineAbortRef = useRef(null)

  // Debounced online search: fires 500ms after the query settles
  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setOnlineResults([])
      setOnlineLoading(false)
      return
    }
    setOnlineLoading(true)
    const timer = setTimeout(async () => {
      const controller = new AbortController()
      onlineAbortRef.current = controller
      try {
        const data = await searchFoodsOnline(query, controller.signal)
        setOnlineResults(data)
      } catch {
        setOnlineResults([])
      } finally {
        setOnlineLoading(false)
      }
    }, 500)
    return () => {
      clearTimeout(timer)
      onlineAbortRef.current?.abort()
      setOnlineLoading(false)
    }
  }, [query])

  const dayLog = getDayLog(date)
  const totalCal = getDayCalories(date)
  const dayDone = isDayDone(date)
  // Local results (database + saved custom foods)
  const results = searchFoods(query, filter).concat(
    query ? customFoods.filter(f => f.name.toLowerCase().includes(query.toLowerCase())) : []
  ).slice(0, 30)

  // Online results: apply traffic-light filter, then deduplicate against local
  const filteredOnline = (filter !== 'all'
    ? onlineResults.filter(f => f.trafficLight === filter)
    : onlineResults
  )
  const localNameSet = new Set(results.map(f => f.name.toLowerCase().slice(0, 25)))
  const newOnline = filteredOnline.filter(f => !localNameSet.has(f.name.toLowerCase().slice(0, 25)))

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
    if (!customForm.name || !customForm.calories) return
    const calories = parseFloat(customForm.calories)
    const displayName = customForm.brand
      ? `${customForm.name} (${customForm.brand})`
      : customForm.name
    const food = {
      id: 'custom_' + Date.now(),
      name: displayName,
      brand: customForm.brand || null,
      // servingSizeG = 100 so caloriesPer100g == calories per serving
      caloriesPer100g: Math.round(calories),
      servingSizeG: 100,
      servingLabel: customForm.servingLabel.trim() || '1 serving',
      trafficLight: customForm.trafficLight,
      isCustom: true,
      category: 'custom',
      proteinG: customForm.proteinG ? parseFloat(customForm.proteinG) : null,
      carbsG:   customForm.carbsG   ? parseFloat(customForm.carbsG)   : null,
      fatG:     customForm.fatG     ? parseFloat(customForm.fatG)     : null,
      createdAt: new Date().toISOString(),
    }
    setCustomFoods(prev => [food, ...prev])
    setCustomForm({ name: '', brand: '', servingLabel: '', calories: '', proteinG: '', carbsG: '', fatG: '', trafficLight: 'green' })
    setAddCustomOpen(false)
  }

  async function handleBarcodeScan(barcode) {
    setScannerOpen(false)
    setScanLoading(true)
    setScanError(null)

    // Check if we already saved this barcode before
    const existing = customFoods.find(f => f.barcode === barcode)
    if (existing) {
      setSelected(existing)
      setServings(1)
      setScanLoading(false)
      return
    }

    // Query Open Food Facts
    const food = await lookupBarcode(barcode)
    setScanLoading(false)

    if (food) {
      // Cache it in custom foods so future scans are instant
      setCustomFoods(prev =>
        prev.find(f => f.id === food.id) ? prev : [food, ...prev]
      )
      setSelected(food)
      setServings(1)
    } else {
      // Not found — open the custom form so the user can fill it in
      setScanError('not_found')
      setCustomForm(f => ({ ...f, name: `Scanned item (${barcode})`, brand: '' }))
      setAddCustomOpen(true)
    }
  }

  const inRange = totalCal >= profile.calorieMin && totalCal <= profile.calorieMax
  const mealTotalCal = mealIngredients.reduce((s, i) => s + i.calories, 0)

  const sheetTitle = creatingMeal
    ? 'Create New Meal'
    : sheet ? `Add to ${MEAL_LABELS[sheet.meal]}` : ''

  // Footer button — always pinned at the bottom of the sheet, never scrolls away
  let sheetFooter = null
  if (sheet && selected) {
    if (creatingMeal) {
      sheetFooter = (
        <button onClick={handleAddToMeal}
                className="w-full bg-brand-primary text-white py-3.5 rounded-xl font-semibold hover:bg-[#3a2270] active:scale-[0.98] transition-all">
          + Add to Meal
        </button>
      )
    } else if (sheetTab === 'foods') {
      sheetFooter = (
        <button onClick={handleAdd}
                className="w-full bg-brand-primary text-white py-3.5 rounded-xl font-semibold hover:bg-[#3a2270] active:scale-[0.98] transition-all text-base">
          Add to Log
        </button>
      )
    }
  }

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
                <span className="text-xs text-gray-500">{mealCal > 0 ? `${mealCal} cal` : '0 cal'}</span>
              </div>
              {entries.length === 0 ? (
                <p className="text-xs text-gray-500 px-4 py-3">Nothing logged yet</p>
              ) : (
                <div className="divide-y divide-gray-50">
                  {entries.map(e => (
                    <div key={e.id} className="flex items-center gap-3 px-4 py-2.5">
                      <TrafficDot light={e.trafficLight} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-800 truncate">{e.name}</p>
                        <p className="text-xs text-gray-500">{e.grams}g</p>
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

      {/* Finished logging for the day — today only */}
      {isToday(date) && (
        <div className="px-4 pb-6">
          {dayDone ? (
            // ── Done banner ──
            <div className="rounded-2xl overflow-hidden"
                 style={{ background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)' }}>
              <div className="p-4 flex items-start gap-3">
                <CheckCircle2 size={22} className="text-white flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-white font-bold text-base leading-tight">All meals logged for today!</p>
                  <p className="text-white/80 text-xs mt-0.5">
                    {totalCal > 0
                      ? `${totalCal.toLocaleString()} cal · ${totalCal >= (profile.calorieMin || 0) && totalCal <= (profile.calorieMax || 9999) ? '✓ In your range' : totalCal > (profile.calorieMax || 9999) ? 'Over range' : 'Below range'}`
                      : 'Great work staying mindful today'}
                  </p>
                </div>
              </div>
              <div className="border-t border-white/20 px-4 py-2.5">
                <button
                  onClick={() => markDayDone(date, false)}
                  className="text-white/70 text-xs font-medium hover:text-white transition-colors"
                >
                  Forgot something? Tap to add more
                </button>
              </div>
            </div>
          ) : (
            // ── Done button ──
            <button
              onClick={() => { markDayDone(date, true); pushToCloud() }}
              disabled={totalCal === 0}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl border-2 border-green-500 text-green-600 font-semibold text-sm bg-green-50 hover:bg-green-100 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <CheckCircle2 size={18} />
              Finished logging for the day
            </button>
          )}
        </div>
      )}

      {/* Add Food / Meals Sheet */}
      <BottomSheet open={!!sheet} onClose={closeSheet} title={sheetTitle} footer={sheetFooter}>
        <div className="p-3 space-y-2">

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
                        <p className="text-xs text-gray-500">{ing.servings} × {ing.servingLabel}</p>
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
                  <div className="space-y-1 max-h-44 overflow-y-auto no-scrollbar">
                    {!query && <p className="text-xs text-gray-500 text-center py-2">Search for an ingredient above</p>}
                    {query && results.length === 0 && !onlineLoading && newOnline.length === 0 && (
                      <p className="text-sm text-gray-500 text-center py-3">No foods found</p>
                    )}
                    {results.map(f => (
                      <button key={f.id} onClick={() => { setSelected(f); setServings(1) }}
                              className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 text-left transition-colors">
                        <TrafficDot light={f.trafficLight} size={8} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-800 truncate">{f.name}</p>
                          <p className="text-xs text-gray-500">{f.servingLabel} · {Math.round((f.caloriesPer100g / 100) * f.servingSizeG)} cal</p>
                        </div>
                      </button>
                    ))}
                    {onlineLoading && query.trim().length >= 2 && (
                      <div className="flex items-center gap-2 px-2 py-1.5">
                        <Loader size={12} className="animate-spin text-brand-secondary flex-shrink-0" />
                        <span className="text-xs text-gray-500">Searching online...</span>
                      </div>
                    )}
                    {query && newOnline.length > 0 && (
                      <>
                        <div className="flex items-center gap-1.5 px-1 pt-1.5 pb-0.5">
                          <Globe size={10} className="text-gray-400" />
                          <span className="text-xs text-gray-400 uppercase tracking-wide font-medium">Open Food Facts</span>
                        </div>
                        {newOnline.map(f => (
                          <button key={f.id} onClick={() => { setSelected(f); setServings(1) }}
                                  className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 text-left transition-colors">
                            <TrafficDot light={f.trafficLight} size={8} />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-gray-800 truncate">{f.name}</p>
                              <p className="text-xs text-gray-500">{f.servingLabel} · {Math.round((f.caloriesPer100g / 100) * f.servingSizeG)} cal</p>
                            </div>
                          </button>
                        ))}
                      </>
                    )}
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
                    <button onClick={() => setSelected(null)} className="text-xs text-brand-primary font-medium flex-shrink-0">Change</button>
                  </div>

                  {/* Compact serving + calorie row */}
                  <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2.5">
                    <span className="text-xs text-gray-500 flex-shrink-0">Servings</span>
                    <button onClick={() => setServings(s => Math.max(0.5, Math.round((s - 0.5) * 2) / 2))}
                            className="w-9 h-9 rounded-full bg-white border border-gray-200 text-gray-700 text-lg font-bold flex items-center justify-center active:scale-95 transition-all flex-shrink-0 shadow-sm">−</button>
                    <span className="text-xl font-bold text-brand-primary w-8 text-center flex-shrink-0">{servings}</span>
                    <button onClick={() => setServings(s => Math.round((s + 0.5) * 2) / 2)}
                            className="w-9 h-9 rounded-full bg-brand-primary text-white text-lg font-bold flex items-center justify-center active:scale-95 transition-all flex-shrink-0">+</button>
                    <div className="flex-1 text-right">
                      <span className="text-xl font-bold text-gray-900">
                        {Math.round((selected.caloriesPer100g / 100) * selected.servingSizeG * servings)}
                      </span>
                      <span className="text-sm text-gray-400 ml-1">cal</span>
                    </div>
                  </div>
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
                  {/* Search + scan row */}
                  <div className="flex gap-2 items-center">
                    <div className="flex-1">
                      <SearchBar value={query} onChange={setQuery} autoFocus />
                    </div>
                    <button
                      onClick={() => setScannerOpen(true)}
                      className="flex-shrink-0 w-11 h-11 rounded-xl bg-brand-primary flex items-center justify-center text-white hover:bg-[#3a2270] active:scale-95 transition-all"
                      title="Scan barcode"
                    >
                      {scanLoading
                        ? <Loader size={18} className="animate-spin" />
                        : <ScanLine size={18} />}
                    </button>
                  </div>

                  {/* Scan error banner */}
                  {scanError === 'not_found' && (
                    <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5">
                      <span className="text-amber-500 text-sm">⚠️</span>
                      <p className="text-xs text-amber-700 flex-1">
                        Item not found in database. Fill in the details below to save it for next time.
                      </p>
                      <button onClick={() => setScanError(null)} className="text-amber-400 hover:text-amber-600 text-xs font-bold">✕</button>
                    </div>
                  )}

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
                      {/* Local results */}
                      {results.length === 0 && !onlineLoading && newOnline.length === 0 && (
                        <p className="text-sm text-gray-500 text-center py-4">{query ? 'No foods found' : 'Search above to find foods'}</p>
                      )}
                      {results.map(f => (
                        <button key={f.id} onClick={() => { setSelected(f); setServings(1) }}
                                className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 text-left transition-colors">
                          <TrafficDot light={f.trafficLight} size={10} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-800 truncate">{f.name}</p>
                            <p className="text-xs text-gray-500">{Math.round((f.caloriesPer100g / 100) * f.servingSizeG)} cal · {f.servingLabel}</p>
                          </div>
                          <TrafficLightBadge light={f.trafficLight} size="xs" />
                        </button>
                      ))}

                      {/* Online search status */}
                      {onlineLoading && query.trim().length >= 2 && (
                        <div className="flex items-center gap-2 px-2.5 py-2">
                          <Loader size={13} className="animate-spin text-brand-secondary flex-shrink-0" />
                          <span className="text-xs text-gray-500">Searching online...</span>
                        </div>
                      )}

                      {/* Online results from Open Food Facts */}
                      {query && newOnline.length > 0 && (
                        <>
                          <div className="flex items-center gap-1.5 px-1 pt-2 pb-0.5">
                            <Globe size={11} className="text-gray-400" />
                            <span className="text-xs text-gray-400 uppercase tracking-wide font-medium">Open Food Facts</span>
                          </div>
                          {newOnline.map(f => (
                            <button key={f.id} onClick={() => { setSelected(f); setServings(1) }}
                                    className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 text-left transition-colors">
                              <TrafficDot light={f.trafficLight} size={10} />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-gray-800 truncate">{f.name}</p>
                                <p className="text-xs text-gray-500">{Math.round((f.caloriesPer100g / 100) * f.servingSizeG)} cal · {f.servingLabel}</p>
                              </div>
                              <TrafficLightBadge light={f.trafficLight} size="xs" />
                            </button>
                          ))}
                        </>
                      )}

                      <button onClick={() => setAddCustomOpen(true)}
                              className="w-full text-center py-2.5 text-brand-primary text-sm font-medium hover:bg-brand-pale rounded-xl transition-colors">
                        + Add custom food
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {/* Selected food card */}
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                        <TrafficDot light={selected.trafficLight} size={10} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800 truncate">{selected.name}</p>
                          <p className="text-xs text-gray-500">1 serving = {selected.servingLabel}</p>
                        </div>
                        <button onClick={() => setSelected(null)} className="text-xs text-brand-primary font-medium flex-shrink-0">Change</button>
                      </div>

                      {/* Compact serving picker + calorie preview in one row */}
                      <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2.5">
                        <span className="text-xs text-gray-500 flex-shrink-0">Servings</span>
                        <button
                          onClick={() => setServings(s => Math.max(0.5, Math.round((s - 0.5) * 2) / 2))}
                          className="w-9 h-9 rounded-full bg-white border border-gray-200 text-gray-700 text-lg font-bold flex items-center justify-center active:scale-95 transition-all flex-shrink-0 shadow-sm"
                        >−</button>
                        <span className="text-xl font-bold text-brand-primary w-8 text-center flex-shrink-0">{servings}</span>
                        <button
                          onClick={() => setServings(s => Math.round((s + 0.5) * 2) / 2)}
                          className="w-9 h-9 rounded-full bg-brand-primary text-white text-lg font-bold flex items-center justify-center active:scale-95 transition-all flex-shrink-0"
                        >+</button>
                        <div className="flex-1 text-right">
                          <span className="text-2xl font-bold text-gray-900">
                            {Math.round((selected.caloriesPer100g / 100) * selected.servingSizeG * servings)}
                          </span>
                          <span className="text-sm text-gray-400 ml-1">cal</span>
                        </div>
                      </div>
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
                      <p className="text-xs text-gray-500 mt-1">Save your go-to combos for quick logging</p>
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
                          <p className="text-xs text-gray-500 mb-2 line-clamp-1">
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

      {/* Barcode Scanner */}
      {scannerOpen && (
        <BarcodeScanner
          onResult={handleBarcodeScan}
          onClose={() => setScannerOpen(false)}
        />
      )}

      {/* Scan loading overlay (shown after scanner closes while fetching) */}
      {scanLoading && (
        <div className="fixed inset-0 z-40 bg-black/60 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-6 mx-8 text-center shadow-2xl">
            <Loader size={36} className="animate-spin text-brand-primary mx-auto mb-3" />
            <p className="font-semibold text-gray-800">Looking up product...</p>
            <p className="text-xs text-gray-400 mt-1">Checking Open Food Facts database</p>
          </div>
        </div>
      )}

      {/* Custom Food Sheet */}
      <BottomSheet open={addCustomOpen} onClose={() => { setAddCustomOpen(false); setScanError(null) }} title="Add Custom Food / Drink">
        <div className="p-4 space-y-3 max-h-[70vh] overflow-y-auto no-scrollbar">

          {/* Name + Brand row */}
          <div className="space-y-2">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">Name *</label>
              <input type="text" value={customForm.name}
                     onChange={e => setCustomForm(f => ({...f, name: e.target.value}))}
                     placeholder="e.g. Homemade Smoothie"
                     className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-secondary" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">Brand / Restaurant <span className="text-gray-400 font-normal normal-case">(optional)</span></label>
              <input type="text" value={customForm.brand}
                     onChange={e => setCustomForm(f => ({...f, brand: e.target.value}))}
                     placeholder="e.g. Trader Joe's, McDonald's"
                     className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-secondary" />
            </div>
          </div>

          {/* Serving size + Calories row */}
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">Serving size <span className="text-gray-400 font-normal normal-case">(optional)</span></label>
              <input type="text" value={customForm.servingLabel}
                     onChange={e => setCustomForm(f => ({...f, servingLabel: e.target.value}))}
                     placeholder="e.g. 1 cup, 12 oz"
                     className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-secondary" />
            </div>
            <div className="w-28">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">Calories *</label>
              <input type="number" value={customForm.calories}
                     onChange={e => setCustomForm(f => ({...f, calories: e.target.value}))}
                     placeholder="e.g. 150"
                     className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-secondary" />
            </div>
          </div>

          {/* Macros */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">Macros per serving <span className="text-gray-400 font-normal normal-case">(optional)</span></label>
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="text-xs text-gray-500 block mb-1 text-center">Protein (g)</label>
                <input type="number" value={customForm.proteinG}
                       onChange={e => setCustomForm(f => ({...f, proteinG: e.target.value}))}
                       placeholder="0"
                       className="w-full px-2 py-2 border border-gray-200 rounded-xl text-sm text-center focus:outline-none focus:ring-2 focus:ring-brand-secondary" />
              </div>
              <div className="flex-1">
                <label className="text-xs text-gray-500 block mb-1 text-center">Carbs (g)</label>
                <input type="number" value={customForm.carbsG}
                       onChange={e => setCustomForm(f => ({...f, carbsG: e.target.value}))}
                       placeholder="0"
                       className="w-full px-2 py-2 border border-gray-200 rounded-xl text-sm text-center focus:outline-none focus:ring-2 focus:ring-brand-secondary" />
              </div>
              <div className="flex-1">
                <label className="text-xs text-gray-500 block mb-1 text-center">Fat (g)</label>
                <input type="number" value={customForm.fatG}
                       onChange={e => setCustomForm(f => ({...f, fatG: e.target.value}))}
                       placeholder="0"
                       className="w-full px-2 py-2 border border-gray-200 rounded-xl text-sm text-center focus:outline-none focus:ring-2 focus:ring-brand-secondary" />
              </div>
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">Category</label>
            <div className="flex gap-2">
              {[
                { v: 'green',  label: '🟢 Healthy',  desc: 'Whole foods, minimal processing' },
                { v: 'yellow', label: '🟡 Moderate',  desc: 'Enjoy in reasonable amounts' },
                { v: 'orange', label: '🟠 Limit',     desc: 'High sugar, fat, or processed' },
              ].map(({ v, label, desc }) => (
                <button key={v} onClick={() => setCustomForm(f => ({...f, trafficLight: v}))}
                        className={`flex-1 py-2 px-1 rounded-xl text-xs font-medium transition-colors text-center border ${customForm.trafficLight===v ? 'border-brand-primary bg-brand-pale text-brand-primary' : 'border-gray-200 text-gray-500'}`}>
                  <div>{label}</div>
                </button>
              ))}
            </div>
          </div>

          <button onClick={saveCustomFood} disabled={!customForm.name || !customForm.calories}
                  className="w-full bg-brand-primary text-white py-3.5 rounded-xl font-semibold disabled:opacity-40 hover:bg-[#3a2270] transition-colors">
            Save to My Foods
          </button>
        </div>
      </BottomSheet>
    </div>
  )
}
