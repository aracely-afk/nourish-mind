import React, { useEffect, useMemo, useState } from 'react'
import { Sparkles, X } from 'lucide-react'

// Pure-CSS confetti — no external dep needed
const CONFETTI_COLORS = ['#D4AF37', '#A88FCF', '#4B2E83', '#22c55e', '#f97316', '#ec4899', '#3b82f6', '#facc15']

function generateConfettiPieces(count = 80) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    delay: Math.random() * 1.5,
    duration: 3 + Math.random() * 2.5,
    size: 6 + Math.random() * 8,
    rotation: Math.random() * 360,
    shape: Math.random() > 0.5 ? 'square' : 'circle',
  }))
}

export default function MilestoneCelebration({ milestone, day, onClose }) {
  const [show, setShow] = useState(false)
  const pieces = useMemo(() => generateConfettiPieces(90), [])

  useEffect(() => {
    // Trigger entrance animation
    requestAnimationFrame(() => setShow(true))
  }, [])

  if (!milestone) return null

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center px-4 transition-opacity duration-300 ${show ? 'opacity-100' : 'opacity-0'}`}
      style={{ background: 'rgba(0,0,0,0.65)' }}
    >
      {/* Confetti layer */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {pieces.map(p => (
          <span
            key={p.id}
            className="absolute top-[-20px] confetti-piece"
            style={{
              left: `${p.left}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              background: p.color,
              borderRadius: p.shape === 'circle' ? '50%' : '2px',
              animation: `confetti-fall ${p.duration}s ${p.delay}s linear forwards`,
              transform: `rotate(${p.rotation}deg)`,
            }}
          />
        ))}
      </div>

      {/* Modal card */}
      <div
        className={`relative w-full max-w-sm transform transition-all duration-500 ${show ? 'scale-100 translate-y-0' : 'scale-90 translate-y-8'}`}
      >
        <div className={`relative bg-gradient-to-br ${milestone.gradient} rounded-3xl p-6 shadow-2xl overflow-hidden`}>
          {/* Decorative sparkles */}
          <Sparkles className="absolute top-4 right-4 text-white/40" size={20} />
          <Sparkles className="absolute bottom-6 left-6 text-white/30" size={14} />

          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-white/70 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
            <X size={18} />
          </button>

          {/* Big emoji burst */}
          <div className="text-center pt-2">
            <div className="text-7xl mb-2 animate-bounce-slow" style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.25))' }}>
              {milestone.emoji}
            </div>
            <p className="text-white/80 text-xs font-semibold uppercase tracking-widest font-brand">
              Day {day} Milestone
            </p>
            <h2 className="text-2xl font-bold text-white mt-1 font-brand">{milestone.title}</h2>
          </div>

          {/* Badge pill */}
          <div className="flex justify-center mt-3">
            <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full border border-white/30">
              🏅 {milestone.badge}
            </span>
          </div>

          {/* Headline + message */}
          <div className="mt-5 bg-white/95 rounded-2xl p-4 space-y-3">
            <p className="text-gray-900 font-bold text-base font-brand text-center">{milestone.headline}</p>
            <p className="text-gray-700 text-sm leading-relaxed">{milestone.message}</p>
            <p className="text-xs text-gray-500 italic font-display border-t border-gray-100 pt-2">{milestone.scripture}</p>
          </div>

          {/* CTA */}
          <button
            onClick={onClose}
            className="w-full mt-4 bg-white text-gray-900 font-semibold py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Keep Going ✨
          </button>
        </div>
      </div>

      <style>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(105vh) rotate(720deg);
            opacity: 0.8;
          }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 1.8s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
