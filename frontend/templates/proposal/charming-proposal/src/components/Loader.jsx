import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

const Loader = ({ onComplete }) => {
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    setClicked(true);
    setTimeout(() => {
      onComplete();
    }, 2000);
  };

  return (
    <motion.div
      className="fixed inset-0 z-10 flex flex-col items-center justify-center p-4"
      exit={{ opacity: 0, transition: { duration: 1.5 } }}
    >
      <motion.p
        className="text-2xl md:text-4xl text-white italic tracking-widest text-center font-serif font-primary mb-16 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 2 }}
      >
        "Every great love story starts with a single heartbeat."
      </motion.p>

      {!clicked ? (
        <motion.button
          onClick={handleClick}
          className="relative group cursor-pointer"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="absolute inset-0 bg-red-500 rounded-full blur-xl opacity-40 group-hover:opacity-70 transition-opacity" />
          <Heart className="w-24 h-24 text-red-500 fill-red-500 relative z-10" />
          <p className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-white/80 whitespace-nowrap tracking-widest text-sm uppercase font-secondary">Tap to open</p>
        </motion.button>
      ) : (
        <motion.div
          animate={{ scale: [1, 25], opacity: [1, 0] }}
          transition={{ duration: 1.5, ease: "easeIn" }}
        >
          <Heart className="w-24 h-24 text-red-500 fill-red-500" />
        </motion.div>
      )}
    </motion.div>
  );
};

export default Loader;
