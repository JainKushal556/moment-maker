import { useEffect, useRef, useContext, useLayoutEffect, lazy, Suspense, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger, Observer } from 'gsap/all'
import Lenis from 'lenis'
import './index.css'

// Base UI
import NoiseOverlay from './base/NoiseOverlay'
import DotGrid from './base/DotGrid'
import SvgTransition from './base/SvgTransition'

// Layout
const Navbar = lazy(() => import('./layout/Navbar'))
const FullScreenNav = lazy(() => import('./layout/FullScreenNav'))

// Context
import { NavProvider, ViewContext } from './context/NavContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import { WalletProvider } from './context/WalletContext'

// Auth
import AuthModal from './features/auth/AuthModal'
import VerifyEmail from './features/auth/VerifyEmail'
import ResetPassword from './features/auth/ResetPassword'

import PublicViewer from './features/public/PublicViewer'

// Features
const LandingPage = lazy(() => import('./features/landing/LandingPage'))
const CategoriesExplorer = lazy(() => import('./features/explorer/CategoriesExplorer'))
const GalleryExplorer = lazy(() => import('./features/explorer/GalleryExplorer'))
const TemplatePreview = lazy(() => import('./features/preview/TemplatePreview'))
const EditorView = lazy(() => import('./features/editor/EditorView'))
const ShareView = lazy(() => import('./features/share/ShareView'))
const MyMomentsView = lazy(() => import('./features/moments/MyMomentsView'))
const SettingsView = lazy(() => import('./features/settings/SettingsView'))
const AboutUs = lazy(() => import('./features/about/AboutUs'))
const CopyrightPage = lazy(() => import('./features/legal/CopyrightPage'))
const ReferalView = lazy(() => import('./features/referral/ReferalView'))
const WalletView = lazy(() => import('./features/wallet/WalletView'))

gsap.registerPlugin(ScrollTrigger, Observer)

function AppContent() {
  const lenisRef = useRef(null)
  const [currentView, , , , , , transitionRef] = useContext(ViewContext)
  const { authModalOpen, closeAuthModal, onAuthSuccess, openAuthModal } = useAuth()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const path = window.location.pathname
    
    // Referral Tracking Logic (Supports /ref/CODE and ?ref=CODE)
    let refCode = params.get('ref');
    
    if (!refCode && path.includes('/ref/')) {
      refCode = path.split('/ref/')[1]?.split('/')[0]?.split('?')[0];
    }

    if (refCode) {
      const cleanRef = refCode.trim().toUpperCase();
      localStorage.setItem('pending_referral', cleanRef);
      console.log('Referral Captured:', cleanRef);
      // Clean the URL
      const newUrl = window.location.pathname === '/' || path.startsWith('/ref/') 
        ? '/' 
        : window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }

    if (params.get('action') === 'login') {
      openAuthModal()
      window.history.replaceState({}, document.title, window.location.pathname)
    }

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

  useLayoutEffect(() => {
    document.body.style.overflow = ''
    document.documentElement.style.overflow = ''
    document.body.style.touchAction = ''

    if (window.lenis && currentView !== 'editor' && currentView !== 'moments' && currentView !== 'preview' && currentView !== 'settings' && currentView !== 'wallet' && currentView !== 'refer') {
      window.lenis.start()
      window.lenis.scrollTo(0, { immediate: true, force: true })
    } else if (currentView !== 'editor' && currentView !== 'moments' && currentView !== 'settings' && currentView !== 'wallet' && currentView !== 'refer') {
      window.scrollTo(0, 0)
    }
  }, [currentView])

  useEffect(() => {
    if (prevViewRef.current !== currentView) {
      const dotGridBg = document.getElementById('dot-grid-bg')
      if (dotGridBg) dotGridBg.style.opacity = '1'

      document.querySelectorAll('body > .icon').forEach((el) => el.remove())
      document.querySelectorAll('.falling-emoji, .minimal-glow, .light-wave, .minimal-particle, .minimal-heart, #ty-canvas-fullscreen, .soap-bubble, .bubble-blast-particle').forEach((el) => el.remove())

      // Global scroll/touch reset fail-safe — use double-RAF so it runs AFTER
      // all child component cleanup effects AND any pending RAF loops complete.
      const forceUnlockScroll = () => {
        document.body.style.overflow = ''
        document.documentElement.style.overflow = ''
        document.body.style.touchAction = ''
        if (window.lenis) window.lenis.start()
      }
      // Double-RAF: fires after all pending paint + RAF callbacks finish
      requestAnimationFrame(() => requestAnimationFrame(forceUnlockScroll))
      // Mobile safety net: some touch-action locks persist longer on mobile browsers
      setTimeout(forceUnlockScroll, 100)

      if (currentView === 'editor' || currentView === 'share' || currentView === 'preview') {
        // Only lock overflow on desktop. Let mobile scroll naturally.
        if (window.innerWidth > 768) {
          document.body.style.overflow = 'hidden';
        }
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
        detail: { visible: ['landing', 'about', 'categories', 'gallery', 'moments', 'settings', 'wallet', 'refer'].includes(currentView) }
      }))

      prevViewRef.current = currentView
    }

    if (window.lenis && currentView !== 'editor' && currentView !== 'moments' && currentView !== 'preview' && currentView !== 'settings' && currentView !== 'wallet' && currentView !== 'refer') {
      window.lenis.scrollTo(0, { immediate: true, force: true })
    } else if (currentView !== 'editor' && currentView !== 'moments' && currentView !== 'settings' && currentView !== 'wallet' && currentView !== 'refer') {
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

      {currentView !== 'editor' && currentView !== 'preview' && currentView !== 'share' && currentView !== 'moments' && currentView !== 'settings' && currentView !== 'wallet' && currentView !== 'refer' && currentView !== 'gallery' && (
        <Suspense fallback={null}>
          <Navbar />
          <FullScreenNav requireAuth={openAuthModal} />
        </Suspense>
      )}
      {currentView !== 'share' && currentView !== 'moments' && currentView !== 'settings' && currentView !== 'wallet' && currentView !== 'refer' && currentView !== 'about' && (
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
      {currentView !== 'share' && currentView !== 'moments' && currentView !== 'settings' && currentView !== 'wallet' && currentView !== 'refer' && <NoiseOverlay />}

      {currentView === 'landing' && (
        <div className="relative z-10">
          <Suspense fallback={null}>
            <LandingPage />
          </Suspense>
        </div>
      )}

      {currentView === 'categories' && (
        <div className="relative z-10">
          <Suspense fallback={<div className="fixed inset-0 z-50 bg-[#050508]"></div>}>
            <CategoriesExplorer />
          </Suspense>
        </div>
      )}

      {currentView === 'gallery' && (
        <div className="relative z-10">
          <Suspense fallback={<div className="fixed inset-0 z-50 bg-[#050508]"></div>}>
            <GalleryExplorer />
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

      {currentView === 'settings' && (
        <div className="relative z-20">
          <Suspense fallback={<div className="fixed inset-0 z-200 bg-[#0a0a12]"></div>}>
            <SettingsView />
          </Suspense>
        </div>
      )}
      
      {currentView === 'wallet' && (
        <div className="relative z-20">
          <Suspense fallback={<div className="fixed inset-0 z-200 bg-[#0a0a12]"></div>}>
            <WalletView />
          </Suspense>
        </div>
      )}

      {currentView === 'refer' && (
        <div className="relative z-20">
          <Suspense fallback={<div className="fixed inset-0 z-200 bg-[#0a0a12]"></div>}>
            <ReferalView />
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

      {currentView === 'copyright' && (
        <div className="relative z-10">
          <Suspense fallback={<div className="fixed inset-0 z-50 bg-[#050508]"></div>}>
            <CopyrightPage />
          </Suspense>
        </div>
      )}

      {/* SVG Stroke Transition Overlay — always mounted */}
      <SvgTransition ref={transitionRef} />
    </>
  )
}

import Preloader from './components/Preloader/Preloader'

export default function App() {
  const [loadProgress, setLoadProgress] = useState(0)
  const [preloaderDone, setPreloaderDone] = useState(false)
  const [appReady, setAppReady] = useState(false) // mounts AppContent behind the preloader during orbit

  useEffect(() => {
    let currentProgress = 0;
    let targetProgress = 0;
    let animationFrameId;

    const addProgress = (amount) => {
      targetProgress = Math.min(100, targetProgress + amount);
    };

    // 1. Initial DOM Load (20%)
    if (document.readyState === 'complete') addProgress(20);
    else window.addEventListener('load', () => addProgress(20));

    // 2. Fonts Loaded (30%)
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => addProgress(30));
    } else {
      addProgress(30);
    }

    // 3. Preload Main Chunks (Network Request - 30%)
    Promise.all([
      import('./features/landing/LandingPage'),
      import('./layout/Navbar'),
      import('./layout/FullScreenNav')
    ]).then(() => addProgress(30)).catch(() => addProgress(30));

    // 4. Preload Critical Images (Network Request - 20%)
    const imagesToPreload = ['/icon1.svg', '/icon2.svg', '/icon3.svg', '/icon4.svg', '/icon5.svg'];
    let loadedImages = 0;
    imagesToPreload.forEach(src => {
      const img = new Image();
      img.src = src;
      img.onload = img.onerror = () => {
        loadedImages++;
        addProgress(20 / imagesToPreload.length);
      };
    });

    // Smooth interpolator: animate currentProgress towards targetProgress
    let lastTime = null;
    const updateProgress = (timestamp) => {
      if (!lastTime) lastTime = timestamp;
      const deltaTime = timestamp - lastTime;
      lastTime = timestamp;

      if (currentProgress < targetProgress) {
        const diff = targetProgress - currentProgress;
        
        // Framerate-independent max speed: 100 progress over 4800ms
        const maxIncrement = (100 / 4800) * deltaTime;
        
        // Ensures it scales perfectly regardless of 60Hz or 120Hz screen
        const increment = Math.min(maxIncrement, Math.max(0.003 * deltaTime, diff * 0.001 * deltaTime));
        currentProgress += increment;
        
        if (currentProgress > 100) currentProgress = 100;
        setLoadProgress(Math.floor(currentProgress));
      }
      
      if (currentProgress < 100) {
        animationFrameId = requestAnimationFrame(updateProgress);
      } else {
        setLoadProgress(100);
      }
    };
    
    animationFrameId = requestAnimationFrame(updateProgress);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Check if the URL path starts with /w/
  const path = window.location.pathname
  const momentId = path.startsWith('/w/') ? path.split('/w/')[1] : null

  // Check for email verification params
  const params = new URLSearchParams(window.location.search)
  const mode = params.get('mode')
  const oobCode = params.get('oobCode')

  if (mode === 'verifyEmail' && oobCode) {
    return (
      <AuthProvider>
        <VerifyEmail oobCode={oobCode} />
      </AuthProvider>
    )
  }

  if (mode === 'resetPassword' && oobCode) {
    return (
      <AuthProvider>
        <ResetPassword oobCode={oobCode} />
      </AuthProvider>
    )
  }

  // Completely bypass the main SPA if a public share link is detected
  if (momentId) {
    return <PublicViewer momentId={momentId} />
  }

  // During orbit phase: render AppContent hidden behind the preloader
  // so it's fully mounted and ready when the animation finishes
  return (
    <>
      {/* Preloader sits on top (z-index 99999) until done */}
      {!preloaderDone && (
        <Preloader
          loadProgress={loadProgress}
          onOrbitStart={() => setAppReady(true)}
          onComplete={() => setPreloaderDone(true)}
        />
      )}

      {/* AppContent mounts hidden during orbit, becomes visible instantly on complete */}
      {appReady && (
        <div style={!preloaderDone ? {
          opacity: 0,
          pointerEvents: 'none',
          userSelect: 'none',
          position: 'fixed',
          inset: 0,
          overflow: 'hidden',
        } : {}}>
          <AuthProvider>
            <WalletProvider>
              <NavProvider>
                <AppContent />
              </NavProvider>
            </WalletProvider>
          </AuthProvider>
        </div>
      )}
    </>
  )
}
