import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Greeting = ({ onNext }) => {
  const [phase, setPhase] = useState(0);

  const texts = [
    "From the very first moment...",
    "I knew there was something profoundly different about you.",
    "Something that made my world so much brighter."
  ];

  const handleTap = () => {
    if (phase < texts.length - 1) {
      setPhase(p => p + 1);
    } else {
      setPhase(p => p + 1);
      setTimeout(() => onNext(), 1000);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-10 flex items-center justify-center p-4 cursor-pointer"
      onClick={handleTap}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 1.5 } }}
    >
      <div className="text-center w-full h-full flex flex-col items-center justify-center relative -translate-y-12 md:-translate-y-20">
        <AnimatePresence mode="wait">
          {phase < texts.length && (
            <motion.h1
              key={phase}
              className="text-3xl md:text-5xl text-white font-light leading-relaxed max-w-4xl tracking-wide font-serif font-primary italic drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
              initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
              transition={{ duration: 1.2 }}
            >
              {texts[phase]}
            </motion.h1>
          )}
        </AnimatePresence>

        {phase < texts.length && (
          <motion.p
            className="absolute bottom-24 text-white/50 text-[10px] md:text-sm tracking-[0.3em] uppercase animate-pulse font-secondary"
          >
            Tap anywhere to continue
          </motion.p>
        )}
      </div>
    </motion.div>
  );
};

export default Greeting;
