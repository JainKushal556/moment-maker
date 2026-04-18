import { useRef } from 'react'
import gsap from 'gsap'

const BentoCard = ({ category, onClick }) => {
    const cardRef = useRef(null)
    const contentRef = useRef(null)
    const iconRef = useRef(null)

    const isLarge = category.size === 'large'
    const isMedium = category.size === 'medium'

    const handleMouseEnter = () => {
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
            onClick={() => onClick(category)}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={`bento-card group relative overflow-hidden cursor-pointer
                ${sizeClasses}
                rounded-3xl border border-white/10 hover:border-[#f472b6]/50
                transition-[border-color] duration-500 bg-[#0a0a12]
            `}
            data-category-id={category.id}
        >
            {/* Background Image — Fully visible always */}
            <div className="absolute inset-0 overflow-hidden">
                <img
                    src={category.img}
                    alt={category.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    style={{ filter: 'brightness(0.7)', willChange: 'transform' }}
                    loading="lazy"
                />
            </div>

            {/* Light Vignette / Text Readability gradient from bottom */}
            <div className="absolute inset-0 bg-black/30" />
            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-linear-to-t from-[#0a0a12] via-[#0a0a12]/80 to-transparent z-10" />

            {/* Content Container */}
            <div 
                ref={contentRef}
                className="relative h-full flex flex-col justify-between z-20"
                style={{ padding: isLarge ? '3.5rem' : '2.5rem' }}
            >
                {/* Top Header Log */}
                <div className="flex justify-between items-start">
                    <div className="flex gap-3 items-center">
                        <div
                            ref={iconRef}
                            className="bento-icon flex items-center justify-center text-white/60"
                            style={{ willChange: 'transform' }}
                        >
                            {category.icon}
                        </div>
                        {isLarge && (
                            <span className="font-mono text-[9px] text-[#f472b6] tracking-[0.3em] uppercase">
                                FEELING: LOVELY
                            </span>
                        )}
                    </div>
                    
                    <span
                        className="bento-tag text-[9px] font-bold uppercase tracking-[0.3em] text-white/50 group-hover:text-[#f472b6] bg-black/40 px-3 py-1 border border-white/10 group-hover:border-[#f472b6]/30 transition-all backdrop-blur-md rounded-full"
                    >
                        {category.tag}
                    </span>
                </div>

                {/* Bottom Body */}
                <div>
                    {(isLarge || isMedium) && (
                        <p className="font-mono text-[10px] text-[#f472b6] uppercase tracking-[0.3em] mb-5">
                            {category.subtitle}
                        </p>
                    )}
                    <h3
                        className="font-montserrat font-black tracking-tighter text-white leading-[1] uppercase group-hover:text-white transition-colors"
                        style={{
                            fontSize: isLarge ? 'clamp(3rem, 5vw, 5rem)' : isMedium ? 'clamp(2rem, 3vw, 3rem)' : 'clamp(1.5rem, 2vw, 2.5rem)',
                            marginBottom: '1.5rem'
                        }}
                    >
                        {category.title}
                    </h3>
                    
                    {(isLarge || isMedium) && (
                        <div className="overflow-hidden">
                            <p className="text-white/50 text-xs font-mono uppercase tracking-widest leading-relaxed border-l-2 border-[#f472b6]/30 pl-4 max-w-[90%] transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
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
