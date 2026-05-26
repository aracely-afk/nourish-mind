import React, { useEffect } from 'react'

export default function BottomSheet({ open, onClose, title, children, footer }) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-t-2xl max-h-[90vh] flex flex-col"
           style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1 rounded-full bg-gray-300" />
        </div>
        {title && (
          <div className="px-4 pb-2 flex-shrink-0 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900 text-base">{title}</h2>
          </div>
        )}
        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto no-scrollbar">
          {children}
        </div>
        {/* Sticky footer — always visible, never scrolls away */}
        {footer && (
          <div className="flex-shrink-0 px-3 pb-3 pt-2 border-t border-gray-100 bg-white">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
