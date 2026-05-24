import React from 'react'

export default function ProgressBar({ value, max, color = 'bg-indigo-500', className = '' }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0
  return (
    <div className={`h-2 rounded-full bg-gray-100 overflow-hidden ${className}`}>
      <div
        className={`h-full rounded-full transition-all duration-500 ${color}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}
