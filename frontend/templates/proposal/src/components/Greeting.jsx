import React from 'react';
import { motion } from 'framer-motion';
import { Heart, ArrowRight } from 'lucide-react';

const Greeting = ({ onNext }) => {
  return (
    <motion.div
      className="fixed inset-0 flex flex-col items-center justify-center p-4 z-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      <div className="text-center max-w-3xl mx-auto">
        <div className="mb-8 relative flex justify-center">
          <div className="w-[144px] h-[144px] rounded-full bg-gradient-to-br from-purple-500/20 to-rose-500/20 border-2 border-pink-400/30 flex items-center justify-center backdrop-blur-sm animate-[pulseShadow_2s_ease-in-out_infinite]">
            <img 
              src="./gif/cute.gif" 
              alt="Cute bear" 
              className="w-[110px] h-[110px] object-cover rounded-full"
            />
          </div>
        </div>

        <motion.h1
          className="text-4xl md:text-6xl font-extrabold bg-gradient-to-br from-pink-300 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent mb-6 leading-tight"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          I have something special<br />to tell you...
        </motion.h1>

        <motion.p
          className="text-pink-300/80 text-xl md:text-2xl mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
        >
          Something that will change everything✨
        </motion.p>

        <motion.button
          onClick={onNext}
          className="bg-gradient-to-r from-pink-500 via-pink-600 to-purple-600 hover:from-pink-400 hover:via-pink-500 hover:to-purple-500 text-white px-8 py-4 text-xl font-bold rounded-full transition-all duration-300 hover:scale-105 shadow-[0_0_20px_rgba(236,72,153,0.5)] hover:shadow-[0_0_30px_rgba(236,72,153,0.7)] flex items-center justify-center mx-auto"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            delay: 2.5,
            type: "spring",
            stiffness: 200,
            damping: 20
          }}
        >
          <Heart className="w-5 h-5 mr-2 fill-current" />
          Tap to Begin
        </motion.button>
      </div>
    </motion.div>
  );
};

export default Greeting;
