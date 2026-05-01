import { lazy, Suspense, useRef, useEffect } from 'react'

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
    const isScrollLocked = useRef(false); // single source of truth for lock

    // Single persistent Lenis scroll listener installed once
    useEffect(() => {
        // Proactive block: intercept upward wheel events before Lenis processes them
        // This eliminates the tug-of-war jitter caused by the reactive scroll correction
        const wheelHandler = (e) => {
            if (!isScrollLocked.current) return;
            if (e.deltaY < 0) {
                e.preventDefault();
                e.stopPropagation();
                // Hint user to use the Back button
                const backBtn = document.querySelector('.back-to-steps');
                if (backBtn && !backBtn.classList.contains('btn-blink')) {
                    backBtn.classList.add('btn-blink');
                    setTimeout(() => backBtn.classList.remove('btn-blink'), 1000);
                }
            }
        };
        window.addEventListener('wheel', wheelHandler, { passive: false });

        const waitForLenis = setInterval(() => {
            if (!window.lenis) return;
            clearInterval(waitForLenis);

            window.lenis.on('scroll', ({ scroll }) => {
                if (!isScrollLocked.current) return;
                const custSection = document.querySelector('.customization');
                if (!custSection) return;
                const sectionTop = custSection.offsetTop;
                if (scroll < sectionTop - 5) {
                    window.lenis.scrollTo(sectionTop, { immediate: true });
                }
            });
        }, 100);

        return () => {
            clearInterval(waitForLenis);
            window.removeEventListener('wheel', wheelHandler);
        };
    }, []);

    const handleHiwTransition = () => {
        const studioElement = document.getElementById('the-studio');

        if (transitionRef.current) {
            transitionRef.current.playTransition(
                () => {
                    if (studioElement) {
                        if (window.lenis) {
                            window.lenis.start();
                            window.lenis.scrollTo(studioElement, { immediate: true });
                            window.lenis.stop();
                        } else {
                            const rect = studioElement.getBoundingClientRect();
                            window.scrollTo({ top: rect.top + window.scrollY, behavior: 'instant' });
                        }
                    }
                },
                'forward',
                () => {
                    if (window.lenis) window.lenis.start();
                    else document.body.style.overflow = '';
                    // Activate the lock
                    isScrollLocked.current = true;
                }
            );
        }
    };

    const handleCustomizationTransitionBack = () => {
        const prevSection = document.querySelector('.how-it-works-section');

        // Deactivate lock BEFORE doing anything else
        isScrollLocked.current = false;
        // Block the HIW ScrollTrigger so it doesn't re-fire during the back scroll jump
        window._hiwTransitionBlocked = true;

        if (window.lenis) window.lenis.stop();
        else document.body.style.overflow = 'hidden';

        if (transitionRef.current) {
            transitionRef.current.playTransition(
                () => {
                    if (prevSection) {
                        const rect = prevSection.getBoundingClientRect();
                        const absoluteTop = rect.top + window.scrollY;
                        const jumpPos = absoluteTop + rect.height - window.innerHeight * 1.8;
                        if (window.lenis) {
                            window.lenis.start();
                            window.lenis.scrollTo(jumpPos, { immediate: true });
                            window.lenis.stop();
                        } else {
                            window.scrollTo({ top: jumpPos, behavior: 'instant' });
                        }
                    }
                    // Unblock after reveal animation completes (~0.8s) + buffer
                    setTimeout(() => { window._hiwTransitionBlocked = false; }, 1000);
                },
                'backward'
            );
        }
    };

    return (
        <>
            <HeroSection />

            <Suspense fallback={null}>
                <CategoriesCarousel />
            </Suspense>
            <Suspense fallback={null}>
                <HowItWorks onTransition={handleHiwTransition} />
            </Suspense>

            <Suspense fallback={null}>
                <Customization onTransitionBack={handleCustomizationTransitionBack} />
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
