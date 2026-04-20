import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

const Final = () => {
  useEffect(() => {
    // Notify the parent editor that the full experience is complete
    window.parent?.postMessage({ type: 'preview_complete' }, '*');
  }, []);

  return (
    <motion.div
      className="fixed inset-0 bg-gradient-to-br from-rose-950/90 via-black/95 to-fuchsia-950/90 backdrop-blur-3xl flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="text-center max-w-md mx-auto"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, duration: 1 }}
      >
        <div className="mb-10 relative">
          <div className="relative w-32 h-32 mx-auto">
            {/* Left half heart joining */}
            <motion.div
              className="absolute inset-0"
              initial={{ x: -45, rotate: -35 }}
              animate={{ x: 1, rotate: 0 }}
              transition={{ delay: 0.5, duration: 1.5, ease: "easeInOut" }}
            >
              <Heart className="w-32 h-32 text-pink-500 fill-current" style={{ clipPath: "inset(0 50% 0 0)" }} />
            </motion.div>
            
            {/* Right half heart joining */}
            <motion.div
              className="absolute inset-0 mr-1"
              initial={{ x: 45, rotate: 35 }}
              animate={{ x: 0, rotate: 0 }}
              transition={{ delay: 0.5, duration: 1.5, ease: "easeInOut" }}
            >
              <Heart className="w-32 h-32 text-pink-500 fill-current" style={{ clipPath: "inset(0 0 0 50%)" }} />
            </motion.div>

            {/* Glowing joined heart pulses after join */}
            <motion.div
              className="absolute inset-0"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [1, 1.2, 1], opacity: 1 }}
              transition={{
                delay: 1.8,
                scale: { delay: 2.3, duration: 1.5, repeat: Infinity, ease: "easeInOut" }
              }}
            >
              <Heart className="w-32 h-32 text-pink-500 fill-current drop-shadow-[0_0_20px_rgba(236,72,153,0.8)]" />
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.5, duration: 1 }}
        >
          <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-3 leading-tight">
            Let's make it worth it...
          </h1>
          <motion.p
            className="text-4xl md:text-5xl text-pink-300 font-black"
            animate={{ textShadow: ["0 0 8px rgba(236,72,153,0.6)", "0 0 20px rgba(236,72,153,0.9)", "0 0 8px rgba(236,72,153,0.6)"] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Forever✨
          </motion.p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Final;
