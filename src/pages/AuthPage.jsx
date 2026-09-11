import React, { useState } from 'react'
import { supabase } from '../utils/supabase'
import { Mail, Lock, Eye, EyeOff, Loader } from 'lucide-react'

export default function AuthPage({ recovery = false, invalidRecovery = false }) {
  const [tab, setTab] = useState(invalidRecovery ? 'forgot' : 'signin')  // 'signin' | 'signup'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [saved, setSaved] = useState(false)
  const forgot = tab === 'forgot'
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(invalidRecovery ? 'This reset link is invalid or expired. Request a new link below.' : '')
  const [notice, setNotice] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setNotice('')
    setLoading(true)

    try {
      if (recovery) {
        if (password !== confirmPassword) throw new Error('Passwords do not match.')
        const { error } = await supabase.auth.updateUser({ password })
        if (error) throw error
        setPassword('')
        setConfirmPassword('')
        setSaved(true)
        setNotice('Password updated. You can now sign in with your new password.')
      } else if (forgot) {
        const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: window.location.origin + '/',
        })
        if (error) throw error
        setNotice('If an account exists for this email, a reset link is on its way. Check your inbox and spam folder.')
      } else if (tab === 'signup') {
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
    } finally {
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
      <div className="flex flex-col items-center mb-8 bg-[#1f2933] rounded-2xl p-4">
        <img src="/icon.png" alt="" className="w-20 h-20 object-contain drop-shadow-xl mb-3"
             onError={e => { e.target.style.display = 'none' }} />
        <h1 className="font-brand font-bold text-3xl tracking-wide text-[#D4AF37]">NourishMind</h1>
        <p className="text-white text-xs tracking-widest uppercase mt-1">Renew Your Mind</p>
      </div>

      {/* Card */}
      <div className="w-full max-w-sm bg-[#1f2933] rounded-3xl p-6 border border-white/10">
        {/* Tabs */}
        {!recovery && !forgot && <div className="flex bg-white/10 rounded-2xl p-1 mb-6">
          {[['signin', 'Sign In'], ['signup', 'Create Account']].map(([val, label]) => (
            <button
              key={val}
              onClick={() => { setTab(val); setError(''); setNotice('') }}
              className={`flex-1 min-h-[44px] py-2 rounded-xl text-sm font-semibold transition-all ${
                tab === val ? 'bg-white text-[#1f2933] shadow-sm' : 'text-white hover:text-white'
              }`}
            >
              {label}
            </button>
          ))}
        </div>}
        {(recovery || forgot) && <h2 className="text-white text-xl font-semibold mb-4">{recovery ? 'Set a new password' : 'Reset your password'}</h2>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          {!recovery && <div className="relative">
            <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white" />
            <input
              aria-label="Email address"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Email address"
              required
              autoComplete="email"
              className="w-full bg-white/10 border border-white rounded-xl pl-10 pr-4 py-3 text-white placeholder-white text-sm focus:outline-none focus:border-[#D4AF37] focus:bg-white/15 transition-colors"
            />
          </div>}

          {/* Password */}
          {!forgot && !saved && <div className="relative">
            <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white" />
            <input
              aria-label={recovery ? 'New password' : 'Password'}
              minLength={recovery || tab === 'signup' ? 6 : undefined}
              type={showPw ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder={tab === 'signup' ? 'Create a password (6+ chars)' : 'Password'}
              required
              autoComplete={recovery || tab === 'signup' ? 'new-password' : 'current-password'}
              className="w-full bg-white/10 border border-white rounded-xl pl-10 pr-12 py-3 text-white placeholder-white text-sm focus:outline-none focus:border-[#D4AF37] focus:bg-white/15 transition-colors"
            />
            <button
              type="button"
              aria-label={showPw ? 'Hide password' : 'Show password'}
              onClick={() => setShowPw(v => !v)}
              className="absolute right-1 top-1/2 -translate-y-1/2 text-white w-11 h-11 flex items-center justify-center transition-colors"
            >
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>}
          {recovery && !saved && <input aria-label="Confirm new password" type="password" autoComplete="new-password" required minLength={6} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Confirm new password" className="w-full bg-[#1f2933] border border-white rounded-xl px-4 py-3 text-white placeholder-white text-sm" />}

          {/* Error */}
          {error && (
            <p role="alert" className="text-red-300 text-xs text-center leading-relaxed bg-red-500/10 rounded-xl px-3 py-2">
              {error}
            </p>
          )}
          {notice && (
            <p role="status" className="text-green-300 text-xs text-center leading-relaxed bg-green-500/10 rounded-xl px-3 py-2">
              {notice}
            </p>
          )}

          {/* Submit */}
          {!saved && <button
            type="submit"
            disabled={loading || (recovery ? !password || !confirmPassword : !email || (!forgot && !password))}
            className="w-full bg-[#D4AF37] text-[#1f2933] font-bold py-3.5 rounded-xl text-sm disabled:opacity-50 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            {loading
              ? <><Loader size={16} className="animate-spin" /> {recovery ? 'Updating password...' : forgot ? 'Sending link...' : tab === 'signup' ? 'Creating account...' : 'Signing in...'}</>
              : recovery ? 'Save new password' : forgot ? 'Send reset link' : tab === 'signup' ? 'Create Account' : 'Sign In'
            }
          </button>}
        </form>
        {!recovery && tab === 'signin' && <button type="button" onClick={() => { setTab('forgot'); setError(''); setNotice('') }} className="w-full min-h-[44px] mt-3 text-white underline">Forgot password?</button>}
        {forgot && <button type="button" onClick={() => { setTab('signin'); setError(''); setNotice('') }} className="w-full min-h-[44px] text-white underline">Back to sign in</button>}
        {saved && <button type="button" onClick={async () => {
          setLoading(true)
          const { error } = await supabase.auth.signOut({ scope: 'local' })
          if (error) { setError(error.message); setLoading(false); return }
          window.location.replace('/')
        }} disabled={loading} className="w-full min-h-[44px] text-white underline">Continue to sign in</button>}

        {/* Switch tab hint */}
        {!recovery && !forgot && <p className="text-white text-xs text-center mt-4">
          {tab === 'signin'
            ? <span>New here? <button onClick={() => setTab('signup')} className="text-[#D4AF37] font-medium underline-offset-2 hover:underline">Create an account</button></span>
            : <span>Already have an account? <button onClick={() => setTab('signin')} className="text-[#D4AF37] font-medium underline-offset-2 hover:underline">Sign in</button></span>
          }
        </p>}
      </div>

      <p className="text-white text-[10px] text-center mt-6 max-w-xs leading-relaxed">
        Your data is stored securely in the cloud and can be accessed from any device.
      </p>
    </div>
  )
}
