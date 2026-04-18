import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useContext, useRef, useEffect } from 'react'
import { NavbarContext, ViewContext } from '../context/NavContext'

// Cinematic image placeholders built to fit the Moment Maker vibe
const cinematicImgs = [
    "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1517404215738-15263e9f9178?q=80&w=800&auto=format&fit=crop"
]

const FullScreenNav = () => {
    const fullNavLinksRef = useRef(null)
    const fullScreenRef = useRef(null)
    const tlRef = useRef(null)
    const viewSwitchTimeoutRef = useRef(null)

    const [navOpen, setNavOpen] = useContext(NavbarContext)
    const [, setCurrentView] = useContext(ViewContext)

    // Build the master timeline once
    useGSAP(() => {
        const tl = gsap.timeline({ paused: true, defaults: { overwrite: "auto" } })
        
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
            // Make reverse significantly faster so it gets out of the way gracefully
            tlRef.current.timeScale(1.8).reverse()
        }
    }, [navOpen])

    useEffect(() => {
        return () => {
            if (viewSwitchTimeoutRef.current) clearTimeout(viewSwitchTimeoutRef.current)
        }
    }, [])

    const closeNavAndSwitch = (nextView) => {
        if (viewSwitchTimeoutRef.current) clearTimeout(viewSwitchTimeoutRef.current)
        setNavOpen(false)
        viewSwitchTimeoutRef.current = window.setTimeout(() => {
            setCurrentView(nextView)
        }, 260)
    }

    const handleHomeAction = () => {
        if (window.lenis) window.lenis.start()
        
        // Immediate scroll and state switch
        setNavOpen(false)
        
        // Use a small timeout to ensure Lenis has restarted and navigation is clearing
        setTimeout(() => {
            setCurrentView('landing')
            if (window.lenis) {
                window.lenis.scrollTo(0, { immediate: true, force: true })
            }
            window.scrollTo(0, 0)
        }, 100)
    }

    // Navigation items with their view actions
    const navItems = [
        { 
            title: "Home", 
            label: "Return Home", 
            action: handleHomeAction
        },
        { title: "Categories", label: "Explore Categories", action: () => { closeNavAndSwitch('categories') } },
        { title: "Draft", label: "View Drafts", action: () => { setNavOpen(false) } },
        { title: "About Us", label: "Our Story", action: () => { setNavOpen(false) } }
    ]

    return (
        <div ref={fullScreenRef} className='fullscreennav hidden text-white h-screen w-full z-100 fixed top-0 left-0'>
            <div className='h-screen w-full fixed pointer-events-none'>
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
            <div ref={fullNavLinksRef} className='relative h-full overflow-y-auto overflow-x-hidden flex flex-col no-scrollbar'>
                
                <div className="navlink opacity-0 flex w-full justify-end lg:p-8 p-4 items-start pt-8 pointer-events-none shrink-0">
                    <div onClick={() => {
                        if (viewSwitchTimeoutRef.current) clearTimeout(viewSwitchTimeoutRef.current)
                        setNavOpen(false)
                    }} className='lg:h-16 h-12 w-16 lg:w-16 relative cursor-pointer pointer-events-auto group flex items-center justify-center shrink-0'>
                        {/* Brighter 'Sun Gold' Accent X closing button (Made Much Smaller) */}
                        <div className='lg:h-10 h-8 lg:w-[2px] w-[2px] -rotate-45 absolute bg-[#FFD700] transition-transform group-hover:bg-white group-hover:scale-110'></div>
                        <div className='lg:h-10 h-8 lg:w-[2px] w-[2px] rotate-45 absolute bg-[#FFD700] transition-transform group-hover:bg-white group-hover:scale-110'></div>
                    </div>
                </div>

                <div className='pt-8 pb-12 overflow-hidden flex flex-col justify-center grow w-full'>
                    {navItems.map((item, id, arr) => (
                        <div key={id} onClick={item.action} className={`link opacity-0 transform-[rotateX(90deg)] origin-top relative border-t border-white/20 ${id === arr.length - 1 ? 'border-b' : ''} group cursor-pointer hover:bg-white/2 transition-colors`}>
                            <h1 className='font-montserrat font-black text-5xl lg:text-[7vw] text-center lg:leading-[0.9] lg:py-8 py-5 uppercase tracking-tighter text-white/90 group-hover:text-white transition-colors duration-300'>
                                {item.title}
                            </h1>
                            <div className='moveLink absolute text-black flex top-0 bg-[#FFD700] w-full h-full pointer-events-none overflow-hidden'>
                                <div className='moveX flex items-center h-full'>
                                    {[1, 2, 3].map((_, i) => (
                                        <div key={i} className='flex items-center'>
                                            <h2 className='whitespace-nowrap font-montserrat font-black lg:text-[7vw] text-5xl text-center lg:leading-[0.9] uppercase px-8'>
                                                {item.label}
                                            </h2>
                                            <img className='lg:h-[8vw] h-16 rounded-full shrink-0 lg:w-[24vw] w-48 object-cover shadow-2xl brightness-90 saturate-50' src={cinematicImgs[id % cinematicImgs.length]} alt="cinematic" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer Section inside Navigation */}
                <div className='nav-footer opacity-0 translate-y-5 flex lg:flex-row flex-col justify-between items-start lg:items-end w-full lg:p-12 p-6 shrink-0 gap-8'>
                    <div className='flex flex-col gap-2'>
                        <h4 className='text-white/50 text-sm font-semibold uppercase tracking-widest'>Our Office</h4>
                        <p className='text-lg'>123 Cinematic Blvd.<br/>Los Angeles, CA 90028</p>
                    </div>
                    <div className='flex flex-col gap-2'>
                        <h4 className='text-white/50 text-sm font-semibold uppercase tracking-widest'>Get In Touch</h4>
                        <a href="mailto:hello@momentmaker.com" className='text-xl border-b border-[#FFD700] inline-block hover:text-[#FFD700] transition-colors'>hello@momentmaker.com</a>
                    </div>
                    <div className='flex flex-col gap-2 lg:items-end items-start'>
                        <h4 className='text-white/50 text-sm font-semibold uppercase tracking-widest'>Socials</h4>
                        <div className='flex gap-6 mt-1 text-lg'>
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
