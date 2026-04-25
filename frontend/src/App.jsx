import { useEffect, useRef, useContext, lazy, Suspense } from 'react'
import gsap from 'gsap'
import { ScrollTrigger, Observer } from 'gsap/all'
import Lenis from 'lenis'
import './index.css'

// Base UI
import NoiseOverlay from './base/NoiseOverlay'
import DotGrid from './base/DotGrid'
import SvgTransition from './base/SvgTransition'

// Layout
import Navbar from './layout/Navbar'
import FullScreenNav from './layout/FullScreenNav'

// Context
import { NavProvider, ViewContext } from './context/NavContext'
import { AuthProvider, useAuth } from './context/AuthContext'

// Auth
import AuthModal from './features/auth/AuthModal'

import PublicViewer from './features/public/PublicViewer'

// Features
const LandingPage = lazy(() => import('./features/landing/LandingPage'))
const CategoriesExplorer = lazy(() => import('./features/explorer/CategoriesExplorer'))
const TemplatePreview = lazy(() => import('./features/preview/TemplatePreview'))
const EditorView = lazy(() => import('./features/editor/EditorView'))
const ShareView = lazy(() => import('./features/share/ShareView'))
const MyMomentsView = lazy(() => import('./features/moments/MyMomentsView'))
const AboutUs = lazy(() => import('./features/about/AboutUs'))

gsap.registerPlugin(ScrollTrigger, Observer)

function AppContent() {
  const lenisRef = useRef(null)
  const [currentView, , , , , , transitionRef] = useContext(ViewContext)
  const { authModalOpen, closeAuthModal, onAuthSuccess, openAuthModal } = useAuth()

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
      if (currentView === 'editor' || currentView === 'share' || currentView === 'preview') {
        document.body.style.overflow = 'hidden';
        // Destroy Lenis so mouse wheel works natively in these views
        if (window.lenis) {
          window.lenis.destroy()
          window.lenis = null
          lenisRef.current = null
        }
      } else {
        // Recreate Lenis if it was destroyed (coming back from editor/share/moments)
        if (!window.lenis) {
          const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smooth: true,
          })
          lenisRef.current = lenis
          window.lenis = lenis
          lenis.on('scroll', ScrollTrigger.update)
          gsap.ticker.add((time) => lenis.raf(time * 1000))
        } else {
          window.lenis.start()
        }
      }

      window.dispatchEvent(new CustomEvent('momentNavToggle', {
        detail: { visible: currentView === 'landing' || currentView === 'categories' || currentView === 'about' }
      }))

      prevViewRef.current = currentView
    }

    if (window.lenis && currentView !== 'editor' && currentView !== 'moments' && currentView !== 'preview') {
      window.lenis.scrollTo(0, { immediate: true, force: true })
    } else if (currentView !== 'editor' && currentView !== 'moments') {
      window.scrollTo(0, 0)
    }

    const timer = setTimeout(() => {
      ScrollTrigger.refresh()
    }, currentView === 'categories' ? 80 : 180)

    return () => clearTimeout(timer)
  }, [currentView])

  return (
    <>
      {authModalOpen && (
        <AuthModal
          onClose={closeAuthModal}
          onSuccess={onAuthSuccess}
        />
      )}

      {currentView !== 'editor' && currentView !== 'preview' && currentView !== 'share' && currentView !== 'moments' && <Navbar />}
      {currentView !== 'editor' && currentView !== 'preview' && currentView !== 'share' && currentView !== 'moments' && <FullScreenNav requireAuth={openAuthModal} />}
      {currentView !== 'share' && currentView !== 'moments' && currentView !== 'about' && (
        <DotGrid
          dotSize={5}
          gap={30}
          baseColor="#2F293A"
          activeColor="#5227FF"
          proximity={150}
          shockRadius={250}
          shockStrength={5}
          resistance={700}
          returnDuration={1.5}
        />
      )}
      {currentView !== 'share' && currentView !== 'moments' && <NoiseOverlay />}

      {currentView === 'landing' && (
        <div className="relative z-10">
          <Suspense fallback={null}>
            <LandingPage />
          </Suspense>
        </div>
      )}

      {(currentView === 'categories' || currentView === 'preview') && (
        <div className="relative z-10">
          <Suspense fallback={<div className="fixed inset-0 z-50 bg-[#050508]"></div>}>
            <CategoriesExplorer />
          </Suspense>
        </div>
      )}

      {currentView === 'preview' && (
        <div className="relative z-10">
          <Suspense fallback={null}>
            <TemplatePreview />
          </Suspense>
        </div>
      )}

      {currentView === 'editor' && (
        <div className="relative z-20">
          <Suspense fallback={<div className="fixed inset-0 z-200 bg-[#1a0d0d]"></div>}>
            <EditorView />
          </Suspense>
        </div>
      )}

      {currentView === 'share' && (
        <div className="relative z-20">
          <Suspense fallback={<div className="fixed inset-0 z-200 bg-[#0d0a0e]"></div>}>
            <ShareView />
          </Suspense>
        </div>
      )}

      {currentView === 'moments' && (
        <div className="relative z-20">
          <Suspense fallback={<div className="fixed inset-0 z-200 bg-[#0a0a12]"></div>}>
            <MyMomentsView />
          </Suspense>
        </div>
      )}

      {currentView === 'about' && (
        <div className="relative z-10">
          <Suspense fallback={<div className="fixed inset-0 z-50 bg-[#050508]"></div>}>
            <AboutUs />
          </Suspense>
        </div>
      )}

      {/* SVG Stroke Transition Overlay — always mounted */}
      <SvgTransition ref={transitionRef} />
    </>
  )
}

export default function App() {
  // Check if the URL path starts with /w/
  const path = window.location.pathname
  const momentId = path.startsWith('/w/') ? path.split('/w/')[1] : null

  // Completely bypass the main SPA if a public share link is detected
  if (momentId) {
    return <PublicViewer momentId={momentId} />
  }

  return (
    <AuthProvider>
      <NavProvider>
        <AppContent />
      </NavProvider>
    </AuthProvider>
  )
}
