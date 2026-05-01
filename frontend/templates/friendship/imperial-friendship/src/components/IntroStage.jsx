import React from 'react';
import { motion } from 'framer-motion';

const IntroStage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-6">

      {/* Ambient glow blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-fuchsia-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Content */}
      <div className="relative z-10 text-center w-full max-w-xl">

        {/* Big bouncing emoji */}
        <motion.div
          className="flex justify-center items-center mb-12"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
        >
          <motion.span
            className="text-9xl md:text-[10rem]"
            animate={{ y: [0, -24, 0], scale: [1, 1.08, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >🤗</motion.span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          className="text-3xl md:text-5xl font-black tracking-tight leading-tight mb-6 uppercase"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.9 }}
        >
          <span className="bg-linear-to-r from-fuchsia-400 via-amber-300 to-indigo-400 bg-clip-text text-transparent pr-8 pb-2 inline-block">
            Something Special
          </span>
          <br />
          <span className="bg-linear-to-r from-indigo-400 via-fuchsia-400 to-amber-400 bg-clip-text text-transparent pr-8 pb-2 inline-block">
            Is On Its Way...
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-base md:text-xl font-medium mb-14"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
        >
          Crafted with memories and a little magic, just for you...
        </motion.p>

        {/* Progress Bar */}
        <motion.div
          className="w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <div className="flex justify-between text-amber-400/70 text-[10px] md:text-sm font-bold mb-3 px-1 uppercase tracking-[0.3em]">
            <span>Preparing Your Surprise</span>
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3 }}>Ready!</motion.span>
          </div>
          <div className="h-2.5 w-full bg-white/5 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-linear-to-r from-fuchsia-500 via-amber-400 to-indigo-500 rounded-full relative overflow-hidden"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ delay: 1, duration: 2.8, ease: "circOut" }}
            >
              <motion.div
                className="absolute inset-0 bg-white/30 w-1/2 -skew-x-12"
                animate={{ x: ["-100%", "300%"] }}
                transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
              />
            </motion.div>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default IntroStage;
