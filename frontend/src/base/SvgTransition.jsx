import { useRef, useImperativeHandle, forwardRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

/**
 * Full-screen SVG stroke transition overlay.
 * Ported directly from svg_transition — no modifications to the animation logic.
 * 
 * Usage: parent gets a ref and calls ref.current.play(colors) → returns a Promise
 * that resolves at the midpoint (screen fully covered) so the parent can swap views.
 */
const SvgTransition = forwardRef(function SvgTransition(_, ref) {
    const path1Ref = useRef(null)
    const path2Ref = useRef(null)

    const { contextSafe } = useGSAP()

    // Color mapping per transition type
    const COLOR_MAP = {
        landing: ['#ff3d6a', '#d5ababff'],
        categories: ['#ff3d6a', '#d5ababff'],
        preview: ['#6E44FF', '#d59fdfff'],
        editor: ['#ff3d6a', '#d5ababff'],
        share: ['#39e6d0', '#88e7d3ff'],
    }

    const play = contextSafe((targetView) => {
        return new Promise((resolve) => {
            const paths = [path1Ref.current, path2Ref.current]
            if (!paths[0] || !paths[1]) { resolve(); return }

            const colors = COLOR_MAP[targetView] || COLOR_MAP.landing

            gsap.killTweensOf(paths)

            // Initial SVG Setup
            paths.forEach((path, index) => {
                const length = path.getTotalLength()
                const color = colors[index] || colors[0]
                gsap.set(path, {
                    strokeDasharray: length,
                    strokeDashoffset: length,
                    opacity: 1,
                    stroke: color,
                    strokeWidth: 20,
                })
            })

            const tl = gsap.timeline()

            // Phase 1: Screen Fill Animation
            paths.forEach((path) => {
                tl.to(path, {
                    strokeDashoffset: 0,
                    strokeWidth: 650,
                    duration: 0.7,
                    ease: 'power2.out',
                }, 0)
            })

            // At midpoint — screen is fully covered — resolve so parent can swap the view
            tl.call(() => resolve(), null, 0.6)

            // Phase 2: Exit Forward Animation
            paths.forEach((path) => {
                const length = path.getTotalLength()
                tl.to(path, {
                    strokeDashoffset: -length,
                    strokeWidth: 20,
                    duration: 1.2,
                    ease: 'power2.inOut',
                }, 0.8)
            })
        })
    })

    useImperativeHandle(ref, () => ({ play }))

    return (
        <div className="viewport-overlay">
            <div className="overlay-stroke">
                <svg viewBox="0 0 2453 2535" fill="none" preserveAspectRatio="none">
                    {/* Path 1 */}
                    <path
                        ref={path1Ref}
                        d="M227.549 1818.76C227.549 1818.76 406.016 2207.75 569.049 2130.26C843.431 1999.85 -264.104 1002.3 227.549 876.262C552.918 792.849 773.647 2456.11 1342.05 2130.26C1885.43 1818.76 14.9644 455.772 760.548 137.262C1342.05 -111.152 1663.5 2266.35 2209.55 1972.76C2755.6 1679.18 1536.63 384.467 1826.55 137.262C2013.5 -22.1463 2209.55 381.262 2209.55 381.262"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    {/* Path 2 */}
                    <path
                        ref={path2Ref}
                        d="M1661.28 2255.51C1661.28 2255.51 2311.09 1960.37 2111.78 1817.01C1944.47 1696.67 718.456 2870.17 499.781 2255.51C308.969 1719.17 2457.51 1613.83 2111.78 963.512C1766.05 313.198 427.949 2195.17 132.281 1455.51C-155.219 736.292 2014.78 891.514 1708.78 252.012C1437.81 -314.29 369.471 909.169 132.281 566.512C18.1772 401.672 244.781 193.012 244.781 193.012"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </div>
        </div>
    )
})

export default SvgTransition
