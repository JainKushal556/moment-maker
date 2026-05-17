import { useState, useEffect, useRef } from 'react';
import './App.css';


/* ══════════════════════════════════════════════
   SLIDE 2 – Inside Joke Quiz
══════════════════════════════════════════════ */
const QUIZ = [
  {
    title: <>Before we continue... <span className="s2-emoji">💌</span></>,
    q: "Can I borrow your trust for a moment?",
    opts: ["Always 💖", "Not really 😭"],
    ans: 0,
  },
  {
    title: <>Then tell me honestly... <span className="s2-emoji">🌸</span></>,
    q: "Have I quietly become\na little part of your heart? 🌸",
    opts: ["More than you know 💞", "No 😭"],
    ans: 0,
  },
];

const SAD_MESSAGES = [
  "That answer wounded my tiny little heart... 💔",
  "You clicked “No” like it was nothing 😭",
  "Even the flowers look disappointed now 🌸",
  "I was hoping for a sweeter answer... 🥺",
  "Are you really that heartless? 😔",
  "My last bit of hope just slipped away... 💞",
  "Okay fine... but this still hurts a little 💔",
  "I’ll pretend I didn’t see that click 😭"
];

const SAD_GIFS = [
  "/templates/proposal/cherry-blossom-proposal/mocha-cry.webp",
  "/templates/proposal/cherry-blossom-proposal/centilia-sad.webp",
  "/templates/proposal/cherry-blossom-proposal/chubby-tonton.webp",
  "/templates/proposal/cherry-blossom-proposal/cosytales-couple.webp",
  "/templates/proposal/cherry-blossom-proposal/shinchan.webp",
  "/templates/proposal/cherry-blossom-proposal/tkthao219-peach.webp"
];

function Slide2({ onNext }) {
  const [qi, setQi] = useState(0);
  const [shake, setShake] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [noClicks, setNoClicks] = useState(0);
  const [isSad, setIsSad] = useState(false);
  const q = QUIZ[qi];

  useEffect(() => {
    setNoClicks(0); // Reset when question changes
    setIsSad(false);
  }, [qi]);

  const pick = (idx) => {
    if (idx === q.ans) {
      setFadeOut(true);
      setTimeout(() => {
        setFadeOut(false);
        if (qi < QUIZ.length - 1) setQi(qi + 1);
        else onNext();
      }, 700);
    } else {
      if (qi === 1) {
        setIsSad(true);
      }
      setNoClicks(prev => prev + 1);
      setShake(true);
      setTimeout(() => setShake(false), 550);
    }
  };

  return (
    <div className="s2-bg slide-inner">
      {/* Background Orbs for Premium Depth */}
      <div className="s2-orb s2-orb-1" aria-hidden="true" />
      <div className="s2-orb s2-orb-2" aria-hidden="true" />
      <div className="s2-orb s2-orb-3" aria-hidden="true" />

      <div className={`s2-content-wrap ${isSad ? 's2-meme-mode' : ''}`}>
        <div key={qi} className={`s2-animate-wrap ${shake ? ' shake' : ''}${fadeOut ? ' s2-fade' : ''}`} style={{ textAlign: 'center' }}>
          {!isSad ? (
            <h2 className="s2-title">{q.title}</h2>
          ) : (
            <div className="s2-meme-container">
              <img src={SAD_GIFS[(noClicks - 1) % SAD_GIFS.length]} alt="Sad Reaction" className="s2-meme-gif" />
              <p key={noClicks} className="s2-sad-message">{SAD_MESSAGES[(noClicks - 1) % SAD_MESSAGES.length]}</p>
            </div>
          )}
          <p className="s2-question">{q.q}</p>
          <div className="s2-options">
            {q.opts.map((o, i) => {
              const isWrong = i !== q.ans;
              const btnStyle = {
                zIndex: isWrong ? 1 : 10,
                position: 'relative',
                transition: 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                transform: (isWrong && qi === 0) ? `translateX(-${noClicks === 1 ? 30 : noClicks === 2 ? 80 : noClicks >= 3 ? 180 : 0}px)` : 'none',
                opacity: (isWrong && qi === 0 && noClicks >= 3) ? 0 : 1,
                pointerEvents: (isWrong && qi === 0 && noClicks >= 3) ? 'none' : 'auto',
              };
              return (
                <button key={i} className="s2-opt-btn" onClick={() => pick(i)} style={btnStyle}>
                  {o}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}





/* ══════════════════════════════════════════════
   SLIDE 7 – Grand Finale
══════════════════════════════════════════════ */
const CONF_COLORS = ['#d0b0ff', '#f0e6ff', '#fff', '#7c5cbf', '#ff6ec7', '#ffd700'];
const HEART_EMO   = ['✨', '💫', '✦', '💜', '🤍', '🌸', '🪄'];

function Slide7() {
  const confetti = useState(() =>
    [...Array(90)].map((_, i) => ({
      id: i,
      color: CONF_COLORS[i % CONF_COLORS.length],
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 4}s`,
      dur: `${3 + Math.random() * 3}s`,
      w: `${6 + Math.random() * 10}px`,
      h: `${6 + Math.random() * 8}px`,
      rot: `${Math.random() * 360}deg`,
    }))
  )[0];

  const hearts = useState(() =>
    [...Array(22)].map((_, i) => ({
      id: i,
      emoji: HEART_EMO[i % HEART_EMO.length],
      left: `${Math.random() * 95}%`,
      delay: `${Math.random() * 5}s`,
      dur: `${4 + Math.random() * 5}s`,
      size: `${16 + Math.random() * 30}px`,
    }))
  )[0];

  return (
    <div className="s7-bg slide-inner">
      {confetti.map(c => (
        <div key={c.id} className="s7-confetti" style={{
          left: c.left, backgroundColor: c.color,
          width: c.w, height: c.h,
          animationDuration: c.dur, animationDelay: c.delay,
          transform: `rotate(${c.rot})`,
        }} />
      ))}
      {hearts.map(h => (
        <div key={h.id} className="s7-heart" style={{
          left: h.left, fontSize: h.size,
          animationDuration: h.dur, animationDelay: h.delay,
        }}>{h.emoji}</div>
      ))}
      <div className="s7-center glass-card">
        <div className="s7-crown">👑</div>
        <h1 className="s7-title">She Said Yes! 🎉</h1>
        <p className="s7-subtitle">You just made the world a little more beautiful.</p>
        <p className="s7-message">
          "Every love story is beautiful,<br />but ours is my favourite…"
        </p>
        <a href="https://wa.me/?text=A%20small%20message%20just%20for%20you%20%F0%9F%92%8C"
          target="_blank" rel="noopener noreferrer" className="s7-letter-btn">
          💌 A small message for you
        </a>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   NEW SLIDE: Emotional Transition
══════════════════════════════════════════════ */
const TRANSITION_KEYS = [
  "ACTUALLY...",
  "BASICALLY...",
  "MENTALLY...",
  "EMOTIONALLY...",
  "AND FINALLY..."
];

function EmotionalTransition({ onNext, config }) {
  const [step, setStep] = useState(0);
  const [show, setShow] = useState(true);
  
  const texts = config?.transitionTexts || [
    "I never meant to fall this hard.",
    "you became my favorite thought.",
    "you’ve been living in my mind rent free.",
    "my heart already chose you. 💞",
    "there’s something I need to tell you. 🌸"
  ];

  const nextStep = () => {
    if (step < TRANSITION_KEYS.length - 1) {
      setShow(false);
      setTimeout(() => {
        setStep(s => s + 1);
        setShow(true);
      }, 950); // Increased delay for smoother cross-fade
    } else {
      setShow(false);
      setTimeout(onNext, 1100);
    }
  };

  return (
    <div className={`et-bg slide-inner et-step-${step}`} onClick={nextStep} style={{ cursor: 'pointer' }}>
      <div className="et-overlay" />
      
      {/* Floating Petals - Minimal & Slow */}
      <div className="et-petals" aria-hidden="true">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="et-petal" style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 8}s`,
            animationDuration: `${15 + Math.random() * 15}s`
          }}>🌸</div>
        ))}
      </div>

      <div className={`et-content-wrap ${show ? 'et-show' : ''}`}>
        <div key={step} className="et-text-box">
          <span className="et-keyword">{TRANSITION_KEYS[step]}</span>
          <p className="et-sentence">{texts[step]}</p>
        </div>
        
        {step === TRANSITION_KEYS.length - 1 && (
          <button className="et-btn" onClick={(e) => { e.stopPropagation(); nextStep(); }}>
            Open the letter 💌
          </button>
        )}
        
        {step < TRANSITION_KEYS.length - 1 && (
          <span className="et-hint">continue 💌</span>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   NEW SLIDE: Love Letter Reveal
══════════════════════════════════════════════ */
function LoveLetter({ onNext, config }) {
  const [paperVisible, setPaperVisible] = useState(false);
  const [titleIdx, setTitleIdx] = useState(0);
  const [lineIdx, setLineIdx] = useState(-1);
  const [showSignature, setShowSignature] = useState(false);
  const [showFinale, setShowFinale] = useState(false);
  const [showScrollHint, setShowScrollHint] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const scrollRef = useRef(null);

  const titleText = "To the one who unknowingly became special to me... 💌";
  const defaultLetterBody = "Somewhere between our random conversations,\nthe little shared smiles, and the moments\nI kept replaying in my head...\n\nYou quietly became my favorite person.\nI didn't plan for it, but I’m so glad it happened.\nEvery day with you feels like a beautiful dream\nI never want to wake up from.\n\nI've kept these words inside for so long,\nwaiting for the right moment to tell you.\nBut then I realized, there's no perfect time—\nonly the time we have right now.";
  const letterLines = (config?.letterBody || defaultLetterBody).split('\n');
  const letterHeader = config?.letterHeader || "FROM YASH✨";

  useEffect(() => {
    setTimeout(() => setPaperVisible(true), 600);
  }, []);

  useEffect(() => {
    if (!paperVisible) return;
    if (titleIdx < titleText.length) {
      const timeout = setTimeout(() => setTitleIdx(titleIdx + 1), 50);
      return () => clearTimeout(timeout);
    } else if (lineIdx === -1) {
      setTimeout(() => setLineIdx(0), 1000);
    }
  }, [paperVisible, titleIdx]);

  useEffect(() => {
    if (lineIdx >= 0 && lineIdx < letterLines.length) {
      const timeout = setTimeout(() => setLineIdx(lineIdx + 1), 1000);
      return () => clearTimeout(timeout);
    } else if (lineIdx === letterLines.length) {
      setTimeout(() => setShowSignature(true), 1500);
    }
  }, [lineIdx]);

  const inactivityTimerRef = useRef(null);

  useEffect(() => {
    if (!showSignature || showFinale) {
      setShowScrollHint(false);
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
      return;
    }
    
    // Initial prompt after 3.5s
    const timer = setTimeout(() => {
      if (!showFinale) setShowScrollHint(true);
    }, 3500);

    return () => clearTimeout(timer);
  }, [showSignature, showFinale]);

  const handleScroll = (e) => {
    setShowScrollHint(false);
    
    // Reset the 7-second inactivity timer
    if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    inactivityTimerRef.current = setTimeout(() => {
      if (!showFinale) setShowScrollHint(true);
    }, 7000);

    if (!hasScrolled) setHasScrolled(true);
    if (showFinale || !showSignature) return;

    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollHeight - scrollTop <= clientHeight + 15) {
      setShowFinale(true);
      setShowScrollHint(false);
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    }
  };

  return (
    <div className="ll-bg slide-inner">
      <div className="ll-overlay" />
      
      <div className="ll-container">
        <div className={`ll-paper-card ${paperVisible ? 'll-paper-show' : ''}`}>
          <div className="ll-paper-texture" />
          
          <div className="ll-paper-scroll-view">
            <div className="ll-paper-height-wrapper" ref={scrollRef} onScroll={handleScroll}>
              <div className="ll-paper-inner-box">
                <div className="ll-paper-content">
                  <div className="ll-header">
                    <span className="ll-from-label">{letterHeader}</span>
                    <h2 className="ll-premium-title">
                      {titleText.slice(0, titleIdx)}
                      {titleIdx < titleText.length && <span className="ll-type-cursor">|</span>}
                    </h2>
                  </div>

                  <div className="ll-body-text">
                    {letterLines.map((line, i) => (
                      <p key={i} className={`ll-line ${i < lineIdx ? 'll-line-show' : ''} ${line === "" ? 'll-spacer' : ''}`}>
                        {line}
                      </p>
                    ))}
                  </div>

                  <div className={`ll-signature-wrap ${showSignature ? 'll-sig-show' : ''}`}>
                    <span className="ll-sig-text">— Yours, always 💞</span>
                  </div>

                  <div className={`ll-inner-finale ${showFinale ? 'll-finale-visible' : ''}`}>
                    <p className="ll-finale-hint">And after writing all of this... I still have one last question. 🌸</p>
                    <button className="ll-premium-btn" onClick={onNext}>Continue 💞</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Scroll Hint Popup */}
          <div className={`ll-scroll-hint ${showScrollHint ? 'hint-visible' : ''}`}>
            <span className="hint-arrow">↓</span>
            <span className="hint-text">Scroll to read more 🌸</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   NEW SLIDE: Floating Cinematic Memory Gallery
   (Emotional bridge between letter and proposal)
══════════════════════════════════════════════ */
const DEFAULT_GALLERY_PHOTOS = [
  { src: '/templates/proposal/cherry-blossom-proposal/memory1.png', cap: "this smile >>> 🌸", rot: -3, y: -10, w: '220px', dur: '7s' },
  { src: '/templates/proposal/cherry-blossom-proposal/memory2.png', cap: "fav moment. 💞", rot: 2, y: 15, w: '190px', dur: '6s' },
  { src: '/templates/proposal/cherry-blossom-proposal/memory3.png', cap: "blurry but i love it ✨", rot: -4, y: -20, w: '230px', dur: '8s' },
  { src: '/templates/proposal/cherry-blossom-proposal/memory4.png', cap: "my comfort person 💖", rot: 3, y: 10, w: '200px', dur: '7.5s' }
];

function MemoryGallery({ onNext, config }) {
  const [showText, setShowText] = useState(false);
  const [visiblePhotos, setVisiblePhotos] = useState([]);
  const [showFinale, setShowFinale] = useState(false);
  const [zoomedPhoto, setZoomedPhoto] = useState(null);
  const [sliderVal, setSliderVal] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const sliderRef = useRef(null);
  
  const photos = DEFAULT_GALLERY_PHOTOS.map((dp, i) => ({
    ...dp,
    src: config?.images?.[i] || dp.src,
    cap: config?.captions?.[i] || dp.cap
  }));

  useEffect(() => {
    setShowText(false);
    setVisiblePhotos([]);
    setShowFinale(false);

    const textTimer = setTimeout(() => setShowText(true), 1000);

    const photoTimers = photos.map((_, i) => {
      return setTimeout(() => {
        setVisiblePhotos(prev => [...prev, i]);
      }, 4000 + (i * 1000));
    });

    const finaleTimer = setTimeout(() => {
      setShowFinale(true);
    }, 9000); 

    return () => {
      clearTimeout(textTimer);
      photoTimers.forEach(t => clearTimeout(t));
      clearTimeout(finaleTimer);
    };
  }, []);

  const handleStart = () => setIsDragging(true);
  const handleEnd = () => {
    if (sliderVal >= 90) {
      onNext();
    } else {
      setSliderVal(0);
    }
    setIsDragging(false);
  };

  const handleMove = (e) => {
    if (!isDragging || !sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;
    setSliderVal(percent);
    
    if (percent >= 95) {
      handleEnd();
    }
  };

  const handleScroll = (e) => {
    if (e.target.scrollTop > 40) {
      setHasScrolled(true);
    }
  };

  return (
    <div className="mg-bg slide-inner" 
      onMouseMove={handleMove} 
      onMouseUp={handleEnd}
      onTouchMove={handleMove}
      onTouchEnd={handleEnd}
    >
      <div className="mg-overlay" />
      
      <div className="mg-container" onScroll={handleScroll}>
        <h2 className={`mg-transition-text ${showText ? 'mg-text-show' : ''}`}>
          And maybe...<br />these little moments are the reason why. 💞
          <span className="mg-sub-hint">(tap images to enlarge 🌸)</span>
        </h2>

        <div className="mg-gallery-wrap">
          {photos.map((photo, i) => (
            <div 
              key={i} 
              className={`mg-polaroid ${visiblePhotos.includes(i) ? 'mg-polaroid-show' : ''}`}
              style={{ 
                '--rot': `${photo.rot}deg`, 
                '--y': `${photo.y}px`, 
                '--w': photo.w, 
                '--float-dur': photo.dur 
              }}
              onClick={() => setZoomedPhoto(photo)}
            >
              {i === 0 && (
                <div className="mg-tap-hint">
                  Tap Me! ✨
                </div>
              )}
              <img src={photo.src} alt={photo.cap} className="mg-photo" />
              <span className="mg-caption">{photo.cap}</span>
            </div>
          ))}
        </div>

        {showFinale && !hasScrolled && (
          <div className="mg-scroll-hint">
            <span>scroll down to see more</span>
            <div className="mg-scroll-arrow">ᐁ</div>
          </div>
        )}

        {/* Slider Area - Appearing below images */}
        <div className={`mg-bottom-reveal ${showFinale ? 'mg-reveal-active' : ''}`}>
          <p className="mg-finale-mini-text">
            And after all of this... there’s still one thing left unsaid. 🌸
          </p>
          
          <div className="mg-slider-container" ref={sliderRef}>
            <div className="mg-slider-text">Slide to reveal my heart 💞</div>
            <div 
              className="mg-slider-handle" 
              onMouseDown={handleStart}
              onTouchStart={handleStart}
              style={{ 
                left: `calc(${sliderVal}% - ${sliderVal > 50 ? '56px' : '0px'})`,
                transform: `translateX(${sliderVal}%)` 
              }}
            >
              <span className="handle-arrow">→</span>
            </div>
            <div className="mg-slider-progress" style={{ width: `${sliderVal}%` }} />
          </div>
        </div>
      </div>

      {/* Cinematic Zoom Overlay */}
      {zoomedPhoto && (
        <div className="mg-zoom-overlay" onClick={() => setZoomedPhoto(null)}>
          <div className="mg-zoom-content" onClick={(e) => e.stopPropagation()}>
            <button className="mg-zoom-close" onClick={() => setZoomedPhoto(null)}>✕</button>
            <div className="mg-zoom-card">
              <img src={zoomedPhoto.src} alt={zoomedPhoto.cap} className="mg-zoom-img" />
              <p className="mg-zoom-caption">{zoomedPhoto.cap}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════
   SLIDE 6 – Cinematic Proposal Reveal
   The emotional climax of the whole website.
══════════════════════════════════════════════ */
const GIF_FRAMES = [
  { pos: 'pr-gif-frame-1', label: 'your reaction here... 🌸', src: '/templates/proposal/cherry-blossom-proposal/mocha-cry.webp' },
  { pos: 'pr-gif-frame-2', label: 'that one look you have 💞', src: '/templates/proposal/cherry-blossom-proposal/tkthao219-bear.webp' },
  { pos: 'pr-gif-frame-3', label: 'our vibe rn 🌙', src: '/templates/proposal/cherry-blossom-proposal/frown-sad.webp' },
  { pos: 'pr-gif-frame-4', label: 'saying yes energy ✨', src: '/templates/proposal/cherry-blossom-proposal/milk-and-mocha.webp' },
];

function ProposalReveal({ onNext }) {
  const [phase, setPhase] = useState('intro'); // intro → reveal
  const [answered, setAnswered] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Cinematic reveal sequence
    const t1 = setTimeout(() => setPhase('reveal'), 1200);
    return () => clearTimeout(t1);
  }, []);

  const handleYes = () => {
    setAnswered(true);
    // Heartbeat/Glow happens for 2s, then we fade out
    setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => onNext(), 1400); // 1.4s for the exit animation
    }, 2200);
  };

  return (
    <div className={`pr-bg slide-inner ${phase === 'reveal' ? 'pr-revealed' : ''} ${isExiting ? 'pr-exiting' : ''}`}>
      {/* Soft overlay */}
      <div className="pr-overlay" />

      {/* Floating petals */}
      <div className="pr-petals" aria-hidden="true">
        {[...Array(18)].map((_, i) => (
          <div key={i} className="pr-petal" style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 8}s`,
            animationDuration: `${10 + Math.random() * 8}s`,
            opacity: 0.3 + Math.random() * 0.4,
            fontSize: `${10 + Math.random() * 14}px`
          }}>🌸</div>
        ))}
      </div>

      {/* Ambient bloom glow */}
      <div className="pr-bloom-glow" />

      {/* GIF Frames – placed cinematically */}
      {GIF_FRAMES.map((frame, i) => (
        <div key={i} className={`pr-gif-frame ${frame.pos} ${phase === 'reveal' ? 'pr-gif-visible' : ''}`}
          style={{ animationDelay: `${0.3 + i * 0.4}s` }}>
          <div className="pr-gif-inner">
            {frame.src
              ? <img src={frame.src} alt={frame.label} className="pr-gif-img" />
              : <span className="pr-gif-label">{frame.label}</span>
            }
          </div>
        </div>
      ))}

      {/* Main content */}
      <div className={`pr-content ${phase === 'reveal' ? 'pr-content-visible' : ''}`}>
        <p className="pr-top-text">And now...</p>

        <div className="pr-proposal-text">
          <h1 className="pr-main-line">So...</h1>
          <h1 className="pr-main-line pr-main-line-2">
            can I finally call you mine?&nbsp;
            <span className="pr-heart-icon">💞</span>
          </h1>
        </div>

        <p className="pr-sub-line">
          Can we turn this feeling into something real? 🌸
        </p>

        {!answered ? (
          <div className="pr-buttons">
            <button className="pr-btn pr-btn-yes" onClick={handleYes}>
              Yes 💖
            </button>
            <button className="pr-btn pr-btn-always" onClick={handleYes}>
              Always yours ✨
            </button>
          </div>
        ) : (
          <div className="pr-answered-glow">
            <span>💗</span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   SLIDE 7 – Finale: Emotional Afterglow
   The peaceful, warm ending after "Yes 💖"
══════════════════════════════════════════════ */
function Finale() {
  const [showAura, setShowAura]     = useState(false);
  const [showMain, setShowMain]     = useState(false);
  const [showSub, setShowSub]       = useState(false);
  const [showFooter, setShowFooter] = useState(false);

  useEffect(() => {
    // Signal parent platform to unlock actions / customizer buttons
    window.parent.postMessage({ type: 'TEMPLATE_COMPLETED' }, '*');

    // Cinematic staggered reveal
    const t0 = setTimeout(() => setShowAura(true),   600);
    const t1 = setTimeout(() => setShowMain(true),  1400);
    const t2 = setTimeout(() => setShowSub(true),   3200);
    const t3 = setTimeout(() => setShowFooter(true), 5500);
    return () => { clearTimeout(t0); clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  return (
    <div className="fn-bg slide-inner">

      {/* Dual bloom glows for warmth */}
      <div className={`fn-bloom ${showAura ? 'fn-bloom-visible' : ''}`} />
      <div className={`fn-bloom fn-bloom-2 ${showAura ? 'fn-bloom-visible' : ''}`} />

      {/* Fewer petals — calm, not overwhelming */}
      <div className="fn-petals" aria-hidden="true">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="fn-petal-item" style={{
            left: `${5 + Math.random() * 90}%`,
            animationDelay: `${Math.random() * 10}s`,
            animationDuration: `${14 + Math.random() * 8}s`,
            fontSize: `${10 + Math.random() * 12}px`,
            opacity: 0.25 + Math.random() * 0.3
          }}>🌸</div>
        ))}
      </div>

      {/* Heartbeat glow aura — behind the text */}
      <div className={`fn-aura ${showAura ? 'fn-aura-visible' : ''}`} />

      <div className="fn-content">
        
        {/* GIF above text */}
        <div className={`fn-gif-wrap ${showMain ? 'fn-text-visible' : ''}`}>
          <img src="/templates/proposal/cherry-blossom-proposal/bear-hug.webp" alt="Bear Hug" className="fn-gif" />
        </div>

        {/* Main emotional text — 2 lines */}
        <h1 className={`fn-main-text ${showMain ? 'fn-text-visible' : ''}`}>
          You just made me
          <br />
          the happiest person alive.
          <span className="fn-heart-glyph"> 💞</span>
        </h1>

        {/* Sub line — appears after pause */}
        <p className={`fn-sub-text ${showSub ? 'fn-text-visible' : ''}`}>
          Forever starts here 🌸
        </p>



      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   APP SHELL
══════════════════════════════════════════════ */
const SLIDES = [Slide2, EmotionalTransition, LoveLetter, MemoryGallery, ProposalReveal, Finale];

export default function App() {
  const [current, setCurrent] = useState(0);
  const [config, setConfig] = useState({});
  const cursorRef = useRef(null);
  const audioRef = useRef(null);

  const startMusic = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.log("Audio play failed:", e));
    }
  };

  useEffect(() => {
    startMusic(); // Attempt immediate autoplay

    const handleFirstClick = () => {
      startMusic();
      window.removeEventListener('click', handleFirstClick);
    };
    window.addEventListener('click', handleFirstClick);
    return () => window.removeEventListener('click', handleFirstClick);
  }, []);

  const goNext = () => {
    setCurrent(c => c + 1);
  };

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;
    const onMove = (e) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  useEffect(() => {
    const handleMessage = (e) => {
      if (e.data?.type === 'customize') {
        setConfig(prev => ({ ...prev, ...e.data }));
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const themeClass = `theme-${config.selectedFontSet || 'set1'}`;

  return (
    <div className={themeClass}>
      {/* Global Background Image */}
      <div className="global-bg-image" />

      {/* Global Vignette */}
      <div className="global-vignette" />

      {/* Audio Element */}
      <audio ref={audioRef} src="/templates/proposal/cherry-blossom-proposal/Proposal.mp3" loop autoPlay />



      {/* Global Paper Overlays */}
      <div className="paper-overlay" />
      <div className="paper-overlay-grain" />

      {/* Floating Elements (Hearts/Stars) */}
      <div className="global-particles" aria-hidden="true">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="particle" style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 10}s`,
            animationDuration: `${15 + Math.random() * 10}s`,
            fontSize: `${12 + Math.random() * 12}px`
          }}>
            {['❤️', '🌸'][i % 2]}
          </div>
        ))}
      </div>

      {/* Custom cursor */}
      <div ref={cursorRef} id="custom-cursor">💗</div>


      {/* Slides */}
      <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
        {SLIDES.map((SlideComp, i) => (
          i === current && (
            <div key={i} className="slide-shell slide-active">
              <SlideComp onNext={goNext} config={config} />
            </div>
          )
        ))}
      </div>
    </div>
  );
}
