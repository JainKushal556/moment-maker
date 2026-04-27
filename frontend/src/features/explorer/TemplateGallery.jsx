import { useRef, useEffect, useMemo, useState, useContext } from 'react'
import gsap from 'gsap'
import { ViewContext } from '../../context/NavContext'
import { templates } from '../../data/templates'
import MomentMagicCard from '../moments/MomentMagicCard'



const TemplateGallery = ({ category, onBack }) => {
    const containerRef = useRef(null)
    const headerRef = useRef(null)
    const gridRef = useRef(null)
    const searchInputRef = useRef(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [currentView, navigateTo, , setSelectedTemplate, , setTemplateCustomization, , , , , setEditingMomentId] = useContext(ViewContext)

    const filteredTemplates = useMemo(() => {
        return templates.filter(t =>
            (t.category === category?.id) &&
            t.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
    }, [category, searchQuery])

    const handleTemplateClick = (template) => {
        if (!template.url) return

        // Reset state so it loads as a fresh new moment, not a continuation of an old one
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

    return (
        <div ref={containerRef} className="w-full text-white">

            {/* Header section */}
            <div ref={headerRef} className="mb-12 md:mb-40 space-y-8 md:space-y-20">
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 lg:gap-20">
                    <div className="min-w-0 flex flex-col items-start text-left">
                        <div className="flex items-center justify-start gap-3 mb-3 md:mb-8 w-full text-left">
                            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-fuchsia-400 font-black text-left">
                                {category?.tag} VIBE
                            </span>
                        </div>
                        <h2 className="font-montserrat font-black uppercase tracking-tighter leading-[0.9] text-white text-left"
                            style={{ fontSize: 'clamp(3.5rem, 8vw, 8.25rem)', textAlign: 'left' }}
                        >
                            {category?.title} <br />
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
    )
}

export default TemplateGallery
