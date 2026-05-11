import { useEffect, useRef, useState } from 'react'
import RainCanvas from '../components/RainCanvas'
import './Step2_FogWipe.css'

export default function Step2_FogWipe({ onNext }) {
  const canvasRef = useRef(null)
  const [revealed, setRevealed] = useState(false)
  const [progress, setProgress] = useState(0)
  const [showNext, setShowNext] = useState(false)
  const [fadeOut, setFadeOut] = useState(false)
  const isDrawing = useRef(false)
  const hasCompleted = useRef(false)
  const drips = useRef([])
  const THRESHOLD = 55

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animId

    const resize = () => {
      const parent = canvas.parentElement
      canvas.width = parent.offsetWidth
      canvas.height = parent.offsetHeight
      drawFog()
    }

    const drawFog = () => {
      ctx.save()
      // 1. Realistic milky frosted glass
      const grad = ctx.createLinearGradient(0, 0, 0, canvas.height)
      grad.addColorStop(0, 'rgba(210, 230, 245, 0.92)')
      grad.addColorStop(0.5, 'rgba(180, 210, 235, 0.95)')
      grad.addColorStop(1, 'rgba(150, 190, 220, 0.98)')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // 2. Add frost grain texture
      for (let i = 0; i < 6000; i++) {
        const x = Math.random() * canvas.width
        const y = Math.random() * canvas.height
        const size = Math.random() * 1.5
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.04})`
        ctx.fillRect(x, y, size, size)
      }

      // 3. Subtle condensation streaks (vertical)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.03)'
      for(let i=0; i<60; i++) {
        ctx.fillRect(Math.random() * canvas.width, 0, Math.random() * 2 + 1, canvas.height)
      }
      ctx.restore()
    }

    const animate = () => {
      // Update and draw drips
      if (drips.current.length > 0) {
        ctx.save()
        ctx.globalCompositeOperation = 'destination-out'
        for (let i = drips.current.length - 1; i >= 0; i--) {
          const drip = drips.current[i]
          ctx.beginPath()
          ctx.arc(drip.x, drip.y, drip.r, 0, Math.PI * 2)
          ctx.fill()
          
          drip.y += drip.speed
          drip.r *= 0.996 // Slowly shrink
          
          if (drip.y > canvas.height || drip.r < 0.4) {
            drips.current.splice(i, 1)
          }
        }
        ctx.restore()
      }
      animId = requestAnimationFrame(animate)
    }

    resize()
    window.addEventListener('resize', resize)
    animate()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animId)
    }
  }, [])

  const wipe = (x, y) => {
    if (hasCompleted.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const rect = canvas.getBoundingClientRect()
    const cx = (x - rect.left) * (canvas.width / rect.width)
    const cy = (y - rect.top) * (canvas.height / rect.height)
    
    const radius = Math.max(canvas.width, canvas.height) * 0.08

    ctx.save()
    ctx.globalCompositeOperation = 'destination-out'
    
    // Natural irregular brush
    for (let i = 0; i < 5; i++) {
      const offsetX = (Math.random() - 0.5) * 20
      const offsetY = (Math.random() - 0.5) * 20
      const r = radius * (0.8 + Math.random() * 0.4)
      
      const brush = ctx.createRadialGradient(cx + offsetX, cy + offsetY, r * 0.2, cx + offsetX, cy + offsetY, r)
      brush.addColorStop(0, 'rgba(0,0,0,1)')
      brush.addColorStop(1, 'rgba(0,0,0,0)')
      
      ctx.fillStyle = brush
      ctx.beginPath()
      ctx.arc(cx + offsetX, cy + offsetY, r, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.restore()

    // Occasionally spawn a drip when wiping
    if (Math.random() > 0.85) {
      drips.current.push({
        x: cx + (Math.random() - 0.5) * 20,
        y: cy,
        r: Math.random() * 3 + 2,
        speed: Math.random() * 2 + 1
      })
    }

    // Progress check within the important interaction region (Message + Button area)
    const interactionRegion = {
      x: Math.round(canvas.width * 0.15),
      y: Math.round(canvas.height * 0.1),
      w: Math.round(canvas.width * 0.7),
      h: Math.round(canvas.height * 0.85)
    }

    const data = ctx.getImageData(interactionRegion.x, interactionRegion.y, interactionRegion.w, interactionRegion.h).data
    let clearedCount = 0
    const sampleStep = 25 
    for (let i = 3; i < data.length; i += sampleStep) {
      if (data[i] < 150) clearedCount++
    }
    
    const totalPossibleSamples = (interactionRegion.w * interactionRegion.h) / (sampleStep / 4)
    const pctWiped = Math.round((clearedCount / totalPossibleSamples) * 100)
    setProgress(Math.min(pctWiped, 100))

    if (pctWiped >= 85 && !hasCompleted.current) {
      hasCompleted.current = true
      setRevealed(true)
      setTimeout(() => setShowNext(true), 1200)
    }
  }

  const handleMouseMove = (e) => {
    if (!isDrawing.current) return
    wipe(e.clientX, e.clientY)
  }
  const handleTouchMove = (e) => {
    e.preventDefault()
    const t = e.touches[0]
    wipe(t.clientX, t.clientY)
  }

  const handleContinue = () => {
    setFadeOut(true)
    setTimeout(() => onNext(), 800)
  }

  return (
    <div className={`s2-wrapper ${fadeOut ? 'fade-out' : ''}`}>
      <RainCanvas intensity={120} opacity={0.4} />
      <div className="s2-bg" />

      {/* Window Frame with enhanced realism */}
      <div className="s2-window-frame">
        <div className="s2-window-pane">
          <div className="s2-condensation-layer" />
        </div>
      </div>

      {/* Message with realistic depth */}
      <div className="s2-hidden-content">
        <div className="s2-heart-msg">
          <div className="s2-heart-symbol">♡</div>
          <p className="s2-hidden-text serif italic">
            "The world feels so empty<br/>
            <span className="s2-subtext lora">without you by my side..."</span>
          </p>
        </div>
      </div>

      {/* Interactive Fog layer */}
      <div className="s2-canvas-container">
        <canvas
          ref={canvasRef}
          className="s2-fog-canvas"
          onMouseDown={() => { isDrawing.current = true }}
          onMouseUp={() => { isDrawing.current = false }}
          onMouseLeave={() => { isDrawing.current = false }}
          onMouseMove={handleMouseMove}
          onTouchStart={() => { isDrawing.current = true }}
          onTouchEnd={() => { isDrawing.current = false }}
          onTouchMove={handleTouchMove}
        />
      </div>

      {/* Interaction UI */}
      <div className="s2-overlay-content">
        <div className="s2-instruction-box">
          {!revealed ? (
            <>
              <p className="s2-instruction lora italic">Wipe the glass...</p>
              <div className="s2-progress-bar">
                <div className="s2-progress-fill" style={{ width: `${Math.min(progress * (100 / 65), 100)}%` }} />
              </div>
            </>
          ) : (
            <p className="s2-revealed-msg lora italic">I found you... finally.</p>
          )}
        </div>
      </div>

      {showNext && (
        <button className="s2-next-btn" onClick={handleContinue}>
          <span>Show me more</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      )}

      <div className="noise-overlay" />
      <div className="cinema-top" />
      <div className="cinema-bottom" />
    </div>
  )
}
