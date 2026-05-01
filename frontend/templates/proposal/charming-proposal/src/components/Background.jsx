import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Background = () => {
  // Generate floating romantic hearts
  const [hearts] = useState(() => Array.from({ length: 30 }).map(() => ({
    id: Math.random(),
    x: Math.random() * 100,
    size: Math.random() * 15 + 10,
    delay: Math.random() * 5,
    duration: Math.random() * 10 + 15,
    opacity: Math.random() * 0.4 + 0.1
  })));

  return (
    <>
      {/* Pink Gradient Layer */}
      <div className="fixed inset-0 min-h-screen w-screen bg-linear-to-r from-[#ff758c] via-[#ff5e7e] to-[#ff7eb3] animate-gradient" />
      
      {/* Soft contrast overlay */}
      <div className="fixed inset-0 bg-black/10 pointer-events-none z-0" />

      {/* Floating Hearts Animation */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {hearts.map((heart) => (
          <motion.div
            key={heart.id}
            className="absolute bottom-[-10%]"
            style={{ left: `${heart.x}%`, opacity: heart.opacity }}
            animate={{ 
              y: ['0vh', '-120vh'], 
              x: ['0px', '30px', '-30px', '0px'],
              rotate: [0, 180]
            }}
            transition={{ 
              y: { duration: heart.duration, repeat: Infinity, ease: 'linear', delay: heart.delay },
              x: { duration: heart.duration * 0.5, repeat: Infinity, ease: 'easeInOut', delay: heart.delay },
              rotate: { duration: heart.duration, repeat: Infinity, ease: 'linear', delay: heart.delay }
            }}
          >
            <svg width={heart.size} height={heart.size} viewBox="0 0 24 24" fill="currentColor" className="text-white/40 drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </motion.div>
        ))}
      </div>
    </>
  );
};

export default Background;
