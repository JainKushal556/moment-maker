import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles } from 'lucide-react';
import './Intro_GlassCard2.css';

const Intro_GlassCard2 = ({ senderName, onFinish }) => {
  const [phase, setPhase] = useState('idle'); // idle → shaking → developing → revealed
  const [typedText, setTypedText] = useState('');
  const fullText = "A little piece I built for you.";

  const handleClick = () => {
    if (phase !== 'idle') return;
    setPhase('shaking');
    setTimeout(() => setPhase('developing'), 1200);
    setTimeout(() => setPhase('revealed'), 3000);
  };

  useEffect(() => {
    if (phase === 'revealed') {
      let i = 0;
      const interval = setInterval(() => {
        setTypedText(fullText.slice(0, i));
        i++;
        if (i > fullText.length) clearInterval(interval);
      }, 60);
      return () => clearInterval(interval);
    }
  }, [phase]);

  return (
    <div className="polaroid-viewport">
      {/* Warm Bokeh Background */}
      <div className="warm-bg">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="warm-orb"
            animate={{
              x: [0, (Math.random() - 0.5) * 80, 0],
              y: [0, (Math.random() - 0.5) * 80, 0],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 6 + Math.random() * 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
              width: `${150 + Math.random() * 200}px`,
              height: `${150 + Math.random() * 200}px`,
            }}
          />
        ))}
      </div>

      {/* Film Grain Overlay */}
      <div className="film-grain"></div>

      <AnimatePresence mode="wait">
        {/* Idle State - Polaroid Face Down */}
        {phase === 'idle' && (
          <motion.div
            key="idle"
            className="polaroid-outer"
            initial={{ opacity: 0, y: 60, rotate: -5 }}
            animate={{ opacity: 1, y: 0, rotate: -3 }}
            exit={{ opacity: 0 }}
            onClick={handleClick}
            whileHover={{ scale: 1.05, rotate: -1 }}
            whileTap={{ scale: 0.97 }}
          >
            <div className="polaroid-back">
              <div className="polaroid-back-lines">
                <div className="back-line"></div>
                <div className="back-line short"></div>
              </div>
              <div className="tap-hint">
                <Heart size={20} className="hint-heart" fill="currentColor" />
                <p>Tap to Open</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Shaking State */}
        {phase === 'shaking' && (
          <motion.div
            key="shaking"
            className="polaroid-outer"
            animate={{ rotate: [-3, 8, -6, 10, -4, 7, -3, 0] }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
          >
            <div className="polaroid-back">
              <div className="polaroid-back-lines">
                <div className="back-line"></div>
                <div className="back-line short"></div>
              </div>
              <div className="tap-hint">
                <Heart size={20} className="hint-heart" fill="currentColor" />
                <p>Opening...</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Developing State - White to reveal */}
        {phase === 'developing' && (
          <motion.div
            key="developing"
            className="polaroid-outer"
            initial={{ rotate: 0 }}
            animate={{ rotate: 2 }}
          >
            <div className="polaroid-front">
              <div className="polaroid-photo-area">
                <motion.div
                  className="develop-wash"
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 0 }}
                  transition={{ duration: 1.8, ease: "easeOut" }}
                ></motion.div>
                <div className="polaroid-photo-content developing-placeholder">
                  <div className="developing-text">Opening...</div>
                </div>
              </div>
              <div className="polaroid-caption-area"></div>
            </div>
          </motion.div>
        )}

        {/* Fully Revealed */}
        {phase === 'revealed' && (
          <motion.div
            key="revealed"
            className="polaroid-outer"
            initial={{ rotate: 3 }}
            animate={{ rotate: 2 }}
          >
            <div className="polaroid-front">
              <div className="polaroid-photo-area">
                <div className="polaroid-photo-content">
                  <motion.div
                    className="from-label"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    FROM {senderName.toUpperCase()}
                  </motion.div>

                  <motion.h1
                    className="polaroid-title"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    Not just a message...
                  </motion.h1>

                  <motion.div
                    className="polaroid-divider"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.9, duration: 0.6 }}
                  >
                    <Heart size={14} fill="currentColor" className="div-heart" />
                  </motion.div>

                  <motion.p
                    className="polaroid-msg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                  >
                    {typedText}
                  </motion.p>
                </div>
              </div>

              {/* Handwritten caption at bottom */}
              <div className="polaroid-caption-area">
                <motion.p
                  className="polaroid-caption"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2.5 }}
                >
                  ♡ with love
                </motion.p>
              </div>
            </div>

            {typedText === fullText && (
              <motion.button
                className="polaroid-btn"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                onClick={onFinish}
              >
                Let's Go <Sparkles size={18} />
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Intro_GlassCard2;
