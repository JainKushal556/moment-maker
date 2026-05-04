import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Hexagon } from 'lucide-react';
import './Intro_SlidingCurtains2.css';

const Intro_SlidingCurtains2 = ({ senderName, onFinish }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [typedText, setTypedText] = useState('');
  const fullText = "There is something special for you inside. Check it out!";

  const handleOpen = () => {
    if (isOpen) return;
    setIsOpen(true);
  };

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        let i = 0;
        const interval = setInterval(() => {
          setTypedText(fullText.slice(0, i));
          i++;
          if (i > fullText.length) {
            clearInterval(interval);
          }
        }, 50);
        return () => clearInterval(interval);
      }, 800); 
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  return (
    <div className="curtain-wrapper">
      {/* Background Content */}
      <div className="reveal-area">
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              className="message-reveal"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 1 }}
            >
              <div className="content-inner">
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  className="reveal-badge-top"
                >
                  MESSAGE FROM
                </motion.div>

                <motion.h1 
                  className="reveal-main-name"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.2, duration: 0.8 }}
                >
                  {senderName}
                </motion.h1>

                <motion.div 
                  className="reveal-divider-modern"
                  initial={{ width: 0 }}
                  animate={{ width: "100px" }}
                  transition={{ delay: 1.5, duration: 0.8 }}
                >
                  <Sparkles size={14} className="div-sparkle" />
                </motion.div>

                <motion.div 
                  className="message-card-glass"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.8 }}
                >
                  <p className="reveal-msg">{typedText}</p>
                </motion.div>

                {typedText === fullText && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.5 }}
                  >
                    <button 
                      className="reveal-final-action-btn" 
                      onClick={() => {
                        onFinish();
                      }}
                    >
                      Proceed to Magic <Sparkles size={18} />
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Unique Multi-Panel Shutter */}
      <div className={`shutter-container ${isOpen ? 'open' : ''}`}>
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className={`shutter-panel panel-${i + 1}`}
            animate={{ 
              x: isOpen ? (i < 2 ? '-105%' : '105%') : '0%',
              opacity: isOpen ? 0 : 1
            }}
            transition={{ 
              duration: 1.2, 
              ease: [0.16, 1, 0.3, 1],
              delay: i === 0 || i === 3 ? 0 : 0.15 
            }}
          >
            <div className="panel-inner-glow"></div>
            <div className="panel-pattern"></div>
          </motion.div>
        ))}
      </div>

      {/* Modern Geometric Badge */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div 
            className="modern-geometric-badge"
            initial={{ opacity: 0, scale: 0, rotate: -45 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0, rotate: 45 }}
            whileHover={{ scale: 1.1 }}
            onClick={handleOpen}
          >
            <div className="badge-ring"></div>
            <div className="badge-core">
              <Hexagon size={32} className="core-icon" />
              <span className="badge-name">{senderName}</span>
              <p className="badge-hint">INITIATE REVEAL</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Intro_SlidingCurtains2;
