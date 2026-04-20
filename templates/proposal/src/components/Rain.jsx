import React from 'react';
import { motion } from 'framer-motion';

const Rain = () => {
  // Generate static drops array so they don't rerender differently
  const drops = Array.from({ length: 55 }).map((_, i) => ({
    id: i,
    left: Math.random() * 100,
    duration: Math.random() * 5 + 2,
    delay: Math.random() * 2,
  }));

  return (
    <div className="fixed inset-0 z-[1] pointer-events-none overflow-hidden">
      {drops.map((drop) => (
        <div
          key={drop.id}
          className="absolute top-[-20px] w-[1.5px] h-[60px] rounded-full"
          style={{
            left: `${drop.left}%`,
            background: 'linear-gradient(to bottom, transparent, rgba(255,180,220,0.35))',
            animation: `rain ${drop.duration}s linear infinite`,
            animationDelay: `${drop.delay}s`,
          }}
        />
      ))}
      
      {/* Floating hearts mapping */}
      {Array.from({ length: 12 }).map((_, i) => {
        const sizes = [10, 14, 18, 12, 16];
        const size = sizes[i % sizes.length];
        return (
          <div
            key={`heart-${i}`}
            className="fixed pointer-events-none z-[1]"
            style={{
              left: `${Math.random() * 95}%`,
              top: `${Math.random() * 90}%`,
              color: 'rgba(236,72,153,0.4)',
              filter: 'drop-shadow(0 0 6px rgba(236,72,153,0.6))',
              animation: `floatHeart ${(3 + Math.random() * 3).toFixed(1)}s linear infinite`,
              animationDelay: `${(Math.random() * 2).toFixed(1)}s`,
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
              <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"/>
            </svg>
          </div>
        );
      })}
    </div>
  );
};

export default Rain;
