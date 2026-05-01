import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Letter = ({ onNext, body }) => {
  const [typedText, setTypedText] = useState('');

  const fullText = `My Dearest,\n\n${body || "In your smile, I find my home..."}\n\nYours forever.`;

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      setTypedText(fullText.slice(0, index));
      index++;
      if (index > fullText.length) {
        clearInterval(timer);
      }
    }, 40);

    return () => clearInterval(timer);
  }, [fullText]);

  return (
    <motion.div
      className="fixed inset-0 z-10 overflow-y-auto no-scrollbar flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 1.5 } }}
    >
      <div className="flex-1 flex flex-col items-center justify-center p-3 md:p-8 py-12 md:py-16 gap-4 md:gap-10">
        <div className="w-full max-w-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.15)] rounded-lg p-5 md:px-12 md:py-8 relative overflow-visible flex flex-col">

          {/* Soft pink glow behind letter */}
          <div className="absolute top-[-50px] right-[-50px] w-48 h-48 bg-pink-500/20 blur-[60px] rounded-full pointer-events-none z-0" />
          <div className="absolute bottom-[-50px] left-[-50px] w-48 h-48 bg-rose-500/20 blur-[60px] rounded-full pointer-events-none z-0" />

          {/* Floating GIFs on the borders */}
          <motion.img
            src="gif/cute.gif"
            alt="Cute Floating GIF"
            className="absolute -top-10 -left-4 md:-top-12 md:-left-8 w-20 md:w-32 h-auto object-contain drop-shadow-xl z-20"
            animate={{ y: [0, -10, 0], rotate: [-5, 5, -5] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />

          <AnimatePresence>
            {typedText.length >= fullText.length && (
              <motion.img
                src="gif/msg.gif"
                alt="Message Floating GIF"
                className="absolute -bottom-8 -right-6 md:-bottom-12 md:-right-12 w-24 md:w-36 h-auto object-contain drop-shadow-xl z-20"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1, y: [0, 10, 0], rotate: [5, -5, 5] }}
                transition={{
                  opacity: { duration: 0.5 },
                  scale: { duration: 0.5, type: "spring" },
                  y: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 },
                  rotate: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }
                }}
              />
            )}
          </AnimatePresence>

          <div className="text-white font-serif font-primary italic text-[13px] md:text-xl leading-[1.6] md:leading-relaxed whitespace-pre-wrap relative z-10 drop-shadow-sm px-1 md:px-4">
            {typedText}
            <span className="animate-pulse inline-block w-1.5 h-3.5 md:h-5 bg-white ml-1 translate-y-0.5"></span>
          </div>
        </div>

        <motion.button
          onClick={onNext}
          className="shrink-0 px-6 py-2.5 md:px-10 md:py-3 rounded-full border border-white text-white hover:bg-white hover:text-[#4a0f2b] transition-all duration-300 tracking-[0.2em] uppercase text-[10px] md:text-sm font-semibold shadow-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: typedText.length >= fullText.length ? 1 : 0 }}
          transition={{ duration: 1 }}
          disabled={typedText.length < fullText.length}
        >
          Close Letter
        </motion.button>
      </div>
    </motion.div>
  );
};

export default Letter;
