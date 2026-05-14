import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useContext, useRef, useEffect, useState } from 'react'
import { NavbarContext, ViewContext } from '../context/NavContext'
import { useAuth } from '../context/AuthContext'
import logo from '../assets/logo.png'

// Cinematic image placeholders built to fit the Moment Crafter vibe
const cinematicImgs = [
    "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1517404215738-15263e9f9178?q=80&w=800&auto=format&fit=crop"
]

const FullScreenNav = ({ requireAuth }) => {
    const [hoveredIndex, setHoveredIndex] = useState(null)
    const ribbonRef = useRef(null)
    const ribbonContentRef = useRef(null)
    const fullNavLinksRef = useRef(null)
    const fullScreenRef = useRef(null)
    const tlRef = useRef(null)
    const viewSwitchTimeoutRef = useRef(null)
    const mobileNavActionTimeoutRef = useRef(null)
    const [activeMobileItem, setActiveMobileItem] = useState(null)
    const [isDesktop, setIsDesktop] = useState(typeof window !== 'undefined' ? window.innerWidth >= 1024 : true)

    useEffect(() => {
        const handleResize = () => setIsDesktop(window.innerWidth >= 1024)
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    useEffect(() => {
        if (hoveredIndex !== null && ribbonRef.current && ribbonContentRef.current) {
            const isOutOfBound = hoveredIndex === -1 || hoveredIndex === 4;

            gsap.to(ribbonRef.current, {
                top: `${hoveredIndex * 25}%`,
                duration: 0.35,
                ease: "expo.out",
                opacity: isOutOfBound ? 0 : 1,
                overwrite: "auto"
            })
            
            if (!isOutOfBound) {
                gsap.to(ribbonContentRef.current, {
                    yPercent: -hoveredIndex * 100,
                    duration: 0.35,
                    ease: "expo.out",
                    overwrite: "auto"
                })
            }
        } else if (ribbonRef.current) {
            gsap.to(ribbonRef.current, {
                opacity: 0,
                duration: 0.35,
                overwrite: "auto"
            })
        }
    }, [hoveredIndex])

    const [navOpen, setNavOpen] = useContext(NavbarContext)
    const [currentView, navigateTo, , , , , , , , , , , , setCurrentView] = useContext(ViewContext)
    const { currentUser } = useAuth()

    // Build the master timeline once
    useGSAP(() => {
        const tl = gsap.timeline({
            paused: true,
            defaults: { overwrite: "auto" },
            onReverseComplete: () => {
                // Fully hide the nav element after reverse so it can't block anything
                gsap.set('.fullscreennav', { display: 'none' })
            }
        })

        tl.to('.fullscreennav', {
            display: 'block'
        }, 0)
        tl.fromTo('.nav-logo',
            { y: -50, opacity: 0 },
            {
                duration: 0.6,
                opacity: 1,
                y: 0,
                ease: "power3.out"
            }, 0.1)
        tl.fromTo('.navlink', 
            { x: 30, opacity: 0 },
            {
                duration: 0.6,
                opacity: 1,
                x: 0,
                ease: "power3.out"
            }, 0.1)
        tl.to('.stairing', {
            duration: 0.8,
            height: '100%',
            stagger: {
                amount: 0.1
            },
            ease: "expo.out"
        }, 0)
        tl.to('.nav-ribbon-mask', {
            duration: 0.4,
            opacity: 1,
            ease: "power3.out"
        }, 0.3)
        tl.to('.link', {
            duration: 0.6,
            opacity: 1,
            rotateX: 0,
            stagger: {
                amount: 0.2
            },
            ease: "power3.out"
        }, 0.2)
        tl.to('.nav-footer', {
            duration: 0.6,
            opacity: 1,
            y: 0,
            ease: "power3.out"
        }, 0.3)

        tlRef.current = tl
    }, [])

    // Smoothly play and reverse the master timeline to prevent glitching/fighting
    useEffect(() => {
        if (!tlRef.current) return

        if (navOpen) {
            if (window.lenis) window.lenis.stop()
            tlRef.current.timeScale(1).play()
        } else {
            if (window.lenis) window.lenis.start()
            setHoveredIndex(null) // Immediate reset on close start
            tlRef.current.timeScale(2).reverse()
        }
    }, [navOpen])

    useEffect(() => {
        return () => {
            if (viewSwitchTimeoutRef.current) clearTimeout(viewSwitchTimeoutRef.current)
            if (mobileNavActionTimeoutRef.current) clearTimeout(mobileNavActionTimeoutRef.current)
        }
    }, [])

    useEffect(() => {
        if (!navOpen) {
            setActiveMobileItem(null)
            setHoveredIndex(null)
            if (mobileNavActionTimeoutRef.current) clearTimeout(mobileNavActionTimeoutRef.current)
        }
    }, [navOpen])

    const closeNavAndSwitch = (nextView) => {
        // Use transition-aware navigation
        navigateTo(nextView)
        setNavOpen(false)
    }

    const triggerNavAction = (action, id) => {
        const isMobileViewport = typeof window !== 'undefined' && window.innerWidth < 768

        if (!isMobileViewport) {
            action()
            return
        }

        setHoveredIndex(id)
        setActiveMobileItem(id)

        if (mobileNavActionTimeoutRef.current) clearTimeout(mobileNavActionTimeoutRef.current)
        mobileNavActionTimeoutRef.current = setTimeout(() => {
            action()
            setActiveMobileItem(null)
        }, 180)
    }

    const handleHomeAction = () => {
        if (window.lenis) window.lenis.start()

        // Start closing the nav immediately
        setNavOpen(false)

        // Use navigateTo for history and transition support
        navigateTo('landing')
    }

    // Navigation items with their view actions
    const navItems = [
        {
            title: "Home",
            label: "Return Home",
            action: handleHomeAction
        },
        { 
            title: "Categories", 
            label: "Explore Categories", 
            action: () => { 
                sessionStorage.removeItem('explorerInternalView')
                sessionStorage.removeItem('explorerSelectedCategory')
                closeNavAndSwitch('categories') 
            } 
        },
        {
            title: "My Moments",
            label: "Your Archive",
            action: () => {
                if (currentUser) {
                    closeNavAndSwitch('moments')
                } else {
                    setNavOpen(false)
                    // Give nav time to close, then open auth modal
                    setTimeout(() => {
                        requireAuth?.(() => navigateTo('moments'))
                    }, 280)
                }
            }
        },
        { title: "About Us", label: "Our Story", action: () => { closeNavAndSwitch('about') } }
    ]

    return (
        <div ref={fullScreenRef} className='fullscreennav hidden text-white fixed inset-0 w-full h-full z-[9999]'>
            <div className='fixed inset-0 w-full h-full pointer-events-none'>
                <div className='h-full w-full flex'>
                    {/* Stairing backgrounds using the deep space color styling */}
                    <div className='stairing h-0 w-1/5 bg-[#050508]'></div>
                    <div className='stairing h-0 w-1/5 bg-[#050508]'></div>
                    <div className='stairing h-0 w-1/5 bg-[#050508]'></div>
                    <div className='stairing h-0 w-1/5 bg-[#050508]'></div>
                    <div className='stairing h-0 w-1/5 bg-[#050508]'></div>
                </div>
            </div>

            {/* Scrollable area for the links and footer */}
            <div
                ref={fullNavLinksRef}
                onMouseLeave={() => setHoveredIndex(null)}
                className='relative h-full w-full flex flex-col justify-center lg:justify-start overflow-hidden z-20'
            >
                {/* Logo in top-left: Stylized 'Moment Crafter' */}
                <div className='nav-logo opacity-0 absolute left-4 lg:left-4 top-[4vw] lg:top-[1.8%] -translate-y-1/2 z-[101] pointer-events-none flex items-center gap-4'>
                    {/* Logo with rotating border */}
                    <div className="relative h-20 lg:h-23 aspect-square rounded-full overflow-hidden p-[2px] shadow-[0_0_20px_rgba(217,70,239,0.3)]">
                        {/* Rotating Gradient Layer */}
                        <div className="absolute inset-[-100%] bg-gradient-to-br from-[#d946ef] via-[#f472b6] to-[#fb923c] animate-spin-slow"></div>
                        
                        {/* Inner Container to keep Logo static */}
                        <div className="absolute inset-[2px] rounded-full bg-[#050508] flex items-center justify-center overflow-hidden z-10">
                            <img 
                                src={logo} 
                                alt="Moment Maker Logo" 
                                className="h-full w-full object-cover" 
                            />
                        </div>
                    </div>

                    <div className="flex flex-col items-start leading-[0.85]">
                        <span className='text-white font-black text-3xl sm:text-3xl lg:text-4xl uppercase tracking-tight'>
                            Moment
                        </span>
                        <span 
                            className='font-black text-3xl sm:text-3xl lg:text-4xl uppercase tracking-tight'
                            style={{ 
                                WebkitTextStroke: '1px #FFD700', 
                                color: 'transparent' 
                            }}
                        >
                            Crafter
                        </span>
                    </div>
                </div>

                {/* Independent Close Button (Moved outside row to prevent opacity inheritance issues) */}
                <button type="button" aria-label="Close menu" onClick={() => {
                    if (viewSwitchTimeoutRef.current) clearTimeout(viewSwitchTimeoutRef.current)
                    setNavOpen(false)
                }} className='navlink opacity-0 absolute right-4 lg:right-0 top-5 lg:top-[1.9%] h-[13.8vw] lg:h-[16.66%] w-20 sm:w-28 lg:w-48 cursor-pointer pointer-events-auto z-[101] group flex items-center justify-center'>
                    <div className='h-[200%] lg:h-[125%] w-[3px] -rotate-45 absolute bg-white transition-transform group-hover:scale-110'></div>
                    <div className='h-[200%] lg:h-[125%] w-[3px] rotate-45 absolute bg-white transition-transform group-hover:scale-110'></div>
                </button>

                {/* Row 1: Empty Top Row */}
                <div 
                    onMouseEnter={() => setHoveredIndex(-1)}
                    className='link opacity-0 h-[13.8vw] lg:h-[16.66%] border-b border-white/50 relative'
                >
                </div>

                {/* Mask container to prevent ribbon from crossing the top/bottom boundary lines */}
                <div 
                    className='nav-ribbon-mask opacity-0 absolute left-0 w-full pointer-events-none overflow-hidden z-10'
                    style={{ 
                        top: isDesktop ? '16.66%' : 'calc(50% - 27.6vw)', 
                        height: isDesktop ? '66.64%' : '55.2vw' 
                    }}
                >
                    <div 
                        ref={ribbonRef}
                        className='absolute left-0 w-full h-[25%] bg-[#FFD700] overflow-hidden opacity-0'
                        style={{ top: '0%' }}
                    >
                        <div ref={ribbonContentRef} className='h-full w-full'>
                        {navItems.map((item, idx) => (
                            <div key={idx} className='h-full w-full flex items-center overflow-hidden'>
                                <div className='moveX flex items-center h-full shrink-0' style={{ animation: 'moveAnimation 30s linear infinite' }}>
                                    {/* Double the items and animate to -50% for a truly seamless loop */}
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((_, i) => (
                                         <div key={i} className='flex items-center h-full shrink-0'>
                                            <h2 className='whitespace-nowrap font-sans font-medium text-[14vw] sm:text-7xl md:text-8xl lg:text-[9vw] xl:text-[8.5vw] text-center uppercase px-0 text-black leading-none flex items-center h-full transform translate-y-[-5%]'>
                                                {item.title}
                                            </h2>
                                             <img 
                                                className='h-[75%] aspect-[2/1] rounded-full shrink-0 object-cover shadow-2xl brightness-110 contrast-110 mx-6' 
                                                src={cinematicImgs[idx % cinematicImgs.length]} 
                                                alt="cinematic" 
                                                loading="lazy"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                        </div>
                    </div>
                </div>

                {navItems.map((item, id, arr) => (
                    <div
                        key={id}
                        onMouseEnter={() => setHoveredIndex(id)}
                        onClick={() => triggerNavAction(item.action, id)}
                        className={`link opacity-0 transform-[rotateX(90deg)] origin-top relative border-b border-white/50 group cursor-pointer hover:bg-white/2 transition-colors h-[13.8vw] lg:h-[16.66%] flex items-center justify-center shrink-0 ${activeMobileItem === id ? 'mobile-active' : ''}`}
                    >
                        <h1 className='font-sans font-medium text-[14vw] sm:text-7xl md:text-8xl lg:text-[9vw] xl:text-[8.5vw] text-center leading-none h-full w-full flex items-center lg:items-end justify-center px-0 sm:px-16 lg:px-24 uppercase text-white/90 group-hover:text-white transition-all duration-300 whitespace-nowrap'>
                            {item.title}
                        </h1>
                    </div>
                ))}

                {/* Row 6: Empty Bottom Row */}
                <div 
                    onMouseEnter={() => setHoveredIndex(4)}
                    className='link opacity-0 h-[13.8vw] lg:h-[16.66%] flex flex-col justify-center'
                >
                </div>
            </div>
        </div>
    )
}

export default FullScreenNav
