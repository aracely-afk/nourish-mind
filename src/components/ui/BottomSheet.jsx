import React, { useEffect, useRef, useState } from 'react'

export default function BottomSheet({ open, onClose, title, children, footer }) {
  const sheetRef = useRef(null)
  const startYRef = useRef(null)
  const startHeightRef = useRef(null)
  const [height, setHeight] = useState(null) // null = content-driven up to 90vh

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
      setHeight(null) // reset when closed so next open starts fresh
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  /**
   * Drag-to-resize: attach to the drag handle (and title bar).
   * Dragging UP expands the sheet up to 96vh.
   * Dragging DOWN 80px+ below the starting height closes the sheet.
   */
  function onHandlePointerDown(e) {
    // Don't steal clicks on buttons inside the title area
    if (e.target.closest('button')) return

    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    startYRef.current = clientY
    startHeightRef.current = sheetRef.current?.offsetHeight ?? 300

    function onMove(ev) {
      if (startYRef.current === null) return
      if (ev.cancelable) ev.preventDefault() // prevent scroll while dragging
      const cy = ev.touches ? ev.touches[0].clientY : ev.clientY
      const delta = startYRef.current - cy   // positive = finger moved up
      const maxH = window.visualViewport ? window.visualViewport.height * 0.96 : window.innerHeight * 0.96
      const newH = Math.min(maxH, Math.max(120, startHeightRef.current + delta))
      setHeight(newH)
    }

    function onUp() {
      const currentH = sheetRef.current?.offsetHeight ?? startHeightRef.current ?? 300
      // Close if dragged down 80+ px below where it started
      if (currentH < (startHeightRef.current ?? 300) - 80) {
        setHeight(null)
        onClose()
      }
      startYRef.current = null
      document.removeEventListener('touchmove', onMove)
      document.removeEventListener('touchend', onUp)
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
    }

    document.addEventListener('touchmove', onMove, { passive: false })
    document.addEventListener('touchend', onUp)
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Sheet */}
      <div
        ref={sheetRef}
        className="relative bg-white rounded-t-2xl flex flex-col"
        style={{
          ...(height ? { height: `${height}px` } : { maxHeight: '90dvh' }),
        }}
      >
        {/* Drag handle — primary drag target */}
        <div
          className="flex justify-center pt-3 pb-2 flex-shrink-0 select-none touch-none cursor-grab active:cursor-grabbing"
          onTouchStart={onHandlePointerDown}
          onMouseDown={onHandlePointerDown}
        >
          <div className="w-12 h-1.5 rounded-full bg-gray-300" />
        </div>

        {/* Title — also draggable */}
        {title && (
          <div
            className="px-4 pb-2 flex-shrink-0 border-b border-gray-100 select-none touch-none cursor-grab active:cursor-grabbing"
            onTouchStart={onHandlePointerDown}
            onMouseDown={onHandlePointerDown}
          >
            <h2 className="font-semibold text-gray-900 text-base pointer-events-none">{title}</h2>
          </div>
        )}

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto no-scrollbar">
          {children}
        </div>

        {/* Sticky footer — always visible, never scrolls away */}
        {footer && (
          <div className="flex-shrink-0 px-3 pt-2 border-t border-gray-100 bg-white"
               style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
