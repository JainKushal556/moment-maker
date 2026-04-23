import { useEffect, useRef, useState } from 'react';
import { useCustomization } from '../context/CustomizationContext.jsx';

/* ─── Carousel config ────────────────────────────────────────────── */
const RADIUS       = 240;
const AUTO_ROTATE  = true;
const ROTATE_SPEED = -60;   // seconds / 360°  (negative = spinRevert)
const IMG_WIDTH    = 120;
const IMG_HEIGHT   = 170;

/* ─── Photo sources — put your real photos in /public/images/ ─────── */
// Fallback photo sources if customization is missing
const DEFAULT_PHOTOS = [
  './images/r1.png', './images/r2.png', './images/r3.png', './images/r4.png', './images/r5.jpg',
];

/* Gradient placeholders for any missing photos */
const FALLBACK_COLORS = [
  'linear-gradient(135deg,#ff9a9e,#fad0c4)',
  'linear-gradient(135deg,#a18cd1,#fbc2eb)',
  'linear-gradient(135deg,#ffecd2,#fcb69f)',
  'linear-gradient(135deg,#f6d365,#fda085)',
  'linear-gradient(135deg,#84fab0,#8fd3f4)',
  'linear-gradient(135deg,#cfd9df,#e2ebf0)',
  'linear-gradient(135deg,#f093fb,#f5576c)',
  'linear-gradient(135deg,#4facfe,#00f2fe)',
  'linear-gradient(135deg,#43e97b,#38f9d7)',
  'linear-gradient(135deg,#fa709a,#fee140)',
];


/* ─── Component ───────────────────────────────────────────────────── */
export default function CarouselStage({ name: propName }) {
  const { recipientName, images } = useCustomization();
  const name = recipientName || propName;
  
  // Use customized images, repeat to fill 10 slots. 
  // If images array is empty or missing, use internal defaults.
  const photosToDisplay = (images && images.length > 0) 
    ? [...images, ...images].slice(0, 10) 
    : [...DEFAULT_PHOTOS, ...DEFAULT_PHOTOS].slice(0, 10);

  const dragRef = useRef(null);
  const spinRef = useRef(null);
  const gndRef  = useRef(null);
  const rad     = useRef(RADIUS);
  const tX      = useRef(0);
  const tY      = useRef(10);
  const dX      = useRef(0);
  const dY      = useRef(0);
  const dtimer  = useRef(null);
  const [errMap, setErrMap] = useState({});

  const reposition = (delay) => {
    const spin = spinRef.current; if (!spin) return;
    const els = [...spin.querySelectorAll('img, .carousel-ph')];
    els.forEach((el, i) => {
      el.style.transform = `rotateY(${i*(360/els.length)}deg) translateZ(${rad.current}px)`;
      el.style.transition = 'transform 1s';
      el.style.transitionDelay = delay != null ? `${delay}s` : `${(els.length-i)/4}s`;
    });
  };

  const applyDrag = () => {
    const drag = dragRef.current; if (!drag) return;
    let ty = Math.max(0, Math.min(180, tY.current));
    drag.style.transform = `rotateX(${-ty}deg) rotateY(${tX.current}deg)`;
  };

  const playSpin = (yes) => {
    if (spinRef.current) spinRef.current.style.animationPlayState = yes ? 'running' : 'paused';
  };



  useEffect(() => {
    // Size spin + ground
    if (spinRef.current) { spinRef.current.style.width=`${IMG_WIDTH}px`; spinRef.current.style.height=`${IMG_HEIGHT}px`; }
    if (gndRef.current)  { gndRef.current.style.width=`${rad.current*3}px`; gndRef.current.style.height=`${rad.current*3}px`; }

    // Auto-rotate
    if (AUTO_ROTATE && spinRef.current) {
      spinRef.current.style.animation = `${ROTATE_SPEED>0?'spin':'spinRevert'} ${Math.abs(ROTATE_SPEED)}s infinite linear`;
    }

    setTimeout(() => reposition(), 1000);



    // Wheel zoom
    const onWheel = (e) => { rad.current += (e.wheelDelta||(-e.deltaY))/20; reposition(1); };
    document.addEventListener('wheel', onWheel, { passive: true });

    // Drag
    const onDown = (e) => {
      clearInterval(dtimer.current);
      let sx = e.clientX, sy = e.clientY;
      const onMove = (e) => {
        dX.current = e.clientX-sx; dY.current = e.clientY-sy;
        tX.current += dX.current*.1; tY.current += dY.current*.1;
        applyDrag(); sx = e.clientX; sy = e.clientY;
      };
      const onUp = () => {
        dtimer.current = setInterval(() => {
          dX.current *= .95; dY.current *= .95;
          tX.current += dX.current*.1; tY.current += dY.current*.1;
          applyDrag(); playSpin(false);
          if (Math.abs(dX.current)<.5 && Math.abs(dY.current)<.5) { clearInterval(dtimer.current); playSpin(true); }
        }, 17);
        document.removeEventListener('pointermove', onMove);
        document.removeEventListener('pointerup', onUp);
      };
      document.addEventListener('pointermove', onMove);
      document.addEventListener('pointerup', onUp);
    };
    document.addEventListener('pointerdown', onDown);

    return () => {
      document.removeEventListener('wheel', onWheel);
      document.removeEventListener('pointerdown', onDown);
      clearInterval(dtimer.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="carousel-root">


      <audio autoPlay loop className="hidden-audio">
        <source src="./music/setlove.mp3" type="audio/mpeg" />
      </audio>

      <div className="carousel-wrapper">
        <div id="drag-container" ref={dragRef}>
        <div id="spin-container" ref={spinRef}>
          {photosToDisplay.map((src, i) =>
            errMap[i] || !src ? (
              <div
                key={i}
                className="carousel-photo carousel-ph"
                style={{
                  background: FALLBACK_COLORS[i % FALLBACK_COLORS.length],
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '2rem', borderRadius: '6px',
                }}
              >📸</div>
            ) : (
              <img
                key={i}
                src={src}
                alt={`Memory ${i+1}`}
                className="carousel-photo carousel-ph"
                onError={() => setErrMap(p => ({ ...p, [i]: true }))}
              />
            )
          )}
          <p className="carousel-label">Happy Birthday {name || 'Rashmii'} 🎂</p>
        </div>
        <div id="ground" ref={gndRef} />
        </div>
      </div>
    </div>
  );
}
