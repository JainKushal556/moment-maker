import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import '../../styles/howItWorks.css'

gsap.registerPlugin(ScrollTrigger)
import image1Url from '../../assets/hiw/image1.png'
import image2Url from '../../assets/hiw/image2.png'
import image3Url from '../../assets/hiw/image3.png'

const HIWGoldenParticles = () => {
  const particles = Array.from({ length: 40 }).map((_, i) => {
    const size = Math.random() * 3 + 1; // 1px to 4px
    const left = Math.random() * 100;
    const top = Math.random() * 100;
    const duration = Math.random() * 6 + 4; // 4s to 10s
    const delay = Math.random() * 5;
    const isBokeh = Math.random() > 0.8; // 20% are larger, blurred bokeh

    return (
      <div
        key={i}
        className={`golden-particle ${isBokeh ? 'bokeh' : ''}`}
        style={{
          width: isBokeh ? `${size * 3}px` : `${size}px`,
          height: isBokeh ? `${size * 3}px` : `${size}px`,
          left: `${left}%`,
          top: `${top}%`,
          animationDuration: `${duration}s`,
          animationDelay: `-${delay}s`
        }}
      />
    );
  });

  return <div className="particles-container" style={{ height: '100vh', position: 'absolute', top: 0, left: 0, right: 0 }}>{particles}</div>;
};

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

export default function HowItWorks({ onTransition }) {
  const sectionRef = useRef(null)
  const canvasRef = useRef(null)
  const cardsTrackRef = useRef(null)
  const revealMaskRef = useRef(null)
  const revealLabelRef = useRef(null)

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
    const zones = [{ start: 0, end: 0.25, recedeEnd: 0.40 }, { start: 0.25, end: 0.55, recedeEnd: 0.70 }, { start: 0.55, end: 1.5, recedeEnd: 1.5 }]

    let cachedScrollProgress = 0

    const manualScrollUpdate = () => {
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

    const revealMask = revealMaskRef.current
    const revealLabel = revealLabelRef.current
    const hiwContent = section.querySelector('.hiw-sticky-container')

    // GSAP ScrollTrigger for Circle Reveal and Section Scroll
    const gsapCtx = gsap.context(() => {
      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
          onUpdate: (self) => {
            // First 30% is the circle reveal
            // Remaining 70% is the content scroll
            let contentProg = 0;
            if (self.progress > 0.3) {
              contentProg = (self.progress - 0.3) / 0.7;
            }
            cachedScrollProgress = Math.min(1, Math.max(0, contentProg));
            manualScrollUpdate();
          }
        }
      })

      masterTl.to(revealMask,
        {
          '--inset-val': '0%',
          '--radius-val': '0px',
          backgroundColor: 'transparent',
          borderColor: 'transparent',
          duration: 0.3,
          ease: 'power2.inOut'
        }, 0
      )

      masterTl.to(revealLabel, {
        opacity: 0,
        scale: 1.2,
        duration: 0.2,
        ease: 'power2.in'
      }, 0)

      masterTl.fromTo(hiwContent,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: 'power2.out' },
        0.1
      )

      const hiwTrigger = ScrollTrigger.create({
        trigger: section,
        start: 'bottom-=60vh bottom',
        onEnter: () => {
          if (window._hiwTransitionBlocked) return;
          if (onTransition) onTransition();
        }
      });

      masterTl.to({}, { duration: 0.7 }) // Padding for the rest of the scroll
    }, section)

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
      gsapCtx.revert()
    }
  }, [])

  const CardData = [
    { number: '01', title: 'Choose', accent: 'cyan', description: 'Find the perfect starting point from our handpicked collection of celebration templates', services: ['20+ occasion categories', 'Smart search & filters', 'Trending templates', 'Personalized recommendations'], tools: ['Category browser', 'Preview modal', 'Save favorites', 'Quick-select interface'] },
    { number: '02', title: 'Customize', accent: 'purple', description: 'Add photos, music, and your message watch it come alive in real-time as you edit', services: ['Rich text editor', 'Music library upload', 'Photo filters & cropping', 'Interactive effects'], tools: ['Split-screen editor', 'Color picker', 'Font selector', 'Animation controls'] },
    { number: '03', title: 'Send', accent: 'emerald', description: 'Get a unique link, share anywhere, and know when your wish is viewed and loved', services: ['Unique URL generation', 'QR code creator', 'One-click sharing', 'Analytics dashboard'], tools: ['Share buttons', 'View tracker', 'Engagement metrics', 'Copy link + QR download'] }
  ]

  return (
    <section className="how-it-works-section" ref={sectionRef}>
      <HIWGoldenParticles />
      <svg className="svg-container" style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none' }}>
        <defs>
          <filter id="turbulent-displace" colorInterpolationFilters="sRGB" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="10" result="noise1" seed="1" />
            <feOffset in="noise1" dx="0" dy="0" result="offsetNoise1">
              <animate attributeName="dy" values="700; 0" dur="6s" repeatCount="indefinite" calcMode="linear" />
            </feOffset>
            <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="10" result="noise2" seed="1" />
            <feOffset in="noise2" dx="0" dy="0" result="offsetNoise2">
              <animate attributeName="dy" values="0; -700" dur="6s" repeatCount="indefinite" calcMode="linear" />
            </feOffset>
            <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="10" result="noise1" seed="2" />
            <feOffset in="noise1" dx="0" dy="0" result="offsetNoise3">
              <animate attributeName="dx" values="490; 0" dur="6s" repeatCount="indefinite" calcMode="linear" />
            </feOffset>
            <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="10" result="noise2" seed="2" />
            <feOffset in="noise2" dx="0" dy="0" result="offsetNoise4">
              <animate attributeName="dx" values="0; -490" dur="6s" repeatCount="indefinite" calcMode="linear" />
            </feOffset>
            <feComposite in="offsetNoise1" in2="offsetNoise2" result="part1" />
            <feComposite in="offsetNoise3" in2="offsetNoise4" result="part2" />
            <feBlend in="part1" in2="part2" mode="color-dodge" result="combinedNoise" />
            <feDisplacementMap in="SourceGraphic" in2="combinedNoise" scale="50" xChannelSelector="R" yChannelSelector="B" />
          </filter>
        </defs>
      </svg>
      <img id="hiw-image1" data-src={image1Url} style={{ display: 'none' }} />
      <img id="hiw-image2" data-src={image2Url} style={{ display: 'none' }} />
      <img id="hiw-image3" data-src={image3Url} style={{ display: 'none' }} />

      <div className="hiw-reveal-mask" ref={revealMaskRef}>
        <div className="hiw-reveal-label" ref={revealLabelRef}>PROCESS</div>
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
                    {/* Electric Border Layers */}
                    <div className="hiw-electric-layers">
                      <div className="inner-container">
                        <div className="border-outer">
                          <div className="main-card"></div>
                        </div>
                        <div className="glow-layer-1"></div>
                        <div className="glow-layer-2"></div>
                      </div>
                      <div className="overlay-1"></div>
                      <div className="overlay-2"></div>
                      <div className="background-glow"></div>
                    </div>

                    <div className="hiw-card-spotlight"></div>

                    <div className="hiw-card-content-wrapper">
                      <div className="hiw-card-header">
                        <span className="hiw-card-number">{card.number}</span>
                        <svg className="hiw-arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
