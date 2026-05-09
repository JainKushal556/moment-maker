import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Observer } from 'gsap/Observer'
import confetti from 'canvas-confetti'
import '../../styles/categoriesTransition.css'

const GoldenParticles = () => {
  const particles = Array.from({ length: 40 }).map((_, i) => {
    const size = Math.random() * 3 + 1; // 1px to 4px
    const left = Math.random() * 100;
    const top = Math.random() * 100;
    const duration = Math.random() * 6 + 4; // 4s to 10s (Much faster)
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

  return <div className="particles-container">{particles}</div>;
};

gsap.registerPlugin(ScrollTrigger, Observer)

const BLOCK_COUNT = 3
const imageData = [
  { title: "Thank You", sub: "Deeply grateful always", img: "/cards/thank-you.png" },
  { title: "Friendship", sub: "Bonded for life", img: "/cards/friendship.png" },
  { title: "Miss You", sub: "Waiting for you", img: "/cards/miss-you.png" },
  { title: "Proposal", sub: "Forever starts now", img: "/cards/proposal.png" },
  { title: "Confession", sub: "My honest truth", img: "/cards/confession.png" },
  { title: "Birthday", sub: "Celebrate your day", img: "/cards/birthday.png" },
  { title: "Celebration", sub: "Magic in moments", img: "/cards/celebration.png" },
  { title: "Sorry", sub: "Sincere apologies sent", img: "/cards/sorry.png" },
  { title: "Romantic", sub: "Pure love shared", img: "/cards/romantic.png" },
  { title: "Special", sub: "Simply the best", img: "/cards/special.png" }
]

// --- Effect functions ---
function triggerConfettiEffect(onComplete) {
  const duration = 3 * 1000; const animationEnd = Date.now() + duration
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 3000 }
  const interval = setInterval(() => {
    const timeLeft = animationEnd - Date.now()
    if (timeLeft <= 0) {
      clearInterval(interval)
      if (onComplete) setTimeout(onComplete, 500)
      return
    }
    const particleCount = 50 * (timeLeft / duration)
    confetti({ ...defaults, particleCount, origin: { x: 0, y: 1 }, angle: 60, spread: 55, startVelocity: 60 })
    confetti({ ...defaults, particleCount, origin: { x: 1, y: 1 }, angle: 120, spread: 55, startVelocity: 60 })
  }, 250)
}

function triggerEmojiDrop(onComplete) {
  const emojis = ['😭', '😖', '😩', '🥹', '😢']
  let completedCount = 0
  for (let i = 0; i < 50; i++) {
    const el = document.createElement('div'); el.className = 'falling-emoji'
    el.innerText = emojis[Math.floor(Math.random() * emojis.length)]
    document.body.appendChild(el)
    const startX = Math.random() * window.innerWidth
    gsap.set(el, { x: startX, y: -50, opacity: 1, scale: 0.5 + Math.random() })
    const dur = 2 + Math.random() * 3; const delay = Math.random() * 2
    gsap.to(el, {
      y: window.innerHeight + 50, x: startX + (Math.random() - 0.5) * 200, rotation: Math.random() * 360, duration: dur, delay, ease: 'none', onComplete: () => {
        el.remove()
        completedCount++
        if (completedCount === 50 && onComplete) onComplete()
      }
    })
    gsap.to(el, { opacity: 0, duration: 0.5, delay: delay + dur - 0.5 })
  }
}

function triggerBalloonBlast(onComplete) {
  const items = ['🥳', '💐', '🎂', '🎈', '🎉', '🎁']
  let completedCount = 0
  for (let i = 0; i < 60; i++) {
    setTimeout(() => {
      const el = document.createElement('div'); el.className = 'falling-emoji'
      el.innerText = items[Math.floor(Math.random() * items.length)]
      document.body.appendChild(el)
      const startX = Math.random() * window.innerWidth
      const peakY = 50 + Math.random() * (window.innerHeight / 2 + 150)
      const dUp = 0.6 + Math.random() * 0.5; const dDown = 0.9 + Math.random() * 0.6
      const drift = (Math.random() - 0.5) * 450
      gsap.set(el, { x: startX, y: window.innerHeight + 100, opacity: 1, scale: 0.8 + Math.random() * 0.7 })
      const tl = gsap.timeline({
        onComplete: () => {
          el.remove()
          completedCount++
          if (completedCount === 60 && onComplete) onComplete()
        }
      })
      tl.to(el, { y: peakY, x: startX + drift * 0.3, rotation: (Math.random() - 0.5) * 180, duration: dUp, ease: 'power2.out' })
        .to(el, { y: window.innerHeight + 150, x: startX + drift, rotation: (Math.random() - 0.5) * 360, duration: dDown, ease: 'power2.in' })
      gsap.to(el, { opacity: 0, duration: 0.4, delay: dUp + dDown - 0.4 })
    }, i * 40)
  }
}

function triggerMinimalEffect(onComplete) {
  const glow = document.createElement('div'); glow.className = 'minimal-glow'; document.body.appendChild(glow)
  const waveL = document.createElement('div'); waveL.className = 'light-wave'; document.body.appendChild(waveL)
  const waveR = document.createElement('div'); waveR.className = 'light-wave'; document.body.appendChild(waveR)
  const heartContainer = document.createElement('div'); heartContainer.className = 'minimal-heart'
  heartContainer.innerHTML = `<svg viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`
  document.body.appendChild(heartContainer)
  const cx = window.innerWidth / 2; const cy = window.innerHeight / 2
  gsap.set(waveL, { x: -200, y: cy, opacity: 0 }); gsap.set(waveR, { x: window.innerWidth + 200, y: cy, opacity: 0 })
  const mainTl = gsap.timeline({
    onComplete: () => {
      glow.remove(); waveL.remove(); waveR.remove(); heartContainer.remove()
      if (onComplete) onComplete()
    }
  })
  mainTl.to(glow, { scale: 6, opacity: 1, duration: 1.5, ease: 'power2.inOut' }, 0)
  mainTl.to([waveL, waveR], { opacity: 1, duration: 0.6, ease: 'power1.inOut' }, 0.5)
  mainTl.to(waveL, { x: cx - 60, duration: 2.0, ease: 'power3.inOut' }, 0.5)
  mainTl.to(waveR, { x: cx - 60, duration: 2.0, ease: 'power3.inOut' }, 0.5)
  const particles = []
  for (let i = 0; i < 24; i++) {
    const p = document.createElement('div'); p.className = 'minimal-particle'; document.body.appendChild(p); particles.push(p)
    const isLeft = i < 12; const spawnX = isLeft ? -50 : window.innerWidth + 50
    gsap.set(p, { x: spawnX, y: cy + (Math.random() - 0.5) * 60, opacity: 0, scale: Math.random() * 0.8 + 0.4 })
    mainTl.to(p, { x: cx + (Math.random() - 0.5) * 100, opacity: 1, duration: 2.0, ease: 'power2.inOut' }, 0.7 + Math.random() * 0.5)
  }
  mainTl.to(heartContainer, { opacity: 1, scale: 1.4, duration: 0.8, ease: 'expo.out' }, 2.5)
  mainTl.to(heartContainer, { scale: 1.6, filter: 'drop-shadow(0 0 30px white)', duration: 0.5, yoyo: true, repeat: 1, ease: 'sine.inOut' }, 3.3)
  mainTl.to(heartContainer, { scale: 2.0, opacity: 0, filter: 'blur(20px)', duration: 1.0, ease: 'power2.out' }, 4.0)
  mainTl.to([waveL, waveR, glow], { opacity: 0, duration: 1.0 }, 4.0)
  particles.forEach(p => { mainTl.to(p, { y: '-=150', x: `+=${(Math.random() - 0.5) * 100}`, opacity: 0, duration: 1.2, ease: 'power1.in' }, 4.0 + Math.random() * 0.2) })
}

function triggerThankYouAnimation(card, data, onComplete) {
  const originalContent = card.innerHTML
  card.innerHTML = `<div class="split-container"><div class="split-layer top" id="split-top"><img src="${data.img}"><div class="split-overlay"><h3>${data.title}</h3><p>${data.sub}</p></div></div><div class="split-layer bottom" id="split-bottom"><img src="${data.img}"><div class="split-overlay"><h3>${data.title}</h3><p>${data.sub}</p></div></div></div>`
  const topLayer = card.querySelector('#split-top'); const bottomLayer = card.querySelector('#split-bottom')
  const canvas = document.createElement('canvas'); canvas.id = 'ty-canvas-fullscreen'
  canvas.width = window.innerWidth; canvas.height = window.innerHeight; document.body.appendChild(canvas)
  const ctx = canvas.getContext('2d')
  const rect = card.getBoundingClientRect()
  const cardCX = rect.left + rect.width / 2; const cardCY = rect.top + rect.height / 2
  const tl = gsap.timeline({
    onComplete: () => {
      gsap.to([topLayer, bottomLayer], {
        y: 0, duration: 0.8, ease: 'power3.inOut', onComplete: () => {
          card.innerHTML = originalContent; canvas.remove()
          if (onComplete) onComplete()
        }
      })
    }
  })
  tl.to([topLayer, bottomLayer], { y: (i, t) => t.classList.contains('top') ? -25 : 25, duration: 1.0, ease: 'power3.inOut' })

  // Particle text
  const tempCanvas = document.createElement('canvas'); tempCanvas.width = canvas.width; tempCanvas.height = canvas.height
  const tCtx = tempCanvas.getContext('2d')
  const fontSize = Math.min(canvas.width, canvas.height) * 0.15
  tCtx.font = `bold ${fontSize}px 'Inter', sans-serif`; tCtx.textAlign = 'center'; tCtx.textBaseline = 'middle'; tCtx.fillStyle = 'white'
  tCtx.fillText('Thank You', canvas.width / 2, canvas.height / 2)
  const imgData = tCtx.getImageData(0, 0, canvas.width, canvas.height).data
  const targets = []; const step = 4
  for (let y = 0; y < canvas.height; y += step) for (let x = 0; x < canvas.width; x += step) if (imgData[(y * canvas.width + x) * 4 + 3] > 128) targets.push({ x, y })
  const particles = targets.map(t => ({ x: cardCX + (Math.random() - 0.5) * 50, y: cardCY + (Math.random() - 0.5) * 10, tx: t.x, ty: t.y, r: Math.random() * 2 + 1, color: `rgba(255,215,0,${Math.random() * 0.4 + 0.6})` }))
  const state = { progress: 0, disperse: 0, glow: 0 }
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    if (state.glow > 0 && state.disperse < 0.1) { ctx.shadowBlur = 20 * state.glow; ctx.shadowColor = `rgba(255,215,0,${state.glow})` } else { ctx.shadowBlur = 0 }
    particles.forEach((p, i) => {
      let cx2, cy2, alpha, sc
      if (state.disperse === 0) {
        const t = state.progress; const nx = Math.sin(i * 0.1 + t * 10) * (1 - t) * 50; const ny = Math.cos(i * 0.1 + t * 10) * (1 - t) * 50
        cx2 = cardCX + (p.tx - cardCX) * t + nx; cy2 = cardCY + (p.ty - cardCY) * t + ny; sc = 0.1 + 0.9 * t; alpha = t
      } else {
        const t = state.disperse; const dx = p.tx - canvas.width / 2; const dy = p.ty - canvas.height / 2; const dist = Math.sqrt(dx * dx + dy * dy) || 1
        cx2 = p.tx + (dx / dist) * t * (100 + Math.random() * 200) + (Math.random() - 0.5) * 50 * t
        cy2 = p.ty + (dy / dist) * t * (100 + Math.random() * 200) + (Math.random() - 0.5) * 50 * t
        sc = 1 - t * 0.5; alpha = 1 - t
      }
      ctx.fillStyle = p.color; ctx.globalAlpha = alpha; ctx.beginPath(); ctx.arc(cx2, cy2, p.r * sc, 0, Math.PI * 2); ctx.fill()
    })
    ctx.globalAlpha = 1; ctx.shadowBlur = 0
  }
  tl.to(state, { progress: 1, duration: 2.5, ease: 'power2.inOut', onUpdate: draw }, '-=0.5')
  tl.to(state, { glow: 1, duration: 0.5, ease: 'power2.out' })
  tl.to({}, { duration: 1.0 })
  tl.to(state, { disperse: 1, duration: 1.5, ease: 'power2.out', onUpdate: draw })
}

export default function CategoriesCarousel() {
  const sectionRef = useRef(null)
  const stageRef = useRef(null)
  const canvasRef = useRef(null)
  const overlayRef = useRef(null)
  const transitionPlayed = useRef(false)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const stage = stageRef.current
      if (!stage) return

      const dimmer = document.getElementById('dimmer')
      const dynamicBg = document.getElementById('dynamic-bg')
      const overlay = overlayRef.current



      const carouselContent = sectionRef.current?.querySelector('.carousel-content-wrapper')

      // Hide carousel immediately before animation
      if (carouselContent) {
        gsap.set(carouselContent, { opacity: 0, scale: 0.95 })
      }

      if (overlay && !transitionPlayed.current) {
        const blocks = overlay.querySelectorAll('.ct-block')
        const text = overlay.querySelector('.ct-text')

        const textEl = overlay.querySelector('.ct-text')
        if (textEl) textEl.textContent = 'MOMENTS'
        overlay.classList.remove('ct-hidden')

        const master = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: '+=300%', // Reduced scroll distance for faster timing per user request
            scrub: 1.5,    // Slightly more smoothing
            pin: true,
            pinSpacing: true,
            onUpdate: (self) => {
              if (self.progress === 1) overlay.classList.add('ct-hidden')
              else overlay.classList.remove('ct-hidden')
            }
          }
        })

        // Initial States
        master.set(sectionRef.current, { backgroundColor: 'transparent' }, 0)
        master.set('.hero, .hero-clone', { opacity: 1 }, 0)

        // Phase 1: Blocks descend
        master.fromTo(blocks, { y: '-100%' }, { y: '0%', duration: 0.8, stagger: 0.1, ease: 'power4.inOut' }, 0)

        // Phase 2: Toggle
        master.to(sectionRef.current, { backgroundColor: '#050a1f', duration: 0.01 }, 0.8)
        master.set('.hero, .hero-clone', { opacity: 0 }, 0.8)

        // Phase 3: Text Reveal
        master.to(text, { opacity: 1, scale: 1, duration: 0.6, ease: 'power3.out' }, 0.8)

        // Phase 4: Hold
        master.to({}, { duration: 0.6 })

        // Phase 5: Text out
        master.to(text, { opacity: 0, scale: 1.05, duration: 0.5, ease: 'power2.out' })

        // Phase 6: Blocks exit
        master.to(blocks, { y: '-100%', duration: 0.8, stagger: 0.08, ease: 'expo.inOut' })

        if (carouselContent) {
          master.set(carouselContent, { opacity: 1, scale: 1 }, "<")
        }


      }

      const TOTAL = 10; const ANGLE = 360 / TOTAL
      let radius = 450; let rotationValue = 0; let targetRotation = 0
      let isInteracting = false; let isFocused = false; let focusedCard = null; let sliderOutsideHandler = null
      let autoRotationSpeed = 0.18; let currentDirection = -1
      const cards = []

      function updateRadius() {
        const w = window.innerWidth
        radius = w < 640 ? 380 : (w < 1200 ? 450 : 520)
        cards.forEach(card => { if (!card.classList.contains('focused')) gsap.set(card, { transformOrigin: `50% 50% ${radius}px` }) })
      }

      const mouseMoveHandler = (e) => { if (!isFocused) currentDirection = e.clientX < window.innerWidth / 2 ? 1 : -1 }
      window.addEventListener('mousemove', mouseMoveHandler)

      for (let i = 0; i < TOTAL; i++) {
        const card = document.createElement('div'); card.className = 'slider-card'
        const data = imageData[i]
        card.innerHTML = `<div class="slider-card-content"><img src="${data.img}" alt="${data.title}" loading="lazy"><div class="slider-card-overlay"><h3>${data.title}</h3><p>${data.sub}</p></div></div>`
        card.addEventListener('click', () => {
          const vp = document.querySelector('.viewport')
          if (!vp || !vp.classList.contains('fullscreen')) return
          handleCardClick(i, card)
        })
        stage.appendChild(card); cards.push(card)
        const w = window.innerWidth
        gsap.set(card, { rotationY: i * ANGLE, transformOrigin: `50% 50% ${w < 640 ? 380 : (w < 1200 ? 450 : 520)}px` })
      }

      function handleCardClick(index, card) {
        if (isFocused && focusedCard === card) { unfocusCard(); return }
        isFocused = true; focusedCard = card; isInteracting = true
        const offset = ((index * ANGLE) + targetRotation) % 360
        let diff = -offset; if (diff > 180) diff -= 360; if (diff < -180) diff += 360
        targetRotation += diff
        dynamicBg.style.backgroundImage = `url(${imageData[index].img})`; dynamicBg.style.opacity = '0.7'
        dimmer.classList.add('active')
        cards.forEach(c => { c.classList.remove('focused'); if (c !== card) { gsap.to(c, { opacity: 0.15, filter: 'blur(12px) grayscale(40%)', duration: 0.8, ease: 'power2.out' }); c.style.pointerEvents = 'none' } else { c.style.pointerEvents = 'auto' } })
        card.classList.add('focused')
        const onCompletedEffect = () => unfocusCard()

        const isMobile = window.innerWidth < 768
        gsap.to(card, {
          scale: isMobile ? 1.15 : 1.5,
          z: isMobile ? 380 : 520,
          opacity: 1, filter: 'blur(0px)', duration: 1.2, ease: 'expo.out', overwrite: true, onComplete: () => {
            if (imageData[index].title === 'Thank You') triggerThankYouAnimation(card, imageData[index], onCompletedEffect)
          }
        })

        if (imageData[index].title === 'Celebration') triggerConfettiEffect(onCompletedEffect)
        else if (imageData[index].title === 'Sorry') triggerEmojiDrop(onCompletedEffect)
        else if (imageData[index].title === 'Birthday') triggerBalloonBlast(onCompletedEffect)
        else if (imageData[index].title === 'Romantic') triggerMinimalEffect(onCompletedEffect)
        else if (imageData[index].title !== 'Thank You') setTimeout(onCompletedEffect, 3000)
        sliderOutsideHandler = (e) => { if (!focusedCard) return; if (e && e.target && focusedCard.contains(e.target)) return; unfocusCard() }
        document.addEventListener('click', sliderOutsideHandler, true)
        document.addEventListener('wheel', sliderOutsideHandler, { passive: true, capture: true })
      }

      function unfocusCard() {
        if (!isFocused) return; isFocused = false; dimmer.classList.remove('active'); dynamicBg.style.opacity = '0'
        if (focusedCard) { gsap.to(focusedCard, { scale: 1, z: 0, duration: 0.8, ease: 'expo.inOut' }); focusedCard.classList.remove('focused') }
        cards.forEach(c => { c.style.pointerEvents = ''; gsap.to(c, { opacity: 1, filter: 'blur(0px) grayscale(0%)', duration: 0.8, ease: 'power2.inOut' }) })
        if (sliderOutsideHandler) { try { document.removeEventListener('click', sliderOutsideHandler, true) } catch (e) { } try { document.removeEventListener('wheel', sliderOutsideHandler, { capture: true }) } catch (e) { } sliderOutsideHandler = null }
        focusedCard = null; isInteracting = false
      }

      dimmer.onclick = unfocusCard

      let carouselTickerActive = false
      function carouselTick() {
        if (!carouselTickerActive) return
        if (!isInteracting && !isFocused) targetRotation += autoRotationSpeed * currentDirection
        rotationValue += (targetRotation - rotationValue) * 0.08
        cards.forEach((card, i) => { gsap.set(card, { rotationY: (i * ANGLE) + rotationValue }) })
      }
      gsap.ticker.add(carouselTick)

      const carouselObs = new IntersectionObserver((entries) => { entries.forEach(entry => { carouselTickerActive = entry.isIntersecting }) }, { rootMargin: '200px', threshold: 0 })
      const sectionEl = sectionRef.current
      if (sectionEl) carouselObs.observe(sectionEl)

      const resizeHandler = () => updateRadius()
      window.addEventListener('resize', resizeHandler)

      let interactionTimeout
      const viewportEl = document.querySelector('.viewport')
      let sliderObserver = null
      if (typeof Observer !== 'undefined') {
        sliderObserver = Observer.create({
          target: stage, type: 'wheel,touch,pointer',
          onWheel: e => { if (!viewportEl?.classList.contains('fullscreen')) return; if (isFocused) unfocusCard(); isInteracting = true; targetRotation -= e.deltaY * 0.08; clearTimeout(interactionTimeout); interactionTimeout = setTimeout(() => { isInteracting = false; snapToGrid() }, 1000) },
          onDrag: e => { if (!viewportEl?.classList.contains('fullscreen')) return; if (isFocused) return; isInteracting = true; targetRotation += e.deltaX * 0.18 },
          onDragEnd: () => { if (!viewportEl?.classList.contains('fullscreen')) return; if (isFocused) return; clearTimeout(interactionTimeout); interactionTimeout = setTimeout(() => { isInteracting = false; snapToGrid() }, 1000) },
          tolerance: 5, preventDefault: true
        })
        sliderObserver.disable()
      }

      const interactBtn = document.getElementById('interact-btn')
      const exitBtn = document.getElementById('exit-btn')
      let isFullscreen = false
      const handleInteract = () => {
        if (isFullscreen) return; isFullscreen = true
        if (window.lenis && sectionRef.current) window.lenis.scrollTo(sectionRef.current, { immediate: true, force: true })
        viewportEl?.classList.add('fullscreen')
        document.getElementById('page-dim-blur')?.classList.add('visible')
        document.body.style.overflow = 'hidden'
        window.lenis?.stop(); sliderObserver?.enable()
        exitBtn?.classList.add('visible')
        if (interactBtn) interactBtn.style.display = 'none'
        gsap.to(stage, { scale: 1.02, duration: 0.5, ease: 'power2.out', yoyo: true, repeat: 1 })
        snapToGrid()
      }
      const handleExit = () => {
        if (!isFullscreen) return; isFullscreen = false
        viewportEl?.classList.remove('fullscreen')
        document.getElementById('page-dim-blur')?.classList.remove('visible')
        document.body.style.overflow = ''
        window.lenis?.start(); sliderObserver?.disable()
        exitBtn?.classList.remove('visible')
        if (interactBtn) interactBtn.style.display = 'inline-block'
      }
      interactBtn?.addEventListener('click', handleInteract)
      exitBtn?.addEventListener('click', handleExit)

      const handleKeyDown = (e) => { if (e.key === 'Escape' && isFullscreen) handleExit() }
      window.addEventListener('keydown', handleKeyDown)

      function snapToGrid() { if (isFocused) return; targetRotation = Math.round(targetRotation / ANGLE) * ANGLE }

      const floatTween = gsap.to(stage, { y: '-=10', duration: 3, repeat: -1, yoyo: true, ease: 'sine.inOut' })
      const scrollFrom = gsap.from(cards, {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
        y: 300, z: -850, rotationX: 35, opacity: 0, stagger: 0.1, duration: 1.5, ease: 'back.out(1.2)'
      })

      return () => {
        gsap.ticker.remove(carouselTick)
        carouselObs.disconnect()
        floatTween.kill()

        window.removeEventListener('resize', resizeHandler)
        window.removeEventListener('mousemove', mouseMoveHandler)
        window.removeEventListener('keydown', handleKeyDown)
        interactBtn?.removeEventListener('click', handleInteract)
        exitBtn?.removeEventListener('click', handleExit)
        if (sliderOutsideHandler) {
          document.removeEventListener('click', sliderOutsideHandler, true)
          document.removeEventListener('wheel', sliderOutsideHandler, true)
        }
        if (dimmer) dimmer.onclick = null
        stage.replaceChildren()
      }
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section className="carousel-section" ref={sectionRef}>
      <div className="ct-overlay" ref={overlayRef}>
        <div className="ct-blocks">
          {Array.from({ length: BLOCK_COUNT }, (_, i) => (
            <div key={i} className={`ct-block ct-block-${i + 1}`} />
          ))}
        </div>
        <div className="ct-text-wrapper"><div className="ct-text">MOMENTS</div></div>
      </div>
      <div className="carousel-content-wrapper" style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}>
        {/* Floating Golden Dust/Bokeh */}
        <GoldenParticles />

        <div className="bg-monolith">MOMENTS</div>
        <div id="dynamic-bg"></div>
        <div id="dimmer"></div>
        <div id="page-dim-blur" aria-hidden="true"></div>
        <div className="viewport">
          <div className="stage" id="stage" ref={stageRef}></div>
          <button id="interact-btn" className="interact-btn">
            <span className="btn-text-content">
              <span className="text-original">Interact with me</span>
              <span className="text-hover">Enter Experience</span>
            </span>
            <span className="btn-shine"></span>
          </button>
          <button id="exit-btn" className="exit-btn" aria-label="Exit Interaction">✕</button>
        </div>
      </div>
    </section>
  )
}
