import { useEffect, useRef, useContext } from 'react'
import { ViewContext } from '../../context/NavContext'
import '../../styles/bigCta.css'

/* ── Sparkle SVG ── */
function SparkleIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path
        d="M12 0C12 6.62742 6.62742 12 0 12C6.62742 12 12 17.3726 12 24C12 17.3726 17.3726 12 24 12C17.3726 12 12 6.62742 12 0Z"
        fill="currentColor"
      />
    </svg>
  )
}

/* ── Animated wave layer ── */
function AnimatedWaveLayer({ color, layerClass, speed = 0.05 }) {
  const pathRef = useRef(null)
  const rafRef = useRef()
  const wrapRef = useRef(null)

  useEffect(() => {
    const startTime = performance.now()
    let isVisible = false

    const animate = (time) => {
      if (!isVisible) return
      const elapsed = time - startTime
      const offset = (elapsed * speed) % 100

      let d = 'M -100 0 '
      for (let x = -100; x <= 1500; x += 100) {
        d += `Q ${x + 25 - offset} 15 ${x + 50 - offset} 0 `
        d += `T ${x + 100 - offset} 0 `
      }
      d += 'L 1600 -50 L -200 -50 Z'

      if (pathRef.current) pathRef.current.setAttribute('d', d)
      rafRef.current = requestAnimationFrame(animate)
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          isVisible = true
          rafRef.current = requestAnimationFrame(animate)
        } else {
          isVisible = false
          cancelAnimationFrame(rafRef.current)
        }
      })
    }, { rootMargin: '200px', threshold: 0 })

    if (wrapRef.current) observer.observe(wrapRef.current)

    return () => {
      cancelAnimationFrame(rafRef.current)
      observer.disconnect()
    }
  }, [speed])

  return (
    <div ref={wrapRef} className={`big-cta__wave-layer ${layerClass}`}>
      <div className="big-cta__wave-fill" style={{ backgroundColor: color }} />
      <div className="big-cta__wave-svg-wrap" style={{ color }}>
        <svg viewBox="0 -20 1400 35">
          <path ref={pathRef} />
        </svg>
      </div>
    </div>
  )
}

/* ── Main component ── */
export default function BigCta() {
  const [, navigateTo] = useContext(ViewContext)

  return (
    <section className="big-cta">
      {/* Background layers */}
      <AnimatedWaveLayer
        color="#FDC429"
        layerClass="big-cta__wave-layer--yellow"
        speed={0.03}
      />
      <AnimatedWaveLayer
        color="#481b7a"
        layerClass="big-cta__wave-layer--purple"
        speed={0.05}
      />

      {/* Content */}
      <div className="big-cta__content">
        <h2 className="big-cta__title">
          Create a Wish They'll Never Forget
        </h2>
        <p className="big-cta__subtitle">
          Easily craft personalized, interactive wishes in minutes.
        </p>

        <div className="big-cta__actions">
          <button 
            className="big-cta__btn"
            onClick={() => navigateTo('categories')}
          >
            Start Creating
          </button>
          <button 
            onClick={() => navigateTo('categories')}
            className="big-cta__link"
          >
            See Examples{' '}
            <span className="big-cta__link-arrow">&gt;</span>
          </button>
        </div>

        {/* Ambient sparkles (visible ≥ 768 px) */}
        <SparkleIcon className="big-cta__sparkle big-cta__sparkle--1" />
        <SparkleIcon className="big-cta__sparkle big-cta__sparkle--2" />
        <SparkleIcon className="big-cta__sparkle big-cta__sparkle--3" />
        <SparkleIcon className="big-cta__sparkle big-cta__sparkle--4" />
      </div>
    </section>
  )
}
