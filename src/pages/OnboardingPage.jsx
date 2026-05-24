import React, { useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { KEYS } from '../utils/storageKeys'
import { calcBMR, calcTDEE, calcCalorieRange, lbsToKg, ftInToCm, ACTIVITY_LEVELS, GOALS } from '../utils/calorieCalc'
import { ChevronRight, ChevronLeft, Leaf } from 'lucide-react'

const STEPS = ['welcome', 'quiz', 'result', 'done']

export default function OnboardingPage() {
  const [step, setStep] = useState(0)
  const [, setProfile] = useLocalStorage(KEYS.PROFILE, {})
  const [, setOnboarded] = useLocalStorage(KEYS.ONBOARDED, false)
  const [form, setForm] = useState({
    name: '', age: 30, sex: 'female',
    unit: 'imperial', weightLbs: 155, heightFt: 5, heightIn: 5,
    activityLevel: 1.375, goal: 'lose',
  })
  const [result, setResult] = useState(null)

  function update(key, val) { setForm(f => ({ ...f, [key]: val })) }

  function handleCalculate() {
    const weightKg = lbsToKg(form.weightLbs)
    const heightCm = ftInToCm(Number(form.heightFt), Number(form.heightIn))
    const bmr = calcBMR({ weightKg, heightCm, age: Number(form.age), sex: form.sex })
    const tdee = calcTDEE(bmr, form.activityLevel)
    const { min, max } = calcCalorieRange(tdee, form.goal)
    const profile = { name: form.name, age: Number(form.age), sex: form.sex, weightKg, heightCm, activityLevel: form.activityLevel, goal: form.goal, tdee, calorieMin: min, calorieMax: max }
    setResult({ tdee, min, max })
    setProfile(profile)
    setStep(2)
  }

  function finish() {
    setOnboarded(true)
  }

  if (step === 0) return (
    <div className="min-h-[100dvh] bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 flex flex-col items-center justify-center p-6 text-white text-center">
      <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mb-6 backdrop-blur">
        <Leaf size={40} className="text-white" />
      </div>
      <h1 className="text-4xl font-bold mb-2">NourishMind</h1>
      <p className="text-indigo-200 text-lg mb-3">Heal your relationship with food</p>
      <blockquote className="text-indigo-100 text-sm italic max-w-xs mb-10 leading-relaxed">
        "I can do all things through Christ who strengthens me." — Philippians 4:13
      </blockquote>
      <button onClick={() => setStep(1)}
              className="bg-white text-indigo-700 font-semibold px-8 py-4 rounded-2xl text-base shadow-lg flex items-center gap-2 hover:bg-indigo-50 transition-colors">
        Begin My Journey <ChevronRight size={20} />
      </button>
      <p className="text-indigo-300 text-xs mt-6 max-w-xs">CBT principles + biblical wisdom + personalized tracking</p>
    </div>
  )

  if (step === 1) return (
    <div className="min-h-[100dvh] bg-gray-50 flex flex-col">
      <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
        <button onClick={() => setStep(0)} className="p-1 text-gray-500"><ChevronLeft size={22} /></button>
        <div>
          <h1 className="font-semibold text-gray-900">Your Profile</h1>
          <p className="text-xs text-gray-500">Tell us about yourself</p>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-5 pb-24">
        <Field label="Your first name">
          <input type="text" value={form.name} onChange={e => update('name', e.target.value)}
                 placeholder="e.g. Aracely" className={inputCls} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Age">
            <input type="number" min="16" max="80" value={form.age} onChange={e => update('age', e.target.value)} className={inputCls} />
          </Field>
          <Field label="Sex">
            <div className="flex rounded-xl border border-gray-200 overflow-hidden">
              {['female','male'].map(s => (
                <button key={s} onClick={() => update('sex', s)}
                        className={`flex-1 py-2.5 text-sm font-medium transition-colors capitalize ${form.sex === s ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600'}`}>
                  {s}
                </button>
              ))}
            </div>
          </Field>
        </div>
        <Field label="Current weight (lbs)">
          <input type="number" min="80" max="500" value={form.weightLbs} onChange={e => update('weightLbs', e.target.value)} className={inputCls} />
        </Field>
        <Field label="Height">
          <div className="flex gap-2">
            <div className="flex-1">
              <input type="number" min="4" max="7" value={form.heightFt} onChange={e => update('heightFt', e.target.value)} className={inputCls} placeholder="ft" />
              <span className="text-xs text-gray-400 pl-1">feet</span>
            </div>
            <div className="flex-1">
              <input type="number" min="0" max="11" value={form.heightIn} onChange={e => update('heightIn', e.target.value)} className={inputCls} placeholder="in" />
              <span className="text-xs text-gray-400 pl-1">inches</span>
            </div>
          </div>
        </Field>
        <Field label="Activity level">
          <div className="space-y-2">
            {ACTIVITY_LEVELS.map(a => (
              <button key={a.value} onClick={() => update('activityLevel', a.value)}
                      className={`w-full text-left p-3 rounded-xl border transition-colors ${form.activityLevel === a.value ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 bg-white'}`}>
                <div className={`font-medium text-sm ${form.activityLevel === a.value ? 'text-indigo-700' : 'text-gray-800'}`}>{a.label}</div>
                <div className="text-xs text-gray-500 mt-0.5">{a.desc}</div>
              </button>
            ))}
          </div>
        </Field>
        <Field label="My goal">
          <div className="grid grid-cols-3 gap-2">
            {GOALS.map(g => (
              <button key={g.value} onClick={() => update('goal', g.value)}
                      className={`p-3 rounded-xl border text-center transition-colors ${form.goal === g.value ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 bg-white'}`}>
                <div className="text-2xl mb-1">{g.emoji}</div>
                <div className={`text-xs font-medium ${form.goal === g.value ? 'text-indigo-700' : 'text-gray-700'}`}>{g.label}</div>
              </button>
            ))}
          </div>
        </Field>
      </div>
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 max-w-lg mx-auto"
           style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}>
        <button onClick={handleCalculate} disabled={!form.name}
                className="w-full bg-indigo-600 text-white font-semibold py-4 rounded-2xl text-base disabled:opacity-40 hover:bg-indigo-700 transition-colors">
          Calculate My Range
        </button>
      </div>
    </div>
  )

  if (step === 2 && result) return (
    <div className="min-h-[100dvh] bg-gray-50 flex flex-col">
      <div className="bg-white border-b border-gray-100 px-4 py-3">
        <h1 className="font-semibold text-gray-900">Your Calorie Range</h1>
        <p className="text-xs text-gray-500">Personalized for you</p>
      </div>
      <div className="flex-1 p-4 space-y-4">
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-6 text-white text-center">
          <p className="text-indigo-200 text-sm mb-2">Hi {form.name}! Your daily target is</p>
          <div className="text-4xl font-bold">{result.min.toLocaleString()} – {result.max.toLocaleString()}</div>
          <div className="text-indigo-200 text-sm mt-1">calories per day</div>
          <div className="mt-3 text-xs text-indigo-300">Based on your TDEE of {result.tdee.toLocaleString()} cal/day</div>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-gray-100 space-y-3">
          <p className="font-semibold text-gray-800">Why a range, not a single number?</p>
          <p className="text-sm text-gray-600 leading-relaxed">Your body is not a machine. Hunger, activity, stress, and sleep all vary day to day. A range gives you flexibility without obsession. Any day between {result.min} and {result.max} calories is a successful day.</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-gray-100 space-y-3">
          <p className="font-semibold text-gray-800">The Traffic Light System</p>
          {[['🟢','Green Foods','Eat freely — fruits, vegetables, lean proteins, whole grains'],
            ['🟡','Yellow Foods','Moderate portions — healthy fats, lean meats, legumes, whole grain carbs'],
            ['🟠','Orange Foods','Small portions — oils, nuts, sweets, processed foods']].map(([e,l,d]) => (
            <div key={l} className="flex gap-3">
              <span className="text-xl">{e}</span>
              <div><div className="font-medium text-sm text-gray-800">{l}</div><div className="text-xs text-gray-500">{d}</div></div>
            </div>
          ))}
        </div>
        <button onClick={() => setStep(3)}
                className="w-full bg-indigo-600 text-white font-semibold py-4 rounded-2xl text-base hover:bg-indigo-700 transition-colors">
          This looks great! Continue
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-[100dvh] bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="text-6xl mb-4">🌱</div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">You're all set, {form.name}!</h1>
      <p className="text-gray-500 text-sm mb-8 max-w-xs leading-relaxed">Your 30-day journey to food freedom starts now. Remember: progress, not perfection.</p>
      <div className="grid grid-cols-2 gap-3 w-full max-w-xs mb-8 text-left">
        {[['📊','Daily Calorie Tracking','Log every meal with traffic light guidance'],
          ['📖','Daily Lessons','CBT + biblical wisdom in 5-15 min reads'],
          ['📋','Quizzes & Challenges','Reinforce what you learn with interactive tools'],
          ['🏃','Biometrics Tracking','Log steps, water, weight, and exercise']].map(([e,t,d]) => (
          <div key={t} className="bg-white rounded-2xl p-3 border border-gray-100">
            <div className="text-2xl mb-1">{e}</div>
            <div className="font-semibold text-xs text-gray-800">{t}</div>
            <div className="text-[10px] text-gray-500 mt-0.5">{d}</div>
          </div>
        ))}
      </div>
      <button onClick={finish}
              className="bg-indigo-600 text-white font-semibold px-8 py-4 rounded-2xl text-base hover:bg-indigo-700 transition-colors shadow-lg">
        Start Day 1 →
      </button>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      {children}
    </div>
  )
}

const inputCls = 'w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent'
