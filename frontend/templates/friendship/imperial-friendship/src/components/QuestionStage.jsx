import React, { useState } from 'react';
import { motion } from 'framer-motion';

const QuestionStage = ({ onNext }) => {
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });

  const moveNoButton = () => {
    const maxX = window.innerWidth / 3;
    const maxY = window.innerHeight / 3;
    const x = (Math.random() - 0.5) * maxX * 1.5;
    const y = (Math.random() - 0.5) * maxY * 1.5;
    setNoPosition({ x, y });
  };

  return (
    <motion.div className="min-h-screen relative">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(217,70,239,0.08),transparent_50%)]" />
      </div>
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="text-center w-full">
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-3xl md:text-5xl font-black leading-tight uppercase tracking-tight">
              <span className="bg-linear-to-r from-fuchsia-400 to-amber-500 bg-clip-text text-transparent pr-6 pb-2 inline-block">
                Are You Really My Friend?
              </span>
            </h1>
          </motion.div>
          <div className="flex flex-row items-center justify-center gap-4 sm:gap-8 relative min-h-[100px]">
            <motion.button
              onClick={onNext}
              className="px-6 sm:px-10 py-3 sm:py-4 bg-linear-to-r from-fuchsia-500 to-amber-500 text-white text-sm sm:text-lg font-black rounded-full shadow-lg hover:shadow-fuchsia-500/25 transition-all duration-300 border-2 border-white/80 z-10 uppercase tracking-wider"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              Of Course! 💛
            </motion.button>
            <motion.div
              animate={{ x: noPosition.x, y: noPosition.y }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="z-20"
            >
              <motion.button
                onHoverStart={moveNoButton}
                onTouchStart={(e) => { e.preventDefault(); moveNoButton(); }}
                onClick={moveNoButton}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="px-8 sm:px-10 py-3 sm:py-4 bg-slate-800/80 text-indigo-100 text-base sm:text-xl font-bold rounded-full shadow-lg border-2 border-gray-600"
              >
                No
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default QuestionStage;
