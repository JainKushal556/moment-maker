import { useContext } from 'react'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import Orb from './Orb'
import { ViewContext } from '../../context/NavContext'
import '../../styles/bigCta.css'

/* ── Sparkle SVG Icon ── */
function SparkleIcon({ className = '' }) {
  return (
    <svg className={`cta-sparkle-icon ${className}`} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 0C12 6.62742 6.62742 12 0 12C6.62742 12 12 17.3726 12 24C12 17.3726 17.3726 12 24 12C17.3726 12 12 6.62742 12 0Z" />
    </svg>
  )
}

/* ── 4-point Star ── */
function Star({ className = '' }) {
  return <span className={`cta-star ${className}`} aria-hidden="true">✦</span>
}

/* ── Main Component ── */
export default function BigCta() {
  const [, navigateTo] = useContext(ViewContext)

  return (
    <section className="big-cta" aria-label="Call to action">

      {/* ── Ambient Background Orbs ── */}
      <div className="big-cta__orb big-cta__orb--purple-left" aria-hidden="true" />
      <div className="big-cta__orb big-cta__orb--teal-right"  aria-hidden="true" />
      <div className="big-cta__orb big-cta__orb--violet-mid"  aria-hidden="true" />

      {/* ── Scattered Stars ── */}
      <div className="big-cta__starfield" aria-hidden="true">
        <Star className="s1" /><Star className="s2" /><Star className="s3" />
        <Star className="s4" /><Star className="s5" /><Star className="s6" />
        <Star className="s7" /><Star className="s8" /><Star className="s9" />
        <Star className="s10" /><Star className="s11" /><Star className="s12" />
        <span className="cta-dot d1" /><span className="cta-dot d2" />
        <span className="cta-dot d3" /><span className="cta-dot d4" />
        <span className="cta-dot d5" /><span className="cta-dot d6" />
        <span className="cta-dot d7" /><span className="cta-dot d8" />
      </div>

      {/* ── Central Content ── */}
      <div className="big-cta__center">

        {/* Badge */}
        <div className="big-cta__badge">
          <SparkleIcon /> Create. Personalize. Delight.
        </div>

        {/* ═══════════════════════════════════════════════
            REACT BITS GLOWING CIRCLE
            ═══════════════════════════════════════════════ */}
        <div className="big-cta__ring-slot" aria-hidden="true">
          <Orb
            hoverIntensity={2}
            rotateOnHover
            hue={0}
            forceHoverState={false}
            backgroundColor="#000000" /* Black translates to transparent in the Orb shader */
          />
        </div>
        {/* ═══════════════════════════════════════════════ */}

        {/* Headline */}
        <div className="big-cta__headline-group">
          <h2 className="big-cta__title">
            Create a Wish
            <span className="big-cta__title-gradient">They'll Never Forget</span>
          </h2>
          <p className="big-cta__subtitle">
            Easily craft personalized, interactive<br />wishes in minutes.
          </p>
        </div>

        {/* Cat mascot zone — cat peeking over the card */}
        <div className="big-cta__cat-zone">
          {/* Dark glassy card behind cat */}
          <div className="big-cta__cat-card" aria-hidden="true" />

          {/* Sparkles around cat */}
          <span className="big-cta__cat-sparkle csp1" aria-hidden="true">✦</span>
          <span className="big-cta__cat-sparkle csp2" aria-hidden="true">✦</span>
          <span className="big-cta__cat-sparkle csp3" aria-hidden="true">✦</span>
          <span className="big-cta__cat-sparkle csp4" aria-hidden="true">✦</span>

          <DotLottieReact
            className="big-cta__cat-player"
            src="https://lottie.host/153500aa-4176-4f36-bf8c-1772eb25b622/9q6lenAcE0.lottie"
            autoplay
            loop
            aria-hidden="true"
            stateMachineId="StateMachine1"
          />

          {/* Invisible clickable layer over the Lottie's baked-in button */}
          <button 
            className="big-cta__hitbox" 
            onClick={() => navigateTo('categories')}
            aria-label="Get Started — Create your wish"
          />
        </div>

      </div>

    </section>
  )
}
