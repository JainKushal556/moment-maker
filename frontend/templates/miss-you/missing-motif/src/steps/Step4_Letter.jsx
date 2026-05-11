import { useState, useEffect, useRef } from 'react'
import RainCanvas from '../components/RainCanvas'
import './Step4_Letter.css'

export default function Step4_Letter({ onNext, config }) {
  const [phase, setPhase] = useState('desk') // desk → envelope → typing → done
  const [typedText, setTypedText] = useState('')
  const [showBtn, setShowBtn] = useState(false)
  const [fadeOut, setFadeOut] = useState(false)
  const letterRef = useRef(null)

  const letterBody = config.letterBody ||
    "I keep reaching for my phone just to text you something random, then remembering there's a distance between us that feels heavier on some days than others...\n\nThe rain always makes it worse. Everything quiet, everything grey, and all I can think about is how much easier it is to breathe when you're around.\n\nI'm not writing this because I need an answer. I'm writing this because I needed you to know... that I miss you. More than words usually allow."

  const letterHeader = config.letterHeader || 'To the one I keep thinking about,'

  useEffect(() => {
    if (phase === 'desk') return

    if (phase === 'typing') {
      let i = 0
      const speed = 28
      const interval = setInterval(() => {
        setTypedText(letterBody.slice(0, i + 1))
        i++
        if (letterRef.current) {
          letterRef.current.scrollTop = letterRef.current.scrollHeight
        }
        if (i >= letterBody.length) {
          clearInterval(interval)
          setTimeout(() => setShowBtn(true), 1000)
          setPhase('done')
        }
      }, speed)
      return () => clearInterval(interval)
    }
  }, [phase, letterBody])

  const handleContinue = () => {
    setFadeOut(true)
    setTimeout(() => onNext(), 800)
  }

  return (
    <div className={`s4-wrapper ${fadeOut ? 'fade-out' : ''}`}>
      <RainCanvas intensity={80} opacity={0.3} />
      <div className="s4-bg" />

      {/* Desk scene */}
      <div className={`s4-desk-scene ${phase !== 'desk' ? 'slide-up' : ''}`}>
        <div className="s4-lamp-glow" />
        <div className="s4-desk-surface">
          {/* Envelope (Centered) */}
          <div
            className={`s4-envelope ${phase === 'desk' ? 'clickable' : 'opened'}`}
            onClick={() => phase === 'desk' && setPhase('opening')}
          >
            <div className="s4-envelope-body">
              <div className="s4-envelope-flap" />
              <div className="s4-envelope-body-inner">
                <div className="s4-wax-seal">
                  <span>♡</span>
                </div>
              </div>
            </div>
            {phase === 'desk' && (
              <p className="s4-tap-hint lora italic">tap to open</p>
            )}
          </div>

          {/* Lamp Showpiece (Left) */}
          <div className="s4-lamp">
            <div className="s4-lamp-base" />
            <div className="s4-lamp-arm-1" />
            <div className="s4-lamp-head">
              <div className="s4-lamp-bulb" />
            </div>
            <div className="s4-lamp-light-beam" />
          </div>

          {/* Old Style Inkwell and Nib (Right) */}
          <div className="s4-inkwell-group">
            <div className="s4-inkwell">
              <div className="s4-ink-lid" />
            </div>
            <div className="s4-dip-pen">
              <div className="s4-pen-nib" />
            </div>
          </div>
        </div>
      </div>

      {/* Letter content */}
      {(phase === 'opening' || phase === 'typing' || phase === 'done') && (
        <div
          className={`s4-letter-overlay ${phase === 'opening' ? 'opening' : 'open'}`}
          onAnimationEnd={() => {
            if (phase === 'opening') setPhase('typing')
          }}
        >
          <div className="s4-paper">
            <div className="s4-paper-lines" />
            <div className="s4-paper-content" ref={letterRef}>
              <p className="s4-letter-header lora italic">{letterHeader}</p>
              <div className="s4-letter-body lora">
                {typedText.split('\n').map((line, i) => (
                  <p key={i} className={line === '' ? 's4-para-break' : ''}>{line}</p>
                ))}
                {phase === 'typing' && <span className="s4-cursor">|</span>}
              </div>
            </div>
          </div>

          {showBtn && (
            <button className="s4-next-btn" onClick={handleContinue}>
              <span>One last thing...</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          )}
        </div>
      )}

      <div className="noise-overlay" />
      <div className="cinema-top" />
      <div className="cinema-bottom" />
    </div>
  )
}
