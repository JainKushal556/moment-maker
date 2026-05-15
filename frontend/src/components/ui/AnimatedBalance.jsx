import React, { useEffect, useState } from 'react';
import { motion, animate } from 'framer-motion';
import WishbitIcon from '../icons/WishbitIcon';

/**
 * AnimatedBalance Component
 * Handles smooth numerical transitions and icon animations for user balance.
 * 
 * @param {number} value - The current balance value
 * @param {number} iconSize - Size of the Wishbit icon
 * @param {string} className - Additional classes for the container
 * @param {string} textClassName - Additional classes for the balance text
 */
const AnimatedBalance = ({ value, iconSize = 32, className = "", textClassName = "" }) => {
  const [displayValue, setDisplayValue] = useState(value || 0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsAnimating(true);
    // Smoothly animate the number from current display value to new value
    const controls = animate(displayValue, value || 0, {
      duration: 1.2,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => setDisplayValue(Math.floor(latest)),
      onComplete: () => setIsAnimating(false)
    });
    return () => {
      controls.stop();
      setIsAnimating(false);
    };
  }, [value]);

  return (
    <div className={`flex items-center gap-0 py-1 transition-all select-none group active:scale-95 ${className}`}>
      <motion.div
        animate={isAnimating ? {
          // Faster, more intense vibration during value changes
          rotate: [0, -12, 12, -12, 12, -12, 12, 0],
          scale: [1, 1.2, 1.1, 1.2, 1],
          filter: [
            'drop-shadow(0 0 8px rgba(217, 70, 239, 0.4))',
            'drop-shadow(0 0 20px rgba(217, 70, 239, 0.8))',
            'drop-shadow(0 0 8px rgba(217, 70, 239, 0.4))'
          ]
        } : {
          // Subtle periodic "tremble" when idle
          rotate: [0, -8, 8, -6, 6, -4, 4, 0],
          x: [0, -1, 1, -1, 1, -0.5, 0.5, 0],
        }}
        transition={isAnimating ? {
          duration: 0.3, // Very fast during animation
          repeat: Infinity,
          ease: "linear"
        } : {
          duration: 0.6,
          repeat: Infinity,
          repeatDelay: 3.5, // Periodic shake when idle
          ease: "easeInOut"
        }}
        className="flex items-center justify-center"
      >
        <WishbitIcon 
          size={iconSize} 
          className="drop-shadow-none group-hover:scale-110 transition-transform duration-300" 
        />
      </motion.div>
      
      <motion.span 
        animate={isAnimating ? { scale: [1, 1.05, 1] } : {}}
        transition={{ duration: 0.2, repeat: Infinity }}
        className={`text-base md:text-lg font-black tracking-tighter text-white tabular-nums ${textClassName}`}
      >
        {displayValue.toLocaleString()}
      </motion.span>
    </div>
  );
};

export default AnimatedBalance;
