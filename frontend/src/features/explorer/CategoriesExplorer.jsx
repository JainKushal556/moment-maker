import { useState, useMemo, useRef, useEffect, useContext, useCallback } from 'react'
import gsap from 'gsap'
import BentoCard from './BentoCard'
import TemplateGallery from './TemplateGallery'
import { templates } from '../../data/templates'
import { ViewContext } from '../../context/NavContext'
import Footer from '../../layout/Footer'

// Warm, cute icons
const HeartIcon = ({ size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
)
const SparkleIcon = ({ size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3l1.91 5.89L20 10.8l-5.89 1.91L12 21l-1.91-5.89L4 13.2l5.89-1.91L12 3z" />
    </svg>
)
const StarIcon = ({ size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
)

const FloatingHearts = () => {
    const containerRef = useRef(null)

    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        const createHeart = () => {
            const heart = document.createElement('div')
            heart.className = 'floating-heart'
            heart.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="#f472b6" style="opacity: ${Math.random() * 0.4 + 0.2}">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>`
            
            const size = Math.random() * 20 + 10
            heart.style.left = Math.random() * 100 + '%'
            heart.style.top = '100%'
            heart.style.setProperty('--rotation', (Math.random() * 90 - 45) + 'deg')
            heart.style.animationDuration = Math.random() * 10 + 15 + 's'
            
            container.appendChild(heart)
            heart.addEventListener('animationend', () => heart.remove())
        }

        const interval = setInterval(createHeart, 2000)
        for(let i=0; i<8; i++) setTimeout(createHeart, Math.random() * 5000)

        return () => clearInterval(interval)
    }, [])

    return <div ref={containerRef} className="absolute inset-0 pointer-events-none overflow-hidden" />
}

const categories = [
    {
        id: "thank-you",
        title: "THANK YOU",
        subtitle: "SCENE [01] // GRATITUDE",
        size: "large",
        icon: <HeartIcon size={28} />,
        img: "/cards/thank-you.png",
        tag: "HEARTFELT",
        desc: "Deeply grateful always."
    },
    {
        id: "friendship",
        title: "FRIENDSHIP",
        subtitle: "SCENE [02] // BOND",
        size: "medium",
        icon: <SparkleIcon size={24} />,
        img: "/cards/friendship.png",
        tag: "BESTIES",
        desc: "Bonded for life."
    },
    {
        id: "miss-you",
        title: "MISS YOU",
        subtitle: "SCENE [03] // LONGING",
        size: "small",
        icon: <StarIcon size={22} />,
        img: "/cards/miss-you.png",
        tag: "DREAMY",
        desc: "Waiting for you."
    },
    {
        id: "proposal",
        title: "PROPOSAL",
        subtitle: "SCENE [04] // FOREVER",
        size: "small",
        icon: <HeartIcon size={22} />,
        img: "/cards/proposal.png",
        tag: "MAGIC",
        desc: "Forever starts now."
    },
    {
        id: "confession",
        title: "CONFESSION",
        subtitle: "SCENE [05] // TRUTH",
        size: "small",
        icon: <SparkleIcon size={22} />,
        img: "/cards/confession.png",
        tag: "SECRET",
        desc: "My honest truth."
    },
    {
        id: "birthday",
        title: "BIRTHDAY",
        subtitle: "SCENE [06] // JOY",
        size: "medium",
        icon: <StarIcon size={24} />,
        img: "/cards/birthday.png",
        tag: "CELEBRATE",
        desc: "Celebrate your day."
    },
    {
        id: "celebration",
        title: "CELEBRATION",
        subtitle: "SCENE [07] // MAGIC",
        size: "small",
        icon: <SparkleIcon size={22} />,
        img: "/cards/celebration.png",
        tag: "BLISS",
        desc: "Magic in moments."
    },
    {
        id: "sorry",
        title: "SORRY",
        subtitle: "SCENE [08] // MENDING",
        size: "medium",
        icon: <HeartIcon size={24} />,
        img: "/cards/sorry.png",
        tag: "SINCERE",
        desc: "Sincere apologies sent."
    },
    {
        id: "romantic",
        title: "ROMANTIC",
        subtitle: "SCENE [09] // LOVE",
        size: "small",
        icon: <HeartIcon size={22} />,
        img: "/cards/romantic.png",
        tag: "FOREVER",
        desc: "Pure love shared."
    },
    {
        id: "special",
        title: "SPECIAL",
        subtitle: "SCENE [10] // UNIQUE",
        size: "small",
        icon: <StarIcon size={22} />,
        img: "/cards/special.png",
        tag: "ONLY YOU",
        desc: "Simply the best."
    }
]

const CategoriesExplorer = () => {
    const [internalView, setInternalView] = useState('categories')
    const [selectedCategory, setSelectedCategory] = useState(null)
    const [, setCurrentView, , , , , transitionRef] = useContext(ViewContext)

    const containerRef = useRef(null)
    const gridRef = useRef(null)
    const headerRef = useRef(null)

    useEffect(() => {
        if (internalView !== 'categories') return

        const animations = []
        const cards = gridRef.current ? Array.from(gridRef.current.children) : []

        if (containerRef.current) {
            animations.push(gsap.fromTo(containerRef.current, {
                autoAlpha: 0
            }, {
                autoAlpha: 1,
                duration: 0.25,
                ease: 'power1.out'
            }))
        }

        if (headerRef.current) {
            animations.push(gsap.fromTo(headerRef.current, {
                autoAlpha: 0,
                y: 28
            }, {
                autoAlpha: 1,
                y: 0,
                duration: 0.5,
                ease: 'power3.out'
            }))
        }

        if (cards.length > 0) {
            animations.push(gsap.fromTo(cards, {
                autoAlpha: 0,
                y: 32
            }, {
                autoAlpha: 1,
                y: 0,
                duration: 0.55,
                stagger: 0.045,
                delay: 0.08,
                ease: 'power3.out'
            }))
        }

        return () => {
            animations.forEach((animation) => animation.kill())
        }
    }, [internalView])

    const handleCategoryClick = useCallback((category) => {
        const transition = transitionRef?.current
        if (transition) {
            transition.play('categories').then(() => {
                setSelectedCategory(category)
                setInternalView('templates')
                window.scrollTo({ top: 0, behavior: 'instant' })
            })
        } else {
            setSelectedCategory(category)
            setInternalView('templates')
            window.scrollTo({ top: 0, behavior: 'instant' })
        }
    }, [transitionRef])

    const handleBackToCategories = useCallback(() => {
        setInternalView('categories')
        window.scrollTo({ top: 0, behavior: 'auto' })
    }, [])

    const handleReturnHome = useCallback(() => {
        if (window.lenis) window.lenis.scrollTo(0, { immediate: true })
        else window.scrollTo(0, 0)
        setCurrentView('landing')
    }, [setCurrentView])

    return (
        <section
            ref={containerRef}
            className={`categories-explorer relative bg-[#0a0a12] w-full ${internalView === 'templates' ? 'z-150' : 'z-40'}`}
            style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                padding: '0'
            }}
        >
            <FloatingHearts />
            
                {/* PRE-HEADER NAVIGATION (Like Editor) */}
                <div className="w-full h-12 flex items-center px-8 md:px-16 border-b border-white/5 bg-black/20 backdrop-blur-md sticky top-0 z-100">
                    <button
                        onClick={internalView === 'categories' ? handleReturnHome : handleBackToCategories}
                        className="group flex items-center gap-3 text-white/40 hover:text-white transition-colors"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:-translate-x-1 transition-transform">
                            <polyline points="15 18 9 12 15 6" />
                        </svg>
                        <span className="text-[10px] font-mono uppercase tracking-[0.3em] font-bold">
                            {internalView === 'categories' ? 'RETURN HOME' : 'BACK TO MOMENTS'}
                        </span>
                    </button>
                </div>

                <div
                    className="w-full relative z-10"
                    style={{
                        maxWidth: '1600px',
                        margin: '0 auto',
                        paddingLeft: '32px',
                        paddingRight: '32px',
                        paddingTop: '96px',
                    }}
                >
                    {internalView === 'categories' ? (
                        <div style={{ paddingBottom: '10rem' }}>
                            {/* SOFT ROMANTIC HEADER */}
                            <header ref={headerRef} className="mb-24 md:mb-40 space-y-12 md:space-y-20">
                                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 lg:gap-20">
                                    <div className="min-w-0">
                                        {/* Moved to top header */}
                                        <h1
                                            className="text-6xl md:text-8xl lg:text-[11rem] font-black tracking-tighter leading-[0.85] text-white"
                                        >
                                            The<br />
                                            <span className="text-transparent bg-clip-text bg-linear-to-br from-fuchsia-500 via-pink-400 to-orange-400">Moments.</span>
                                        </h1>
                                    </div>
                                
                                <div className="lg:pb-4 lg:ml-auto">
                                    <div className="flex items-stretch gap-10 max-w-[360px]">
                                        <div className="w-px bg-white/10 shrink-0" />
                                        <div className="text-white/40 text-sm md:text-base font-medium leading-relaxed space-y-2 text-right">
                                            <p>Pick a vibe.</p>
                                            <p>Choose a template.</p>
                                            <p>Share a personal moment.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </header>

                        <div style={{ height: '60px' }} className="hidden md:block" />
                        <div style={{ height: '30px' }} className="md:hidden" />

                        {/* Bento Grid */}
                        <div
                            ref={gridRef}
                            className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-6 md:gap-8 md:auto-rows-[300px]"
                        >
                            {categories.map((cat) => {
                                const count = templates.filter(t => t.category === cat.id).length
                                return (
                                    <BentoCard
                                        key={cat.id}
                                        category={cat}
                                        templateCount={count}
                                        onClick={handleCategoryClick}
                                    />
                                )
                            })}
                        </div>
                    </div>
                ) : (
                    <div style={{ paddingBottom: '10rem' }}>
                        <TemplateGallery
                            category={selectedCategory}
                            onBack={handleBackToCategories}
                        />
                    </div>
                )}
            </div>
            <div style={{ height: '160px' }} />
            <Footer />
        </section>
    )
}

export default CategoriesExplorer
