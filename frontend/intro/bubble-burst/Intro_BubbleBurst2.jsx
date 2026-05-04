import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import './Intro_BubbleBurst2.css';
import hiGif from './hi.gif';
import giphyGif from './giphy.gif';

const Intro_BubbleBurst2 = ({ senderName, onFinish }) => {
  const [showContent, setShowContent] = useState(false);
  const [typedLine1, setTypedLine1] = useState('');
  const [typedLine2, setTypedLine2] = useState('');
  const [isTypingFinished, setIsTypingFinished] = useState(false);
  
  const line1 = "I didn’t just write this...";
  const line2 = "I created it ";
  const highlight = "for you.";

  const handleClick = () => {
    if (!isTypingFinished) return;
    
    const confettiCanvas = document.getElementById('bubble-confetti-canvas-2');
    if (confettiCanvas) {
      const myConfetti = confetti.create(confettiCanvas, { resize: true });
      myConfetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ff4d6d', '#ffffff', '#ff8fa3']
      });
    }
    setTimeout(() => onFinish(), 600);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
      
      // Typing logic
      setTimeout(() => {
        let i = 0;
        const interval1 = setInterval(() => {
          setTypedLine1(line1.slice(0, i));
          i++;
          if (i > line1.length) {
            clearInterval(interval1);
            let j = 0;
            const interval2 = setInterval(() => {
              setTypedLine2(line2.slice(0, j));
              j++;
              if (j > line2.length) {
                clearInterval(interval2);
                setTimeout(() => setIsTypingFinished(true), 800);
              }
            }, 50);
          }
        }, 50);
      }, 1000); 
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`nebula-wrapper ${isTypingFinished ? 'ready-to-click' : ''}`} onClick={handleClick}>
      <canvas 
        id="bubble-confetti-canvas-2"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 100 }} 
      />
      <div className="clean-bg"></div>
      
      <motion.div
        className="cinematic-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        <motion.div 
          className="main-hi-gif-wrapper"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <img src={hiGif} alt="Hi" className="main-hi-gif" />
        </motion.div>

        <AnimatePresence>
          {showContent && (
            <motion.div className="content-block">
              {/* Upper Heart Separator */}
              <motion.div 
                className="separator-group"
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ duration: 1, delay: 0.2 }}
              >
                <div className="line"></div>
                <span className="heart">❤</span>
                <div className="line"></div>
              </motion.div>

              {/* Main Title */}
              <motion.h1 
                className="main-title"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.4 }}
              >
                From {senderName}
              </motion.h1>

              {/* Lower Line Separator */}
              <motion.div 
                className="line-full"
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ duration: 1, delay: 0.6 }}
              ></motion.div>

              <div className="message-group">
                <p className="sub-text italic">{typedLine1}</p>
                <p className="sub-text italic">
                  {typedLine2}
                  {typedLine2.length === line2.length && (
                    <motion.span 
                      className="pink-highlight"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.8 }}
                    >
                      {highlight}
                    </motion.span>
                  )}
                </p>
              </div>

              {/* Bottom Heart */}
              <AnimatePresence>
                {isTypingFinished && (
                  <motion.div 
                    className="bottom-heart"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0.4, 1], scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    ❤
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Footer */}
              <AnimatePresence>
                {isTypingFinished && (
                  <motion.div 
                    className="click-footer"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                  >
                    <div className="footer-text">
                      <span className="dash">⑊</span> CLICK TO OPEN <span className="dash">⑊</span>
                    </div>
                    <motion.img 
                      src={giphyGif} 
                      alt="Click" 
                      className="footer-hand"
                      animate={{ y: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Intro_BubbleBurst2;
