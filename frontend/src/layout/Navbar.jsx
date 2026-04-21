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
        gsap.set(navWrapperRef.current, { autoAlpha: 0, y: -20 })
        
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
        <div ref={navWrapperRef} className='z-100 flex fixed top-0 w-full items-start justify-end pointer-events-none mix-blend-difference'>
            
            {/* Raw Text Menu Button */}
            <div className='lg:p-8 p-4 pointer-events-auto'>
                <div 
                    id="nav-menu-button"
                    onClick={() => setNavOpen(true)} 
                    className='group h-12 lg:h-14 relative cursor-pointer flex items-center justify-center transition-all duration-300 ease-out'
                >
                    <div className='relative flex items-center justify-center gap-4 pointer-events-none'>
                        <span className="text-white font-inter tracking-[0.2em] uppercase text-xs lg:text-sm font-semibold opacity-90 group-hover:opacity-100 transition-opacity">
                            Menu
                        </span>
                        
                        {/* Elegant 3-line hamburger */}
                        <div className='flex flex-col items-end gap-[5px] mt-px'>
                            <div className="w-5 h-[2px] bg-white transition-all duration-300 group-hover:w-6"></div>
                            <div className="w-3 h-[2px] bg-white transition-all duration-300 group-hover:w-6 group-hover:translate-x-0"></div>
                            <div className="w-4 h-[2px] bg-white transition-all duration-300 group-hover:w-6 group-hover:translate-x-0"></div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Navbar
