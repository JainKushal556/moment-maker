import { useEffect, useRef } from 'react'

export default function RainCanvas({ intensity = 150, opacity = 0.85 }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animId

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Lightning state
    let lightning = 0
    const triggerLightning = () => {
      if (Math.random() > 0.997) {
        lightning = Math.random() * 0.3 + 0.1
      }
    }

    // Cloud initialization
    const clouds = Array.from({ length: 8 }, () => {
      const scale = Math.random() * 1.5 + 1.0
      const puffs = Array.from({ length: 8 }, () => ({
        dx: (Math.random() - 0.5) * 180 * scale,
        dy: (Math.random() - 0.5) * 60 * scale,
        radius: (Math.random() * 70 + 50) * scale,
        opacity: Math.random() * 0.4 + 0.1
      }))
      
      return {
        x: Math.random() * window.innerWidth,
        y: Math.random() * (window.innerHeight * 0.5),
        speed: Math.random() * 0.2 + 0.05,
        baseOpacity: Math.random() * 0.1 + 0.05,
        puffs
      }
    })

    const drops = Array.from({ length: intensity }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      len: Math.random() * 25 + 15,
      speed: Math.random() * 10 + 10,
      opacity: Math.random() * 0.4 + 0.2,
      width: Math.random() * 1.2 + 0.5,
      angle: 0.12
    }))

    const draw = () => {
      // Clear with slight trail
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      triggerLightning()
      if (lightning > 0) {
        ctx.fillStyle = `rgba(200, 230, 255, ${lightning})`
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        lightning *= 0.92 // Fade out
        if (lightning < 0.01) lightning = 0
      }

      // Draw Clouds
      ctx.save()
      ctx.filter = 'blur(50px)'
      clouds.forEach(c => {
        const cloudOpacity = c.baseOpacity + (lightning * 0.5)
        c.puffs.forEach(p => {
          const grad = ctx.createRadialGradient(
            c.x + p.dx, c.y + p.dy, 0,
            c.x + p.dx, c.y + p.dy, p.radius
          )
          grad.addColorStop(0, `rgba(160, 180, 210, ${cloudOpacity * p.opacity})`)
          grad.addColorStop(1, 'rgba(160, 180, 210, 0)')
          
          ctx.fillStyle = grad
          ctx.beginPath()
          ctx.arc(c.x + p.dx, c.y + p.dy, p.radius, 0, Math.PI * 2)
          ctx.fill()
        })
        
        c.x += c.speed
        if (c.x - 400 > canvas.width) {
          c.x = -500
          c.y = Math.random() * (canvas.height * 0.5)
        }
      })
      ctx.restore()

      // Draw Rain
      drops.forEach(d => {
        ctx.beginPath()
        ctx.moveTo(d.x, d.y)
        ctx.lineTo(d.x - (d.len * d.angle), d.y + d.len)
        ctx.strokeStyle = `rgba(180, 210, 240, ${d.opacity + (lightning * 0.5)})`
        ctx.lineWidth = d.width
        ctx.lineCap = 'round'
        ctx.stroke()
        
        d.y += d.speed
        d.x -= d.speed * d.angle
        
        if (d.y > canvas.height || d.x < -d.len) {
          d.y = -d.len
          d.x = Math.random() * (canvas.width + 200)
        }
      })
      
      animId = requestAnimationFrame(draw)
    }
    draw()
    
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [intensity])

  return (
    <canvas
      ref={canvasRef}
      id="rain-canvas"
      style={{ opacity }}
    />
  )
}
