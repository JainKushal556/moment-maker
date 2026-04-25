import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';
import './Intro_MagicEnvelope.css';

const Intro_MagicEnvelope = ({ senderName, onFinish }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [typedText, setTypedText] = useState('');
  const fullText = "There is something special for you inside. Check it out!";

  const handleOpen = () => {
    if (isOpen) return;
    setIsOpen(true);
    // Wait for envelope flap to open before sliding card
    setTimeout(() => setShowCard(true), 600);
  };

  useEffect(() => {
    if (showCard) {
      let i = 0;
      const interval = setInterval(() => {
        setTypedText(fullText.slice(0, i));
        i++;
        if (i > fullText.length) {
          clearInterval(interval);
        }
      }, 50);
      return () => clearInterval(interval);
    }
  }, [showCard]);

  return (
    <div className="envelope-wrapper">
      {/* Enhanced Dynamic Background */}
      <div className="night-bg"></div>
      <div className="stars"></div>
      <div className="bokeh-circles"></div>

      <div className={`envelope-container ${isOpen ? 'open' : ''}`} onClick={handleOpen}>
        <div className="envelope">
          <div className="front-flap"></div>
          <div className="front-body"></div>
          
          <AnimatePresence>
            {showCard && (
              <motion.div 
                className="letter-card"
                initial={{ y: 0, opacity: 0 }}
                animate={{ y: -150, opacity: 1 }}
                exit={{ scale: 2, opacity: 0, filter: "blur(20px)" }}
                transition={{ duration: 1, ease: "easeOut" }}
              >
                <div className="card-inner">
                  <h2 className="from-text">Hi! It's <span>{senderName}</span></h2>
                  <p className="message-content">{typedText}</p>
                  
                  {typedText === fullText && (
                    <motion.button 
                      className="open-btn"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onFinish();
                      }}
                    >
                      Check it out
                    </motion.button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="heart-seal">
            <Heart fill="#ff4d4d" color="#ff4d4d" size={32} />
          </div>
        </div>
      </div>
      
      {!isOpen && (
        <motion.p 
          className="tap-hint"
          animate={{ opacity: [0.4, 1, 0.4], y: [0, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Tap to open the magic envelope
        </motion.p>
      )}
    </div>
  );
};

export default Intro_MagicEnvelope;
