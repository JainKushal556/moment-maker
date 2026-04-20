import React from 'react';
import { motion } from 'framer-motion';

const Loader = ({ onComplete }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1, ease: "easeInOut" }}
      className="fixed inset-0 flex flex-col gap-10 items-center justify-center z-10 p-4"
    >
      <div className="relative w-[100px] h-[120px] animate-[pandaBounce_2s_ease-in-out_infinite]">
        <div className="absolute w-[28px] h-[28px] rounded-full top-[-10px] left-[8px] bg-[radial-gradient(circle,#2a2a2a,#1a1a1a)]" />
        <div className="absolute w-[28px] h-[28px] rounded-full top-[-10px] right-[8px] bg-[radial-gradient(circle,#2a2a2a,#1a1a1a)]" />
        <div className="relative w-[100px] h-[100px] rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.3)] bg-[radial-gradient(circle_at_35%_35%,#f0f0f0,#d8d8d8)]">
          <div className="absolute w-[32px] h-[28px] rounded-full top-[28px] left-[10px] bg-[radial-gradient(circle,#2a2a2a,#111)]" />
          <div className="absolute w-[32px] h-[28px] rounded-full top-[28px] right-[10px] bg-[radial-gradient(circle,#2a2a2a,#111)]" />
          
          <div className="absolute w-[16px] h-[20px] bg-white rounded-full overflow-hidden top-[31px] left-[18px]">
            <div className="absolute w-full h-0 bg-[#222] top-0 rounded-b-full animate-[blink_4s_ease-in-out_infinite]" />
            <div className="absolute w-[8px] h-[10px] bg-[#111] rounded-full top-[4px] left-1/2 -translate-x-1/2" />
          </div>
          <div className="absolute w-[16px] h-[20px] bg-white rounded-full overflow-hidden top-[31px] right-[18px]">
            <div className="absolute w-full h-0 bg-[#222] top-0 rounded-b-full animate-[blink_4s_ease-in-out_infinite]" />
            <div className="absolute w-[8px] h-[10px] bg-[#111] rounded-full top-[4px] left-1/2 -translate-x-1/2" />
          </div>

          <div className="absolute w-[12px] h-[8px] bg-[#ff8fab] rounded-full top-[60px] left-1/2 -translate-x-1/2" />
          <div className="absolute w-[24px] h-[10px] border-2 border-t-0 border-[#ff8fab] rounded-b-full top-[72px] left-1/2 -translate-x-1/2" />
        </div>
      </div>

      <motion.h2
        className="text-2xl text-center bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent font-bold"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        Something special is coming...
      </motion.h2>

      <motion.div
        className="flex justify-center space-x-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-3 h-3 rounded-full bg-gradient-to-r from-pink-400 to-purple-400"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
};

export default Loader;
