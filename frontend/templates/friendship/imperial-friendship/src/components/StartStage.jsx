import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Star, Heart } from 'lucide-react';

const StartStage = ({ config, onNext }) => {
  const [isStarting, setIsStarting] = useState(false);
  const [typedText, setTypedText] = useState('');
  
  const fullText = config.letterBody;

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setTypedText(fullText.slice(0, index));
      index++;
      if (index > fullText.length) {
        clearInterval(interval);
      }
    }, 30);
    return () => clearInterval(interval);
  }, [fullText]);

  const handleStart = () => {
    if (!isStarting) {
      setIsStarting(true);
      setTimeout(onNext, 1000);
    }
  };

  return (
    <motion.div className="h-dvh w-full relative flex items-center justify-center px-4 overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-fuchsia-600/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-amber-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative bg-slate-900/50 backdrop-blur-2xl border border-white/10 rounded-4xl p-6 md:p-10 shadow-2xl overflow-visible"
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-6 md:mb-8">
            <div className="space-y-1">
              <div className="h-1 w-12 bg-gradient-to-r from-fuchsia-400 to-amber-400 rounded-full" />
              <h2 className="text-xl md:text-3xl font-black uppercase tracking-tight bg-gradient-to-r from-fuchsia-400 via-amber-300 to-amber-500 bg-clip-text text-transparent pr-6 pb-1 inline-block">
                {config.letterHeader}
              </h2>
            </div>
            <div className="p-2.5 bg-white/5 rounded-xl border border-white/10">
              <Mail className="w-5 h-5 text-fuchsia-400/80" />
            </div>
          </div>

          {/* Body */}
          <div className="min-h-[160px] md:min-h-[200px]">
            <p className="text-[14px] md:text-lg text-indigo-100/90 font-medium leading-relaxed whitespace-pre-wrap">
              {typedText}
              <motion.span 
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="inline-block w-1.5 h-5 bg-fuchsia-400 ml-1 translate-y-0.5"
              />
            </p>
          </div>

          {/* Footer & Signature */}
          <div className="mt-8 flex flex-col items-end w-full">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: typedText.length >= fullText.length ? 1 : 0 }}
              className="text-right w-full"
            >
              <p className="text-white/40 text-[10px] font-bold tracking-widest uppercase mb-0.5">With absolute chaos,</p>
              <p className="text-2xl md:text-3xl font-black bg-gradient-to-r from-fuchsia-400 via-amber-300 to-indigo-400 bg-clip-text text-transparent uppercase italic break-words pr-6 pb-1 inline-block">
                — {config.nickname}
              </p>
            </motion.div>

            <AnimatePresence>
              {typedText.length >= fullText.length && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 w-full flex justify-center"
                >
                  <motion.button
                    onClick={handleStart}
                    disabled={isStarting}
                    className="group relative px-6 py-3 bg-gradient-to-r from-fuchsia-600 to-indigo-600 text-white text-sm md:text-base font-black rounded-xl shadow-lg shadow-fuchsia-500/20 border border-white/10 overflow-hidden flex items-center gap-2 transition-all active:scale-95"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    <span className="relative z-10">SEE OUR BEST MOMENTS</span>
                    <Star className="w-4 h-4 relative z-10 fill-current" />
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default StartStage;
