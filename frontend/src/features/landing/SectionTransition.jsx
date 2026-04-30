import { forwardRef, useImperativeHandle, useRef } from 'react'
import gsap from 'gsap'
import '../../styles/sectionTransition.css'

const SectionTransition = forwardRef((props, ref) => {
    const overlayRef = useRef(null)
    const isTransitioning = useRef(false)

    useImperativeHandle(ref, () => ({
        playTransition: (onCover, direction = 'forward', onReveal) => {
            if (isTransitioning.current) return;
            isTransitioning.current = true;

            // Freeze scroll to prevent momentum scrolling during wipe
            if (window.lenis) window.lenis.stop();
            else document.body.style.overflow = 'hidden';

            const tl = gsap.timeline();
            const overlay = overlayRef.current;

            // Set initial state for backward
            if (direction === 'backward') {
                gsap.set(overlay, { 
                    xPercent: 0, 
                    translateX: '100%',
                    borderTopLeftRadius: "50vh",
                    borderBottomLeftRadius: "50vh",
                    borderTopRightRadius: 0,
                    borderBottomRightRadius: 0
                });
            }

            // Phase 1: Slide In (Cover)
            tl.to(overlay, {
                xPercent: direction === 'backward' ? -100 : 100,
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0,
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
                duration: 0.8,
                ease: "power2.inOut",
                onComplete: () => {
                    if (onCover) onCover();
                }
            });

            // Phase 2: Slide Out (Reveal)
            tl.to(overlay, {
                xPercent: direction === 'backward' ? -200 : 200,
                borderTopRightRadius: direction === 'backward' ? "50vh" : 0,
                borderBottomRightRadius: direction === 'backward' ? "50vh" : 0,
                borderTopLeftRadius: direction === 'backward' ? 0 : "50vh",
                borderBottomLeftRadius: direction === 'backward' ? 0 : "50vh",
                duration: 0.8,
                ease: "power2.inOut",
                onComplete: () => {
                    // Reset position for next time
                    gsap.set(overlay, { 
                        xPercent: 0, 
                        translateX: '-100%',
                        borderTopRightRadius: "50vh",
                        borderBottomRightRadius: "50vh",
                        borderTopLeftRadius: 0,
                        borderBottomLeftRadius: 0
                    });

                    // Unlock or hand off to caller
                    setTimeout(() => {
                        if (onReveal) {
                            onReveal(); // caller decides what to do
                        } else {
                            if (window.lenis) window.lenis.start();
                            else document.body.style.overflow = '';
                        }
                        isTransitioning.current = false;
                    }, 50);
                }
            });
        }
    }));

    return (
        <div 
            className="transition-overlay" 
            ref={overlayRef}
            aria-hidden="true"
        ></div>
    );
});

export default SectionTransition;
