import { forwardRef, useImperativeHandle, useRef } from 'react'
import gsap from 'gsap'
import '../../styles/sectionTransition.css'

const SectionTransition = forwardRef((props, ref) => {
    const overlayRef = useRef(null)
    const curtainRef = useRef(null)
    const textRef = useRef(null)
    const archiveRef = useRef(null)
    const archivePathRef = useRef(null)
    const isTransitioning = useRef(false)

    useImperativeHandle(ref, () => ({
        playArchiveTransition: (onCover, onReveal) => {
            if (isTransitioning.current) return;
            isTransitioning.current = true;

            if (window.lenis) window.lenis.stop();
            else document.body.style.overflow = 'hidden';

            const tl = gsap.timeline();
            const archive = archiveRef.current;
            const path = archivePathRef.current;
            
            // Calculate path length for stroke dash animation
            const length = path.getTotalLength();
            
            const isMobile = window.innerWidth <= 768;
            const startWidth = isMobile ? 35 : 100;
            const targetWidth = isMobile ? 650 : 1000; // 650 is enough to cover mobile screen

            // Set initial state
            gsap.set(archive, { visibility: 'visible' });
            gsap.set(path, { 
                strokeDasharray: length, 
                strokeDashoffset: length, 
                strokeWidth: startWidth, 
                opacity: 0 
            });

            // Phase 1: Draw and Expand (Cover)
            tl.to(path, {
                opacity: 1,
                duration: 0.5,
            })
            .to(path, {
                strokeDashoffset: 0,
                duration: 1.4,
                ease: 'sine.inOut'
            }, '<')
            .to(path, {
                strokeWidth: targetWidth, 
                duration: 1.4,
                ease: 'sine.inOut',
                onComplete: () => {
                    if (onCover) onCover();
                }
            }, '<+=0.18');

            // Phase 2: Erase and Contract (Reveal)
            tl.to(path, {
                strokeWidth: 100,
                duration: 1.0,
                ease: 'sine.inOut'
            })
            .to(path, {
                strokeDashoffset: -length,
                duration: 1.0,
                ease: 'sine.inOut',
                onComplete: () => {
                    // Reset and hide
                    gsap.set(archive, { visibility: 'hidden' });
                    
                    setTimeout(() => {
                        if (onReveal) {
                            onReveal();
                        } else {
                            if (window.lenis) window.lenis.start();
                            else document.body.style.overflow = '';
                        }
                        isTransitioning.current = false;
                    }, 50);
                }
            }, '<+=0.45');
        },
        playCurtainTransition: (onCover, onReveal) => {
            if (isTransitioning.current) return;
            isTransitioning.current = true;

            // Freeze scroll to prevent momentum scrolling during wipe
            if (window.lenis) window.lenis.stop();
            else document.body.style.overflow = 'hidden';

            const tl = gsap.timeline();
            const curtain = curtainRef.current;
            const text = textRef.current;

            // Ensure initial state
            // Ensure initial state: zero-width but with thickness (solid stripe)
            gsap.set(curtain, { 
                clipPath: "polygon(0% 47%, 0% 47%, 0% 53%, 0% 53%)" 
            });
            gsap.set(text, { opacity: 0, y: 10 });

            // Step 1: Draw horizontally from left to right as a solid stripe
            tl.to(curtain, {
                clipPath: "polygon(0% 47%, 100% 47%, 100% 53%, 0% 53%)",
                duration: 0.6,
                ease: "power2.inOut"
            })
            // Step 2: Show text
            .to(text, {
                opacity: 1,
                y: 0,
                duration: 0.3,
                ease: "power2.out"
            }, "-=0.2")
            // Step 3: Expand vertically (Cover)
            .to(curtain, {
                clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
                duration: 0.6,
                ease: "power2.inOut",
                onComplete: () => {
                    if (onCover) onCover();
                }
            })
            // Step 4: Hide text before reveal
            .to(text, {
                opacity: 0,
                duration: 0.3,
                ease: "power2.in"
            });

            // Phase 2: Slide out towards the top (Reveal)
            tl.to(curtain, {
                clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
                duration: 0.8,
                ease: "power2.inOut",
                onComplete: () => {
                    // Reset position for next time
                    gsap.set(curtain, { 
                        clipPath: "polygon(0% 47%, 0% 47%, 0% 53%, 0% 53%)" 
                    });

                    // Unlock or hand off to caller
                    setTimeout(() => {
                        if (onReveal) {
                            onReveal();
                        } else {
                            if (window.lenis) window.lenis.start();
                            else document.body.style.overflow = '';
                        }
                        isTransitioning.current = false;
                    }, 50);
                }
            });
        },
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
        <>
            <div 
                className="transition-overlay" 
                ref={overlayRef}
                aria-hidden="true"
            ></div>
            <div 
                className="curtain-overlay" 
                ref={curtainRef}
                aria-hidden="true"
            >
                <div className="curtain-text" ref={textRef}>
                    Start Crafting
                </div>
            </div>
            <div 
                className="archive-overlay" 
                ref={archiveRef}
                aria-hidden="true"
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="-360 -360 760 760" preserveAspectRatio="xMidYMid slice">
                    <defs>
                        <linearGradient id="momentsGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#d946ef" />
                            <stop offset="50%" stopColor="#f472b6" />
                            <stop offset="100%" stopColor="#fb923c" />
                        </linearGradient>
                    </defs>
                    <path 
                        ref={archivePathRef}
                        d="m0 0c3.36 0.06 6.6-2.82 7.07-7.07 0.59-4.19-1.79-9.6-7.07-12.93-5.18-3.4-13.27-4.43-21.21-1.21-7.92 3.09-15.48 10.7-18.79 21.21-3.42 10.46-2.3 23.68 4.64 35.36 6.83 11.64 19.57 21.35 35.36 24.64 15.69 3.43 34.14 0.2 49.5-10.5 15.38-10.52 27.21-28.47 30.5-49.5 3.43-20.92-1.92-44.6-16.36-63.64-14.2-19.1-37.37-33.1-63.64-36.36-26.16-3.45-55.05 4.06-77.78 22.22-22.82 17.9-38.98 46.25-42.22 77.78-3.48 31.43 6.2 65.49 28.08 91.92 21.58 26.55 55.16 44.87 91.92 48.08 36.66 3.5 75.94-8.33 106.07-33.93 30.27-25.28 50.74-64.07 53.93-106.07 3.53-41.9-10.46-86.4-39.79-120.21-28.97-33.99-72.97-56.62-120.21-59.79-47.13-3.56-96.85 12.6-134.35 45.65-37.71 32.65-62.51 81.88-65.65 134.35-3.55 52.4 14.72 107.29 51.51 148.49 36.35 41.41 90.75 68.41 148.49 71.51 57.63 3.58 117.75-16.86 162.63-57.37 45.14-40.03 74.29-99.66 77.37-162.63 3.62-62.86-19.02-128.21-63.22-176.78-43.73-48.85-108.57-80.17-176.78-83.22-68.13-3.64-138.65 21.15-190.92 69.08-52.57 47.43-86.06 117.45-89.08 190.92-3.66 73.36 23.29 149.1 74.94 205.06 51.12 56.3 126.35 91.94 205.06 94.94 78.6 3.69 159.56-25.42 219.2-80.8 60.03-54.8 97.82-135.26 100.8-219.2 3.72-83.84-27.56-170.01-86.65-233.35-58.51-63.77-144.14-103.69-233.35-106.65-89.07-3.71-180.46 29.68-247.49 92.51-67.51 62.18-109.54 153.08-112.51 247.49-3.74 94.33 31.82 190.91 98.37 261.63 65.88 71.23 161.96 115.43 261.63 118.37 99.57 3.76 201.36-33.95 275.77-104.23 74.96-69.57 121.31-170.86 124.23-275.77" 
                        fill="none" 
                        stroke="none" 
                        strokeWidth="100" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        vectorEffect="non-scaling-stroke"
                    />
                </svg>
            </div>
        </>
    );
});

export default SectionTransition;
