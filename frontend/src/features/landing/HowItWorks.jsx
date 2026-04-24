import { useEffect, useRef } from 'react'
import '../../styles/howItWorks.css'
import image1Url from '../../assets/hiw/image1.png'
import image2Url from '../../assets/hiw/image2.png'
import image3Url from '../../assets/hiw/image3.png'

class Particle {
  constructor(x, y, canvasWidth, canvasHeight, color = 'white') {
    this.x = Math.random() * canvasWidth; this.y = Math.random() * canvasHeight
    this.baseSize = 1.6; this.size = 1.6; this.targetX = x; this.targetY = y
    this.color = color; this.baseColor = color; this.vx = 0; this.vy = 0
    this.friction = 0.80; this.ease = 0.08
    this.seedX = Math.random() * Math.PI * 2; this.seedY = Math.random() * Math.PI * 2
    this.freq = 0.5 + Math.random()
  }
  draw(ctx) { ctx.fillStyle = this.color; ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.closePath(); ctx.fill() }
  update(mouse, time) {
    const f = this.freq * time
    let tx = this.targetX + Math.sin(f + this.seedX) * 2
    let ty = this.targetY + Math.cos(f + this.seedY) * 2
    const dx = this.x - mouse.x; const dy = this.y - mouse.y; const distance = Math.sqrt(dx * dx + dy * dy)
    if (distance < mouse.radius) { const force = (mouse.radius - distance) / mouse.radius; const push = force * 60; tx += (dx / distance) * push; ty += (dy / distance) * push }
    this.vx += (tx - this.x) * this.ease; this.vy += (ty - this.y) * this.ease
    this.vx *= this.friction; this.vy *= this.friction; this.x += this.vx; this.y += this.vy
    this.size = this.baseSize + Math.sin(time * 2 + this.seedX) * 0.3
  }
}

export default function HowItWorks() {
  const sectionRef = useRef(null)
  const canvasRef = useRef(null)
  const cardsTrackRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const section = sectionRef.current
    const cardsTrack = cardsTrackRef.current
    const cardOuters = section.querySelectorAll('.hiw-card-outer')

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    let particlesArray = []; let time = 0
    let image1Coords = []; let image2Coords = []; let image3Coords = []
    const mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999, radius: 100 }

    const mouseMoveHandler = (event) => { mouse.tx = event.clientX; mouse.ty = event.clientY }
    window.addEventListener('mousemove', mouseMoveHandler)

    // Mouse spotlight per card
    cardOuters.forEach(outer => {
      const card = outer.querySelector('.hiw-card')
      const spotlight = outer.querySelector('.hiw-card-spotlight')
      if (!card || !spotlight) return
      const moveHandler = (e) => {
        const rect = card.getBoundingClientRect()
        spotlight.style.background = `radial-gradient(circle 280px at ${e.clientX - rect.left}px ${e.clientY - rect.top}px, rgba(255,255,255,0.06), transparent)`
      }
      const leaveHandler = () => { spotlight.style.background = 'none' }
      card.addEventListener('mousemove', moveHandler)
      card.addEventListener('mouseleave', leaveHandler)
    })

    function getCoordinates(image) {
      const tempCanvas = document.createElement('canvas'); const tempCtx = tempCanvas.getContext('2d')
      tempCanvas.width = canvas.width; tempCanvas.height = canvas.height
      const aspectRatio = image.width / image.height
      let displayWidth = (canvas.width * 0.43) * 0.8
      if (window.innerWidth < 1024) displayWidth = canvas.width * 0.8
      let newWidth = Math.min(600, displayWidth); let newHeight = newWidth / aspectRatio
      let centerX = (canvas.width * 0.215) - (newWidth / 2)
      if (window.innerWidth < 1024) centerX = (canvas.width * 0.5) - (newWidth / 2)
      let centerY = (canvas.height - newHeight) / 2
      tempCtx.drawImage(image, centerX, centerY, newWidth, newHeight)
      const pixels = tempCtx.getImageData(0, 0, canvas.width, canvas.height)
      let coords = []; const step = 4
      for (let y = 0; y < canvas.height; y += step) for (let x = 0; x < canvas.width; x += step) {
        const index = (y * 4 * pixels.width) + (x * 4)
        const alpha = pixels.data[index + 3]; const brightness = (pixels.data[index] + pixels.data[index + 1] + pixels.data[index + 2]) / 3
        if (alpha > 128 && brightness > 50) coords.push({ x, y, color: 'white' })
      }
      return coords
    }

    function init() {
      particlesArray = []
      const image1 = document.getElementById('hiw-image1')
      const image2 = document.getElementById('hiw-image2')
      const image3 = document.getElementById('hiw-image3')
      if (image1?.width > 0) image1Coords = getCoordinates(image1)
      if (image2?.width > 0) image2Coords = getCoordinates(image2)
      if (image3?.width > 0) image3Coords = getCoordinates(image3)
      const maxParticles = Math.max(image1Coords.length, image2Coords.length, image3Coords.length)
      for (let i = 0; i < maxParticles; i++) particlesArray.push(new Particle(Math.random() * canvas.width, Math.random() * canvas.height, canvas.width, canvas.height))
    }

    let animRAF; let isAnimating = false
    let lastActiveIdx = -1
    const zones = [{ start: 0, end: 0.25, recedeEnd: 0.40 }, { start: 0.25, end: 0.55, recedeEnd: 0.70 }, { start: 0.55, end: 1.0, recedeEnd: 1.0 }]

    let cachedScrollProgress = 0
    const scrollHandler = () => {
      const sectionTop = section.offsetTop; const sectionHeight = section.scrollHeight - window.innerHeight
      const scrollY = window.scrollY - sectionTop
      cachedScrollProgress = Math.min(1, Math.max(0, scrollY / sectionHeight))

      if (cardsTrack) {
        let activeIdx = cachedScrollProgress >= 0.55 ? 2 : cachedScrollProgress >= 0.25 ? 1 : 0
        if (activeIdx !== lastActiveIdx) {
          lastActiveIdx = activeIdx
          const cards = cardsTrack.querySelectorAll('.hiw-card-outer')
          const anchorLeft = cards[0]?.offsetLeft || 0; const targetLeft = cards[activeIdx]?.offsetLeft || 0
          cardsTrack.style.transform = `translate3d(${-(targetLeft - anchorLeft)}px, 0, 0)`
        }
        cardOuters.forEach((outer, idx) => { if (cachedScrollProgress >= idx * 0.15) outer.classList.add('visible') })
        cardOuters.forEach((outer, idx) => {
          const zone = zones[idx]
          if (!zone) { outer.classList.remove('active', 'receding'); return }
          const isActive = cachedScrollProgress >= zone.start && cachedScrollProgress < zone.end
          const isPastActive = cachedScrollProgress >= zone.end
          if (isActive) { outer.classList.add('active'); outer.classList.remove('receding'); outer.style.transform = ''; outer.style.opacity = '' }
          else if (!isPastActive && cachedScrollProgress < zone.start) { outer.classList.remove('active', 'receding'); outer.style.transform = ''; outer.style.opacity = '' }
          else if (isPastActive && zone.recedeEnd > zone.end) {
            outer.classList.remove('active'); outer.classList.add('receding')
            const recedeProgress = Math.min(1, (cachedScrollProgress - zone.end) / (zone.recedeEnd - zone.end))
            const eased = recedeProgress < 0.5 ? 2 * recedeProgress * recedeProgress : 1 - Math.pow(-2 * recedeProgress + 2, 2) / 2
            outer.style.transform = `translate3d(${eased * -150}px, 0, 0) scale(${1 - eased * 0.15})`; outer.style.opacity = `${1 - eased}`
          } else { outer.classList.remove('active', 'receding') }
        })
      }
    }
    window.addEventListener('scroll', scrollHandler, { passive: true })

    function animate() {
      if (!isAnimating) return
      ctx.clearRect(0, 0, canvas.width, canvas.height); time += 0.02
      mouse.x += (mouse.tx - mouse.x) * 0.1; mouse.y += (mouse.ty - mouse.y) * 0.1
      let targetCoords = cachedScrollProgress < 0.33 ? image1Coords : cachedScrollProgress < 0.66 ? image2Coords : image3Coords
      for (let i = 0; i < particlesArray.length; i++) {
        const p = particlesArray[i]
        if (targetCoords && i < targetCoords.length) { p.targetX = targetCoords[i].x; p.targetY = targetCoords[i].y; p.color = targetCoords[i].color }
        else { p.targetX = canvas.width * 0.215; p.targetY = canvas.height * 0.5; p.color = 'rgba(0,0,0,0)' }
        p.update(mouse, time); p.draw(ctx)
      }
      animRAF = requestAnimationFrame(animate)
    }

    function startAnim() { if (isAnimating) return; isAnimating = true; animate() }
    function stopAnim() { isAnimating = false; cancelAnimationFrame(animRAF) }

    let imagesLoaded = false
    let imagesLoading = false

    function loadImagesAndStart() {
      if (imagesLoaded || imagesLoading) return
      imagesLoading = true
      const imgs = [document.getElementById('hiw-image1'), document.getElementById('hiw-image2'), document.getElementById('hiw-image3')]
      let loadedCount = 0
      function checkLoad() { loadedCount++; if (loadedCount >= imgs.length) { imagesLoaded = true; init(); startAnim() } }
      imgs.forEach(img => {
        if (!img) return
        if (img.dataset.src) {
          img.onload = checkLoad
          img.onerror = checkLoad
          img.src = img.dataset.src
          img.removeAttribute('data-src')
        } else if (img.complete) {
          checkLoad()
        }
      })
    }

    const sectionObserver = new IntersectionObserver((entries) => { 
      entries.forEach(entry => { 
        if (entry.isIntersecting) {
          if (!imagesLoaded) loadImagesAndStart()
          else startAnim()
        } else {
          stopAnim() 
        }
      }) 
    }, { rootMargin: '400px', threshold: 0 })
    sectionObserver.observe(canvas)

    const resizeHandler = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; if (imagesLoaded) init() }
    window.addEventListener('resize', resizeHandler)

    return () => {
      stopAnim(); sectionObserver.disconnect()
      window.removeEventListener('resize', resizeHandler)
      window.removeEventListener('mousemove', mouseMoveHandler)
      window.removeEventListener('scroll', scrollHandler)
    }
  }, [])

  const CardData = [
    { number: '01', title: 'Choose', accent: 'cyan', description: 'Find the perfect starting point from our handpicked collection of celebration templates', services: ['20+ occasion categories', 'Smart search & filters', 'Trending templates', 'Personalized recommendations'], tools: ['Category browser', 'Preview modal', 'Save favorites', 'Quick-select interface'] },
    { number: '02', title: 'Customize', accent: 'purple', description: 'Add photos, music, and your message watch it come alive in real-time as you edit', services: ['Rich text editor', 'Music library upload', 'Photo filters & cropping', 'Interactive effects'], tools: ['Split-screen editor', 'Color picker', 'Font selector', 'Animation controls'] },
    { number: '03', title: 'Send', accent: 'emerald', description: 'Get a unique link, share anywhere, and know when your wish is viewed and loved', services: ['Unique URL generation', 'QR code creator', 'One-click sharing', 'Analytics dashboard'], tools: ['Share buttons', 'View tracker', 'Engagement metrics', 'Copy link + QR download'] }
  ]

  return (
    <section className="how-it-works-section" ref={sectionRef}>
      <img id="hiw-image1" data-src={image1Url} style={{ display: 'none' }} />
      <img id="hiw-image2" data-src={image2Url} style={{ display: 'none' }} />
      <img id="hiw-image3" data-src={image3Url} style={{ display: 'none' }} />

      <div className="hiw-sticky-container">
        <canvas id="hiw-canvas" ref={canvasRef}></canvas>
        <div className="hiw-heading-block">
          <h2 className="hiw-heading-title">How It Works</h2>
          <div className="hiw-heading-line"></div>
        </div>
        <div className="hiw-left-panel"></div>
        <div className="hiw-right-panel">
          <div className="hiw-cards-track" id="hiwCardsTrack" ref={cardsTrackRef}>
            {CardData.map((card, i) => (
              <div key={i} className="hiw-card-outer" data-accent={card.accent}>
                <div className="hiw-card">
                  <div className="hiw-card-spotlight"></div>
                  <div className="hiw-card-header">
                    <span className="hiw-card-number">{card.number}</span>
                    <svg className="hiw-arrow-icon" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                      <line x1="7" y1="17" x2="17" y2="7" />
                      <polyline points="7 7 17 7 17 17" />
                    </svg>
                  </div>
                  <div className="hiw-card-content">
                    <h2 className="hiw-card-title">{card.title}</h2>
                    <p className="hiw-card-description">{card.description}</p>
                    <span className="hiw-services-label">Services</span>
                    <ul className="hiw-services-list">
                      {card.services.map((s, j) => <li key={j}>{s}</li>)}
                    </ul>
                  </div>
                  <div className="hiw-tags">
                    <span className="hiw-tags-label">Tools</span>
                    {card.tools.map((t, j) => <span key={j} className="hiw-tag">{t}</span>)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
