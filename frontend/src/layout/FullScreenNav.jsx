import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useContext, useRef, useEffect, useState } from 'react'
import { NavbarContext, ViewContext } from '../context/NavContext'
import { useAuth } from '../context/AuthContext'

// Cinematic image placeholders built to fit the Moment Crafter vibe
const cinematicImgs = [
    "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1517404215738-15263e9f9178?q=80&w=800&auto=format&fit=crop"
]

const FullScreenNav = ({ requireAuth }) => {
    const fullNavLinksRef = useRef(null)
    const fullScreenRef = useRef(null)
    const tlRef = useRef(null)
    const viewSwitchTimeoutRef = useRef(null)
    const mobileNavActionTimeoutRef = useRef(null)
    const [activeMobileItem, setActiveMobileItem] = useState(null)


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
        })
        tl.to('.stairing', {
            duration: 0.4,
            height: '100%',
            stagger: {
                amount: -0.15
            },
            ease: "power3.inOut"
        })
        tl.to('.link', {
            duration: 0.3,
            opacity: 1,
            rotateX: 0,
            stagger: {
                amount: 0.2
            },
            ease: "power2.out"
        }, "-=0.3")
        tl.to('.nav-footer', {
            duration: 0.3,
            opacity: 1,
            y: 0,
            ease: "power2.out"
        }, "-=0.3")
        tl.to('.navlink', {
            duration: 0.3,
            opacity: 1
        }, "<")

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
            tlRef.current.timeScale(1.8).reverse()
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

        // Wait a tiny bit before swapping the view so the nav animation starts first
        // This prevents a sudden jump behind the static nav
        setTimeout(() => {
            setCurrentView('landing')
            if (window.lenis) {
                window.lenis.scrollTo(0, { immediate: true, force: true })
            }
            window.scrollTo(0, 0)
        }, 120)
    }

    // Navigation items with their view actions
    const navItems = [
        {
            title: "Home",
            label: "Return Home",
            action: handleHomeAction
        },
        { title: "Categories", label: "Explore Categories", action: () => { closeNavAndSwitch('categories') } },
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
                        requireAuth?.(() => setCurrentView('moments'))
                    }, 280)
                }
            }
        },
        { title: "About Us", label: "Our Story", action: () => { closeNavAndSwitch('about') } }
    ]

    return (
        <div ref={fullScreenRef} className='fullscreennav hidden text-white h-[100svh] min-h-[100svh] w-full z-100 fixed top-0 left-0'>
            <div className='h-[100svh] min-h-[100svh] w-full fixed inset-0 pointer-events-none'>
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
                className='relative h-[100svh] min-h-[100svh] overflow-y-auto overflow-x-hidden flex flex-col no-scrollbar'
                style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}
            >

                <div className="navlink opacity-0 relative h-12 sm:h-14 lg:h-14 w-full pointer-events-none shrink-0">
                    <button type="button" aria-label="Close menu" onClick={() => {
                        if (viewSwitchTimeoutRef.current) clearTimeout(viewSwitchTimeoutRef.current)
                        setNavOpen(false)
                    }} className='absolute right-4 top-0.5 sm:right-5 sm:top-1 lg:right-8 lg:top-1 lg:h-12 h-10 w-10 lg:w-12 cursor-pointer pointer-events-auto group flex items-center justify-center shrink-0'>
                        {/* Brighter 'Sun Gold' Accent X closing button (Made Much Smaller) */}
                        <div className='lg:h-10 h-8 lg:w-[2px] w-[2px] -rotate-45 absolute bg-[#FFD700] transition-transform group-hover:bg-white group-hover:scale-110'></div>
                        <div className='lg:h-10 h-8 lg:w-[2px] w-[2px] rotate-45 absolute bg-[#FFD700] transition-transform group-hover:bg-white group-hover:scale-110'></div>
                    </button>
                </div>

                <div className='pt-24 sm:pt-20 lg:pt-4 pb-4 sm:pb-6 lg:pb-8 flex flex-col grow w-full min-h-0 justify-center lg:justify-start'>
                    {navItems.map((item, id, arr) => (
                        <div
                            key={id}
                            onClick={() => triggerNavAction(item.action, id)}
                            className={`link opacity-0 transform-[rotateX(90deg)] origin-top relative border-t border-white/20 ${id === arr.length - 1 ? 'border-b' : ''} group cursor-pointer hover:bg-white/2 transition-colors shrink-0 ${activeMobileItem === id ? 'mobile-active' : ''}`}
                        >
                            <h1 className='font-montserrat font-black text-[clamp(2rem,10.8vw,2.9rem)] sm:text-5xl md:text-6xl lg:text-[5.4vw] xl:text-[5.2vw] text-center leading-[0.9] lg:py-6 py-1.5 sm:py-4 px-4 sm:px-0 uppercase tracking-tighter text-white/90 group-hover:text-white transition-colors duration-300'>
                                {item.title}
                            </h1>
                            <div className='moveLink absolute text-black flex top-0 bg-[#FFD700] w-full h-full pointer-events-none overflow-hidden'>
                                <div className='moveX flex items-center h-full'>
                                    {[1, 2, 3].map((_, i) => (
                                        <div key={i} className='flex items-center'>
                                            <h2 className='whitespace-nowrap font-montserrat font-black text-[clamp(2rem,10.8vw,2.9rem)] md:text-6xl lg:text-[5.4vw] xl:text-[5.2vw] text-center leading-[0.9] uppercase px-6 md:px-8'>
                                                {item.label}
                                            </h2>
                                            <img className='h-12 w-28 md:h-20 md:w-56 lg:h-[8vw] lg:w-[24vw] rounded-full shrink-0 object-cover shadow-2xl brightness-90 saturate-50' src={cinematicImgs[id % cinematicImgs.length]} alt="cinematic" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer Section inside Navigation */}
                <div className='nav-footer opacity-0 translate-y-5 flex lg:flex-row flex-col justify-between items-start lg:items-end w-full lg:p-12 px-5 pb-5 pt-8 sm:p-6 shrink-0 gap-8 mt-auto'>
                    <div className='flex flex-col gap-2 w-full lg:w-auto'>
                        <h4 className='text-white/50 text-[11px] sm:text-sm font-semibold uppercase tracking-widest'>Our Office</h4>
                        <p className='text-base sm:text-lg leading-relaxed'>123 Cinematic Blvd.<br />Los Angeles, CA 90028</p>
                    </div>
                    <div className='flex flex-col gap-2 w-full lg:w-auto'>
                        <h4 className='text-white/50 text-[11px] sm:text-sm font-semibold uppercase tracking-widest'>Get In Touch</h4>
                        <a href="mailto:hello@momentcrafter.com" className='text-lg sm:text-xl border-b border-[#FFD700] inline-block break-all hover:text-[#FFD700] transition-colors'>hello@momentcrafter.com</a>
                    </div>
                    <div className='flex flex-col gap-2 w-full lg:w-auto lg:items-end items-start'>
                        <h4 className='text-white/50 text-[11px] sm:text-sm font-semibold uppercase tracking-widest'>Socials</h4>
                        <div className='flex flex-wrap gap-x-6 gap-y-2 mt-1 text-base sm:text-lg'>
                            <a href="#" className='hover:text-[#FFD700] transition-colors'>Instagram</a>
                            <a href="#" className='hover:text-[#FFD700] transition-colors'>Twitter</a>
                            <a href="#" className='hover:text-[#FFD700] transition-colors'>Behance</a>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default FullScreenNav
