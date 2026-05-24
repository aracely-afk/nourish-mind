import React, { useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useJourney } from '../hooks/useJourney'
import { KEYS } from '../utils/storageKeys'
import {
  calcBMR, calcTDEE, calcCalorieRange, lbsToKg, ftInToCm, calcBMI, bmiCategory,
  ACTIVITY_LEVELS, GOALS, COMMITMENT_LEVELS, DIET_STYLES, getRecommendedLength,
} from '../utils/calorieCalc'
import { ChevronRight, ChevronLeft, Leaf, Heart, AlertTriangle, Phone } from 'lucide-react'

const ED_OPTIONS = [
  { value: 'healthy',    label: 'Generally healthy',                              desc: 'I just want to build better habits',                        emoji: '✅' },
  { value: 'motivated',  label: 'I know what to do — I need motivation',          desc: 'I have the knowledge but need accountability and support',  emoji: '💪' },
  { value: 'struggling', label: 'It\'s complicated',                              desc: 'I sometimes struggle with guilt or restriction',            emoji: '💛' },
  { value: 'ed',         label: 'I am or have struggled with an eating disorder', desc: 'Past or present — I want to approach this mindfully',      emoji: '🌱' },
]

export default function OnboardingPage() {
  const [step, setStep] = useState(0)
  const [, setProfile] = useLocalStorage(KEYS.PROFILE, {})
  const [, setOnboarded] = useLocalStorage(KEYS.ONBOARDED, false)
  const { initJourney } = useJourney()

  const [edAnswer, setEdAnswer] = useState(null)
  const [form, setForm] = useState({
    name: '', age: 30, sex: 'female',
    weightLbs: 155, heightFt: 5, heightIn: 5,
    activityLevel: 1.375, goal: 'lose', goalWeightLbs: '',
  })
  const [commitment, setCommitment] = useState('ready')
  const [dietStyle, setDietStyle] = useState('standard')
  const [journeyLength, setJourneyLength] = useState(120)
  const [result, setResult] = useState(null)

  function update(key, val) { setForm(f => ({ ...f, [key]: val })) }

  function handleEdNext() {
    if (!edAnswer) return
    setStep(2)
  }

  function handleCalculate() {
    const weightKg = lbsToKg(form.weightLbs)
    const heightCm = ftInToCm(Number(form.heightFt), Number(form.heightIn))
    const bmr = calcBMR({ weightKg, heightCm, age: Number(form.age), sex: form.sex })
    const tdee = calcTDEE(bmr, form.activityLevel)
    const { min, max } = calcCalorieRange(tdee, form.goal)
    const recommended = getRecommendedLength(form.goal, commitment)
    setJourneyLength(recommended)
    setResult({ tdee, min, max, recommended })
    const bmi = calcBMI(weightKg, heightCm)
    const profile = {
      name: form.name, age: Number(form.age), sex: form.sex,
      weightKg, heightCm, activityLevel: form.activityLevel, goal: form.goal,
      tdee, calorieMin: min, calorieMax: max,
      dietStyle, commitmentLevel: commitment,
      weightTrackingEnabled: false,
      goalWeightLbs: form.goalWeightLbs ? parseFloat(form.goalWeightLbs) : null,
      bmi,
    }
    setProfile(profile)
    setStep(4)
  }

  function finish() {
    initJourney({
      length: journeyLength,
      commitmentLevel: commitment,
      dietStyle,
      edScreeningAnswer: edAnswer,
      weightTrackingEnabled: false,
    })
    setOnboarded(true)
  }

  // Step 0: Welcome
  if (step === 0) return (
    <div
      className="relative min-h-[100dvh] flex flex-col items-center text-white text-center overflow-hidden bg-[#2d1a5e]"
      style={{
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'max(2rem, env(safe-area-inset-bottom))',
      }}
    >
      {/* Logo emblem — crop to top portion so the baked-in wordmark is hidden;
          we render the wordmark as HTML below for full legibility control */}
      <div className="flex-1 w-full flex items-center justify-center px-6 pt-6 min-h-0">
        <div className="w-full max-w-[280px] aspect-square overflow-hidden rounded-full">
          <img
            src="/logo.png"
            alt="NourishMind"
            className="w-full h-full object-cover"
            style={{ objectPosition: 'center 30%' }}
            onError={e => { e.target.style.display = 'none' }}
          />
        </div>
      </div>

      {/* HTML wordmark + tagline — readable, never cropped */}
      <div className="relative z-10 flex flex-col items-center px-6 w-full pb-2">
        <h1 className="text-white font-brand font-bold tracking-[0.18em] text-3xl sm:text-4xl drop-shadow-lg">
          NOURISHMIND
        </h1>
        <p className="text-[#F5E6B8] text-xs sm:text-sm font-medium tracking-[0.25em] mt-1 uppercase">
          Renew Your Mind · Nourish Your Life
        </p>

        <blockquote className="text-white text-sm font-display italic max-w-xs mt-6 mb-6 leading-relaxed drop-shadow">
          "I can do all things through Christ who strengthens me." — Philippians 4:13
        </blockquote>

        <button
          onClick={() => setStep(1)}
          className="bg-[#D4AF37] text-[#2d1a5e] font-bold px-8 py-4 rounded-2xl text-base shadow-xl flex items-center gap-2 hover:bg-[#c9a430] active:scale-95 transition-all w-full max-w-xs justify-center"
        >
          Begin My Journey <ChevronRight size={20} />
        </button>
      </div>
    </div>
  )

  // Step 1: Eating disorder screening
  if (step === 1) return (
    <div className="min-h-[100dvh] bg-brand-warm flex flex-col">
      <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
        <button onClick={() => setStep(0)} className="p-1 text-gray-500"><ChevronLeft size={22} /></button>
        <div>
          <h1 className="font-semibold text-brand-charcoal font-brand">A Quick Wellness Check</h1>
          <p className="text-xs text-gray-500">Step 1 of 5</p>
        </div>
      </div>
      <div className="flex-1 p-4 space-y-4 pb-28">
        <div className="bg-brand-pale border border-brand-secondary/20 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Heart size={16} className="text-brand-primary" />
            <span className="font-semibold text-brand-primary text-sm">Your wellbeing matters to us</span>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            NourishMind uses CBT tools to build a <strong>healthy</strong> relationship with food — not to restrict or punish. Before we begin, we want to make sure this is the right fit for where you are today.
          </p>
        </div>

        <p className="text-sm font-medium text-gray-700 px-1">How would you describe your relationship with food right now?</p>

        <div className="space-y-2">
          {ED_OPTIONS.map(opt => (
            <button key={opt.value} onClick={() => setEdAnswer(opt.value)}
                    className={`w-full flex items-center gap-3 p-4 rounded-2xl border text-left transition-colors ${edAnswer === opt.value ? 'border-brand-primary bg-brand-pale' : 'border-gray-200 bg-white'}`}>
              <span className="text-2xl">{opt.emoji}</span>
              <div>
                <p className={`font-medium text-sm ${edAnswer === opt.value ? 'text-brand-primary' : 'text-gray-800'}`}>{opt.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{opt.desc}</p>
              </div>
            </button>
          ))}
        </div>

        {edAnswer === 'motivated' && (
          <div className="bg-brand-pale border border-brand-secondary/20 rounded-2xl p-4">
            <p className="font-semibold text-brand-primary text-sm mb-1">You're in the right place</p>
            <p className="text-sm text-gray-600 leading-relaxed">
              NourishMind is built for exactly this — daily lessons, a points system, streaks, and practical tools to keep you consistent even when motivation dips. Let's build momentum together.
            </p>
          </div>
        )}

        {edAnswer === 'struggling' && (
          <div className="bg-brand-pale border border-brand-secondary/20 rounded-2xl p-4">
            <p className="font-semibold text-brand-primary text-sm mb-1">You're not alone</p>
            <p className="text-sm text-gray-600 leading-relaxed">
              Many people start this journey feeling exactly that way. NourishMind's approach is designed to help heal guilt and restriction — not reinforce them. Take it one day at a time.
            </p>
          </div>
        )}

        {edAnswer === 'ed' && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
            <p className="font-semibold text-amber-800 text-sm mb-1">Thank you for sharing</p>
            <p className="text-sm text-amber-700 leading-relaxed mb-3">
              NourishMind is designed with a trauma-informed mindset — no food is banned, no restriction is encouraged. You're welcome here, and we encourage you to use this app alongside your care team.
            </p>
            <div className="bg-white rounded-xl p-3 flex items-center gap-2">
              <Phone size={14} className="text-amber-500 flex-shrink-0" />
              <div>
                <p className="text-xs font-bold text-gray-800">NEDA Helpline — free &amp; confidential</p>
                <p className="text-xs text-gray-500">1-800-931-2237 · Text "NEDA" to 741741</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 max-w-lg mx-auto"
           style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}>
        <button onClick={handleEdNext} disabled={!edAnswer}
                className="w-full bg-brand-primary text-white font-semibold py-4 rounded-2xl text-base disabled:opacity-40 hover:bg-[#3a2270] transition-colors">
          Continue
        </button>
      </div>
    </div>
  )

  // Step 2: Profile quiz
  if (step === 2) return (
    <div className="min-h-[100dvh] bg-brand-warm flex flex-col">
      <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
        <button onClick={() => setStep(1)} className="p-1 text-gray-500"><ChevronLeft size={22} /></button>
        <div>
          <h1 className="font-semibold text-brand-charcoal font-brand">Your Profile</h1>
          <p className="text-xs text-gray-500">Step 2 of 5</p>
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
              {['female', 'male'].map(s => (
                <button key={s} onClick={() => update('sex', s)}
                        className={`flex-1 py-2.5 text-sm font-medium transition-colors capitalize ${form.sex === s ? 'bg-brand-primary text-white' : 'bg-white text-gray-600'}`}>
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
                      className={`w-full text-left p-3 rounded-xl border transition-colors ${form.activityLevel === a.value ? 'border-brand-primary bg-brand-pale' : 'border-gray-200 bg-white'}`}>
                <div className={`font-medium text-sm ${form.activityLevel === a.value ? 'text-brand-primary' : 'text-gray-800'}`}>{a.label}</div>
                <div className="text-xs text-gray-500 mt-0.5">{a.desc}</div>
                <div className="text-[10px] text-gray-400 mt-0.5 italic">{a.examples}</div>
              </button>
            ))}
          </div>
        </Field>
        <Field label="My goal">
          <div className="grid grid-cols-3 gap-2">
            {GOALS.map(g => (
              <button key={g.value} onClick={() => update('goal', g.value)}
                      className={`p-3 rounded-xl border text-center transition-colors ${form.goal === g.value ? 'border-brand-primary bg-brand-pale' : 'border-gray-200 bg-white'}`}>
                <div className="text-2xl mb-1">{g.emoji}</div>
                <div className={`text-xs font-medium ${form.goal === g.value ? 'text-brand-primary' : 'text-gray-700'}`}>{g.label}</div>
              </button>
            ))}
          </div>
        </Field>

        {form.goal === 'lose' && (
          <Field label="Goal weight (lbs) — optional">
            <input type="number" min="80" max="500" value={form.goalWeightLbs}
                   onChange={e => update('goalWeightLbs', e.target.value)}
                   placeholder="e.g. 145" className={inputCls} />
            <p className="text-xs text-gray-400 mt-1">A milestone to track progress toward — not a hard deadline</p>
          </Field>
        )}

        {form.goal === 'gain' && (() => {
          const hCm = ftInToCm(Number(form.heightFt), Number(form.heightIn))
          const wKg = lbsToKg(Number(form.weightLbs))
          const bmi = calcBMI(wKg, hCm)
          const cat = bmi ? bmiCategory(bmi) : null
          return (
            <div className="bg-brand-pale border border-brand-secondary/20 rounded-2xl p-4 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">💪</span>
                <p className="font-semibold text-brand-primary text-sm font-brand">Build Muscle Features</p>
              </div>
              {cat && (
                <div className="bg-white rounded-xl p-3">
                  <p className="text-xs text-gray-500 mb-1">Your starting BMI</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold" style={{ color: cat.color }}>{bmi}</span>
                    <span className="text-sm font-medium" style={{ color: cat.color }}>{cat.label}</span>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">
                    BMI = weight (kg) ÷ height (m)² · Under 18.5 Underweight · 18.5–24.9 Normal · 25–29.9 Overweight · 30+ Obese
                  </p>
                </div>
              )}
              <p className="text-sm text-gray-600 leading-relaxed">
                Your <strong>Track</strong> tab will include a <strong>Strength Tracker</strong> — log daily reps for push-ups, squats, lunges, and plank hold to measure strength gains week over week.
              </p>
            </div>
          )
        })()}
      </div>
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 max-w-lg mx-auto"
           style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}>
        <button onClick={() => setStep(3)} disabled={!form.name}
                className="w-full bg-brand-primary text-white font-semibold py-4 rounded-2xl text-base disabled:opacity-40 hover:bg-[#3a2270] transition-colors">
          Next
        </button>
      </div>
    </div>
  )

  // Step 3: Commitment + Diet Style
  if (step === 3) return (
    <div className="min-h-[100dvh] bg-brand-warm flex flex-col">
      <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
        <button onClick={() => setStep(2)} className="p-1 text-gray-500"><ChevronLeft size={22} /></button>
        <div>
          <h1 className="font-semibold text-brand-charcoal font-brand">Your Commitment</h1>
          <p className="text-xs text-gray-500">Step 3 of 5</p>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-24">
        <Field label="How committed are you to this journey?">
          <div className="space-y-2 mt-1">
            {COMMITMENT_LEVELS.map(c => (
              <button key={c.value} onClick={() => setCommitment(c.value)}
                      className={`w-full flex items-center gap-3 p-4 rounded-2xl border text-left transition-colors ${commitment === c.value ? 'border-brand-primary bg-brand-pale' : 'border-gray-200 bg-white'}`}>
                <span className="text-2xl">{c.emoji}</span>
                <div className="flex-1">
                  <div className={`font-medium text-sm ${commitment === c.value ? 'text-brand-primary' : 'text-gray-800'}`}>{c.label}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{c.desc}</div>
                </div>
                <div className={`text-xs font-bold px-2 py-1 rounded-lg ${commitment === c.value ? 'bg-brand-primary text-white' : 'bg-gray-100 text-gray-500'}`}>
                  {c.recommendedDays}d
                </div>
              </button>
            ))}
          </div>
        </Field>

        <Field label="Do you follow a specific eating style?">
          <div className="grid grid-cols-2 gap-2 mt-1">
            {DIET_STYLES.map(d => (
              <button key={d.value} onClick={() => setDietStyle(d.value)}
                      className={`flex items-center gap-2 p-3 rounded-xl border text-left transition-colors ${dietStyle === d.value ? 'border-brand-primary bg-brand-pale' : 'border-gray-200 bg-white'}`}>
                <span className="text-lg">{d.emoji}</span>
                <div>
                  <div className={`text-xs font-medium leading-tight ${dietStyle === d.value ? 'text-brand-primary' : 'text-gray-800'}`}>{d.label}</div>
                  <div className="text-[10px] text-gray-400 leading-tight mt-0.5">{d.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </Field>
      </div>
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 max-w-lg mx-auto"
           style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}>
        <button onClick={handleCalculate}
                className="w-full bg-brand-primary text-white font-semibold py-4 rounded-2xl text-base hover:bg-[#3a2270] transition-colors">
          Calculate My Plan
        </button>
      </div>
    </div>
  )

  // Step 4: Journey + Calorie Range reveal
  if (step === 4 && result) return (
    <div className="min-h-[100dvh] bg-brand-warm flex flex-col">
      <div className="bg-white border-b border-gray-100 px-4 py-3">
        <h1 className="font-semibold text-brand-charcoal font-brand">Your Personal Plan</h1>
        <p className="text-xs text-gray-500">Step 4 of 5</p>
      </div>
      <div className="flex-1 p-4 space-y-4 pb-24">
        {/* Journey Length */}
        <div className="bg-gradient-to-br from-[#4B2E83] to-[#3a2270] rounded-3xl p-5 text-white text-center">
          <p className="text-[#A88FCF] text-xs font-medium uppercase tracking-widest mb-1">Your Journey</p>
          <div className="text-5xl font-bold text-[#D4AF37]">{journeyLength}</div>
          <div className="text-white/80 text-sm mt-1">days of transformation</div>
          <div className="mt-3 flex justify-center gap-2">
            {[90, 120, 180].map(d => (
              <button key={d} onClick={() => setJourneyLength(d)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${journeyLength === d ? 'bg-[#D4AF37] text-[#2d1a5e]' : 'bg-white/10 text-white/60'}`}>
                {d}d
              </button>
            ))}
          </div>
          <p className="text-white/40 text-[10px] mt-2">Recommended: {result.recommended} days · tap to change</p>
        </div>

        {/* Calorie Range */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100">
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Daily Calorie Target</p>
          <div className="text-3xl font-bold text-brand-primary">{result.min.toLocaleString()} – {result.max.toLocaleString()}</div>
          <div className="text-gray-500 text-sm mt-0.5">calories per day</div>
          <div className="mt-2 text-xs text-gray-400">Based on TDEE of {result.tdee.toLocaleString()} cal/day · Hi {form.name}!</div>
        </div>

        {/* Points system explainer */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100">
          <p className="font-semibold text-brand-charcoal mb-3">🏆 How Points Work</p>
          <div className="space-y-2">
            {[
              ['Log your meals', 'Up to 2 pts/day'],
              ['Stay in calorie range', '2 pts/day'],
              ['Complete a lesson', '2 pts/day'],
              ['6+ cups of water', '1 pt/day'],
              ['7,500+ steps', '1 pt/day'],
              ['Log exercise', '1 pt/day'],
              ['Weekly weigh-in', '+1 bonus pt/week'],
            ].map(([label, pts]) => (
              <div key={label} className="flex justify-between items-center text-sm">
                <span className="text-gray-600">{label}</span>
                <span className="font-semibold text-brand-primary text-xs bg-brand-pale px-2 py-0.5 rounded-full">{pts}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-gray-50 text-xs text-gray-500 italic">
            Earn 55+ points in a week to unlock a non-food reward 🎁
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-gray-100 space-y-3">
          <p className="font-semibold text-brand-charcoal">Traffic Light System</p>
          {[['🟢', 'Green — Eat freely', 'Vegetables, lean proteins, fruits, whole grains'],
            ['🟡', 'Yellow — Moderate', 'Healthy fats, lean meats, legumes, whole grain carbs'],
            ['🟠', 'Orange — Small portions', 'Oils, nuts, sweets, processed foods']].map(([e, l, d]) => (
            <div key={l} className="flex gap-3">
              <span className="text-xl">{e}</span>
              <div><div className="font-medium text-sm text-gray-800">{l}</div><div className="text-xs text-gray-500">{d}</div></div>
            </div>
          ))}
        </div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 max-w-lg mx-auto"
           style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}>
        <button onClick={() => setStep(5)}
                className="w-full bg-brand-primary text-white font-semibold py-4 rounded-2xl text-base hover:bg-[#3a2270] transition-colors">
          This looks great! Let's go
        </button>
      </div>
    </div>
  )

  // Step 5: Done
  return (
    <div className="min-h-[100dvh] bg-brand-warm flex flex-col items-center justify-center p-6 text-center">
      <div className="text-6xl mb-4">🌱</div>
      <h1 className="text-2xl font-bold text-brand-charcoal mb-2 font-brand">You're all set, {form.name}!</h1>
      <p className="text-gray-500 text-sm mb-8 max-w-xs leading-relaxed">
        Your {journeyLength}-day journey to food freedom starts today. Remember: progress, not perfection.
      </p>
      <div className="grid grid-cols-2 gap-3 w-full max-w-xs mb-8 text-left">
        {[['📊', 'Daily Calorie Tracking', 'Log meals with traffic light guidance'],
          ['📖', 'Daily Lessons', 'CBT + biblical wisdom in 5–15 min reads'],
          ['🏆', 'Points & Rewards', 'Earn points daily, unlock weekly rewards'],
          ['🏃', 'Biometrics Tracking', 'Steps, water, weight, exercise']].map(([e, t, d]) => (
          <div key={t} className="bg-white rounded-2xl p-3 border border-gray-100">
            <div className="text-2xl mb-1">{e}</div>
            <div className="font-semibold text-xs text-brand-charcoal">{t}</div>
            <div className="text-[10px] text-gray-500 mt-0.5">{d}</div>
          </div>
        ))}
      </div>
      <button onClick={finish}
              className="bg-brand-primary text-white font-semibold px-8 py-4 rounded-2xl text-base hover:bg-[#3a2270] transition-colors shadow-lg">
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

const inputCls = 'w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-secondary focus:border-transparent'
