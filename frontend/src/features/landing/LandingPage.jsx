import { lazy, Suspense, useRef, useEffect, useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)
const HeroSection = lazy(() => import('./HeroSection'))
const CategoriesCarousel = lazy(() => import('./CategoriesCarousel'))
const HowItWorks = lazy(() => import('./HowItWorks'))
const Customization = lazy(() => import('./Customization'))
const SocialProof = lazy(() => import('./SocialProof'))
const BigCta = lazy(() => import('./BigCta'))
const FAQ = lazy(() => import('./FAQ'))
const Footer = lazy(() => import('../../layout/Footer'))
const SectionTransition = lazy(() => import('./SectionTransition'))

const LandingPage = () => {
    const transitionRef = useRef(null);
    const landingGatesRef = useRef([]);
    const gateSkipUntilRef = useRef(0);
    const gateSkipTimerRef = useRef(null);

    // ── Scroll-gate progress bar (injected once) ──────────────────────
    useEffect(() => {
        const bar = document.createElement('div');
        bar.id = 'sp-scroll-gate-bar';
        bar.style.cssText = `
            position: fixed;
            bottom: 0;
            left: 0;
            height: 3px;
            width: 0%;
            background: linear-gradient(90deg, #a855f7, #ec4899, #f97316);
            box-shadow: 0 0 12px rgba(168,85,247,0.8), 0 0 24px rgba(236,72,153,0.5);
            z-index: 99999;
            transition: width 0.08s linear;
            pointer-events: none;
        `;
        document.body.appendChild(bar);

        return () => {
            bar?.remove();
        };
    }, []);

    useEffect(() => {
        const getLandingScrollDestination = (targetId) => {
            if (targetId === 'landing-categories') {
                const carouselTrigger = ScrollTrigger.getById('landing-categories-sequence');
                if (!carouselTrigger) return null;

                // The carousel intro is a long pinned sequence.
                // 0.72 lands inside the dark block transition; push deeper so the cards are visible.
                const visibleProgress = 0.9;
                return carouselTrigger.start + ((carouselTrigger.end - carouselTrigger.start) * visibleProgress);
            }

            return document.getElementById(targetId);
        };

        const scrollToLandingSection = (targetId, attempt = 0, forceInstant = false) => {
            // If we're coming from another page (forceInstant or pendingScrollTarget exists), jump instantly.
            // If we're already on the landing page, use smooth scroll for a premium feel.
            const isDeepLink = forceInstant || !!window.pendingScrollTarget;
            const target = getLandingScrollDestination(targetId);

            if (!target) {
                if (attempt < 20) {
                    window.setTimeout(() => scrollToLandingSection(targetId, attempt + 1, forceInstant), 150);
                }
                return;
            }

            gateSkipUntilRef.current = Date.now() + 2000;
            landingGatesRef.current.forEach((gate) => gate?.deactivate?.());
            if (gateSkipTimerRef.current) {
                window.clearTimeout(gateSkipTimerRef.current);
            }
            gateSkipTimerRef.current = window.setTimeout(() => {
                gateSkipUntilRef.current = 0;
                gateSkipTimerRef.current = null;
            }, 2100);

            window.pendingScrollTarget = null;
            document.body.style.overflow = '';
            document.body.style.touchAction = '';
            document.documentElement.style.overflow = '';
            window.lenis?.start();

            const offset = typeof target === 'number' ? 0 : -40;

            if (window.lenis) {
                window.lenis.scrollTo(target, {
                    offset: offset,
                    immediate: isDeepLink,
                    duration: isDeepLink ? 0 : 1.5,
                    force: true,
                });
            } else if (typeof target === 'number') {
                window.scrollTo({ top: target, behavior: isDeepLink ? 'auto' : 'smooth' });
            } else {
                target.scrollIntoView({ behavior: isDeepLink ? 'auto' : 'smooth', block: 'start' });
            }
        };

        window.scrollLandingSection = scrollToLandingSection;

        if (window.pendingScrollTarget) {
            const targetId = window.pendingScrollTarget;
            // Force instant jump (true) while the transition curtain is still covering the screen
            window.setTimeout(() => scrollToLandingSection(targetId, 0, true), 400);
        }

        return () => {
            if (gateSkipTimerRef.current) {
                window.clearTimeout(gateSkipTimerRef.current);
            }
            if (window.scrollLandingSection === scrollToLandingSection) {
                delete window.scrollLandingSection;
            }
        };
    }, []);

    // ── Section-transition scroll gates ──────────────────────────────
    useLayoutEffect(() => {
        let initialized = false;

        // Snap watcher — hoisted to outer scope so cleanup can cancel it
        let snapWatcherRaf = null;
        const stopSnapWatcher = () => {
            if (snapWatcherRaf) {
                cancelAnimationFrame(snapWatcherRaf);
                snapWatcherRaf = null;
            }
        };

        // All gates — tracked here so cleanup can deactivate them all
        const allGates = [];
        landingGatesRef.current = allGates;

        const releaseLandingScrollLocks = () => {
            allGates.forEach(gate => gate.deactivate());
            stopSnapWatcher();
            document.body.style.overflow = '';
            document.body.style.touchAction = '';
            document.documentElement.style.overflow = '';
            window._hiwTriggered = false;
            window._curtainTriggered = false;
            window._archiveTriggered = false;
            if (window.lenis) {
                window.lenis.start();
            }
        };

        window.releaseLandingScrollLocks = releaseLandingScrollLocks;

        // Smart Rotation for Scroll Indicator
        const handleScrollDirection = (e) => {
            const indicator = document.getElementById('globalScrollIndicator');
            if (!indicator) return;

            // Prevent Lenis from overriding the indicator direction while we are in a fake scroll gate
            if (document.body.style.overflow === 'hidden') return;

            // Always point down when within the Hero section (top of the page)
            if (window.scrollY < window.innerHeight * 0.8) {
                indicator.classList.remove('scrolling-up');
                return;
            }

            const direction = e?.direction || window.lenis?.direction;
            if (direction === -1) indicator.classList.add('scrolling-up');
            else indicator.classList.remove('scrolling-up');
        };
        if (window.lenis) window.lenis.on('scroll', handleScrollDirection);

        const initTriggers = () => {
            if (initialized) return true;

            const socialProof = document.querySelector('.social-proof-wrapper');
            const bigCta      = document.querySelector('.big-cta');
            const faqSection  = document.querySelector('.faq-section');

            if (!bigCta || !faqSection) return false;

            initialized = true;

            const bar = document.getElementById('sp-scroll-gate-bar');
            const THRESHOLD = 1200;

            const lockScrollAt = (pos) => {
                stopSnapWatcher();
                
                if (window.lenis) {
                    // Do NOT stop Lenis here! Stopping Lenis mid-swipe hands control back 
                    // to native iOS scrolling, which engages native momentum and causes jitter.
                    // Instead, instantly wipe Lenis's momentum and sync to the lock position.
                    window.lenis.scrollTo(pos, { immediate: true });
                }
                
                // Jump immediately
                window.scrollTo({ top: pos, behavior: 'instant' });
                
                // Watcher to ensure absolute lock (catches any sub-pixel drift)
                const watch = () => {
                    if (Math.abs(window.scrollY - pos) > 2) {
                        window.scrollTo({ top: pos, behavior: 'instant' });
                        if (window.lenis) window.lenis.scrollTo(pos, { immediate: true });
                    }
                    snapWatcherRaf = requestAnimationFrame(watch);
                };
                snapWatcherRaf = requestAnimationFrame(watch);
            };

            // Helper to get exact scroll position of a trigger
            const getTriggerPos = (id, type = 'start') => {
                const t = ScrollTrigger.getById(id);
                return t ? t[type] : 0;
            };

            // ── Gate factory ──────────────────────────────────────────────
            // direction 'down': accumulates downward scroll to fire.
            // direction 'up'  : accumulates upward scroll to fire.
            const createGate = (direction, onFire) => {
                let active = false;
                let accum  = 0;
                let touchStartY = -1; // -1 = "waiting for a fresh touch start"
                let lastTouchY = -1;
                let touchAccumBase = 0;


                const release = (keepLocked = false) => {
                    active = false;
                    accum  = 0;
                    touchStartY = -1;
                    if (bar) bar.style.width = '0%';
                    
                    // Restore pointer events to interactive elements
                    document.querySelectorAll('iframe, textarea').forEach(el => el.style.pointerEvents = '');

                    window.removeEventListener('wheel', onWheel, { capture: true });
                    window.removeEventListener('touchstart', onTouchStart, { capture: true });
                    window.removeEventListener('touchmove', onTouchMove, { capture: true });
                    
                    stopSnapWatcher(); // <--- Kill the watcher

                    if (!keepLocked) {
                        if (window.lenis) {
                            // Sync Lenis internal position to the current native scroll
                            window.lenis.scrollTo(window.scrollY, { immediate: true });
                            window.lenis.start();
                        } else {
                            document.body.style.overflow = '';
                        }
                        // Reset body styles to restore scrolling
                        document.body.style.overflow = '';
                        document.body.style.touchAction = '';
                    }
                };

                const fire = () => { 
                    // Visual delay to let the bar reach 100%
                    setTimeout(() => {
                        release(true); // Keep scroll locked during transition!
                        onFire(); 
                    }, 200);
                };

                const onWheel = (e) => {
                    if (!active) return;
                    e.preventDefault();

                    const indicator = document.getElementById('globalScrollIndicator');
                    if (indicator && e.deltaY !== 0) {
                        if (e.deltaY < 0) indicator.classList.add('scrolling-up');
                        else indicator.classList.remove('scrolling-up');
                    }

                    const delta = direction === 'down' ? e.deltaY : -e.deltaY;
                    
                    accum += delta;
                    
                    if (accum <= -100) { 
                        // Meaningful reverse scroll -> release the gate
                        release(); 
                        return; 
                    }
                    
                    // Clamp for display
                    const displayAccum = Math.max(0, accum);
                    if (bar) bar.style.width = Math.min(100, (displayAccum / THRESHOLD) * 100) + '%';
                    
                    if (accum >= THRESHOLD) fire();
                };

                const onTouchStart = (e) => {
                    // Fresh touch — now we can start accumulating
                    touchStartY = e.touches[0].clientY;
                    lastTouchY = touchStartY;
                    touchAccumBase = accum;
                };

                const onTouchMove = (e) => {
                    if (!active) return;
                    // If touchStartY is still the sentinel, the ongoing swipe that
                    // triggered this gate is still in progress — ignore it.
                    if (touchStartY < 0) { e.preventDefault(); return; }
                    e.preventDefault();
                    
                    const currentY = e.touches[0].clientY;
                    const immediateDelta = lastTouchY - currentY;
                    
                    const indicator = document.getElementById('globalScrollIndicator');
                    if (indicator && immediateDelta !== 0) {
                        if (immediateDelta < 0) indicator.classList.add('scrolling-up');
                        else indicator.classList.remove('scrolling-up');
                    }
                    lastTouchY = currentY;

                    const rawDelta = touchStartY - currentY;
                    const delta = direction === 'down' ? rawDelta : -rawDelta;
                    
                    accum = touchAccumBase + (delta * 1.5);
                    
                    if (accum <= -100) { 
                        release(); 
                        return; 
                    }
                    
                    const displayAccum = Math.max(0, accum);
                    if (bar) bar.style.width = Math.min(100, (displayAccum / THRESHOLD) * 100) + '%';
                    
                    if (accum >= THRESHOLD) fire();
                };

                return {
                    activate: (lockPos, offset = 0) => {
                        if (active) return;
                        if (Date.now() < gateSkipUntilRef.current) return;
                        active = true;
                        accum  = 0;
                        touchStartY = -1; // wait for the NEXT fresh touch
                        
                        // Apply safety offset and forcefully lock
                        lockScrollAt(lockPos + offset);
                        
                        // Force momentum kill for mobile
                        document.body.style.overflow = 'hidden';
                        document.body.style.touchAction = 'none';
                        
                        // Prevent scroll theft by iframes/textareas without blocking overall hovers
                        document.querySelectorAll('iframe, textarea').forEach(el => el.style.pointerEvents = 'none');
                        
                        // Use capture: true to intercept events BEFORE Lenis gets them!
                        // This prevents Lenis from adding velocity before we can preventDefault.
                        window.addEventListener('wheel', onWheel, { passive: false, capture: true });
                        window.addEventListener('touchstart', onTouchStart, { passive: true, capture: true });
                        window.addEventListener('touchmove', onTouchMove, { passive: false, capture: true });
                    },
                    deactivate: () => { if (active) release(false); },
                };
            };

            // ── Gate 0: HowItWorks ──► Customization (scroll DOWN) ────────
            const hiwSection = document.querySelector('.how-it-works-section');
            const custSection = document.querySelector('.customization');

            if (hiwSection && custSection) {
                const fwdGate = createGate(
                    'down',
                    () => {
                        if (window._hiwTriggered) return;
                        window._hiwTriggered = true;
                        const jumpPos = getTriggerPos('backward-cust-hiw', 'start') + 10;
                        transitionRef.current?.playTransition(
                            () => {
                                window.scrollTo({ top: jumpPos, behavior: 'instant' });
                                if (window.lenis) {
                                    window.lenis.start();
                                    window.lenis.scrollTo(jumpPos, { immediate: true });
                                    window.lenis.stop();
                                }
                            },
                            'forward',
                            () => {
                                if (window.lenis) window.lenis.start();
                                document.body.style.overflow = '';
                                document.body.style.touchAction = '';
                                window._hiwTriggered = false;
                            }
                        );
                    }
                );
                allGates.push(fwdGate);

                const bkGate = createGate(
                    'up',
                    () => {
                        if (window._hiwTriggered) return;
                        window._hiwTriggered = true;
                        const jumpPos = getTriggerPos('forward-hiw-cust', 'start') - 10;
                        transitionRef.current?.playTransition(
                            () => {
                                window.scrollTo({ top: jumpPos, behavior: 'instant' });
                                if (window.lenis) {
                                    window.lenis.start();
                                    window.lenis.scrollTo(jumpPos, { immediate: true });
                                    window.lenis.stop();
                                }
                            },
                            'backward',
                            () => {
                                if (window.lenis) window.lenis.start();
                                document.body.style.overflow = '';
                                document.body.style.touchAction = '';
                                window._hiwTriggered = false;
                            }
                        );
                    }
                );
                allGates.push(bkGate);

                ScrollTrigger.create({
                    id: 'forward-hiw-cust',
                    trigger: custSection,
                    start: 'top bottom',
                    onEnter: (self) => fwdGate.activate(self.start, 2),
                    onLeaveBack: fwdGate.deactivate,
                });

                ScrollTrigger.create({
                    id: 'backward-cust-hiw',
                    trigger: custSection,
                    start: 'top top',
                    onLeaveBack: (self) => bkGate.activate(self.start, -2),
                    onEnter: bkGate.deactivate,
                });
            }

            // ── Gate 1: SocialProof ──► CTA (scroll DOWN) ─────────────────
            if (socialProof && bigCta) {
                const fwdGate = createGate(
                    'down',
                    () => {
                        if (window._curtainTriggered) return;
                        window._curtainTriggered = true;
                        const jumpPos = getTriggerPos('backward-cta-sp', 'start') + 10;
                        transitionRef.current?.playCurtainTransition(
                            () => {
                                window.scrollTo({ top: jumpPos, behavior: 'instant' });
                                if (window.lenis) {
                                    window.lenis.start();
                                    window.lenis.scrollTo(jumpPos, { immediate: true });
                                    window.lenis.stop();
                                }
                            },
                            'forward',
                            () => {
                                if (window.lenis) window.lenis.start();
                                document.body.style.overflow = '';
                                document.body.style.touchAction = '';
                                window._curtainTriggered = false;
                            }
                        );
                    }
                );
                allGates.push(fwdGate);

                // Gate 1 reverse: CTA ──► SocialProof (scroll UP)
                const bkGate = createGate(
                    'up',
                    () => {
                        if (window._curtainTriggered) return;
                        window._curtainTriggered = true;
                        const jumpPos = getTriggerPos('forward-sp-cta', 'start') - 10;
                        transitionRef.current?.playCurtainTransition(
                            () => {
                                window.scrollTo({ top: jumpPos, behavior: 'instant' });
                                if (window.lenis) {
                                    window.lenis.start();
                                    window.lenis.scrollTo(jumpPos, { immediate: true });
                                    window.lenis.stop();
                                }
                            },
                            'backward',
                            () => {
                                if (window.lenis) window.lenis.start();
                                document.body.style.overflow = '';
                                document.body.style.touchAction = '';
                                window._curtainTriggered = false;
                            }
                        );
                    }
                );
                allGates.push(bkGate);

                // Fires when BigCTA's top reaches the BOTTOM of the viewport
                ScrollTrigger.create({
                    id: 'forward-sp-cta',
                    trigger: bigCta,
                    start: 'top bottom',
                    // +2 safety offset ensures we are safely INSIDE the trigger area
                    onEnter: (self) => fwdGate.activate(self.start, 2),
                    onLeaveBack: fwdGate.deactivate,
                });

                // Fires when BigCTA's top scrolls back above the TOP of the viewport
                ScrollTrigger.create({
                    id: 'backward-cta-sp',
                    trigger: bigCta,
                    start: 'top top',
                    // -2 safety offset ensures we are safely OUTSIDE (above) the trigger area
                    onLeaveBack: (self) => bkGate.activate(self.start, -2),
                    onEnter: bkGate.deactivate,
                });
            }

            // ── Gate 2: CTA ──► FAQ (scroll DOWN) ────────────────────────
            if (bigCta && faqSection) {
                const fwdGate = createGate(
                    'down',
                    () => {
                        if (window._archiveTriggered) return;
                        window._archiveTriggered = true;
                        const jumpPos = getTriggerPos('backward-faq-cta', 'start') + 10;
                        transitionRef.current?.playArchiveTransition(
                            () => {
                                window.scrollTo({ top: jumpPos, behavior: 'instant' });
                                if (window.lenis) {
                                    window.lenis.start();
                                    window.lenis.scrollTo(jumpPos, { immediate: true });
                                    window.lenis.stop();
                                }
                            },
                            () => {
                                if (window.lenis) window.lenis.start();
                                document.body.style.overflow = '';
                                document.body.style.touchAction = '';
                                window._archiveTriggered = false;
                            }
                        );
                    }
                );
                allGates.push(fwdGate);

                // Gate 2 reverse: FAQ ──► CTA (scroll UP)
                const bkGate = createGate(
                    'up',
                    () => {
                        if (window._archiveTriggered) return;
                        window._archiveTriggered = true;
                        const jumpPos = getTriggerPos('forward-cta-faq', 'start') - 10;
                        transitionRef.current?.playArchiveTransition(
                            () => {
                                window.scrollTo({ top: jumpPos, behavior: 'instant' });
                                if (window.lenis) {
                                    window.lenis.start();
                                    window.lenis.scrollTo(jumpPos, { immediate: true });
                                    window.lenis.stop();
                                }
                            },
                            () => {
                                if (window.lenis) window.lenis.start();
                                document.body.style.overflow = '';
                                document.body.style.touchAction = '';
                                window._archiveTriggered = false;
                            }
                        );
                    }
                );
                allGates.push(bkGate);

                // Fires when FAQ enters the viewport from the bottom
                ScrollTrigger.create({
                    id: 'forward-cta-faq',
                    trigger: faqSection,
                    start: 'top bottom',
                    // +2 safety offset
                    onEnter: (self) => fwdGate.activate(self.start, 2),
                    onLeaveBack: fwdGate.deactivate,
                });

                // Fires when FAQ's top scrolls back above the TOP of the viewport
                ScrollTrigger.create({
                    id: 'backward-faq-cta',
                    trigger: faqSection,
                    start: 'top top',
                    // -2 safety offset
                    onLeaveBack: (self) => bkGate.activate(self.start, -2),
                    onEnter: bkGate.deactivate,
                });
            }

            return true;
        };

        const t1 = setTimeout(initTriggers, 600);
        const t2 = setTimeout(initTriggers, 1800);
        const t3 = setTimeout(initTriggers, 3500);

        return () => {
            clearTimeout(t1); clearTimeout(t2); clearTimeout(t3);

            // Deactivate all gates — removes the stray touchmove/wheel
            // window listeners that would block scroll on other pages
            releaseLandingScrollLocks();
            landingGatesRef.current = [];

            // Kill all ScrollTriggers created by this page
            ['forward-hiw-cust', 'backward-cust-hiw',
             'forward-sp-cta', 'backward-cta-sp',
             'forward-cta-faq', 'backward-faq-cta'].forEach(id => {
                ScrollTrigger.getById(id)?.kill();
            });

            window.lenis?.off('scroll', handleScrollDirection);

            if (window.releaseLandingScrollLocks === releaseLandingScrollLocks) {
                delete window.releaseLandingScrollLocks;
            }
        };
    }, []);

    return (
        <>
            {/* Global Scroll Indicator (Triple Chevron) */}
            <div className="global-scroll-indicator" id="globalScrollIndicator">
                <span></span>
                <span></span>
                <span></span>
            </div>

            <style>{`
                .global-scroll-indicator {
                    position: fixed;
                    bottom: 40px;
                    right: 40px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 8px;
                    z-index: 2147483647;
                    pointer-events: none;
                    opacity: 0.7;
                    transition: transform 0.6s cubic-bezier(0.23, 1, 0.32, 1), opacity 0.5s ease;
                }

                .global-scroll-indicator.scrolling-up {
                    transform: rotate(180deg);
                }

                .global-scroll-indicator span {
                    display: block;
                    width: 20px;
                    height: 20px;
                    border-bottom: 3px solid #ec4899;
                    border-right: 3px solid #ec4899;
                    transform: rotate(45deg);
                    animation: scroll-arrow 2s infinite;
                    box-shadow: 2px 2px 5px rgba(0,0,0,0.2);
                    filter: drop-shadow(0 0 5px rgba(236, 72, 153, 0.5));
                }

                .global-scroll-indicator span:nth-child(2) {
                    animation-delay: -0.2s;
                }

                .global-scroll-indicator span:nth-child(3) {
                    animation-delay: -0.4s;
                }

                @keyframes scroll-arrow {
                    0% {
                        opacity: 0;
                        transform: rotate(45deg) translate(-10px, -10px);
                    }
                    50% {
                        opacity: 1;
                    }
                    100% {
                        opacity: 0;
                        transform: rotate(45deg) translate(10px, 10px);
                    }
                }
            `}</style>

            <HeroSection />

            <Suspense fallback={null}>
                <CategoriesCarousel />
            </Suspense>
            <Suspense fallback={null}>
                <HowItWorks />
            </Suspense>

            <Suspense fallback={null}>
                <Customization />
            </Suspense>
            <Suspense fallback={null}>
                <SectionTransition ref={transitionRef} />
            </Suspense>
            <Suspense fallback={null}>
                <SocialProof />
            </Suspense>
            <Suspense fallback={null}>
                <BigCta />
            </Suspense>
            <Suspense fallback={null}>
                <FAQ />
            </Suspense>
            <Suspense fallback={null}>
                <Footer />
            </Suspense>
        </>
    )
}

export default LandingPage
