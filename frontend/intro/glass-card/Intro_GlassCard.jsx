import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import './Intro_GlassCard.css';

const Intro_GlassCard = ({ senderName, onFinish }) => {
  const [showText, setShowText] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [typedText, setTypedText] = useState('');
  const fullText = "There is something special for you inside. Check it out!";

  useEffect(() => {
    const timer1 = setTimeout(() => setShowText(true), 800);
    const timer2 = setTimeout(() => {
      let i = 0;
      const interval = setInterval(() => {
        setTypedText(fullText.slice(0, i));
        i++;
        if (i > fullText.length) {
          clearInterval(interval);
          setShowButton(true);
        }
      }, 50);
    }, 1500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div className="intro-container">
      <div className="bg-animation"></div>
      <AnimatePresence>
        <motion.div 
          className="glass-card"
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)", transition: { duration: 0.8 } }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="card-content">
            <motion.h1 
              className="sender-name"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: showText ? 1 : 0, y: showText ? 0 : 10 }}
              transition={{ duration: 0.8 }}
            >
              Hi! It's <span className="highlight">{senderName}</span> here.
            </motion.h1>
            <div className="message-text">
              {typedText}
              {!showButton && <span className="cursor">|</span>}
            </div>
            {showButton && (
              <motion.button
                className="check-btn"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onFinish}
              >
                Check it out <Sparkles size={20} style={{ color: '#facc15' }} />
              </motion.button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Intro_GlassCard;
