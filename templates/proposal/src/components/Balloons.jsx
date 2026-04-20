import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ArrowRight } from 'lucide-react';

const Balloon = ({ text, delay, color }) => (
  <motion.div
    className="flex flex-col items-center"
    initial={{ y: "100vh", opacity: 0, scale: 0.5 }}
    animate={{ y: 0, opacity: 1, scale: 1 }}
    transition={{
      y: { type: "spring", stiffness: 50, damping: 20, delay },
      opacity: { duration: 1, delay },
      scale: { duration: 1, delay }
    }}
  >
    <motion.div
      animate={{ y: [0, -15, 0], rotate: [-5, 5, -5] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      className="relative"
    >
      <div className="relative w-24 h-24 md:w-32 md:h-32 flex items-center justify-center">
        <div className={`absolute inset-0 rounded-full blur-xl ${color}`} />
        <Heart className={`w-full h-full absolute inset-0 text-white stroke-white/20 ${color}`} />
        <span className="relative z-10 text-white font-black text-2xl md:text-3xl drop-shadow-md">
          {text}
        </span>
      </div>
      <svg className="w-1 h-32 md:h-40 mx-auto opacity-40" viewBox="0 0 2 100">
        <path d="M1 0 Q 3 30, 1 60 T 1 100" stroke="white" strokeWidth="2" fill="none" />
      </svg>
    </motion.div>
  </motion.div>
);

const Balloons = ({ onNext }) => {
  const [showContinue, setShowContinue] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContinue(true);
    }, 8500); // Wait for all balloons to finish animating
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      className="fixed inset-0 flex flex-col items-center justify-center p-4 z-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      <div className="text-center w-full max-w-4xl mx-auto flex flex-col items-center">
        <motion.div className="mb-12" initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1, delay: 0.5 }}>
          <h1 className="text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 bg-clip-text text-transparent mb-4">
            This is what I wanted to say for so long...
          </h1>
          <motion.p
            className="text-pink-300/80 italic text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 1 }}
          >
            Watch the balloons carry my message to you
          </motion.p>
        </motion.div>

        <div className="flex gap-4 md:gap-12 justify-center items-end h-[300px] md:h-[400px]">
          <Balloon text="I" delay={0.5} color="fill-pink-500/80" />
          <Balloon text="Love" delay={2} color="fill-rose-500/80" />
          <Balloon text="You" delay={3.5} color="fill-purple-500/80" />
        </div>

        <AnimatePresence>
          {showContinue && (
            <motion.div
              className="text-center mt-10 flex flex-col items-center"
              initial={{ y: 50, scale: 0.8, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              <motion.p
                className="text-pink-300/80 text-sm mb-6"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                There's more I want to show you...
              </motion.p>
              <button
                onClick={onNext}
                className="bg-gradient-to-r from-pink-500 via-pink-600 to-red-500 hover:from-pink-600 hover:via-pink-700 hover:to-red-600 text-white px-8 py-4 text-lg font-semibold rounded-full transition-all duration-300 hover:scale-105 shadow-[0_0_30px_rgba(236,72,153,0.4)] flex items-center justify-center animate-[fadeInButton_1s_ease_forwards]"
              >
                <Heart className="w-5 h-5 mr-2 fill-current" />
                Continue
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Balloons;
