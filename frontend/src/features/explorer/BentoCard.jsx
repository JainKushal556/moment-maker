import { useRef } from 'react'
import gsap from 'gsap'

const BentoCard = ({ category, templateCount, onClick }) => {
    const cardRef = useRef(null)
    const contentRef = useRef(null)
    const iconRef = useRef(null)

    const isLarge = category.size === 'large'
    const isMedium = category.size === 'medium'
    const isComingSoon = templateCount === 0

    const handleMouseEnter = () => {
        if (isComingSoon) return
        const content = contentRef.current
        const icon = iconRef.current
        if (!content) return

        gsap.to(content, {
            y: -10,
            duration: 0.5,
            ease: 'back.out(1.5)',
            overwrite: 'auto'
        })
        gsap.to(icon, {
            rotation: 15,
            scale: 1.3,
            opacity: 1,
            color: '#f472b6',
            duration: 0.6,
            filter: 'drop-shadow(0 0 10px rgba(244,114,182,0.6))',
            ease: 'expo.out',
            overwrite: 'auto'
        })
    }

    const handleMouseLeave = () => {
        if (isComingSoon) return
        const content = contentRef.current
        const icon = iconRef.current
        if (!content) return

        gsap.to(content, {
            y: 0,
            duration: 0.5,
            ease: 'power2.out',
            overwrite: 'auto'
        })
        gsap.to(icon, {
            rotation: 0,
            scale: 1,
            opacity: 0.6,
            color: '#ffffff',
            filter: 'drop-shadow(0 0 0px rgba(244,114,182,0))',
            duration: 0.5,
            ease: 'power2.out',
            overwrite: 'auto'
        })
    }

    // Grid sizing
    const sizeClasses = isLarge
        ? 'md:col-span-2 md:row-span-2 min-h-[480px] md:min-h-0'
        : isMedium
            ? 'md:col-span-2 row-span-1 min-h-[260px] md:min-h-0'
            : 'col-span-1 row-span-1 min-h-[260px] md:min-h-0'

    return (
        <div
            ref={cardRef}
            onClick={() => !isComingSoon && onClick(category)}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={`bento-card group relative overflow-hidden transition-all duration-500 bg-[#0a0a12]
                ${sizeClasses}
                ${isComingSoon ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:border-[#f472b6]/50'}
                rounded-3xl border border-white/10
            `}
            data-category-id={category.id}
        >
            {/* Background Image */}
            <div className="absolute inset-0 overflow-hidden">
                <img
                    src={category.img}
                    alt={category.title}
                    className={`w-full h-full object-cover transition-transform duration-700 ${!isComingSoon ? 'group-hover:scale-105' : ''}`}
                    style={{ filter: isComingSoon ? 'brightness(0.3) grayscale(0.5)' : 'brightness(0.7)', willChange: 'transform' }}
                    loading="lazy"
                />
            </div>

            {/* Overlay Layers */}
            <div className={`absolute inset-0 ${isComingSoon ? 'bg-black/60' : 'bg-black/30'}`} />
            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-linear-to-t from-[#0a0a12] via-[#0a0a12]/80 to-transparent z-10" />

            {/* Content Container */}
            <div 
                ref={contentRef}
                className="relative h-full flex flex-col justify-between z-20"
                style={{ padding: isLarge ? '3.5rem' : '1.75rem' }}
            >
                {/* Top Header */}
                <div className="flex justify-between items-start">
                    <div className="flex gap-3 items-center">
                        <div
                            ref={iconRef}
                            className="bento-icon flex items-center justify-center text-white/60"
                            style={{ willChange: 'transform' }}
                        >
                            {category.icon}
                        </div>
                        {isLarge && !isComingSoon && (
                            <span className="font-mono text-[9px] text-[#f472b6] tracking-[0.3em] uppercase">
                                FEELING: LOVELY
                            </span>
                        )}
                    </div>
                    
                    {/* Template Count / Coming Soon Tag */}
                    <div className="flex flex-col items-end gap-2">
                        {isComingSoon ? (
                            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 bg-white/5 px-4 py-1.5 border border-white/10 backdrop-blur-md rounded-full">
                                COMING SOON
                            </span>
                        ) : (
                            <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#f472b6] bg-[#f472b6]/10 px-4 py-1.5 border border-[#f472b6]/30 backdrop-blur-md rounded-full shadow-[0_0_15px_rgba(244,114,182,0.2)]">
                                {templateCount} {templateCount === 1 ? 'MOMENT' : 'MOMENTS'}
                            </span>
                        )}
                    </div>
                </div>

                {/* Bottom Body */}
                <div>
                    <p className="font-mono text-[10px] text-[#f472b6] uppercase tracking-[0.3em] mb-4 opacity-70">
                        {category.subtitle}
                    </p>
                    <h3
                        className="font-montserrat font-black tracking-tighter text-white leading-[1] uppercase transition-colors"
                        style={{
                            fontSize: isLarge ? 'clamp(2.5rem, 5vw, 4.5rem)' : isMedium ? 'clamp(1.8rem, 3vw, 2.8rem)' : 'clamp(1.2rem, 2vw, 2.2rem)',
                            marginBottom: isComingSoon ? '0.5rem' : '1.25rem'
                        }}
                    >
                        {category.title}
                    </h3>
                    
                    {(isLarge || isMedium) && !isComingSoon && (
                        <div className="overflow-hidden">
                            <p className="text-white/50 text-[11px] font-mono uppercase tracking-widest leading-relaxed border-l-2 border-[#f472b6]/30 pl-4 max-w-[90%] transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                                {category.desc}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default BentoCard
