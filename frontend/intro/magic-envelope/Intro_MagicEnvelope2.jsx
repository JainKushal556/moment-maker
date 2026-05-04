import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';
import './Intro_MagicEnvelope2.css';
import marseyGif from './marsey-marsey-the-cat.webp';

const Intro_MagicEnvelope2 = ({ senderName, onFinish }) => {
  const [phase, setPhase] = useState('idle'); // idle → opening → revealed
  const [showText, setShowText] = useState(false);
  const [showButton, setShowButton] = useState(false);

  // Generate stars once and memoize them to prevent re-rendering on click
  const stars = React.useMemo(() => {
    return [...Array(20)].map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 3}s`
    }));
  }, []);

  const handleOpen = () => {
    if (phase !== 'idle') return;
    setPhase('opening');
    setTimeout(() => setPhase('revealed'), 1500);
  };

  useEffect(() => {
    if (phase === 'revealed') {
      setTimeout(() => setShowText(true), 800);
      setTimeout(() => setShowButton(true), 2500);
    }
  }, [phase]);

  return (
    <div className="mail-wrapper">
      {/* Background stays completely static and independent */}
      <div className="starry-night">
        <div className="nebula"></div>
        {stars.map((star) => (
          <div key={star.id} className={`star star-${star.id}`} style={{
            top: star.top,
            left: star.left,
            animationDelay: star.delay
          }}></div>
        ))}
      </div>

      <AnimatePresence>
        {phase !== 'revealed' && (
          <motion.div 
            className="magic-envelope-scene"
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="magic-envelope" onClick={handleOpen}>
              <div className="env-base"></div>

              <motion.div 
                className="flap flap-top"
                animate={phase === 'opening' ? { rotateX: 180 } : { rotateX: 0 }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
              ></motion.div>

              <motion.div 
                className="flap flap-bottom"
                animate={phase === 'opening' ? { rotateX: -180 } : { rotateX: 0 }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
              ></motion.div>

              <motion.div 
                className="flap flap-left"
                animate={phase === 'opening' ? { rotateY: -180 } : { rotateY: 0 }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
              ></motion.div>

              <motion.div 
                className="flap flap-right"
                animate={phase === 'opening' ? { rotateY: 180 } : { rotateY: 0 }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
              ></motion.div>

              <motion.div 
                className="mini-card-preview"
                animate={phase === 'opening' ? { scale: 1.1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
              >
                💌
              </motion.div>

              <motion.div 
                className="magic-seal"
                animate={phase === 'opening' ? { opacity: 0, scale: 0 } : { opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
                style={{ top: '42%', left: '42%' }} // Keeping user's preferred center
              >
                <Heart size={45} fill="#ff4d6d" strokeWidth={0} />
              </motion.div>
            </div>

            {phase === 'idle' && (
              <motion.p className="tap-hint" animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity }}>
                Tap to reveal the magic ✉
              </motion.p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {phase === 'revealed' && (
          <motion.div
            className="revealed-container"
            initial={{ opacity: 0, scale: 0.2, x: "-50%", y: "-50%" }}
            animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
            transition={{ duration: 1, ease: [0.34, 1.56, 0.64, 1] }}
            style={{ 
              position: 'absolute', 
              top: '50%', 
              left: '50%', 
              zIndex: 100, 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              gap: '30px',
              width: '100%',
              maxWidth: '600px'
            }}
          >
            <div className="note-paper-final">
              <div className="tape tape-tl"></div>
              <div className="tape tape-tr"></div>

              <motion.div 
                className="note-content-reveal"
                initial={{ opacity: 0 }}
                animate={{ opacity: showText ? 1 : 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="note-left">
                  <h1 className="note-from">From {senderName}</h1>
                  <div className="note-divider"></div>
                  <p className="note-line">Hey...</p>
                  <p className="note-line">I was thinking about <span className="pink-word">you...</span></p>
                  <p className="note-line">So I made this. <span className="inline-heart">♡</span></p>
                </div>
                <div className="note-right">
                  <img src={marseyGif} alt="marsey cat" className="note-gif" />
                </div>
              </motion.div>
            </div>

            <AnimatePresence>
              {showButton && (
                <motion.button
                  className="see-btn-bottom"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={onFinish}
                >
                  See what I made 💌
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Intro_MagicEnvelope2;
