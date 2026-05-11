import { useState, useEffect, useRef } from 'react'
import RainCanvas from '../components/RainCanvas'
import './Step5_Outro.css'

export default function Step5_Outro({ config }) {
  const [phase, setPhase] = useState(0) // 0=dark, 1=text1, 2=text2, 3=text3, 4=final
  const [particles, setParticles] = useState([])
  const canvasRef = useRef(null)

  const outroLine1 = config.outroLine1 || "The rain will pass."
  const outroLine2 = config.outroLine2 || "And when it does..."
  const outroFinal = config.outroFinal || "I'll be right here, waiting for you."
  const recipientName = config.recipientName || ''

  // Phase timeline
  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 800),
      setTimeout(() => setPhase(2), 2600),
      setTimeout(() => setPhase(3), 4200),
      setTimeout(() => setPhase(4), 6000),
    ]
    return () => timers.forEach(clearTimeout)
  }, [])

  // Send completion message to parent
  useEffect(() => {
    if (phase >= 4) {
      window.parent.postMessage({ type: 'TEMPLATE_COMPLETED' }, '*');
    }
  }, [phase]);

  // Floating particles
  useEffect(() => {
    const arr = Array.from({ length: 18 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      dur: Math.random() * 8 + 6,
      delay: Math.random() * 4,
      opacity: Math.random() * 0.4 + 0.1,
    }))
    setParticles(arr)
  }, [])

  // Canvas fog effect
  useEffect(() => {
    if (!canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    let animId
    let time = 0

    const drawFog = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (let i = 0; i < 5; i++) {
        const x = canvas.width * (0.2 + i * 0.15) + Math.sin(time * 0.3 + i) * 60
        const y = canvas.height * (0.4 + Math.cos(time * 0.2 + i) * 0.15)
        const r = canvas.width * (0.18 + i * 0.04)
        const grad = ctx.createRadialGradient(x, y, 0, x, y, r)
        grad.addColorStop(0, `rgba(80,110,150,0.04)`)
        grad.addColorStop(1, 'transparent')
        ctx.fillStyle = grad
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }
      time += 0.01
      animId = requestAnimationFrame(drawFog)
    }
    drawFog()
    return () => cancelAnimationFrame(animId)
  }, [])

  return (
    <div className="s5-wrapper">
      <RainCanvas intensity={60} opacity={0.25} />

      {/* Animated fog bg */}
      <canvas ref={canvasRef} className="s5-fog-canvas" />

      {/* Floating particles */}
      {particles.map(p => (
        <div
          key={p.id}
          className="s5-particle"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            opacity: p.opacity,
            animationDuration: `${p.dur}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}

      {/* Center glow */}
      <div className="s5-center-glow" />

      {/* Text stages */}
      <div className="s5-content">

        <p className={`s5-line s5-line-1 serif italic ${phase >= 1 ? 'visible' : ''}`}>
          {outroLine1}
        </p>

        <p className={`s5-line s5-line-2 serif italic ${phase >= 2 ? 'visible' : ''}`}>
          {outroLine2}
        </p>

        <div className={`s5-final-block ${phase >= 4 ? 'visible' : ''} bloom-warm`}>
          {recipientName && (
            <span className="s5-name script">{recipientName}</span>
          )}
          <p className="s5-final-text serif italic">{outroFinal}</p>
          <div className="s5-heart-line">
            <div className="s5-line-deco" />
            <span className="s5-heart">♡</span>
            <div className="s5-line-deco" />
          </div>
          <p className="s5-sender lora italic">{config.senderName || '— Yours forever'}</p>
        </div>

      </div>

      {/* Window bottom gloss */}
      <div className="s5-window-gloss" />

      <div className="noise-overlay" />
      <div className="cinema-top" />
      <div className="cinema-bottom" />
    </div>
  )
}
