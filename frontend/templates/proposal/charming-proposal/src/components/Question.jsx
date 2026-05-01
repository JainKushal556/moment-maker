import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';

const Question = ({ onNext }) => {
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  const handleNoHover = () => {
    if (containerRef.current) {
      const maxX = window.innerWidth / 3;
      const maxY = window.innerHeight / 3;
      setNoPosition({
        x: (Math.random() - 0.5) * maxX * 2,
        y: (Math.random() - 0.5) * maxY * 2,
      });
    }
  };

  return (
    <motion.div
      ref={containerRef}
      className="fixed inset-0 z-10 flex flex-col items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 1.5 } }}
    >
      <div className="text-center space-y-12">
        <motion.p
          className="text-3xl md:text-5xl text-white font-serif font-primary italic tracking-wide drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5 }}
        >
          Do you feel the same way?
        </motion.p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 mt-24 relative min-h-[100px] w-full justify-center items-center">
        <motion.button
          onClick={onNext}
          className="px-10 py-4 bg-white hover:bg-gray-100 text-[#4a0f2b] rounded-full transition-all duration-300 uppercase tracking-[0.2em] text-sm font-bold font-secondary shadow-[0_0_20px_rgba(255,255,255,0.4)] z-20"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          Yes, absolutely 💕
        </motion.button>
        
        <motion.button
          onMouseEnter={handleNoHover}
          onClick={handleNoHover}
          onTouchStart={(e) => { e.preventDefault(); handleNoHover(); }}
          className="px-10 py-4 bg-transparent border border-white/40 text-white/70 rounded-full transition-all duration-300 uppercase tracking-[0.2em] text-sm font-secondary relative z-10"
          animate={{ x: noPosition.x, y: noPosition.y }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
        >
          No way
        </motion.button>
      </div>
    </motion.div>
  );
};

export default Question;
