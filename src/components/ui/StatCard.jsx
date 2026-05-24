import React from 'react'

export default function StatCard({ icon: Icon, label, value, sub, color = 'text-indigo-600', bg = 'bg-indigo-50' }) {
  return (
    <div className="flex-1 flex flex-col items-center gap-1 p-3 bg-white rounded-2xl shadow-sm border border-gray-100">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${bg}`}>
        <Icon size={18} className={color} />
      </div>
      <span className="text-lg font-bold text-gray-900 leading-none">{value}</span>
      <span className="text-[10px] text-gray-500 text-center leading-tight">{label}</span>
      {sub && <span className="text-[10px] text-gray-400">{sub}</span>}
    </div>
  )
}
