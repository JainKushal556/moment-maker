import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PhotosLetter = ({ onNext, images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const defaultTexts = [
    "You became my favorite hello...",
    "And my hardest goodbye.",
    "Through every laugh and every tear...",
    "You showed me what true love means."
  ];

  const memories = (images || []).map((img, i) => ({
    src: img,
    text: defaultTexts[i] || "A beautiful memory..."
  }));

  const handleNext = (e) => {
    e.stopPropagation();
    if (currentIndex < memories.length - 1) {
      // Step 1: Change image and flip back SIMULTANEOUSLY
      // The image swaps on the hidden front side while the card is turning
      setIsFlipped(false);
      setCurrentIndex(prev => prev + 1);
    } else {
      onNext();
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-10 overflow-y-auto no-scrollbar flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 1.5 } }}
      exit={{ opacity: 0, transition: { duration: 1.5 } }}
    >
      <div className="flex-1 flex flex-col items-center justify-center p-4 py-12">
        {/* 1. Instruction Text at Top */}
        <div className="mb-4 md:mb-6 text-center min-h-12 flex items-center justify-center">
          <p className="text-white/80 text-base md:text-lg tracking-widest font-serif italic animate-pulse drop-shadow-md">
            {isFlipped ? "Reading the memory..." : "Tap the photo to flip it..."}
          </p>
        </div>

        {/* 2. Image Card (shifted upwards) */}
        <div className="relative w-full max-w-[240px] md:max-w-[320px] aspect-4/5 perspective-1000">
          <motion.div
            className="w-full h-full cursor-pointer"
            style={{ transformStyle: "preserve-3d" }}
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ duration: 0.8, type: "spring", stiffness: 50, damping: 15 }}
            onClick={() => setIsFlipped(!isFlipped)}
          >
            {/* Front of card (Photo) */}
            <div
              className="absolute inset-0 rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl bg-[#1a040d]"
              style={{ backfaceVisibility: "hidden" }}
            >
              <img
                src={memories[currentIndex].src}
                alt="memory"
                className="w-full h-full object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />
            </div>

            {/* Back of card (Text) */}
            <div
              className="absolute inset-0 rounded-2xl border-2 border-white/20 bg-linear-to-br from-[#4a0f2b] to-[#1a040d] flex items-center justify-center p-6 md:p-8 shadow-2xl"
              style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
            >
              <p className="text-xl md:text-3xl text-white font-serif font-primary italic text-center leading-relaxed drop-shadow-md">
                {memories[currentIndex].text}
              </p>
            </div>
          </motion.div>
        </div>

        {/* 3. Dots and Navigation Button at Bottom */}
        <div className="mt-4 flex flex-col items-center gap-8">
          <div className="flex gap-2.5">
            {memories.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-500 ${i === currentIndex ? 'w-8 bg-white' : 'w-2 bg-white/20'}`}
              />
            ))}
          </div>

          <motion.button
            onClick={handleNext}
            className={`px-10 py-3 rounded-full border border-white text-white transition-all duration-500 tracking-[0.2em] uppercase text-xs md:text-sm font-semibold shadow-lg
              ${isFlipped ? 'opacity-100 translate-y-0 bg-white/10 hover:bg-white hover:text-[#4a0f2b]' : 'opacity-0 translate-y-4 pointer-events-none'}`}
          >
            {currentIndex === memories.length - 1 ? "Take my hand" : "Next Memory"}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default PhotosLetter;
