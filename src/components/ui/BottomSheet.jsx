import React, { useEffect, useRef, useState } from 'react'

export default function BottomSheet({ open, onClose, title, children, footer }) {
  const sheetRef = useRef(null)
  const startYRef = useRef(null)
  const startHeightRef = useRef(null)
  const [height, setHeight] = useState(null) // null = content-driven
  const [kbOffset, setKbOffset] = useState(0) // keyboard height in px

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
      setHeight(null)
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  // Track visual viewport so the sheet lifts above the keyboard on iOS/Android
  useEffect(() => {
    if (!open) { setKbOffset(0); return }

    function update() {
      if (!window.visualViewport) return
      const offset = window.innerHeight - window.visualViewport.height - window.visualViewport.offsetTop
      setKbOffset(Math.max(0, offset))
    }

    window.visualViewport?.addEventListener('resize', update)
    window.visualViewport?.addEventListener('scroll', update)
    update()

    return () => {
      window.visualViewport?.removeEventListener('resize', update)
      window.visualViewport?.removeEventListener('scroll', update)
      setKbOffset(0)
    }
  }, [open])

  /**
   * Drag-to-resize: dragging UP expands the sheet.
   * Dragging DOWN 80px+ below the starting height closes it.
   */
  function onHandlePointerDown(e) {
    if (e.target.closest('button')) return

    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    startYRef.current = clientY
    startHeightRef.current = sheetRef.current?.offsetHeight ?? 300

    function onMove(ev) {
      if (startYRef.current === null) return
      if (ev.cancelable) ev.preventDefault()
      const cy = ev.touches ? ev.touches[0].clientY : ev.clientY
      const delta = startYRef.current - cy
      const vh = window.visualViewport ? window.visualViewport.height : window.innerHeight
      const newH = Math.min(vh * 0.96, Math.max(120, startHeightRef.current + delta))
      setHeight(newH)
    }

    function onUp() {
      const currentH = sheetRef.current?.offsetHeight ?? startHeightRef.current ?? 300
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
    // z-[60] beats BottomNav's z-50 so the sheet always renders on top.
    // bottom is set dynamically so the sheet lifts above the keyboard.
    <div
      className="fixed inset-x-0 top-0 z-[60] flex flex-col justify-end"
      style={{ bottom: `${kbOffset}px` }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Sheet */}
      <div
        ref={sheetRef}
        className="relative bg-white rounded-t-2xl flex flex-col"
        style={height ? { height: `${height}px` } : { maxHeight: '92%' }}
      >
        {/* Drag handle */}
        <div
          className="flex justify-center pt-3 pb-2 flex-shrink-0 select-none touch-none cursor-grab active:cursor-grabbing"
          onTouchStart={onHandlePointerDown}
          onMouseDown={onHandlePointerDown}
        >
          <div className="w-12 h-1.5 rounded-full bg-gray-300" />
        </div>

        {/* Title — also a drag target */}
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

        {/* Sticky footer — always visible, never scrolled away */}
        {footer && (
          <div
            className="flex-shrink-0 px-3 pt-2 border-t border-gray-100 bg-white"
            style={{
              paddingBottom: kbOffset > 0
                ? '0.75rem'
                : 'max(0.75rem, env(safe-area-inset-bottom))',
            }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
