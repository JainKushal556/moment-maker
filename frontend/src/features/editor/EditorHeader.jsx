import { useContext } from 'react'
import { ViewContext } from '../../context/NavContext'

export default function EditorHeader({ onBack, onRefresh }) {
  const [, setCurrentView] = useContext(ViewContext)

  return (
    <header className="editor-header flex items-center justify-between px-4 md:px-6">
      {/* Back button */}
      <button
        className="flex items-center gap-3 text-white/40 hover:text-white transition-colors group"
        onClick={() => onBack ? onBack() : setCurrentView('moments')}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:-translate-x-1 transition-transform">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        <span className="text-[10px] font-mono uppercase tracking-[0.3em] font-bold">
          {onBack ? 'Back to Intro' : 'Back to My Moments'}
        </span>
      </button>

      {/* Refresh button - Mobile optimized */}
      {onRefresh && (
        <button
          onClick={onRefresh}
          className="md:hidden flex items-center justify-center w-10 h-10 bg-white/5 border border-white/10 rounded-xl active:scale-95 transition-all text-white/60"
          title="Refresh Preview"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 2v6h-6" />
            <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
            <path d="M3 22v-6h6" />
            <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
          </svg>
        </button>
      )}
    </header>
  )
}
