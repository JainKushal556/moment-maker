import { useEffect, useRef, useContext, useState } from 'react'
import { ViewContext } from '../context/NavContext'
import logo from '../assets/logo.png'
import Matter from 'matter-js'
import '../styles/footer.css'

const { Engine, Runner, Bodies, Body, Composite, Mouse, MouseConstraint, Events } = Matter

const FloatingHearts = () => {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const createHeart = () => {
      const heart = document.createElement('div')
      heart.className = 'floating-heart'
      heart.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="#f472b6" style="opacity: ${Math.random() * 0.4 + 0.2}">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
      </svg>`

      const size = Math.random() * 20 + 10
      heart.style.left = Math.random() * 100 + '%'
      heart.style.top = '100%'
      heart.style.setProperty('--rotation', (Math.random() * 90 - 45) + 'deg')
      heart.style.animationDuration = Math.random() * 10 + 15 + 's'

      container.appendChild(heart)
      heart.addEventListener('animationend', () => heart.remove())
    }

    const interval = setInterval(createHeart, 2000)
    for (let i = 0; i < 8; i++) setTimeout(createHeart, Math.random() * 5000)

    return () => clearInterval(interval)
  }, [])

  return <div ref={containerRef} className="absolute inset-0 pointer-events-none overflow-hidden" />
}

export default function Footer() {
  const playgroundRef = useRef(null)
  const [currentView, navigateTo] = useContext(ViewContext)
  const [email, setEmail] = useState('')
  const [subStatus, setSubStatus] = useState('idle') // idle, loading, success, error

  const handleLandingShortcut = (event, targetId) => {
    event.preventDefault()
    window.pendingScrollTarget = targetId

    if (currentView === 'landing') {
      if (typeof window.scrollLandingSection === 'function') {
        window.scrollLandingSection(targetId)
      } else {
        window.setTimeout(() => window.scrollLandingSection?.(targetId), 50)
      }
      return
    }

    navigateTo('landing')
  }

  const handleAboutShortcut = (event, targetId) => {
    event.preventDefault()
    window.pendingScrollTarget = targetId

    if (currentView === 'about') {
      const target = document.getElementById(targetId)
      if (target) {
        if (window.lenis) {
          window.lenis.scrollTo(target, { 
            offset: -100, 
            immediate: true, 
            force: true 
          })
        } else {
          const top = target.getBoundingClientRect().top + window.scrollY - 100
          window.scrollTo({ top, behavior: 'auto' })
        }
      }
      window.pendingScrollTarget = null
      return
    }

    navigateTo('about')
  }
  
  const handleNewsletterSubmit = (e) => {
    e.preventDefault()
    if (!email || !email.includes('@')) return

    const GOOGLE_FORM_ACTION_URL = 'https://docs.google.com/forms/d/e/1FAIpQLScMFhv4m56BpS2GM5pF71IoB42QxJu2dRM-elsjNYZxluaUaQ/formResponse';
    const GOOGLE_FORM_EMAIL_ENTRY_ID = 'entry.1783343694';

    // Create a hidden iframe to receive the form response (bypasses CORS)
    const iframeName = 'hidden-google-form-iframe';
    let iframe = document.getElementById(iframeName);
    if (!iframe) {
      iframe = document.createElement('iframe');
      iframe.setAttribute('id', iframeName);
      iframe.setAttribute('name', iframeName);
      iframe.style.display = 'none';
      document.body.appendChild(iframe);
    }

    // Create a hidden form and submit it to the iframe
    const form = document.createElement('form');
    form.setAttribute('method', 'POST');
    form.setAttribute('action', GOOGLE_FORM_ACTION_URL);
    form.setAttribute('target', iframeName);

    const input = document.createElement('input');
    input.setAttribute('type', 'hidden');
    input.setAttribute('name', GOOGLE_FORM_EMAIL_ENTRY_ID);
    input.setAttribute('value', email.trim().toLowerCase());
    form.appendChild(input);

    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);

    setSubStatus('success');
    setEmail('');
    setTimeout(() => setSubStatus('idle'), 5000);
  }

  useEffect(() => {
    const indicatorObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const ind = document.getElementById('globalScrollIndicator');
        if (ind) {
          ind.style.opacity = entry.isIntersecting ? '0' : '0.7';
        }
      });
    }, { threshold: 0 });

    const footerEl = document.getElementById('main-footer');
    if (footerEl) indicatorObserver.observe(footerEl);

    const playground = playgroundRef.current
    if (!playground) return

    const overlay = playground.querySelector('.footer-playground-overlay')
    function getOverlayHeight() { return overlay ? overlay.offsetHeight : 220 }

    const engine = Engine.create({ gravity: { x: 0, y: 0.7 } })
    let pW = playground.clientWidth; let pH = playground.clientHeight
    function playFloor() { 
      const overlayH = getOverlayHeight();
      // Ensure the floor is always at least 300px from top, so balls ALWAYS have space
      return Math.max(300, pH - overlayH - 8); 
    }
    const isMobile = window.innerWidth <= 640;
    const wallT = 60

    function createWalls() {
      const floor = playFloor()
      return [
        Bodies.rectangle(pW / 2, floor + wallT / 2, pW + 200, wallT, { isStatic: true, label: 'floor' }),
        Bodies.rectangle(-wallT / 2, pH / 2, wallT, pH * 2, { isStatic: true }),
        Bodies.rectangle(pW + wallT / 2, pH / 2, wallT, pH * 2, { isStatic: true }),
        Bodies.rectangle(pW / 2, (isMobile ? 40 : 0) - wallT / 2, pW + 200, wallT, { isStatic: true })
      ]
    }

    let walls = createWalls(); Composite.add(engine.world, walls)
    const items = []; const MAX_SPEED = 28;

    const blobSize = isMobile ? 140 : 280;
    const blobStartPositions = [{ x: 0.12, y: 0.10 }, { x: 0.80, y: 0.12 }, { x: 0.38, y: 0.08 }, { x: 0.58, y: 0.18 }, { x: 0.15, y: 0.28 }, { x: 0.70, y: 0.06 }]
    
    const blobEls = playground.querySelectorAll('.footer-blob')
    blobEls.forEach((el, i) => {
      const bRadius = blobSize / 2;
      const pos = blobStartPositions[i] || { x: Math.random(), y: 0.15 }; const floor = playFloor()
      const body = Bodies.circle(pW * pos.x, (floor * pos.y) + (isMobile ? 40 : 0), bRadius * 0.65, { restitution: 0.45, friction: 0.25, frictionAir: 0.018, density: 0.002, angle: (Math.random() - 0.5) * 0.6 })
      Composite.add(engine.world, body); items.push({ el, body, w: blobSize, h: blobSize, isBlob: true })
    })

    const pillPositions = [{ x: 0.08, y: 0.55, angle: -1.2 }, { x: 0.30, y: 0.50, angle: -1.4 }, { x: 0.55, y: 0.55, angle: -1.1 }, { x: 0.82, y: 0.58, angle: -0.15 }]
    const pillEls = playground.querySelectorAll('.footer-pill')
    pillEls.forEach((el, i) => {
      const w = el.offsetWidth || 180; const h = el.offsetHeight || 44
      const pos = pillPositions[i] || { x: 0.5, y: 0.55, angle: -0.3 }; const floor = playFloor()
      const body = Bodies.rectangle(pW * pos.x, (floor * pos.y) + (isMobile ? 40 : 0), w, h, { restitution: 0.5, friction: 0.2, frictionAir: 0.03, density: 0.001, angle: pos.angle, chamfer: { radius: h / 2 } })
      Composite.add(engine.world, body); items.push({ el, body, w, h, isBlob: false })
    })

    const dummyEl = document.createElement('div');
    const mouse = Mouse.create(dummyEl);
    mouse.element = playground;

    const mConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: { stiffness: 0.1, render: { visible: false } }
    })
    Composite.add(engine.world, mConstraint)

    const updateMousePos = (cx, cy) => {
      const rect = playground.getBoundingClientRect();
      mouse.position.x = cx - rect.left;
      mouse.position.y = cy - rect.top;
      mouse.absolute.x = mouse.position.x;
      mouse.absolute.y = mouse.position.y;
    };

    const onStart = (e) => {
      const src = e.touches ? e.touches[0] : e;
      updateMousePos(src.clientX, src.clientY);
      mouse.button = 0;
      mouse.mousedownPosition.x = mouse.position.x;
      mouse.mousedownPosition.y = mouse.position.y;
    };

    const onMove = (e) => {
      const src = e.touches ? e.touches[0] : e;
      updateMousePos(src.clientX, src.clientY);
    };

    const onEnd = () => {
      mouse.button = -1;
    };

    const globalUp = () => { mouse.button = -1; };
    window.addEventListener('mouseup', globalUp);
    window.addEventListener('touchend', globalUp);

    playground.addEventListener('mousedown', onStart);
    playground.addEventListener('touchstart', onStart, { passive: false });
    playground.addEventListener('mousemove', onMove);
    playground.addEventListener('touchmove', onMove, { passive: false });
    playground.addEventListener('mouseup', onEnd);
    playground.addEventListener('touchend', onEnd);

    Events.on(engine, 'afterUpdate', () => {
      const floor = playFloor()
      for (const { body } of items) {
        const spd = Math.sqrt(body.velocity.x ** 2 + body.velocity.y ** 2)
        if (spd > MAX_SPEED) { const scale = MAX_SPEED / spd; Body.setVelocity(body, { x: body.velocity.x * scale, y: body.velocity.y * scale }) }
        
        const px = body.position.x; const py = body.position.y
        let clamped = false
        if (px < body.circleRadius || px < 0) { Body.setPosition(body, { x: body.circleRadius || 10, y: py }); Body.setVelocity(body, { x: Math.abs(body.velocity.x) * 0.5, y: body.velocity.y }); clamped = true }
        if (px > pW - (body.circleRadius || 0)) { Body.setPosition(body, { x: pW - (body.circleRadius || 10), y: py }); Body.setVelocity(body, { x: -Math.abs(body.velocity.x) * 0.5, y: body.velocity.y }); clamped = true }
        
        // Prevent items from going below the floor
        if (py > floor) { 
          Body.setPosition(body, { x: px, y: floor - (body.circleRadius || 20) }); 
          Body.setVelocity(body, { x: body.velocity.x, y: -Math.abs(body.velocity.y) * 0.2 }); 
          clamped = true 
        }
        
        if (clamped) { 
          // If significantly out of bounds, stop it completely
          if (py > floor + 20) {
            Body.setPosition(body, { x: px, y: floor - (body.circleRadius || 20) });
            Body.setVelocity(body, { x: 0, y: 0 });
          }
        }
      }
    })

    const runner = Runner.create(); let isRunning = false; let syncRAF
    function startPhysics() { if (isRunning) return; isRunning = true; Runner.run(runner, engine); syncDOM() }
    function stopPhysics() { if (!isRunning) return; isRunning = false; Runner.stop(runner); cancelAnimationFrame(syncRAF) }
    function syncDOM() {
      if (!isRunning) return
      for (const { el, body, w, h } of items) {
        const x = body.position.x - w / 2
        const y = body.position.y - h / 2
        const angle = body.angle
        el.style.transform = `translate(${x}px, ${y}px) rotate(${angle}rad)`
      }
      syncRAF = requestAnimationFrame(syncDOM)
    }

    items.forEach(({ el }) => { el.style.left = '0px'; el.style.top = '0px' })

    const observer = new IntersectionObserver((entries) => { entries.forEach(entry => { if (entry.isIntersecting) startPhysics(); else stopPhysics() }) }, { rootMargin: '100px', threshold: 0 })
    observer.observe(playground)

    let resizeTimeout
    const resizeHandler = () => { clearTimeout(resizeTimeout); resizeTimeout = setTimeout(() => { pW = playground.clientWidth; pH = playground.clientHeight; Composite.remove(engine.world, walls); walls = createWalls(); Composite.add(engine.world, walls) }, 250) }
    window.addEventListener('resize', resizeHandler)

    return () => {
      stopPhysics(); observer.disconnect()
      window.removeEventListener('resize', resizeHandler)
      window.removeEventListener('mouseup', globalUp)
      window.removeEventListener('touchend', globalUp)
      playground.removeEventListener('mousedown', onStart)
      playground.removeEventListener('touchstart', onStart)
      playground.removeEventListener('mousemove', onMove)
      playground.removeEventListener('touchmove', onMove)
      playground.removeEventListener('mouseup', onEnd)
      playground.removeEventListener('touchend', onEnd)
      Engine.clear(engine)
      indicatorObserver.disconnect()
    }
  }, [])

  return (
    <section className="footer-section" id="main-footer">
      <div className="footer-playground" ref={playgroundRef}>
        <FloatingHearts />

        {/* Shape 1: Yellow Heptagon */}
        <div className="footer-blob">
          <svg viewBox="0 0 277 301">
            <path d="M108.103 8.24078C126.954 -2.64276 150.179 -2.64276 169.03 8.24078L246.169 52.7773C265.02 63.6609 276.633 83.7745 276.633 105.542V194.615C276.633 216.382 265.02 236.495 246.169 247.379L169.03 291.915C150.179 302.799 126.954 302.799 108.103 291.915L30.9635 247.379C12.1126 236.495 0.5 216.382 0.5 194.615V105.542C0.5 83.7745 12.1126 63.6609 30.9635 52.7773L108.103 8.24078Z" fill="#FAFF00" />
          </svg>
        </div>

        {/* Shape 2: Lavender Circle */}
        <div className="footer-blob">
          <svg viewBox="0 0 207 207">
            <path d="M176.3,31c-18.8-18.8-44.7-30.4-73.3-30.4C74.3,0.6,48.3,12.2,29.6,31S-0.8,75.7-0.8,104.3 c0,28.6,11.6,54.6,30.4,73.3S74.3,208,102.9,208c28.6,0,54.6-11.6,73.3-30.4s30.4-44.7,30.4-73.3C206.6,75.7,195,49.7,176.3,31z" fill="#8F9AFF" />
          </svg>
        </div>

        {/* Shape 3: Orange Clover */}
        <div className="footer-blob">
          <svg viewBox="0 0 282 281">
            <path d="M75.9469 280.078C91.5033 280.078 105.96 275.398 117.97 267.376C130.585 258.951 151.308 258.951 163.924 267.376C175.934 275.398 190.39 280.078 205.947 280.078C247.615 280.078 281.394 246.499 281.394 205.078C281.394 189.768 276.779 175.529 268.856 163.661C260.282 150.817 260.282 129.339 268.856 116.496C276.779 104.628 281.394 90.3887 281.394 75.0781C281.394 33.6568 247.615 0.078125 205.947 0.078125C190.39 0.078125 175.934 4.75843 163.924 12.7798C151.308 21.2056 130.585 21.2056 117.97 12.7798C105.96 4.75843 91.5033 0.078125 75.9469 0.078125C34.2787 0.078125 0.5 33.6568 0.5 75.0781C0.5 90.3887 5.11505 104.628 13.0377 116.496C21.6119 129.339 21.6119 150.817 13.0377 163.661C5.11505 175.529 0.5 189.768 0.5 205.078C0.5 246.499 34.2787 280.078 75.9469 280.078Z" fill="#FF8E59" />
          </svg>
        </div>

        {/* Shape 4: Blue Star */}
        <div className="footer-blob">
          <svg viewBox="0 0 444 442">
            <path d="M204.205 4.63126C215.258 -1.54115 228.742 -1.54115 239.795 4.63125L266.874 19.7527C272.176 22.7136 278.139 24.3042 284.218 24.3792L315.264 24.762C327.936 24.9182 339.614 31.6297 346.086 42.4769L361.942 69.0507C365.046 74.2541 369.412 78.5999 374.639 81.6906L401.333 97.4751C412.229 103.918 418.971 115.543 419.128 128.158L419.512 159.064C419.588 165.116 421.186 171.052 424.16 176.33L439.35 203.287C445.55 214.29 445.55 227.713 439.35 238.717L424.16 265.674C421.186 270.952 419.588 276.888 419.512 282.94L419.128 313.846C418.971 326.461 412.229 338.086 401.333 344.529L374.639 360.313C369.412 363.404 365.046 367.75 361.942 372.953L346.086 399.527C339.614 410.374 327.936 417.086 315.264 417.242L284.218 417.625C278.139 417.7 272.176 419.29 266.874 422.251L239.795 437.373C228.742 443.545 215.258 443.545 204.205 437.373L177.126 422.251C171.824 419.29 165.861 417.7 159.782 417.625L128.736 417.242C116.064 417.086 104.386 410.374 97.9142 399.527L82.0583 372.953C78.9536 367.75 74.5882 363.404 69.3612 360.313L42.6671 344.529C31.7709 338.086 25.029 326.461 24.8721 313.846L24.4875 282.94C24.4123 276.888 22.8144 270.952 19.8401 265.674L4.65025 238.717C-1.55008 227.713 -1.55008 214.29 4.65025 203.287L19.8401 176.33C22.8144 171.052 24.4122 165.116 24.4875 159.064L24.8721 128.158C25.029 115.543 31.7709 103.918 42.6671 97.4751L69.3612 81.6906C74.5882 78.5999 78.9536 74.2541 82.0583 69.0507L97.9142 42.4769C104.386 31.6297 116.064 24.9182 128.736 24.762L159.782 24.3792C165.861 24.3042 171.824 22.7136 177.126 19.7527L204.205 4.63126Z" fill="#5E9BFF" />
          </svg>
        </div>

        {/* Shape 5: Pink Scalloped */}
        <div className="footer-blob">
          <svg viewBox="0 0 249 247">
            <path d="M245.7,56.1l0-9.9c0-22.7-18.4-41-41-41l-160.2,0c-22.7,0-41,18.4-41,41l0,9.9c0,11,4.3,21,11.4,28.4 c1.5,1.5,1.5,4,0,5.5c-7.1,7.4-11.4,17.4-11.4,28.4l0,9.9c0,11,4.3,21,11.4,28.4c1.5,1.5,1.5,4,0,5.5c-7.1,7.4-11.4,17.4-11.4,28.4 l0,10.1c0,22.7,18.4,41,41,41l160.2,0c22.7,0,41-18.4,41-41l0-10.1c0-11-4.3-21-11.4-28.4c-1.5-1.5-1.5-4,0-5.5 c7.1-7.4,11.4-17.4,11.4-28.4l0-9.9c0-11-4.3-21-11.4-28.4c-1.5-1.5-1.5-4,0-5.5C241.3,77.1,245.7,67.1,245.7,56.1z" fill="#FFBDF9" />
          </svg>
        </div>

        {/* Shape 6: Lime Clover */}
        <div className="footer-blob">
          <svg viewBox="0 0 282 281">
            <path d="M75.9469 280.078C91.5033 280.078 105.96 275.398 117.97 267.376C130.585 258.951 151.308 258.951 163.924 267.376C175.934 275.398 190.39 280.078 205.947 280.078C247.615 280.078 281.394 246.499 281.394 205.078C281.394 189.768 276.779 175.529 268.856 163.661C260.282 150.817 260.282 129.339 268.856 116.496C276.779 104.628 281.394 90.3887 281.394 75.0781C281.394 33.6568 247.615 0.078125 205.947 0.078125C190.39 0.078125 175.934 4.75843 163.924 12.7798C151.308 21.2056 130.585 21.2056 117.97 12.7798C105.96 4.75843 91.5033 0.078125 75.9469 0.078125C34.2787 0.078125 0.5 33.6568 0.5 75.0781C0.5 90.3887 5.11505 104.628 13.0377 116.496C21.6119 129.339 21.6119 150.817 13.0377 163.661C5.11505 175.529 0.5 189.768 0.5 205.078C0.5 246.499 34.2787 280.078 75.9469 280.078Z" fill="#DAEF68" />
          </svg>
        </div>

        {/* Pill Buttons */}
        <a href="#landing-categories" className="footer-pill" onClick={(e) => handleLandingShortcut(e, 'landing-categories')}>
          <span className="pill-text">Browse Categories</span>
          <span className="pill-hover-text">Find the perfect wish</span>
        </a>
        <a href="#landing-create" className="footer-pill" onClick={(e) => handleLandingShortcut(e, 'landing-create')}>
          <span className="pill-text">Try Customization</span>
          <span className="pill-hover-text">Make it truly yours</span>
        </a>
        <a href="#landing-cta" className="footer-pill" onClick={(e) => handleLandingShortcut(e, 'landing-cta')}>
          <span className="pill-text">Send a Wish</span>
          <span className="pill-hover-text">Spread the joy</span>
        </a>
        <a href="#landing-community" className="footer-pill" onClick={(e) => handleLandingShortcut(e, 'landing-community')}>
          <span className="pill-text">Join Community</span>
          <span className="pill-hover-text">Meet fellow wishers</span>
        </a>

        {/* Full Footer Overlay on Playground */}
        <div className="footer-playground-overlay">
        {/* Top: Brand + Nav columns */}
          <div className="fpo-top">
            {/* Brand + Newsletter */}
            <div className="fpo-brand">
                <div className="fpo-logo-tagline flex flex-row items-center gap-3 lg:gap-6 text-left">
                  <div className="footer-logo-link flex flex-row items-center gap-3 lg:gap-4">
                    {/* Rotating Logo for Footer */}
                    <div className="relative h-16 w-16 lg:h-20 lg:w-20 rounded-full overflow-hidden p-[1.5px] shadow-[0_0_15px_rgba(217,70,239,0.2)]">
                        {/* Rotating Gradient Layer */}
                        <div className="absolute inset-[-100%] bg-gradient-to-br from-[#d946ef] via-[#f472b6] to-[#fb923c] animate-spin-slow"></div>
                        
                        {/* Inner Container to keep Logo static */}
                        <div className="absolute inset-[1.5px] rounded-full bg-[#050508] flex items-center justify-center overflow-hidden z-10">
                            <img 
                                src={logo} 
                                alt="Moment Maker Logo" 
                                className="h-full w-full object-cover" 
                            />
                        </div>
                    </div>

                    <div className="flex flex-col items-start leading-[0.65]">
                      <span className='text-white font-black text-lg lg:text-3xl uppercase tracking-tight'>MOMENT</span>
                      <span 
                        className='font-black text-lg lg:text-3xl uppercase tracking-tight'
                        style={{ 
                            WebkitTextStroke: '1px #FFD700', 
                            WebkitTextStrokeWidth: '0.8px',
                            color: 'transparent' 
                        }}
                      >CRAFTER</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-start leading-[0.9] border-l border-white/10 pl-3 lg:pl-10">
                    <p className="fpo-tagline text-white/40 text-[10px] lg:text-base m-0 text-left">Craft memories,</p>
                    <p className="fpo-tagline text-white/40 text-[10px] lg:text-base m-0 text-left">not just messages.</p>
                  </div>
                </div>

              {/* Newsletter */}
              <div className="footer-newsletter">
                <div className="newsletter-header">
                  <div className="newsletter-icon"><i className="fas fa-envelope"></i></div>
                  <div className="newsletter-info">
                    <span className="newsletter-title">Stay in the loop</span>
                    <div className="relative">
                      <span className={`newsletter-sub transition-opacity duration-300 ${subStatus !== 'idle' ? 'opacity-0' : 'opacity-100'}`}>
                        Get ideas & updates in your inbox.
                      </span>
                      {subStatus === 'success' && (
                        <span className="absolute left-0 top-0 text-[10.5px] text-emerald-400 font-medium animate-in fade-in slide-in-from-bottom-1">
                          You're in the loop! ✨
                        </span>
                      )}
                      {subStatus === 'error' && (
                        <span className="absolute left-0 top-0 text-[10.5px] text-red-400 font-medium animate-in fade-in slide-in-from-bottom-1">
                          Something went wrong.
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
                    <input 
                      type="email" 
                      placeholder={subStatus === 'success' ? "Subscribed!" : "Enter your email"} 
                      className={`newsletter-input ${subStatus === 'error' ? 'border-red-500' : ''}`}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={subStatus === 'loading' || subStatus === 'success'}
                      required
                    />
                    <button 
                      type="submit" 
                      className="newsletter-btn" 
                      aria-label="Subscribe"
                      disabled={subStatus === 'loading' || subStatus === 'success'}
                    >
                      {subStatus === 'loading' ? (
                        <i className="fas fa-spinner animate-spin"></i>
                      ) : subStatus === 'success' ? (
                        <i className="fas fa-check"></i>
                      ) : (
                        <i className="fas fa-arrow-right"></i>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>

            {/* Nav columns with iconic headers */}
            <div className="fpo-nav-cols">
              <div className="fpo-col">
                <div className="fpo-col-header"><i className="fas fa-home col-icon"></i> HOME</div>
                <a href="#landing-categories" onClick={(e) => handleLandingShortcut(e, 'landing-categories')}>Interactive carousel</a>
                <a href="#landing-how-it-works" onClick={(e) => handleLandingShortcut(e, 'landing-how-it-works')}>How It Works</a>
                <a href="#landing-create" onClick={(e) => handleLandingShortcut(e, 'landing-create')}>Personalize The Magic</a>
              </div>
              <div className="fpo-col">
                <div className="fpo-col-header"><i className="fas fa-clipboard-list col-icon"></i> TEMPLATES</div>
                <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('categories'); }}>Browse Categories</a>
                <a href="#" onClick={(e) => { e.preventDefault(); sessionStorage.setItem('explorerInitialSection', 'popular'); navigateTo('categories'); }}>Popular Wishes</a>
              </div>
              <div className="fpo-col">
                <div className="fpo-col-header"><i className="fas fa-info-circle col-icon"></i> ABOUT US</div>
                <a href="#process-section" onClick={(e) => handleAboutShortcut(e, 'process-section')}>The Process</a>
                <a href="#makers-section" onClick={(e) => handleAboutShortcut(e, 'makers-section')}>Makers</a>
              </div>
              <div className="fpo-col">
                <div className="fpo-col-header"><i className="fas fa-shield-alt col-icon"></i> SUPPORT & POLICIES</div>
                <a href="#">Contact Us</a>
                <a href="#">Help Center / FAQs</a>
                <a href="#">Privacy Policy</a>
                <a href="#">Terms of Service</a>
                <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('copyright'); }}>Copyright Policy</a>
              </div>
            </div>
          </div>

          {/* Bottom section */}
          <div className="fpo-bottom-section">
            {/* Curvy wave lines */}
            <svg className="footer-waves" viewBox="0 0 1200 80" preserveAspectRatio="none">
              <path d="M0,50 C200,20 400,60 600,35 C800,10 1000,55 1200,30" fill="none" stroke="rgba(255,45,149,0.12)" strokeWidth="1.2" />
              <path d="M0,55 C150,30 350,65 550,40 C750,15 950,58 1200,38" fill="none" stroke="rgba(168,85,247,0.08)" strokeWidth="1" />
              <path d="M0,60 C250,35 450,70 650,45 C850,20 1050,60 1200,42" fill="none" stroke="rgba(59,130,246,0.06)" strokeWidth="0.8" />
            </svg>
            {/* Single row: love LEFT | socials CENTER | trust RIGHT */}
            <div className="fpo-bottom-row">
              <div className="made-with-love">
                <span className="love-hearts">♥♥</span>
                <div className="love-text">
                  <span>Made with love</span>
                  <span>for every memory</span>
                </div>
              </div>

              <div className="fpo-socials">
                <a href="#" className="fpo-social-icon" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
                <a href="#" className="fpo-social-icon" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
                <a href="#" className="fpo-social-icon" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
                <a href="#" className="fpo-social-icon" aria-label="Pinterest"><i className="fab fa-pinterest-p"></i></a>
                <a href="#" className="fpo-social-icon" aria-label="YouTube"><i className="fab fa-youtube"></i></a>
              </div>
            </div>

            {/* Copyright centered below */}
            <span className="fpo-copy">&copy; 2026 Moment Crafter. All rights reserved.</span>
          </div>

        </div>
      </div>
    </section>
  )
}
