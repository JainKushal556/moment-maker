import { useContext } from 'react'
import { ViewContext } from '../../context/NavContext'

export default function EditorHeader({ onBack, onRefresh, onFullScreen, isMobileFullPreview, deviceView, setDeviceView }) {
  const [, navigateTo] = useContext(ViewContext)

  return (
    <header className="w-full h-12 flex items-center justify-between px-6 md:px-12 border-b border-white/5 bg-black/20 backdrop-blur-md sticky top-0 z-100">
      {/* Left: Back button */}
      <div className="flex-1">
        <button
          className="flex items-center gap-3 text-white/40 hover:text-white transition-colors group"
          onClick={() => onBack ? onBack() : navigateTo('moments')}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:-translate-x-1 transition-transform">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] font-bold">
            {onBack ? 'Back to Intro' : 'Back to My Moments'}
          </span>
        </button>
      </div>

      {/* Right: Action buttons & Device Switcher */}
      <div className="flex-1 flex justify-end items-center gap-4">
        {/* Mobile Action Buttons (Hidden on Desktop) */}
        <div className="flex md:hidden items-center gap-2">
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="tp-device-btn"
              title="Refresh Preview"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 2v6h-6" />
                <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
                <path d="M3 22v-6h6" />
                <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
              </svg>
            </button>
          )}

          {onFullScreen && (
            <button
              onClick={onFullScreen}
              className={`tp-device-btn tp-pulse-white ${isMobileFullPreview ? 'tp-fs-active' : ''}`}
              title={isMobileFullPreview ? "Exit Full Screen" : "Full Screen Preview"}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="tp-fullscreen-svg">
                {isMobileFullPreview ? (
                  <>
                    <path className="tp-arrow-in-tl" d="M3 8h5V3M8 8l-5-5" />
                    <path className="tp-arrow-in-br" d="M21 16h-5v5M16 16l5 5" />
                  </>
                ) : (
                  <>
                    <path className="tp-arrow-out-tr" d="M13 5h6v6M19 5l-7 7" />
                    <path className="tp-arrow-out-bl" d="M11 19H5v-6M5 19l7-7" />
                  </>
                )}
              </svg>
            </button>
          )}
        </div>

        {/* Desktop Controls Group */}
        <div className="hidden md:flex items-center gap-3">
          {/* Desktop Refresh Button */}
          <button
            onClick={onRefresh}
            className="tp-device-btn"
            title="Refresh Preview"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 2v6h-6" />
              <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
              <path d="M3 22v-6h6" />
              <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
            </svg>
          </button>

          {/* Device Switcher (Desktop Only) */}
          <div className="flex items-center gap-1.5 p-1 bg-white/5 rounded-full border border-white/5">
            {[
              { id: 'desktop', label: 'Desktop', icon: <><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></> },
              { id: 'tablet', label: 'Tablet', icon: <><rect width="16" height="20" x="4" y="2" rx="2" ry="2" /><line x1="12" y1="18" x2="12.01" y2="18" /></> },
              { id: 'mobile', label: 'Phone', icon: <><rect width="12" height="20" x="6" y="2" rx="2" ry="2" /><line x1="12" y1="18" x2="12.01" y2="18" /></> }
            ].map(d => (
              <button
                key={d.id}
                onClick={() => setDeviceView(d.id)}
                title={d.label}
                className={`tp-device-btn ${deviceView === d.id ? 'active' : ''}`}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">{d.icon}</svg>
              </button>
            ))}
          </div>
        </div>
      </div>
  </header>
  )
}
