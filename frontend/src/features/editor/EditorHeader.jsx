import { useContext } from 'react'
import { ViewContext } from '../../context/NavContext'

export default function EditorHeader({ onBack, onRefresh, onFullScreen, isMobileFullPreview }) {
  const [, navigateTo] = useContext(ViewContext)

  return (
    <header className="w-full h-12 flex items-center justify-between px-6 md:px-12 border-b border-white/5 bg-black/20 backdrop-blur-md sticky top-0 z-100">
      {/* Back button */}
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

      {/* Action buttons - Mobile optimized */}
      <div className="flex items-center gap-2">
        {onFullScreen && (
          <button
            onClick={onFullScreen}
            className={`md:hidden flex items-center justify-center w-10 h-10 bg-white/5 border border-white/10 rounded-xl active:scale-95 transition-all ${isMobileFullPreview ? 'text-pink-500 bg-pink-500/10 border-pink-500/20' : 'text-white/60'}`}
            title={isMobileFullPreview ? "Exit Full Screen" : "Full Screen Preview"}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              {isMobileFullPreview ? (
                <path d="M4 14h6v6M20 10h-6V4M14 10l7-7M10 14l-7 7" />
              ) : (
                <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
              )}
            </svg>
          </button>
        )}

        {onRefresh && (
          <button
            onClick={onRefresh}
            className="md:hidden flex items-center justify-center w-10 h-10 bg-white/5 border border-white/10 rounded-xl active:scale-95 transition-all text-white/60"
            title="Refresh Preview"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 2v6h-6" />
              <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
              <path d="M3 22v-6h6" />
              <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
            </svg>
          </button>
        )}
      </div>
    </header>
  )
}
