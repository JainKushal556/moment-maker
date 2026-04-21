import { useRef, useEffect, useMemo, useState, useContext } from 'react'
import gsap from 'gsap'
import { ViewContext } from '../../context/NavContext'
import { templates } from '../../data/templates'



const TemplateGallery = ({ category, onBack }) => {
    const containerRef = useRef(null)
    const headerRef = useRef(null)
    const gridRef = useRef(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [, setCurrentView, , setSelectedTemplate, , setTemplateCustomization, , , , , setEditingMomentId] = useContext(ViewContext)

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
        setCurrentView('preview')
    }

    return (
        <div ref={containerRef} className="w-full text-white">
            {/* Top Bar Navigation */}
            <div className="flex items-center justify-between mb-24 border-b border-[#f472b6]/20 pb-6">
                <button
                    onClick={onBack}
                    className="group flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.3em] text-white/50 hover:text-[#f472b6] transition-colors"
                >
                    <div className="w-8 h-8 flex items-center justify-center border border-white/20 group-hover:border-[#f472b6] rounded-full transition-colors">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="15 18 9 12 15 6" />
                        </svg>
                    </div>
                    BACK TO MOMENTS
                </button>
                <div className="text-right">
                    <span className="font-mono text-[10px] text-[#f472b6] uppercase tracking-[0.3em] animate-pulse">
                        ACCESSING MOMENTS...
                    </span>
                </div>
            </div>

            {/* Header section */}
            <div ref={headerRef} className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-32">
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <span className="text-[10px] font-mono uppercase tracking-[0.4em] px-4 py-2 border border-[#f472b6]/50 text-[#f472b6] bg-black/50 backdrop-blur-sm rounded-full">
                            {category?.tag} VIBE
                        </span>
                    </div>
                    <h2 className="font-montserrat font-black uppercase tracking-tighter leading-[0.95]"
                        style={{ fontSize: 'clamp(3rem, 6vw, 6rem)' }}
                    >
                        {category?.title} <br/>
                        <span className="text-white/20 text-[60%] tracking-widest block mt-6 border-t-4 border-[#f472b6]/30 pt-6 w-fit">GALLERY</span>
                    </h2>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 lg:w-auto w-full">
                    <div className="relative min-w-[320px]">
                        <svg className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        <input
                            type="text"
                            placeholder={`SEARCH MOMENTS...`}
                            className="w-full bg-[#0a0a12] border border-white/20 rounded-full py-4 pl-12 pr-4 outline-none font-mono text-xs font-bold text-white uppercase placeholder:text-white/30 hover:border-[#f472b6]/50 focus:border-[#f472b6] transition-colors shadow-inner"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Template Grid */}
            <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredTemplates.map((template) => (
                    <div
                        key={template.id}
                        onClick={() => handleTemplateClick(template)}
                        className="template-card group relative bg-[#0d0d16] rounded-3xl border border-white/10 hover:border-[#f472b6]/40 transition-all duration-500 cursor-pointer flex flex-col min-h-[420px] overflow-hidden"
                    >
                        {/* Image overlay stack */}
                        <div className="relative h-64 overflow-hidden border-b border-white/10">
                            <img
                                src={template.img}
                                alt={template.title}
                                className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-110"
                                style={{ filter: 'brightness(0.7)' }}
                                loading="lazy"
                                onError={(e) => {
                                    e.target.src = "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80"
                                }}
                            />
                            
                            {/* Colorful hover reveal */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                                <img src={template.img} alt="" className="w-full h-full object-cover" onError={(e) => {
                                    e.target.src = "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80"
                                }} />
                            </div>

                            <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors duration-700" />
                            
                            {/* Badges */}
                            <div className="absolute top-4 left-4 flex gap-2 font-mono text-[9px] uppercase tracking-widest z-10">
                                {template.isPremium ? (
                                    <span className="bg-[#f472b6] text-white px-3 py-1 font-bold rounded-full">
                                        PREMIUM
                                    </span>
                                ) : (
                                    <span className="bg-white/10 text-white/50 px-3 py-1 border border-white/20 backdrop-blur-sm rounded-full">
                                        FREE
                                    </span>
                                )}
                            </div>

                            <div className="absolute top-4 right-4 flex gap-2 font-mono text-[9px] uppercase tracking-widest z-10">
                                <span className="bg-black/40 text-white border border-white/20 px-3 py-1 backdrop-blur-sm rounded-full capitalize">
                                    ★ {template.rating}
                                </span>
                            </div>

                            {/* Hover overlay preview text */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20 pointer-events-none">
                                <div className="text-[10px] font-bold uppercase tracking-[0.4em] px-6 py-3 border border-white text-white bg-black/60 backdrop-blur-sm rounded-full">
                                    BUILD THIS
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-10 flex-1 flex flex-col justify-between relative z-10 transition-transform duration-500 group-hover:-translate-y-2">
                            <div>
                                <h4 className="font-montserrat font-black text-xl uppercase tracking-tighter text-white group-hover:text-[#f472b6] transition-colors mb-3">
                                    {template.title}
                                </h4>
                                <p className="text-white/50 text-xs font-mono lowercase tracking-wider leading-relaxed border-l-2 border-[#f472b6]/30 pl-4">
                                    {template.desc}
                                </p>
                            </div>
                        </div>

                        <div className="absolute bottom-0 left-0 w-full h-1 bg-linear-to-r from-[#f472b6] to-[#a855f7] transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 z-20" />
                    </div>
                ))}

                {/* Blank Data State */}
                {filteredTemplates.length === 0 && (
                    <div className="col-span-full border border-dashed border-[#f472b6]/20 rounded-3xl flex flex-col items-center justify-center p-20 text-center gap-6 text-white/40 min-h-[400px] bg-[#0d0d16]">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#f472b6" strokeWidth="1.5">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                        <div>
                            <p className="font-mono text-lg font-bold uppercase tracking-[0.3em] text-[#f472b6] mb-2">
                                NO MOMENTS FOUND
                            </p>
                            <p className="text-xs font-mono uppercase tracking-widest text-white/30 max-w-sm mx-auto">
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
