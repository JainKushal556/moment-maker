import { useContext, useRef } from 'react'
import { NavbarContext } from '../context/NavContext'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const Navbar = () => {
    const navWrapperRef = useRef(null)
    const [navOpen, setNavOpen] = useContext(NavbarContext)

    useGSAP(() => {
        gsap.set(navWrapperRef.current, { autoAlpha: 1, y: 0 })

        const handleNavToggle = (e) => {
            if (e.detail.visible) {
                gsap.to(navWrapperRef.current, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.out', overwrite: 'auto' })
            } else {
                gsap.to(navWrapperRef.current, { autoAlpha: 0, y: -20, duration: 0.3, overwrite: 'auto' })
            }
        }

        window.addEventListener('momentNavToggle', handleNavToggle)
        return () => window.removeEventListener('momentNavToggle', handleNavToggle)
    })

    return (
        <div ref={navWrapperRef} className='z-100 fixed inset-x-0 top-0 pointer-events-none mix-blend-difference'>

            {/* Raw Text Menu Button */}
            <div className='absolute right-6 lg:right-12 top-0 h-12 flex items-center pointer-events-auto'>
                <button
                    type="button"
                    aria-label="Open menu"
                    id="nav-menu-button"
                    onClick={() => setNavOpen(true)}
                    className='group h-full relative cursor-pointer flex items-center justify-center transition-all duration-300 ease-out'
                >
                    <div className='relative flex items-center justify-center gap-5 pointer-events-none'>
                        <span className="text-white font-inter leading-none tracking-[0.25em] uppercase text-sm lg:text-base font-bold opacity-90 group-hover:opacity-100 transition-opacity">
                            Menu
                        </span>

                        {/* Elegant 3-line hamburger - slightly larger */}
                        <div className='flex flex-col items-end gap-[6px]'>
                            <div className="w-6 h-[2.5px] bg-white transition-all duration-300 group-hover:w-8"></div>
                            <div className="w-4 h-[2.5px] bg-white transition-all duration-300 group-hover:w-8"></div>
                            <div className="w-5 h-[2.5px] bg-white transition-all duration-300 group-hover:w-8"></div>
                        </div>
                    </div>
                </button>
            </div>

        </div>
    )
}

export default Navbar
