import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import './Preloader.css';

// Helper to pass ref to SVG
const MMarkSVG = ({ className, mMarkRef }) => (
  <svg
    ref={mMarkRef}
    className={className}
    width="338"
    height="363"
    viewBox="0 0 338 363"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <text
      x="50%"
      y="55%"
      dominantBaseline="middle"
      textAnchor="middle"
      fontSize="320"
      fontWeight="750"
      fontFamily="inherit"
      fill="white"
    >
      M
    </text>
  </svg>
);

const OriginalArrowSVG = ({ className }) => (
  <img className={className} src="/arrow.svg" alt="arrow" />
);

// Integration changes from loader-reference/src/App.jsx:
// 1. loadProgress comes as a prop (not local state) — parent (App.jsx) controls it
// 2. onComplete callback replaces dummy-site rendering
// 3. containerRef added to scope GSAP queries inside the preloader only
// 4. Root div uses className="preloader-overlay" with fixed positioning
export default function Preloader({ loadProgress = 0, onComplete, onOrbitStart }) {
  const [phase, setPhase] = useState('loading'); // loading, reveal, giantSlide, showEnt, showEr, meetAndZoom, orbitReveal, iconOrbit, actualSite
  const [loopCount, setLoopCount] = useState(0);
  
  const mMarkRef = useRef(null);
  const loadProgressRef = useRef(0);
  const containerRef = useRef(null);

  // Counter Refs
  const counter1Ref = useRef(null);
  const counter2Ref = useRef(null);
  const counter3Ref = useRef(null);
  const counterTls = useRef([]);

  // Sync loadProgress to a ref for access inside timeouts
  useEffect(() => {
    loadProgressRef.current = loadProgress;
  }, [loadProgress]);

  // Setup GSAP Timelines for Counter
  useEffect(() => {
    // Generate counter 3 (units): 101 digits (0 to 100)
    const c3 = counter3Ref.current;
    if (c3) {
      c3.innerHTML = ''; 
      for (let i = 0; i <= 100; i++) {
        const div = document.createElement("div");
        div.className = "num";
        div.textContent = i % 10;
        c3.appendChild(div);
      }
    }

    // Generate counter 2 (tens): 11 digits (0 to 10)
    const c2 = counter2Ref.current;
    if (c2) {
      c2.innerHTML = '';
      for (let i = 0; i <= 10; i++) {
        const div = document.createElement("div");
        div.className = "num";
        div.textContent = i % 10;
        c2.appendChild(div);
      }
    }

    // Generate counter 1 (hundreds): 2 digits (0 to 1)
    const c1 = counter1Ref.current;
    if (c1) {
      c1.innerHTML = '';
      for (let i = 0; i <= 1; i++) {
        const div = document.createElement("div");
        div.className = "num";
        div.textContent = i;
        c1.appendChild(div);
      }
    }
  }, []);

  // Update GSAP Counter Timelines when loadProgress changes
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const numElement = container.querySelector(".num");
    if (!numElement) return;
    const numHeight = numElement.clientHeight;

    // Calculate exact target indices for each column
    const unitsIndex = loadProgress; // 0 to 100
    const tensIndex = Math.floor(loadProgress / 10); // 0 to 10
    const hundredsIndex = Math.floor(loadProgress / 100); // 0 to 1

    // Animate to precise integer heights to prevent "collapsed" or halfway digits
    gsap.to(counter3Ref.current, { y: -unitsIndex * numHeight, duration: 0.8, ease: "power2.out" });
    gsap.to(counter2Ref.current, { y: -tensIndex * numHeight, duration: 0.8, ease: "power2.out" });
    gsap.to(counter1Ref.current, { y: -hundredsIndex * numHeight, duration: 0.8, ease: "power2.out" });

    // Hide counter digits when it hits 100%
    if (loadProgress >= 100) {
      container.querySelectorAll(".digit").forEach(el => {
        gsap.to(el, {
          top: "-150px",
          stagger: { amount: 0.25 },
          delay: 0.2,
          duration: 1,
          ease: "power4.inOut",
        });
      });
    }
  }, [loadProgress]);

  useEffect(() => {
    if (phase === 'loading') {
      const mMark = mMarkRef.current;
      if (!mMark) return;

      const spinAnim = mMark.animate(
        [
          { offset: 0, transform: 'rotate(0deg)', easing: 'cubic-bezier(1, 0.01, 1, 1)' },
          { offset: 0.4, transform: 'rotate(180deg)', easing: 'cubic-bezier(0, 0, 0, 1)' },
          { offset: 0.8, transform: 'rotate(360deg)', easing: 'cubic-bezier(1, 0.01, 1, 1)' },
          { offset: 1, transform: 'rotate(360deg)' }
        ],
        { duration: 1200, iterations: 1, fill: 'forwards' }
      );

      spinAnim.onfinish = () => {
        setTimeout(() => setPhase('reveal'), 200);
      };

      return () => spinAnim.cancel();
    }

    if (phase === 'reveal') {
      setTimeout(() => setPhase('giantSlide'), 650);
    }

    if (phase === 'giantSlide') {
      setTimeout(() => setPhase('showEnt'), 850);
    }

    if (phase === 'showEnt') {
      setTimeout(() => setPhase('showEr'), 600);
    }

    if (phase === 'showEr') {
      setTimeout(() => setPhase('meetAndZoom'), 400);
    }

    if (phase === 'meetAndZoom') {
      setTimeout(() => setPhase('orbitReveal'), 1500);
    }

    if (phase === 'orbitReveal') {
      setTimeout(() => setPhase('iconOrbit'), 1000);
    }

    if (phase === 'iconOrbit') {
      // Notify parent to start mounting AppContent in the background
      if (onOrbitStart) onOrbitStart();
      setTimeout(() => setPhase('iconOrbitDone'), 1600);
    }
  }, [phase]);

  // Wait for BOTH the animation sequence to finish AND the network to reach 100%
  useEffect(() => {
    if (phase === 'iconOrbitDone' && loadProgress >= 100) {
      if (onComplete) onComplete();
    }
  }, [phase, loadProgress, onComplete]);

  if (phase === 'actualSite') return null;

  return (
    <div ref={containerRef} className="preloader-overlay" style={{ position: 'fixed', inset: 0, zIndex: 99999 }}>
      {/* COUNTER (Standalone) */}
      <div className="counter" style={{ zIndex: 100 }}>
        <div className="counter-1 digit" ref={counter1Ref}>
          <div className="num">0</div>
          <div className="num">1</div>
        </div>
        <div className="counter-2 digit" ref={counter2Ref}>
          <div className="num">0</div>
          <div className="num">1</div>
          <div className="num">2</div>
          <div className="num">3</div>
          <div className="num">4</div>
          <div className="num">5</div>
          <div className="num">6</div>
          <div className="num">7</div>
          <div className="num">8</div>
          <div className="num">9</div>
          <div className="num">0</div>
        </div>
        <div className="counter-3 digit" ref={counter3Ref}>
          {/* numbers will be added here with javascript */}
        </div>
      </div>

      {/* PHASE 1: Spinning H */}
      {phase === 'loading' && (
        <div className="loader">
          <MMarkSVG className="h-mark spinning" mMarkRef={mMarkRef} />
        </div>
      )}

      {/* PHASE 2: Arrow Reveal Slide (Normal Size) */}
      {phase === 'reveal' && (
        <div className="slide-container">
          <div className="back-market-reveal">
            <div className="logo-box-wrapper">
              <div className="white-box"></div>
            </div>
            <span className="back-market-text" style={{ opacity: 0.15 }}>
              Moment Crafter
            </span>
            <OriginalArrowSVG className="arrow-reveal-slide" />
          </div>
        </div>
      )}

      {/* PHASE 3: Giant Fixed Arrow & Sliding Text */}
      {phase === 'giantSlide' && (
        <div className="slide-container">
          {/* Fixed Giant Arrow in the center of the screen */}
          <OriginalArrowSVG className="giant-arrow" />

          <div className="giant-slide-wrapper">
            <div className="logo-box-wrapper">
              <div className="white-box"></div>
            </div>
            <span className="back-market-text text-outline">
              Moment Crafter
            </span>
          </div>
        </div>
      )}

      {/* PHASE 3.5: Instant cut — show "ent" at same zoom */}
      {phase === 'showEnt' && (
        <div className="slide-container">
          <div className="show-ent-wrapper">
            <div className="logo-box-wrapper">
              <div className="white-box"></div>
            </div>
            <span className="back-market-text text-outline">
              Moment Crafter
            </span>
          </div>
        </div>
      )}

      {/* PHASE 3.75: Instant cut — show "er" from Crafter */}
      {phase === 'showEr' && (
        <div className="slide-container">
          <div className="show-er-wrapper">
            <div className="logo-box-wrapper">
              <div className="white-box"></div>
            </div>
            <span className="back-market-text text-outline">
              Moment Crafter
            </span>
          </div>
        </div>
      )}

      {/* PHASE 3.8: MEET AND ZOOM OUT */}
      {phase === 'meetAndZoom' && (
        <div className="slide-container">
          <div className="meet-zoom-wrapper">
            <div className="meet-left">
              <div className="logo-box-wrapper">
                <div className="white-box"></div>
                <OriginalArrowSVG className="docked-arrow-fixed" />
              </div>
              <span className="back-market-text">Moment&nbsp;</span>
            </div>
            <div className="meet-right">
              <span className="back-market-text">Crafter</span>
            </div>
          </div>
        </div>
      )}

      {/* PHASE 3.9 PART 1: slide left + right clip + icon squish */}
      {phase === 'orbitReveal' && (
        <div className="slide-container">
          <div className="orbit-slide-wrapper">
            <div className="orbit-icon-box">
              <div className="logo-box-wrapper">
                <div className="white-box"></div>
                <OriginalArrowSVG className="docked-arrow-fixed" />
              </div>
            </div>
            <div className="orbit-text-clip">
              <span className="back-market-text">Moment Crafter</span>
            </div>
          </div>
        </div>
      )}

      {/* PHASE 4: ICON ORBIT — pivot+arm circular 3D path */}
      {phase === 'iconOrbit' && (
        <div className="icon-orbit-scene">
          <div className="icon-orbit-pivot">
            <div className="icon-orbit-arm">
              <div className="logo-box-wrapper">
                <OriginalArrowSVG className="docked-arrow-fixed icon-orbit-svg" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
