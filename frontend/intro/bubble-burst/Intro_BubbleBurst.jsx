import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import './Intro_BubbleBurst.css';

const Intro_BubbleBurst = ({ senderName, onFinish }) => {
  const [isPopped, setIsPopped] = useState(false);
  const [showText, setShowText] = useState(false);
  const [typedText, setTypedText] = useState('');
  const confettiCanvasRef = React.useRef(null);
  const fullText = "There is something special for you inside. Check it out!";

  const handlePop = () => {
    if (isPopped) return;
    setIsPopped(true);
    
    // Confetti burst effect
    const triangle = confetti.shapeFromPath({ path: 'M0 10 L5 0 L10 10z' });

    if (confettiCanvasRef.current) {
      const myConfetti = confetti.create(confettiCanvasRef.current, { resize: true });
      myConfetti({
        shapes: [triangle],
        particleCount: 150,
        spread: 180,
        origin: { y: 0.5 },
        colors: ['#ff00c8', '#00d4ff', '#ffec3d', '#ffffff'],
        startVelocity: 45,
      });
    }


    setTimeout(() => setShowText(true), 500);
  };

  useEffect(() => {
    if (showText) {
      let i = 0;
      const interval = setInterval(() => {
        setTypedText(fullText.slice(0, i));
        i++;
        if (i > fullText.length) {
          clearInterval(interval);
        }
      }, 40);
      return () => clearInterval(interval);
    }
  }, [showText]);

  return (
    <div className="bubble-wrapper">
      <canvas 
        ref={confettiCanvasRef} 
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 100 }} 
      />
      <div className="gradient-bg"></div>
      
      {/* Background Floating Bubbles */}
      <div className="ambient-bubbles">
        {[...Array(15)].map((_, i) => (
          <div key={i} className={`small-bubble bubble-${i % 5}`}></div>
        ))}
      </div>

      <AnimatePresence>
        {!isPopped ? (
          <motion.div
            className="main-bubble-container"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 2, opacity: 0, filter: 'blur(10px)' }}
            transition={{ duration: 0.8, type: 'spring' }}
            onClick={handlePop}
          >
            <div className="main-bubble shadow-glow">
              <div className="bubble-shine"></div>
              <p className="tap-text">Tap to reveal!</p>
            </div>
            <motion.p 
              className="hint-text"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              "Tap to reveal a surprise!"
            </motion.p>
          </motion.div>
        ) : (
          <motion.div 
            className="reveal-content"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
          >
            <div className="message-box">
              <h1 className="greet-text">Hi! It's <span className="name-highlight">{senderName}</span> here.</h1>
              <p className="sub-message">{typedText}</p>
              
              {typedText === fullText && (
                <motion.button
                  className="start-btn"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onFinish}
                >
                  Let's Go! 🚀
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Intro_BubbleBurst;
