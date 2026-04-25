import { useContext } from 'react'
import { ViewContext } from '../../context/NavContext'

export default function EditorHeader({ onBack }) {
  const [, setCurrentView] = useContext(ViewContext)

  return (
    <header className="editor-header">
      {/* Back button */}
      <button 
        className="flex items-center gap-3 text-white/40 hover:text-white transition-colors group"
        onClick={() => onBack ? onBack() : setCurrentView('categories')}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:-translate-x-1 transition-transform">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
        <span className="text-[10px] font-mono uppercase tracking-[0.3em] font-bold">
          {onBack ? 'Back to Intro' : 'Back to Templates'}
        </span>
      </button>
    </header>
  )
}
