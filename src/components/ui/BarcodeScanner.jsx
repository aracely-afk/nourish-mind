import React, { useEffect, useRef, useState } from 'react'
import { X, Camera, Loader } from 'lucide-react'

/**
 * Full-screen barcode scanner overlay.
 * Lazily imports @zxing/browser so it stays out of the main bundle.
 *
 * Props:
 *   onResult(barcodeString) — called once when a barcode is detected
 *   onClose()               — called when the user dismisses the scanner
 */
export default function BarcodeScanner({ onResult, onClose }) {
  const videoRef = useRef(null)
  const controlsRef = useRef(null)
  const firedRef = useRef(false)
  const [status, setStatus] = useState('initializing') // initializing | scanning | error

  useEffect(() => {
    let mounted = true

    async function start() {
      try {
        const { BrowserMultiFormatReader } = await import('@zxing/browser')
        const reader = new BrowserMultiFormatReader()

        const controls = await reader.decodeFromConstraints(
          {
            video: {
              facingMode: { ideal: 'environment' },
              width:  { ideal: 1280 },
              height: { ideal: 720 },
            },
          },
          videoRef.current,
          (result) => {
            if (result && mounted && !firedRef.current) {
              firedRef.current = true
              controls.stop()
              onResult(result.getText())
            }
          }
        )

        controlsRef.current = controls
        if (mounted) setStatus('scanning')
      } catch {
        if (mounted) setStatus('error')
      }
    }

    start()

    return () => {
      mounted = false
      try { controlsRef.current?.stop() } catch {}
    }
  }, [onResult])

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 bg-black/80 flex-shrink-0"
        style={{ paddingTop: 'max(0.75rem, env(safe-area-inset-top))' }}
      >
        <div>
          <p className="text-white font-semibold text-base">Scan Barcode</p>
          <p className="text-white/50 text-xs mt-0.5">Point at the barcode on the packaging</p>
        </div>
        <button onClick={onClose} className="p-2 text-white/70 hover:text-white transition-colors">
          <X size={22} />
        </button>
      </div>

      {/* Camera feed */}
      <div className="flex-1 relative overflow-hidden">
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          playsInline
          autoPlay
          muted
        />

        {/* Scanning frame overlay */}
        {status === 'scanning' && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {/* Dark vignette */}
            <div className="absolute inset-0 bg-black/50" />

            {/* The scan frame */}
            <div className="relative z-10 w-72 h-44">
              {/* Corner brackets */}
              <span className="absolute top-0    left-0   w-8 h-8 border-t-[3px] border-l-[3px] border-[#D4AF37] rounded-tl-lg" />
              <span className="absolute top-0    right-0  w-8 h-8 border-t-[3px] border-r-[3px] border-[#D4AF37] rounded-tr-lg" />
              <span className="absolute bottom-0 left-0   w-8 h-8 border-b-[3px] border-l-[3px] border-[#D4AF37] rounded-bl-lg" />
              <span className="absolute bottom-0 right-0  w-8 h-8 border-b-[3px] border-r-[3px] border-[#D4AF37] rounded-br-lg" />

              {/* Scanning line */}
              <span className="absolute left-3 right-3 h-px bg-[#D4AF37]/80 animate-scan-line" />
            </div>

            {/* Label below frame */}
            <p className="absolute bottom-[calc(50%-130px)] text-white/60 text-xs tracking-wide">
              Align barcode within the frame
            </p>
          </div>
        )}

        {/* Initializing state */}
        {status === 'initializing' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70">
            <div className="text-center text-white">
              <Loader size={40} className="mx-auto mb-3 animate-spin text-[#D4AF37]" />
              <p className="text-sm font-medium">Starting camera...</p>
            </div>
          </div>
        )}

        {/* Error state */}
        {status === 'error' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/85 p-8">
            <div className="text-center text-white">
              <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                <Camera size={32} className="text-red-400" />
              </div>
              <p className="font-semibold text-lg mb-2">Camera Access Needed</p>
              <p className="text-sm text-white/60 mb-6 leading-relaxed">
                Allow camera access in your browser settings, then try again.
              </p>
              <button
                onClick={onClose}
                className="bg-white text-gray-900 px-8 py-3 rounded-xl font-semibold"
              >
                Go Back
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom safe-area spacer */}
      <div
        className="bg-black/80 flex-shrink-0"
        style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
      />
    </div>
  )
}
