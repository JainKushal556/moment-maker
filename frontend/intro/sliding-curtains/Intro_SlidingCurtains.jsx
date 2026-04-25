import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import './Intro_SlidingCurtains.css';

const Intro_SlidingCurtains = ({ senderName, onFinish }) => {
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
      }, 800); // Wait for curtains to start sliding
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  return (
    <div className="curtain-wrapper">
      {/* Background Content (Revealed behind curtains) */}
      <div className="reveal-area">
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              className="message-reveal"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
            >
              <div className="content-inner">
                <h2 className="reveal-title">A Message From <span>{senderName}</span></h2>
                <p className="reveal-msg">{typedText}</p>
                {typedText === fullText && (
                  <motion.button 
                    className="reveal-btn"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={onFinish}
                  >
                    Enter the Surprise <Sparkles size={18} />
                  </motion.button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Sliding Curtains */}
      <motion.div 
        className="curtain left-curtain"
        animate={{ x: isOpen ? '-100%' : '0%' }}
        transition={{ duration: 1.2, ease: [0.77, 0, 0.175, 1] }}
      ></motion.div>
      
      <motion.div 
        className="curtain right-curtain"
        animate={{ x: isOpen ? '100%' : '0%' }}
        transition={{ duration: 1.2, ease: [0.77, 0, 0.175, 1] }}
      ></motion.div>

      {/* Center Badge */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div 
            className="center-badge"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.5, type: 'spring' }}
            onClick={handleOpen}
          >
            <div className="badge-glow"></div>
            <div className="badge-content">
              <p className="badge-hint" style={{ fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 'bold' }}>Click to open</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Intro_SlidingCurtains;
