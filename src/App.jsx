import { useEffect, useRef, useContext, lazy, Suspense } from 'react'
import gsap from 'gsap'
import { ScrollTrigger, Observer } from 'gsap/all'
import Lenis from 'lenis'
import './index.css'

// Base UI
import NoiseOverlay from './base/NoiseOverlay'
import DotGrid from './base/DotGrid'

// Layout
import Navbar from './layout/Navbar'
import FullScreenNav from './layout/FullScreenNav'

// Context
import { NavProvider, ViewContext } from './context/NavContext'

// Features
const LandingPage = lazy(() => import('./features/landing/LandingPage'))
const CategoriesExplorer = lazy(() => import('./features/explorer/CategoriesExplorer'))

gsap.registerPlugin(ScrollTrigger, Observer)

function AppContent() {
  const lenisRef = useRef(null)
  const [currentView] = useContext(ViewContext)

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
    window.scrollTo(0, 0)

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
    })
    lenisRef.current = lenis
    window.lenis = lenis

    lenis.on('scroll', ScrollTrigger.update)
    const updateLenis = (time) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(updateLenis)
    gsap.ticker.lagSmoothing(0)

    const resizeObserver = new ResizeObserver(() => {
      ScrollTrigger.refresh()
    })
    resizeObserver.observe(document.body)

    return () => {
      lenis.destroy()
      gsap.ticker.remove(updateLenis)
      resizeObserver.disconnect()
    }
  }, [])

  const prevViewRef = useRef(currentView)

  useEffect(() => {
    if (prevViewRef.current !== currentView) {
      const dotGridBg = document.getElementById('dot-grid-bg')
      if (dotGridBg) dotGridBg.style.opacity = '1'

      document.querySelectorAll('body > .icon').forEach((el) => el.remove())
      document.querySelectorAll('.falling-emoji, .minimal-glow, .light-wave, .minimal-particle, .minimal-heart, #ty-canvas-fullscreen, .soap-bubble, .bubble-blast-particle').forEach((el) => el.remove())

      document.body.style.overflow = ''
      if (window.lenis) window.lenis.start()

      window.dispatchEvent(new CustomEvent('momentNavToggle', {
        detail: { visible: currentView === 'categories' }
      }))

      prevViewRef.current = currentView
    }

    if (window.lenis) {
      window.lenis.scrollTo(0, { immediate: true, force: true })
    } else {
      window.scrollTo(0, 0)
    }

    const timer = setTimeout(() => {
      ScrollTrigger.refresh()
    }, currentView === 'categories' ? 80 : 180)

    return () => clearTimeout(timer)
  }, [currentView])

  return (
    <>
      <Navbar />
      <FullScreenNav />
      <DotGrid />
      <NoiseOverlay />

      {currentView === 'landing' && (
        <Suspense fallback={null}>
          <LandingPage />
        </Suspense>
      )}

      {currentView === 'categories' && (
        <Suspense fallback={<div className="fixed inset-0 z-50 bg-[#050508]"></div>}>
          <CategoriesExplorer />
        </Suspense>
      )}
    </>
  )
}

function App() {
  return (
    <NavProvider>
      <AppContent />
    </NavProvider>
  )
}

export default App
