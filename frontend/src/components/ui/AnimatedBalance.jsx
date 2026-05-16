import React, { useEffect, useState, useRef } from 'react';
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
const AnimatedBalance = ({ value, iconSize = 32, className = "", textClassName = "", loading = false }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const hasLoaded = useRef(false);

  useEffect(() => {
    if (loading) return;
    
    // Mark as loaded once the first non-loading state is hit
    if (!hasLoaded.current) {
        hasLoaded.current = true;
    }
    
    setIsAnimating(true);
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
  }, [value, loading]);

  // Derived loading state to prevent "0" flash if data hasn't arrived
  const showLoading = loading || (!hasLoaded.current && value === 0);

  return (
    <div className={`flex items-center gap-0 py-1 transition-all select-none group active:scale-95 ${className}`}>
      <motion.div
        animate={showLoading ? "loading" : isAnimating ? "animating" : "idle"}
        variants={{
          loading: {
            rotate: [0, -12, 12, -12, 12, -12, 12, 0],
            scale: [1, 1.2, 1.1, 1.2, 1],
            filter: [
                'drop-shadow(0 0 8px rgba(217, 70, 239, 0.4))',
                'drop-shadow(0 0 20px rgba(217, 70, 239, 0.8))',
                'drop-shadow(0 0 8px rgba(217, 70, 239, 0.4))'
            ],
            transition: { duration: 0.3, repeat: Infinity, ease: "linear" }
          },
          animating: {
            rotate: [0, -12, 12, -12, 12, -12, 12, 0],
            scale: [1, 1.2, 1.1, 1.2, 1],
            filter: [
                'drop-shadow(0 0 8px rgba(217, 70, 239, 0.4))',
                'drop-shadow(0 0 20px rgba(217, 70, 239, 0.8))',
                'drop-shadow(0 0 8px rgba(217, 70, 239, 0.4))'
            ],
            transition: { duration: 0.3, repeat: Infinity, ease: "linear" }
          },
          idle: {
            rotate: [0, -8, 8, -6, 6, -4, 4, 0],
            x: [0, -1, 1, -1, 1, -0.5, 0.5, 0],
            transition: { duration: 0.6, repeat: Infinity, repeatDelay: 3.5, ease: "easeInOut" }
          }
        }}
        className="flex items-center justify-center"
      >
        <WishbitIcon 
          size={iconSize} 
          className="drop-shadow-none group-hover:scale-110 transition-transform duration-300" 
        />
      </motion.div>
      
      <motion.span 
        animate={showLoading ? {} : isAnimating ? { scale: [1, 1.05, 1], opacity: 1 } : { opacity: 1 }}
        transition={showLoading ? {} : { duration: 0.2, repeat: Infinity }}
        className={`text-base md:text-lg font-black tracking-tighter text-white tabular-nums flex items-center ${textClassName}`}
      >
        {showLoading ? (
          <div className="flex gap-[1px]">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                animate={{ 
                  opacity: [0.3, 1, 0.3],
                  scale: [1, 1.2, 1]
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: i * 0.15,
                  ease: "linear"
                }}
              >
                -
              </motion.span>
            ))}
          </div>
        ) : displayValue.toLocaleString()}
      </motion.span>
    </div>
  );
};

export default AnimatedBalance;
