import React, { useState } from 'react'
import { supabase } from '../utils/supabase'
import { Mail, Lock, Eye, EyeOff, Loader } from 'lucide-react'

export default function AuthPage() {
  const [tab, setTab] = useState('signin')  // 'signin' | 'signup'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setNotice('')
    setLoading(true)

    try {
      if (tab === 'signup') {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        // useAuth will handle SIGNED_IN → pull → reload
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        // useAuth will handle SIGNED_IN → pull → reload
      }
    } catch (err) {
      setError(friendlyError(err.message))
      setLoading(false)
    }
  }

  function friendlyError(msg) {
    if (msg.includes('Invalid login credentials')) return 'Incorrect email or password.'
    if (msg.includes('User already registered')) return 'An account with this email already exists. Try signing in.'
    if (msg.includes('Password should be at least')) return 'Password must be at least 6 characters.'
    if (msg.includes('Unable to validate email')) return 'Please enter a valid email address.'
    if (msg.includes('Email not confirmed')) return 'Check your inbox and confirm your email before signing in.'
    return msg
  }

  return (
    <div
      className="min-h-[100dvh] flex flex-col items-center justify-center px-6"
      style={{
        background: 'linear-gradient(to bottom, #1f2933 0%, #5e6b5a 100%)',
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'max(2rem, env(safe-area-inset-bottom))',
      }}
    >
      {/* Logo */}
      <div className="flex flex-col items-center mb-8">
        <img src="/icon.png" alt="" className="w-20 h-20 object-contain drop-shadow-xl mb-3"
             onError={e => { e.target.style.display = 'none' }} />
        <h1 className="font-brand font-bold text-3xl tracking-wide text-[#D4AF37]">NourishMind</h1>
        <p className="text-[#f5f6f8]/60 text-xs tracking-widest uppercase mt-1">Renew Your Mind</p>
      </div>

      {/* Card */}
      <div className="w-full max-w-sm bg-white/10 backdrop-blur rounded-3xl p-6 border border-white/10">
        {/* Tabs */}
        <div className="flex bg-white/10 rounded-2xl p-1 mb-6">
          {[['signin', 'Sign In'], ['signup', 'Create Account']].map(([val, label]) => (
            <button
              key={val}
              onClick={() => { setTab(val); setError(''); setNotice('') }}
              className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${
                tab === val ? 'bg-white text-[#1f2933] shadow-sm' : 'text-white/60 hover:text-white'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="relative">
            <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Email address"
              required
              autoComplete="email"
              className="w-full bg-white/10 border border-white/15 rounded-xl pl-10 pr-4 py-3 text-white placeholder-white/35 text-sm focus:outline-none focus:border-[#D4AF37] focus:bg-white/15 transition-colors"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type={showPw ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder={tab === 'signup' ? 'Create a password (6+ chars)' : 'Password'}
              required
              autoComplete={tab === 'signup' ? 'new-password' : 'current-password'}
              className="w-full bg-white/10 border border-white/15 rounded-xl pl-10 pr-12 py-3 text-white placeholder-white/35 text-sm focus:outline-none focus:border-[#D4AF37] focus:bg-white/15 transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPw(v => !v)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
            >
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {/* Error */}
          {error && (
            <p className="text-red-300 text-xs text-center leading-relaxed bg-red-500/10 rounded-xl px-3 py-2">
              {error}
            </p>
          )}
          {notice && (
            <p className="text-green-300 text-xs text-center leading-relaxed bg-green-500/10 rounded-xl px-3 py-2">
              {notice}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !email || !password}
            className="w-full bg-[#D4AF37] text-[#1f2933] font-bold py-3.5 rounded-xl text-sm disabled:opacity-50 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            {loading
              ? <><Loader size={16} className="animate-spin" /> {tab === 'signup' ? 'Creating account...' : 'Signing in...'}</>
              : tab === 'signup' ? 'Create Account' : 'Sign In'
            }
          </button>
        </form>

        {/* Switch tab hint */}
        <p className="text-white/40 text-xs text-center mt-4">
          {tab === 'signin'
            ? <span>New here? <button onClick={() => setTab('signup')} className="text-[#D4AF37] font-medium underline-offset-2 hover:underline">Create an account</button></span>
            : <span>Already have an account? <button onClick={() => setTab('signin')} className="text-[#D4AF37] font-medium underline-offset-2 hover:underline">Sign in</button></span>
          }
        </p>
      </div>

      <p className="text-white/25 text-[10px] text-center mt-6 max-w-xs leading-relaxed">
        Your data is stored securely in the cloud and can be accessed from any device.
      </p>
    </div>
  )
}
