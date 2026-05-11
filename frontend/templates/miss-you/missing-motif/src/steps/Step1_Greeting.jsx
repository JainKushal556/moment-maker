import { useState, useEffect, useRef } from 'react'
import RainCanvas from '../components/RainCanvas'
import './Step1_Greeting.css'

export default function Step1_Greeting({ onNext, config }) {
  const [knocked, setKnocked] = useState(false)
  const [ripples, setRipples] = useState([])
  const [showContinue, setShowContinue] = useState(false)
  const [textVisible, setTextVisible] = useState(false)
  const [subVisible, setSubVisible] = useState(false)
  const [bgFade, setBgFade] = useState(false)
  const rippleId = useRef(0)

  useEffect(() => {
    const t1 = setTimeout(() => setTextVisible(true), 800)
    const t2 = setTimeout(() => setSubVisible(true), 2000)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  const handleKnock = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const id = rippleId.current++
    setRipples(prev => [...prev, { id, x, y }])
    setTimeout(() => setRipples(prev => prev.filter(r => r.id !== id)), 1200)

    if (!knocked) {
      setKnocked(true)
      setTimeout(() => setShowContinue(true), 1800)
    }
  }

  const handleContinue = () => {
    setBgFade(true)
    setTimeout(() => onNext(), 900)
  }

  return (
    <div className={`s1-wrapper ${bgFade ? 'fade-out' : ''}`} onClick={handleKnock}>
      <RainCanvas intensity={140} opacity={0.5} />
      <div className="s1-bg-glow" />

      {/* Window frame */}
      <div className="s1-window-frame">
        <div className="s1-window-pane">
          <div className="s1-condensation" />
          <div className="s1-condensation s1-condensation-2" />
          <div className="s1-condensation s1-condensation-3" />
        </div>
      </div>

      {/* Ripples on knock */}
      {ripples.map(r => (
        <div
          key={r.id}
          className="s1-ripple"
          style={{ left: r.x, top: r.y }}
        />
      ))}

      {/* Content */}
      <div className="s1-content">
        <div className="s1-warm-pulse" />
        <div className={`s1-greeting-text ${textVisible ? 'visible' : ''} bloom-text`}>
          <span className="s1-hey serif italic">Hey my love...</span>
          <h1 className={`s1-name script`}>
            {config.recipientName || 'Are you there?'}
          </h1>
        </div>

        <p className={`s1-sub lora italic ${subVisible ? 'visible' : ''}`}>
          {knocked ? 'I miss you so much.' : 'tap anywhere to start'}
        </p>

        {showContinue && (
          <button
            className="s1-continue-btn"
            onClick={(e) => { e.stopPropagation(); handleContinue() }}
          >
            <span>Open the window</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}
      </div>

      {/* Instruction */}
      <div className={`s1-knock-hint ${knocked ? 'hidden' : ''}`}>
        <div className="s1-knock-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M18 11.5V8a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v1M14 9.5V7a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v5M10 11.5v-2a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v6c0 3.31 2.69 6 6 6h2a6 6 0 0 0 6-6v-3a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v1" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <p>Knock knock...</p>
        </div>
      </div>

      <div className="noise-overlay" />
      <div className="cinema-top" />
      <div className="cinema-bottom" />
    </div>
  )
}
