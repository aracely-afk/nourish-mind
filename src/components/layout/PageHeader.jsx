import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'

export default function PageHeader({ title, subtitle, backTo, actions }) {
  const navigate = useNavigate()
  return (
    <div className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-gray-100 px-4 py-3">
      <div className="flex items-center gap-2">
        {backTo !== undefined && (
          <button
            onClick={() => backTo ? navigate(backTo) : navigate(-1)}
            className="p-1 -ml-1 rounded-full text-gray-500 hover:text-gray-800 hover:bg-gray-100 min-w-[36px] min-h-[36px] flex items-center justify-center"
          >
            <ChevronLeft size={22} />
          </button>
        )}
        <div className="flex-1 min-w-0">
          <h1 className="font-semibold text-gray-900 text-base leading-tight truncate">{title}</h1>
          {subtitle && <p className="text-xs text-gray-500 mt-0.5 truncate">{subtitle}</p>}
        </div>
        {actions && <div className="flex items-center gap-1">{actions}</div>}
      </div>
    </div>
  )
}
