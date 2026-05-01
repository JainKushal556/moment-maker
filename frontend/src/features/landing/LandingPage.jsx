import { lazy, Suspense, useRef, useEffect } from 'react'
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

    useEffect(() => {
        // Wait for DOM and components to mount
        const timer = setTimeout(() => {
            const socialProof = document.querySelector('.social-proof-wrapper');
            const bigCta = document.querySelector('.big-cta');
            const faqSection = document.querySelector('.faq-section');

            if (socialProof && bigCta) {
                // Trigger 1: Forward from Social Proof to Big CTA
                ScrollTrigger.create({
                    id: "forward-sp-cta",
                    trigger: ".social-proof-wrapper",
                    start: "top top",
                    end: "bottom bottom",
                    onLeave: () => {
                        if (window._curtainTriggered) return;
                        window._curtainTriggered = true;

                        const snapPos = socialProof.offsetTop + socialProof.offsetHeight - window.innerHeight;
                        if (window.lenis) {
                            window.lenis.stop();
                            window.lenis.scrollTo(snapPos, { immediate: true });
                        } else {
                            document.body.style.overflow = 'hidden';
                            window.scrollTo({ top: snapPos, behavior: 'instant' });
                        }

                        if (transitionRef.current) {
                            transitionRef.current.playCurtainTransition(
                                () => {
                                    if (window.lenis) {
                                        window.lenis.start();
                                        window.lenis.scrollTo(bigCta, { immediate: true });
                                        window.lenis.stop();
                                    } else {
                                        const rect = bigCta.getBoundingClientRect();
                                        window.scrollTo({ top: rect.top + window.scrollY, behavior: 'instant' });
                                    }
                                },
                                () => {
                                    if (window.lenis) window.lenis.start();
                                    else document.body.style.overflow = '';
                                    window._curtainTriggered = false;
                                }
                            );
                        }
                    }
                });

                // Trigger 2: Backward from Big CTA to Social Proof
                ScrollTrigger.create({
                    id: "backward-cta-sp",
                    trigger: ".big-cta",
                    start: "top 5%",
                    onLeaveBack: () => {
                        if (window._curtainTriggered) return;
                        window._curtainTriggered = true;

                        const snapPos = bigCta.offsetTop;
                        if (window.lenis) {
                            window.lenis.stop();
                            window.lenis.scrollTo(snapPos, { immediate: true });
                        } else {
                            document.body.style.overflow = 'hidden';
                            window.scrollTo({ top: snapPos, behavior: 'instant' });
                        }

                        if (transitionRef.current) {
                            transitionRef.current.playCurtainTransition(
                                () => {
                                    if (window.lenis) {
                                        window.lenis.start();
                                        window.lenis.scrollTo(socialProof, { immediate: true });
                                        window.lenis.stop();
                                    } else {
                                        const rect = socialProof.getBoundingClientRect();
                                        window.scrollTo({ top: rect.top + window.scrollY, behavior: 'instant' });
                                    }
                                },
                                () => {
                                    if (window.lenis) window.lenis.start();
                                    else document.body.style.overflow = '';
                                    window._curtainTriggered = false;
                                }
                            );
                        }
                    }
                });
            }

            if (bigCta && faqSection) {
                // Trigger 3: Forward from Big CTA to FAQ
                ScrollTrigger.create({
                    id: "forward-cta-faq",
                    trigger: ".big-cta",
                    start: "top top",
                    end: "bottom bottom",
                    onLeave: () => {
                        if (window._archiveTriggered) return;
                        window._archiveTriggered = true;

                        const snapPos = bigCta.offsetTop + bigCta.offsetHeight - window.innerHeight;
                        if (window.lenis) {
                            window.lenis.stop();
                            window.lenis.scrollTo(snapPos, { immediate: true });
                        } else {
                            document.body.style.overflow = 'hidden';
                            window.scrollTo({ top: snapPos, behavior: 'instant' });
                        }

                        if (transitionRef.current) {
                            transitionRef.current.playArchiveTransition(
                                () => {
                                    if (window.lenis) {
                                        window.lenis.start();
                                        window.lenis.scrollTo(faqSection, { immediate: true });
                                        window.lenis.stop();
                                    } else {
                                        const targetPos = faqSection.offsetTop;
                                        window.scrollTo({ top: targetPos, behavior: 'instant' });
                                    }
                                },
                                () => {
                                    if (window.lenis) window.lenis.start();
                                    else document.body.style.overflow = '';
                                    window._archiveTriggered = false;
                                }
                            );
                        }
                    }
                });

                // Trigger 4: Backward from FAQ to Big CTA
                ScrollTrigger.create({
                    id: "backward-faq-cta",
                    trigger: ".faq-section",
                    start: "top 5%",
                    onLeaveBack: () => {
                        if (window._archiveTriggered) return;
                        window._archiveTriggered = true;

                        const snapPos = faqSection.offsetTop;
                        if (window.lenis) {
                            window.lenis.stop();
                            window.lenis.scrollTo(snapPos, { immediate: true });
                        } else {
                            document.body.style.overflow = 'hidden';
                            window.scrollTo({ top: snapPos, behavior: 'instant' });
                        }

                        if (transitionRef.current) {
                            transitionRef.current.playArchiveTransition(
                                () => {
                                    if (window.lenis) {
                                        window.lenis.start();
                                        const targetPos = bigCta.offsetTop + bigCta.offsetHeight - window.innerHeight;
                                        window.lenis.scrollTo(targetPos, { immediate: true });
                                        window.lenis.stop();
                                    } else {
                                        const targetPos = bigCta.offsetTop + bigCta.offsetHeight - window.innerHeight;
                                        window.scrollTo({ top: targetPos, behavior: 'instant' });
                                    }
                                },
                                () => {
                                    if (window.lenis) window.lenis.start();
                                    else document.body.style.overflow = '';
                                    window._archiveTriggered = false;
                                }
                            );
                        }
                    }
                });
            }
        }, 500);

        return () => {
            clearTimeout(timer);
            ScrollTrigger.getById("forward-sp-cta")?.kill();
            ScrollTrigger.getById("backward-cta-sp")?.kill();
            ScrollTrigger.getById("forward-cta-faq")?.kill();
            ScrollTrigger.getById("backward-faq-cta")?.kill();
        };
    }, []);

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
