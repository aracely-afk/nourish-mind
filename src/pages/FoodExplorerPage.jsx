import React, { useState } from 'react'
import { FOODS, searchFoods, calcCaloriesForGrams } from '../data/foodDatabase'
import SearchBar from '../components/ui/SearchBar'
import TrafficLightBadge from '../components/ui/TrafficLightBadge'
import BottomSheet from '../components/ui/BottomSheet'

const FILTERS = ['all', 'green', 'yellow', 'orange']
const FILTER_LABELS = { all: 'All Foods', green: '🟢 Green', yellow: '🟡 Yellow', orange: '🟠 Orange' }

export default function FoodExplorerPage() {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')
  const [detail, setDetail] = useState(null)
  const [customGrams, setCustomGrams] = useState('')

  const results = searchFoods(query, filter)

  return (
    <div className="pb-4">
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-gray-100 px-4 py-3 space-y-3">
        <h1 className="font-semibold text-gray-900">Food Explorer</h1>
        <SearchBar value={query} onChange={setQuery} placeholder="Search 280+ foods…" />
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
          {FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)}
                    className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${filter===f ? 'bg-brand-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {FILTER_LABELS[f]}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4">
        <p className="text-xs text-gray-400 mb-3">{results.length} food{results.length !== 1 ? 's' : ''}</p>
        <div className="grid grid-cols-2 gap-3">
          {results.map(food => (
            <button key={food.id} onClick={() => { setDetail(food); setCustomGrams(String(food.servingSizeG)) }}
                    className="bg-white rounded-2xl p-3 border border-gray-100 shadow-sm text-left hover:shadow-md transition-shadow flex flex-col gap-2">
              <TrafficLightBadge light={food.trafficLight} />
              <p className="text-sm font-medium text-gray-800 leading-tight">{food.name}</p>
              <div className="text-xs text-gray-500">
                <span className="font-semibold text-gray-700">{food.caloriesPer100g}</span> cal/100g
              </div>
              <p className="text-[10px] text-gray-400">{food.servingLabel}</p>
            </button>
          ))}
        </div>
        {results.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-gray-500 text-sm">No foods found for "{query}"</p>
          </div>
        )}
      </div>

      <BottomSheet open={!!detail} onClose={() => setDetail(null)} title={detail?.name}>
        {detail && (
          <div className="p-4 space-y-4">
            <div className="flex items-center gap-3">
              <TrafficLightBadge light={detail.trafficLight} />
              <span className="text-sm text-gray-500 capitalize">{detail.category}</span>
            </div>
            <div className="bg-gray-50 rounded-2xl p-4 space-y-2">
              <p className="text-sm font-medium text-gray-700">Nutrition</p>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Per 100g</span>
                <span className="font-semibold">{detail.caloriesPer100g} cal</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Serving ({detail.servingLabel})</span>
                <span className="font-semibold">{calcCaloriesForGrams(detail, detail.servingSizeG)} cal</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Calculate custom serving</p>
              <div className="flex gap-2">
                <input type="number" value={customGrams} onChange={e => setCustomGrams(e.target.value)} min="1"
                       placeholder="grams" className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-secondary" />
                <div className="bg-brand-pale text-brand-primary font-semibold px-4 py-2 rounded-xl text-sm flex items-center min-w-[80px] justify-center">
                  {customGrams ? `${calcCaloriesForGrams(detail, parseFloat(customGrams)||0)} cal` : '— cal'}
                </div>
              </div>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
              <p className="text-xs text-amber-700 font-medium mb-0.5">
                {detail.trafficLight === 'green' ? '🟢 Eat Freely' : detail.trafficLight === 'yellow' ? '🟡 Moderate Portions' : '🟠 Small Portions'}
              </p>
              <p className="text-xs text-amber-600">
                {detail.trafficLight === 'green'
                  ? 'Low calorie density. Great for filling up while staying within your range.'
                  : detail.trafficLight === 'yellow'
                  ? 'Moderate calorie density. Nutritious and satisfying — be mindful of portion size.'
                  : 'High calorie density. Enjoy in smaller amounts and less frequently.'}
              </p>
            </div>
          </div>
        )}
      </BottomSheet>
    </div>
  )
}
