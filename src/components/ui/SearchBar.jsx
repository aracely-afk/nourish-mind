import React, { useState, useEffect } from 'react'
import { Search, X } from 'lucide-react'

export default function SearchBar({ value, onChange, placeholder = 'Search foods…', autoFocus }) {
  const [local, setLocal] = useState(value)

  useEffect(() => {
    const t = setTimeout(() => onChange(local), 300)
    return () => clearTimeout(t)
  }, [local])

  useEffect(() => { setLocal(value) }, [value])

  return (
    <div className="relative">
      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
      <input
        type="text"
        value={local}
        onChange={e => setLocal(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-gray-100 text-sm text-gray-900 placeholder-gray-400 border-0 focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />
      {local && (
        <button onClick={() => { setLocal(''); onChange('') }}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600">
          <X size={14} />
        </button>
      )}
    </div>
  )
}
