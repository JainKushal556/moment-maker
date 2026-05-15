import { useState, useRef, useEffect, useContext, useMemo } from 'react'
import gsap from 'gsap'
import { ViewContext } from '../../context/NavContext'
import Footer from '../../layout/Footer'
import { FloatingHearts } from './CategoriesExplorer'
import { templates } from '../../data/templates'
import MomentMagicCard from '../moments/MomentMagicCard'
import AnimatedBalance from '../../components/ui/AnimatedBalance'
import { useAuth } from '../../context/AuthContext'
import { useWallet } from '../../context/WalletContext'
import { getAllTemplateStats } from '../../services/api'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Settings, LogOut, Wallet, Gift } from 'lucide-react'

const getInitialCategory = () => {
    const saved = sessionStorage.getItem('explorerSelectedCategory')
    return saved ? JSON.parse(saved) : null
}

const GalleryExplorer = () => {
    const [selectedCategory] = useState(getInitialCategory())
    const [, navigateTo, , setSelectedTemplate, , setTemplateCustomization, , , , , setEditingMomentId] = useContext(ViewContext)
    const { currentUser, logout, openAuthModal } = useAuth()
    const { balance, unlockedTemplates, templatePrices, unlock } = useWallet()
    const containerRef = useRef(null)
    const headerRef = useRef(null)
    const gridRef = useRef(null)
    const searchInputRef = useRef(null)
    
    const [searchQuery, setSearchQuery] = useState('')
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [templateStats, setTemplateStats] = useState({})
    const [showProfileMenu, setShowProfileMenu] = useState(false)
    const menuRef = useRef(null)

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowProfileMenu(false)
            }
        }
        if (showProfileMenu) {
            document.addEventListener('mousedown', handleClickOutside)
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [showProfileMenu])

    const handleLogout = async () => {
        try {
            await logout()
            navigateTo('landing')
        } catch (error) {
            console.error("Logout failed:", error)
        }
    }

    useEffect(() => {
        window.dispatchEvent(new CustomEvent('momentNavToggle', {
            detail: { visible: true }
        }))
        
        if (containerRef.current) {
            gsap.fromTo(containerRef.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.25, ease: 'power1.out' })
        }
    }, [])

    useEffect(() => {
        getAllTemplateStats()
            .then(stats => setTemplateStats(stats || {}))
            .catch(err => console.error("Failed to fetch template stats:", err))
    }, [])

    const filteredTemplates = useMemo(() => {
        if (!selectedCategory) return []
        return templates.filter(t =>
            (t.category === selectedCategory?.id) &&
            t.title.toLowerCase().includes(searchQuery.toLowerCase())
        ).map(t => ({
            ...t,
            averageRating: templateStats[t.id]?.averageRating || 0,
            totalRatings: templateStats[t.id]?.totalRatings || 0
        }))
    }, [selectedCategory, searchQuery, templateStats])

    const handleBackToCategories = () => {
        navigateTo('categories')
    }

    const handleTemplateClick = (template) => {
        if (!template.url) return

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
    }

    useEffect(() => {
        if (!selectedCategory) {
            navigateTo('categories', false)
        }
    }, [selectedCategory, navigateTo])

    if (!selectedCategory) return null

    return (
        <section
            ref={containerRef}
            className="gallery-explorer relative bg-[#0a0a12] w-full z-150"
            style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                padding: '0'
            }}
        >
            <FloatingHearts />

            <div className="w-full h-12 flex items-center justify-between px-6 md:px-12 border-b border-white/5 bg-black/20 backdrop-blur-md sticky top-0 z-100">
                <button
                    onClick={handleBackToCategories}
                    className="group flex items-center gap-3 text-white/40 hover:text-white transition-colors"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:-translate-x-1 transition-transform">
                        <polyline points="15 18 9 12 15 6" />
                    </svg>
                    <span className="text-[10px] font-mono uppercase tracking-[0.3em] font-bold">
                        BACK TO MOMENTS
                    </span>
                </button>

                <div className="flex items-center gap-3 md:gap-6">
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

                    {currentUser && (
                        <div className="relative">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowProfileMenu(!showProfileMenu);
                                }}
                                className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/20 transition-all active:scale-95 overflow-hidden"
                            >
                                {currentUser?.photoURL ? (
                                    <img src={currentUser.photoURL} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <User size={18} />
                                )}
                            </button>

                            <AnimatePresence>
                                {showProfileMenu && (
                                    <motion.div
                                        ref={menuRef}
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                                        className="absolute right-0 mt-3 w-44 md:w-48 bg-zinc-950/90 backdrop-blur-2xl border border-white/10 rounded-2xl p-2 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.7)] z-[110] overflow-hidden"
                                    >
                                        <button
                                            onClick={() => {
                                                setShowProfileMenu(false);
                                                navigateTo('wallet');
                                            }}
                                            className="w-full flex items-center gap-3 px-3 py-2.5 md:px-4 md:py-3 text-white/60 hover:text-white hover:bg-white/5 rounded-xl transition-all text-left group"
                                        >
                                            <Wallet size={14} className="group-hover:scale-110 transition-transform" />
                                            <span className="text-[9px] md:text-[10px] font-mono font-bold uppercase tracking-widest">Wallet</span>
                                        </button>

                                        <button
                                            onClick={() => {
                                                setShowProfileMenu(false);
                                                navigateTo('refer');
                                            }}
                                            className="w-full flex items-center gap-3 px-3 py-2.5 md:px-4 md:py-3 text-white/60 hover:text-white hover:bg-white/5 rounded-xl transition-all text-left group"
                                        >
                                            <Gift size={14} className="group-hover:scale-110 transition-transform" />
                                            <span className="text-[9px] md:text-[10px] font-mono font-bold uppercase tracking-widest">Refer & Earn</span>
                                        </button>

                                        <button
                                            onClick={() => {
                                                setShowProfileMenu(false);
                                                navigateTo('settings');
                                            }}
                                            className="w-full flex items-center gap-3 px-3 py-2.5 md:px-4 md:py-3 text-white/60 hover:text-white hover:bg-white/5 rounded-xl transition-all text-left group"
                                        >
                                            <Settings size={14} className="group-hover:rotate-45 transition-transform duration-300" />
                                            <span className="text-[9px] md:text-[10px] font-mono font-bold uppercase tracking-widest">Settings</span>
                                        </button>

                                        <div className="h-px bg-white/5 my-1 mx-2" />

                                        <button
                                            onClick={() => {
                                                setShowProfileMenu(false);
                                                handleLogout();
                                            }}
                                            className="w-full flex items-center gap-3 px-3 py-2.5 md:px-4 md:py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all text-left group"
                                        >
                                            <LogOut size={14} className="group-hover:translate-x-0.5 transition-transform" />
                                            <span className="text-[9px] md:text-[10px] font-mono font-bold uppercase tracking-widest">Logout</span>
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </div>

            <div
                className="w-full relative z-10"
                style={{
                    maxWidth: '1600px',
                    margin: '0 auto',
                    paddingLeft: 'clamp(20px, 5vw, 32px)',
                    paddingRight: 'clamp(20px, 5vw, 32px)',
                    paddingTop: 'clamp(60px, 10vw, 96px)',
                }}
            >
                <div style={{ paddingBottom: '10rem' }}>
                    <div className="w-full text-white">

                        {/* Header section */}
                        <div ref={headerRef} className="mb-12 md:mb-40 space-y-8 md:space-y-20">
                            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 lg:gap-20">
                                <div className="min-w-0 flex flex-col items-start text-left">
                                    <div className="flex items-center justify-start gap-3 mb-3 md:mb-8 w-full text-left">
                                        <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-fuchsia-400 font-black text-left">
                                            {selectedCategory?.tag} VIBE
                                        </span>
                                    </div>
                                    <h2 className="font-montserrat font-black uppercase tracking-tighter leading-[0.9] text-white text-left"
                                        style={{ fontSize: 'clamp(3.5rem, 8vw, 8.25rem)', textAlign: 'left' }}
                                    >
                                        {selectedCategory?.title} <br />
                                        <span className="text-white/20 text-[42%] tracking-[0.12em] block mt-4 md:mt-6 border-t-[3px] md:border-t-4 border-[#f472b6]/30 pt-4 md:pt-6 w-fit text-left">GALLERY</span>
                                    </h2>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4 lg:w-auto w-full lg:pb-5">
                                    <div className={`relative flex items-center justify-end transition-all duration-300 ${isSearchOpen || searchQuery ? 'w-full sm:w-[340px] md:w-[380px]' : 'w-14'}`}>
                                        <button
                                            type="button"
                                            aria-label="Open template search"
                                            onClick={() => {
                                                setIsSearchOpen(true)
                                                requestAnimationFrame(() => searchInputRef.current?.focus())
                                            }}
                                            className={`absolute left-0 top-0 z-10 h-14 w-14 flex items-center justify-center text-white/45 hover:text-white transition-colors ${isSearchOpen || searchQuery ? 'pointer-events-none' : ''}`}
                                        >
                                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                                                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                                            </svg>
                                        </button>
                                        <input
                                            ref={searchInputRef}
                                            type="text"
                                            placeholder="Search templates"
                                            className={`w-full h-14 bg-white/0.045 border border-white/10 rounded-xl pr-5 outline-none font-mono text-xs font-bold tracking-[0.08em] text-white placeholder:text-white/35 hover:border-white/20 focus:border-fuchsia-400/70 focus:bg-white/[0.07] transition-all duration-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] ${isSearchOpen || searchQuery ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                                            style={{ paddingLeft: '56px' }}
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            onBlur={() => {
                                                if (!searchQuery) setIsSearchOpen(false)
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style={{ height: '60px' }} className="hidden md:block" />
                        <div style={{ height: '30px' }} className="md:hidden" />

                        {/* Template Grid */}
                        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                            {filteredTemplates.map((template) => (
                                <MomentMagicCard
                                    key={template.id}
                                    moment={{
                                        ...template,
                                        image: template.img,
                                        vibe: template.tag || 'CINEMATIC' // Fallback to CINEMATIC if tag doesn't match a vibe
                                    }}
                                    isTemplate={true}
                                    isUnlocked={unlockedTemplates?.includes(template.id)}
                                    price={templatePrices[template.id] || 0}
                                    onUnlock={async (id) => {
                                        if (!currentUser) {
                                            openAuthModal();
                                            return;
                                        }
                                        try {
                                            await unlock(id);
                                        } catch (err) {
                                            alert(err.message || "Failed to unlock template");
                                        }
                                    }}
                                    onAction={(type, id) => {
                                        if (type === 'build' || type === 'click') {
                                            handleTemplateClick(template);
                                        }
                                    }}
                                />
                            ))}

                            {/* Blank Data State */}
                            {filteredTemplates.length === 0 && (
                                <div className="col-span-full border border-dashed border-[#f472b6]/20 rounded-[2rem] flex flex-col items-center justify-center p-10 md:p-20 text-center gap-4 md:gap-6 text-white/40 min-h-[300px] md:min-h-[400px] bg-[#0d0d16]">
                                    <svg className="w-8 h-8 md:w-10 md:h-10" viewBox="0 0 24 24" fill="none" stroke="#f472b6" strokeWidth="1.5">
                                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                    </svg>
                                    <div>
                                        <p className="font-mono text-sm md:text-lg font-bold uppercase tracking-[0.2em] md:tracking-[0.3em] text-[#f472b6] mb-1 md:mb-2">
                                            NO MOMENTS FOUND
                                        </p>
                                        <p className="text-[10px] md:text-xs font-mono uppercase tracking-widest text-white/30 max-w-[200px] md:max-w-sm mx-auto">
                                            We couldn't find any memories matching your search. Try another vibe!
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div style={{ height: '160px' }} />
            <Footer />
        </section>
    )
}

export default GalleryExplorer
