import { useState, useEffect, useRef } from 'react'
import RainCanvas from '../components/RainCanvas'
import './Step3_Memories.css'

const CAPTIONS = [
  "Still one of my favorite moments...",
  "I think about this day all the time.",
  "You looked so happy here. I miss that smile.",
  "Wish I could go back to this exact moment.",
]

export default function Step3_Memories({ onNext, config }) {
  const [activeIdx, setActiveIdx] = useState(null)
  const [revealed, setRevealed] = useState([])
  const [allRevealed, setAllRevealed] = useState(false)
  const [dropActive, setDropActive] = useState([])
  const [fadeOut, setFadeOut] = useState(false)
  const [showScrollHint, setShowScrollHint] = useState(false)
  const contentRef = useRef(null)

  const images = config.images || [
    '/images/memory1.png',
    '/images/memory2.png',
    '/images/memory3.png',
    '/images/memory4.png',
  ]

  // Animate raindrops that can be tapped
  useEffect(() => {
    const interval = setInterval(() => {
      if (revealed.length < images.length) {
        const nextUnrevealed = images.findIndex((_, i) => !revealed.includes(i))
        if (nextUnrevealed !== -1) {
          setDropActive(prev => {
            if (!prev.includes(nextUnrevealed)) return [...prev, nextUnrevealed]
            return prev
          })
        }
      }
    }, 600)
    return () => clearInterval(interval)
  }, [revealed, images])

  // Scroll hint logic
  useEffect(() => {
    if (revealed.length >= 2 && !allRevealed) {
      const timer = setTimeout(() => {
        if (contentRef.current && contentRef.current.scrollTop < 50) {
          setShowScrollHint(true)
        }
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [revealed, allRevealed])

  const handleScroll = (e) => {
    if (e.target.scrollTop > 50) {
      setShowScrollHint(false)
    }
  }

  const revealPhoto = (idx) => {
    if (revealed.includes(idx)) {
      setActiveIdx(idx === activeIdx ? null : idx)
      return
    }
    setRevealed(prev => {
      const next = [...prev, idx]
      if (next.length === images.length) {
        setTimeout(() => setAllRevealed(true), 800)
        setShowScrollHint(false)
      }
      return next
    })
    setActiveIdx(idx)
  }

  const handleContinue = () => {
    setFadeOut(true)
    setTimeout(() => onNext(), 800)
  }

  return (
    <div className={`s3-wrapper ${fadeOut ? 'fade-out' : ''}`}>
      <RainCanvas intensity={120} opacity={0.4} />
      <div className="s3-bg" />
      <div className="s3-light-leak" />

      {/* Window sill bottom decoration */}
      <div className="s3-windowsill" />

      <div className="s3-content" ref={contentRef} onScroll={handleScroll}>
        <div className="s3-header">
          <p className="s3-label lora italic">whispers in the rain...</p>
          <h2 className="s3-title serif">Our Memories</h2>
          <p className="s3-sub">Tap the raindrops to see our photos</p>
        </div>

        {/* Polaroid grid */}
        <div className="s3-grid">
          {images.map((img, idx) => {
            const isRevealed = revealed.includes(idx)
            const isActive = activeIdx === idx
            const isDropping = dropActive.includes(idx)

            return (
              <div
                key={idx}
                className={`s3-card-wrapper ${isRevealed ? 'revealed' : ''} ${isActive ? 'active' : ''}`}
                onClick={() => revealPhoto(idx)}
              >
                {/* Decorative floating phrases to fill space around cards */}
                {isRevealed && (
                  <div className={`s3-float-phrase lora italic s3-phrase-${idx}`}>
                    {idx === 0 && "remember this?"}
                    {idx === 1 && "my favorite day"}
                    {idx === 2 && "that smile..."}
                    {idx === 3 && "forever yours"}
                  </div>
                )}

                {/* Raindrop trigger (shown before reveal) */}
                {!isRevealed && (
                  <div className={`s3-raindrop ${isDropping ? 'dropping' : ''}`}>
                    <div className="s3-drop-inner">
                      <span className="s3-drop-text">Tap</span>
                    </div>
                  </div>
                )}

                {/* Polaroid card */}
                {isRevealed && (
                  <div className={`s3-polaroid ${isActive ? 's3-active' : ''}`} style={{ '--delay': `${idx * 0.1}s` }}>
                    <div className="s3-photo-wrap">
                      <img className="s3-img" src={img} alt={`Memory ${idx + 1}`} loading="lazy" />
                      <div className="s3-photo-overlay" />
                    </div>
                    <div className="s3-caption lora italic">
                      {(config.captions && config.captions[idx]) || CAPTIONS[idx]}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {allRevealed && (
          <div className="s3-all-revealed">
            <p className="lora italic">Every photo is a special memory of us.</p>
            <button className="s3-next-btn" onClick={handleContinue}>
              <span>There's something I need to say</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        )}
      </div>

      {showScrollHint && (
        <div className="s3-scroll-hint">
          <p className="lora italic">Scroll down for more</p>
          <div className="s3-arrow-down">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 14l-7 7-7-7M12 21V3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      )}

      <div className="noise-overlay" />
      <div className="cinema-top" />
      <div className="cinema-bottom" />
    </div>
  )
}
