import React from 'react'

export default function CalorieRing({ consumed, min, max, size = 180 }) {
  const radius = (size - 24) / 2
  const circumference = 2 * Math.PI * radius
  const midTarget = (min + max) / 2
  const pct = midTarget > 0 ? Math.min(consumed / midTarget, 1.2) : 0
  const dash = circumference * Math.min(pct, 1)
  const over = consumed > max
  const inRange = consumed >= min && consumed <= max
  const color = over ? '#ef4444' : inRange ? '#22c55e' : consumed > min * 0.8 ? '#eab308' : '#6366f1'

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="#f1f5f9" strokeWidth={12} />
        <circle
          cx={size/2} cy={size/2} r={radius}
          fill="none" stroke={color} strokeWidth={12}
          strokeDasharray={`${dash} ${circumference}`}
          strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 0.6s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-2xl font-bold text-gray-900">{consumed.toLocaleString()}</span>
        <span className="text-[10px] text-gray-500 font-medium">cal eaten</span>
        <span className="text-xs text-gray-400 mt-0.5">{min}–{max}</span>
      </div>
    </div>
  )
}
