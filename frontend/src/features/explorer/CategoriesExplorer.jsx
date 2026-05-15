import { useState, useMemo, useRef, useEffect, useLayoutEffect, useContext, useCallback } from 'react'
import gsap from 'gsap'
import BentoCard from './BentoCard'
import { templates } from '../../data/templates'
import { ViewContext } from '../../context/NavContext'
import Footer from '../../layout/Footer'
import MomentMagicCard from '../moments/MomentMagicCard'
import { getAllTemplateStats } from '../../services/api'
import { ChevronDown, Filter, Sparkles, LayoutGrid, TrendingUp } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useWallet } from '../../context/WalletContext'
import { useAuth } from '../../context/AuthContext'
import AnimatedBalance from '../../components/ui/AnimatedBalance'
import CheckoutModal from '../../components/ui/CheckoutModal'

// Warm, cute icons
const HeartIcon = ({ size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
)
const SparkleIcon = ({ size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3L13.5 10.5L21 12L13.5 13.5L12 21L10.5 13.5L3 12L10.5 10.5L12 3Z" />
    </svg>
)
const StarIcon = ({ size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
)

export const FloatingHearts = () => {
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
        for (let i = 0; i < 8; i++) setTimeout(createHeart, Math.random() * 5000)

        return () => clearInterval(interval)
    }, [])

    return <div ref={containerRef} className="absolute inset-0 pointer-events-none overflow-hidden" />
}

const categories = [
    {
        id: "birthday",
        title: "BIRTHDAY",
        subtitle: "SCENE [01] // JOY",
        size: "large",
        icon: <StarIcon size={28} />,
        img: "/cards/birthday.png",
        tag: "CELEBRATE",
        desc: "Celebrate your day."
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
        id: "special",
        title: "SPECIAL",
        subtitle: "SCENE [03] // UNIQUE",
        size: "small",
        icon: <StarIcon size={22} />,
        img: "/cards/special.png",
        tag: "ONLY YOU",
        desc: "Simply the best."
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
        id: "miss-you",
        title: "MISS YOU",
        subtitle: "SCENE [05] // LONGING",
        size: "small",
        icon: <StarIcon size={22} />,
        img: "/cards/miss-you.png",
        tag: "DREAMY",
        desc: "Waiting for you."
    },
    {
        id: "romantic",
        title: "ROMANTIC",
        subtitle: "SCENE [06] // LOVE",
        size: "medium",
        icon: <HeartIcon size={24} />,
        img: "/cards/romantic.png",
        tag: "FOREVER",
        desc: "Pure love shared."
    },
    {
        id: "thank-you",
        title: "THANK YOU",
        subtitle: "SCENE [07] // GRATITUDE",
        size: "small",
        icon: <HeartIcon size={22} />,
        img: "/cards/thank-you.png",
        tag: "HEARTFELT",
        desc: "Deeply grateful always."
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
        id: "celebration",
        title: "CELEBRATION",
        subtitle: "SCENE [09] // MAGIC",
        size: "small",
        icon: <SparkleIcon size={22} />,
        img: "/cards/celebration.png",
        tag: "BLISS",
        desc: "Magic in moments."
    },
    {
        id: "confession",
        title: "CONFESSION",
        subtitle: "SCENE [10] // TRUTH",
        size: "small",
        icon: <SparkleIcon size={22} />,
        img: "/cards/confession.png",
        tag: "SECRET",
        desc: "My honest truth."
    }
]



const CategoriesExplorer = () => {
    const [, navigateTo, , setSelectedTemplate, , setTemplateCustomization, , , , , setEditingMomentId] = useContext(ViewContext)
    const { balance, unlockedTemplates, templatePrices, unlock } = useWallet()
    const { currentUser } = useAuth()
    const [activeSection, setActiveSection] = useState('categories')
    const [popularFilter, setPopularFilter] = useState('all')
    const [templateStats, setTemplateStats] = useState({})
    const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false)
    const [checkoutTarget, setCheckoutTarget] = useState(null)
    const [isUnlocking, setIsUnlocking] = useState(false)

    useLayoutEffect(() => {
        document.body.style.overflow = ''
        document.documentElement.style.overflow = ''
        document.body.style.touchAction = ''

        if (window.lenis) {
            window.lenis.start()
            window.lenis.scrollTo(0, { immediate: true, force: true })
        } else {
            window.scrollTo(0, 0)
        }
    }, [])

    useEffect(() => {
        window.dispatchEvent(new CustomEvent('momentNavToggle', {
            detail: { visible: true }
        }))

        // Check if navigated here from footer "Popular Wishes" link
        const initialSection = sessionStorage.getItem('explorerInitialSection')
        if (initialSection) {
            setActiveSection(initialSection)
            sessionStorage.removeItem('explorerInitialSection')
        }

        getAllTemplateStats()
            .then(stats => setTemplateStats(stats || {}))
            .catch(err => console.error("Failed to fetch template stats:", err))
    }, [])

    const containerRef = useRef(null)
    const gridRef = useRef(null)
    const headerRef = useRef(null)

    useEffect(() => {
        const animations = []
        const gridItems = gridRef.current ? Array.from(gridRef.current.children) : []

        if (headerRef.current) {
            animations.push(gsap.fromTo(headerRef.current, {
                autoAlpha: 0
            }, {
                autoAlpha: 1,
                duration: 0.5,
                ease: 'power3.out'
            }))
        }

        if (gridItems.length > 0) {
            animations.push(gsap.fromTo(gridItems, {
                autoAlpha: 0
            }, {
                autoAlpha: 1,
                duration: 0.55,
                stagger: 0.045,
                delay: 0.08,
                ease: 'power3.out'
            }))
        }

        return () => {
            animations.forEach((animation) => animation.kill())
        }
    }, []) // Only run initial entrance animation once

    const handleCategoryClick = useCallback((category) => {
        sessionStorage.setItem('explorerSelectedCategory', JSON.stringify(category))
        navigateTo('gallery')
    }, [navigateTo])

    const handleReturnHome = useCallback(() => {
        if (window.lenis) window.lenis.scrollTo(0, { immediate: true })
        else window.scrollTo(0, 0)

        sessionStorage.removeItem('explorerSelectedCategory')
        navigateTo('landing')
    }, [navigateTo])

    const handleTemplateClick = useCallback((templateId) => {
        const template = templates.find(t => t.id === templateId)
        if (!template) return

        if (setEditingMomentId) setEditingMomentId(null)
        if (setTemplateCustomization) {
            setTemplateCustomization(prev => {
                const next = { ...prev }
                delete next[template.id]
                return next
            })
        }

        setSelectedTemplate(template)
        navigateTo('preview')
    }, [navigateTo, setEditingMomentId, setTemplateCustomization, setSelectedTemplate])

    const handleConfirmUnlock = async () => {
        if (!checkoutTarget) return
        setIsUnlocking(true)
        try {
            await unlock(checkoutTarget.id)
            setCheckoutTarget(null)
        } catch (error) {
            console.error("Purchase failed:", error)
        } finally {
            setIsUnlocking(false)
        }
    }

    const popularTemplates = useMemo(() => {
        return templates.filter(t => {
            const stats = templateStats[t.id]
            const isPopular = stats && stats.averageRating >= 3
            const matchesFilter = popularFilter === 'all' || t.category === popularFilter
            return isPopular && matchesFilter
        }).map(t => ({
            ...t,
            averageRating: templateStats[t.id]?.averageRating || 0,
            totalRatings: templateStats[t.id]?.totalRatings || 0
        }))
    }, [templateStats, popularFilter])

    return (
        <section
            ref={containerRef}
            className={`categories-explorer relative bg-[#0a0a12] w-full z-40 overflow-x-hidden`}
            style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                padding: '0'
            }}
        >
            <FloatingHearts />

            <div className="w-full h-12 flex items-center justify-between px-6 md:px-12 border-b border-white/5 bg-black/20 backdrop-blur-md fixed top-0 left-0 right-0 z-100">
                <button
                    onClick={handleReturnHome}
                    className="group flex items-center gap-3 text-white/40 hover:text-white transition-colors"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:-translate-x-1 transition-transform">
                        <polyline points="15 18 9 12 15 6" />
                    </svg>
                    <span className="text-[10px] font-mono uppercase tracking-[0.3em] font-bold">
                        RETURN HOME
                    </span>
                </button>

                <div className="flex items-center gap-4 pr-30 md:pr-48">
                    {currentUser && (
                        <button 
                            onClick={() => navigateTo('wallet')}
                            className="active:scale-95 transition-transform"
                        >
                            <AnimatedBalance 
                                value={balance} 
                                iconSize={32} 
                            />
                        </button>
                    )}
                </div>
            </div>

            <div
                className="w-full relative z-10"
                style={{
                    maxWidth: '1600px',
                    margin: '0 auto',
                    paddingLeft: 'clamp(12px, 4vw, 24px)',
                    paddingRight: 'clamp(12px, 4vw, 24px)',
                    paddingTop: 'clamp(60px, 10vw, 96px)',
                }}
            >
                <div style={{ paddingBottom: '10rem' }}>
                    {/* SOFT ROMANTIC HEADER */}
                    <header ref={headerRef} className="mb-12 md:mb-20 w-full flex flex-col items-start text-left relative z-50">
                        <div className="flex flex-row items-end justify-between w-full text-left items-end">
                            <div className="min-w-0 flex-1 flex flex-col items-start text-left">
                                <h1
                                    className="text-[36px] sm:text-6xl md:text-8xl lg:text-[11rem] font-black tracking-tighter leading-[0.85] text-white text-left"
                                    style={{ textAlign: 'left' }}
                                >
                                    The<br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-br from-fuchsia-500 via-pink-400 to-orange-400">Moments.</span>
                                </h1>
                            </div>

                            <div className="pb-1 sm:pb-4 lg:pb-6 shrink-0 ml-4 flex flex-col items-start text-left">
                                <div className="flex items-stretch gap-3 sm:gap-6 md:gap-10 max-w-[140px] sm:max-w-[360px] text-left">
                                    <div className="w-px bg-white/10 shrink-0" />
                                    <div className="text-white/40 text-[9px] sm:text-[11px] md:text-sm lg:text-base font-medium leading-tight sm:leading-relaxed space-y-0.5 sm:space-y-1 md:space-y-2 text-left">
                                        <p className="text-left">Pick a vibe.</p>
                                        <p className="text-left">Choose a template.</p>
                                        <p className="text-left">Share a personal moment.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* SECTION SWITCHER */}
                        <div className="flex flex-col sm:flex-row-reverse items-center sm:items-center justify-between w-full mt-12 md:mt-24 gap-6">
                            <div className="flex flex-wrap items-center justify-center sm:justify-end gap-4 md:gap-8 w-full sm:w-auto pb-2">
                                {[
                                    { id: 'categories', label: 'Categories', icon: <LayoutGrid size={14} /> },
                                    { id: 'popular', label: 'Popular Wishes', icon: <TrendingUp size={14} /> }
                                ].map((s) => (
                                    <button
                                        key={s.id}
                                        onClick={() => setActiveSection(s.id)}
                                        className={`group flex items-center gap-2 text-[10px] md:text-[11px] font-black uppercase tracking-[0.25em] relative pt-4 pb-1 transition-all ${activeSection === s.id ? 'text-white' : 'text-white/30 hover:text-white/60'
                                            }`}
                                    >
                                        <span className={`transition-transform duration-300 ${activeSection === s.id ? 'scale-110 text-fuchsia-400' : 'group-hover:scale-110'}`}>
                                            {s.icon}
                                        </span>
                                        {s.label}
                                        {activeSection === s.id && (
                                            <motion.div
                                                layoutId="activeSection"
                                                className="absolute bottom-0 left-0 right-0 h-[2px] bg-fuchsia-500 shadow-[0_0_15px_#d946ef]"
                                            />
                                        )}
                                    </button>
                                ))}
                            </div>

                            {/* POPULAR FILTER DROPDOWN */}
                            <AnimatePresence>
                                {activeSection === 'popular' && (
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        className="relative z-50 w-full sm:w-auto"
                                    >
                                        <button
                                            onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                                            onBlur={() => setTimeout(() => setIsFilterDropdownOpen(false), 200)}
                                            className="flex items-center justify-between gap-4 px-4 py-2.5 sm:px-5 sm:py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all w-auto min-w-[160px] sm:min-w-[200px]"
                                        >
                                            <div className="flex items-center gap-3">
                                                <Filter size={12} className="text-fuchsia-400" />
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-white/70">
                                                    {popularFilter === 'all' ? 'All Wishes' : popularFilter.replace('-', ' ')}
                                                </span>
                                            </div>
                                            <ChevronDown size={14} className={`text-white/30 transition-transform duration-300 ${isFilterDropdownOpen ? 'rotate-180' : ''}`} />
                                        </button>

                                        <AnimatePresence>
                                            {isFilterDropdownOpen && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                    className="absolute top-full left-0 mt-2 w-48 sm:w-56 bg-zinc-950 border border-white/10 rounded-2xl p-2 shadow-2xl z-[60] overflow-hidden"
                                                >
                                                    <div className="max-h-[300px] overflow-y-auto custom-scrollbar" data-lenis-prevent="true">
                                                        <button
                                                            onClick={() => { setPopularFilter('all'); setIsFilterDropdownOpen(false); }}
                                                            className={`w-full text-left px-4 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${popularFilter === 'all' ? 'bg-fuchsia-500/10 text-fuchsia-400' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                                                        >
                                                            All Wishes
                                                        </button>
                                                        <div className="h-px bg-white/5 my-1 mx-2" />
                                                        {categories.map((cat) => (
                                                            <button
                                                                key={cat.id}
                                                                onClick={() => { setPopularFilter(cat.id); setIsFilterDropdownOpen(false); }}
                                                                className={`w-full text-left px-4 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${popularFilter === cat.id ? 'bg-fuchsia-500/10 text-fuchsia-400' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                                                            >
                                                                {cat.title}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </header>

                    <div style={{ height: '40px' }} className="hidden md:block" />
                    <div style={{ height: '20px' }} className="md:hidden" />

                    {/* CONTENT AREA */}
                    <div ref={gridRef} className="w-full relative">
                        <AnimatePresence mode="wait">
                            {activeSection === 'categories' ? (
                                /* Bento Grid */
                                <motion.div
                                    key="categories-grid"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-8 auto-rows-[240px] md:auto-rows-[300px] grid-flow-dense"
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
                                </motion.div>
                            ) : (
                                /* Popular Wishes Grid */
                                <motion.div
                                    key={`popular-grid-${popularFilter}`}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12"
                                >
                                    {popularTemplates.length > 0 ? (
                                        popularTemplates.map((template) => (
                                            <MomentMagicCard
                                                key={template.id}
                                                moment={{
                                                    ...template,
                                                    image: template.img,
                                                    vibe: template.tag || 'CINEMATIC'
                                                }}
                                                isTemplate={true}
                                                isUnlocked={unlockedTemplates?.includes(template.id)}
                                                price={templatePrices[template.id] || 0}
                                                onUnlock={(id) => {
                                                    const t = templates.find(x => x.id === id);
                                                    if (t) {
                                                        setCheckoutTarget({
                                                            ...t,
                                                            price: templatePrices[id] || 0
                                                        });
                                                    }
                                                }}
                                                onAction={(type) => {
                                                    if (type === 'build' || type === 'click') {
                                                        handleTemplateClick(template.id);
                                                    }
                                                }}
                                            />
                                        ))
                                    ) : (
                                        <div className="col-span-full border border-dashed border-white/10 rounded-[3rem] flex flex-col items-center justify-center p-20 text-center gap-6 bg-black/20 w-full">
                                            <TrendingUp size={40} strokeWidth={1} className="text-white/10 animate-pulse" />
                                            <div>
                                                <p className="text-white/30 text-[10px] font-mono uppercase tracking-[0.3em]">Awaiting popular moments.</p>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
            <div style={{ height: '160px' }} />
            <Footer />

            <CheckoutModal 
                isOpen={!!checkoutTarget}
                onClose={() => setCheckoutTarget(null)}
                template={checkoutTarget}
                userBalance={balance}
                isProcessing={isUnlocking}
                onConfirm={handleConfirmUnlock}
                onBuyWishbits={() => navigateTo('wallet')}
            />
        </section>
    )
}

export default CategoriesExplorer
