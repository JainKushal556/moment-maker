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

    // Strict mobile layout mapping (only for screens < 768px)
    const getMobileSpans = (id) => {
        switch (id) {
            case 'birthday': return 'col-span-2 row-span-1'; // Pos 1: Wide Full
            case 'friendship': return 'col-span-1 row-span-1'; // Pos 2: Half
            case 'compliment': return 'col-span-1 row-span-1'; // Pos 3: Half
            case 'proposal': return 'col-span-2 row-span-1'; // Pos 4: Wide Full
            case 'miss-you': return 'col-span-1 row-span-1'; // Pos 5: Half
            case 'anniversary': return 'col-span-1 row-span-1'; // Pos 6: Half
            case 'festivals': return 'col-span-1 row-span-1'; // Pos 7: Half
            case 'others': return 'col-span-1 row-span-1'; // Pos 8: Half
            default: return 'col-span-1 row-span-1';
        }
    }

    const mobileSpans = getMobileSpans(category.id);

    // Grid sizing: uses strict diagram mapping for mobile, original logic for desktop
    const sizeClasses = isLarge
        ? `${mobileSpans} md:col-span-2 md:row-span-2`
        : isMedium
            ? `${mobileSpans} md:col-span-2 md:row-span-1`
            : `${mobileSpans} md:col-span-1 md:row-span-1`

    return (
        <div
            ref={cardRef}
            onClick={() => !isComingSoon && onClick(category)}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={`bento-card group relative overflow-hidden transition-all duration-500 bg-[#0a0a12]
                ${sizeClasses}
                ${isComingSoon ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:border-[#f472b6]/50'}
                rounded-2xl md:rounded-3xl border border-white/10
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
            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#0a0a12] via-[#0a0a12]/80 to-transparent z-10" />

            {/* Content Container */}
            <div 
                ref={contentRef}
                className="relative h-full flex flex-col justify-between z-20"
                style={{ 
                    padding: isLarge 
                        ? 'clamp(1.5rem, 5vw, 3.5rem)' 
                        : 'clamp(1rem, 3vw, 1.75rem)' 
                }}
            >
                {/* Top Header */}
                <div className="flex justify-between items-start gap-2">
                    <div className="flex gap-2 md:gap-3 items-center">
                        <div
                            ref={iconRef}
                            className="bento-icon flex items-center justify-center text-white/90"
                            style={{ willChange: 'transform' }}
                        >
                            {category.icon}
                        </div>
                        {isLarge && !isComingSoon && (
                            <span className="font-mono text-[8px] md:text-[9px] text-[#f472b6] tracking-[0.2em] md:tracking-[0.3em] uppercase">
                                FEELING: LOVELY
                            </span>
                        )}
                    </div>
                    
                    {/* Template Count / Coming Soon Tag */}
                    <div className="flex flex-col items-end gap-2">
                        {isComingSoon ? (
                            <span className="text-[7px] md:text-[8px] font-bold uppercase tracking-[0.15em] md:tracking-[0.2em] text-white/40 bg-white/5 px-2 md:px-3 py-1 md:py-1 border border-white/10 backdrop-blur-md rounded-full">
                                COMING SOON
                            </span>
                        ) : (
                            <span className="text-[8px] md:text-[9px] font-bold uppercase tracking-[0.2em] md:tracking-[0.3em] text-[#f472b6] bg-[#f472b6]/10 px-3 md:px-4 py-1 md:py-1.5 border border-[#f472b6]/30 backdrop-blur-md rounded-full shadow-[0_0_15px_rgba(244,114,182,0.2)]">
                                {templateCount} {templateCount === 1 ? 'MOMENT' : 'MOMENTS'}
                            </span>
                        )}
                    </div>
                </div>

                {/* Bottom Body */}
                <div className="w-full">
                    <p className="font-mono text-[9px] md:text-[10px] text-[#f472b6] uppercase tracking-[0.2em] md:tracking-[0.3em] mb-1 md:mb-4 opacity-70 min-h-[1.2rem] md:min-h-0">
                        {category.subtitle}
                    </p>
                    <h3
                        className={`font-montserrat font-black tracking-tighter text-white leading-[1] uppercase transition-colors break-words 
                            ${mobileSpans.includes('col-span-2') ? 'text-[clamp(1.8rem,5vw,4.5rem)]' : 'text-[clamp(1.3rem,3.5vw,2.4rem)]'} 
                            ${isLarge ? 'md:text-[clamp(1.8rem,5vw,4.5rem)]' : isMedium ? 'md:text-[clamp(1.3rem,3.5vw,2.4rem)]' : 'md:text-[clamp(1.05rem,1.8vw,1.25rem)]'}
                        `}
                        style={{
                            marginBottom: '0.75rem' // Unified margin for perfect alignment
                        }}
                    >
                        {category.title}
                    </h3>
                    
                    {(isLarge || isMedium) && !isComingSoon && (
                        <div className="hidden sm:block overflow-hidden">
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
