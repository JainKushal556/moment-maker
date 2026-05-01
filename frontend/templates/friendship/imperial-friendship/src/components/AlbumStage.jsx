import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useEffect } from 'react';

const AlbumStage = ({ config }) => {
  useEffect(() => {
    // Notify parent window that preview reached the final stage
    window.parent.postMessage({ type: 'TEMPLATE_COMPLETED' }, '*');
  }, []);
  const defaultPhotos = [
    { id: 1, tapeColor: "bg-amber-200/70", rotate: "-rotate-2" },
    { id: 2, tapeColor: "bg-fuchsia-300/70", rotate: "rotate-3" },
    { id: 3, tapeColor: "bg-orange-200/70", rotate: "rotate-2" },
    { id: 4, tapeColor: "bg-pink-200/70",   rotate: "-rotate-3" },
  ];

  const captions = config.captions || [
    "Summer Nights & Laughter ♡",
    "Best Friends Forever ♡",
    "Memories We Made ♡",
    "Always By My Side ♡"
  ];

  const photos = config.images.map((src, index) => ({
    ...defaultPhotos[index],
    src: src,
    caption: captions[index] || ""
  }));

  return (
    <div className="min-h-dvh w-full relative flex flex-col md:flex-row items-center justify-center px-4 md:px-12 py-10 md:py-16 overflow-y-auto overflow-x-visible no-scrollbar">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(217,70,239,0.1),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(245,158,11,0.1),transparent_70%)]" />
      </div>

      <div className="relative z-50 flex flex-col md:flex-row items-center justify-center w-full max-w-7xl gap-12 md:gap-16">

        {/* Left Side: Typography */}
        <div className="w-full md:w-[42%] flex flex-col items-center md:items-start text-center md:text-left shrink-0">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6 md:space-y-10"
          >
            <div className="space-y-4 md:space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight uppercase">
                  <span className="bg-linear-to-r from-fuchsia-400 via-amber-300 to-indigo-400 bg-clip-text text-transparent pr-8 pb-2 inline-block">
                    “Hey, Remember This?”
                  </span>
                </h1>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ delay: 0.6, duration: 1 }}
                className="h-px w-full md:w-48 bg-linear-to-r from-amber-400/50 to-transparent origin-left"
              />

              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="text-lg md:text-2xl font-light text-indigo-100/80 leading-relaxed max-w-md"
              >
                {config.memoryWords}
              </motion.p>
            </div>

            {/* Signature */}
            <motion.div
              className="relative pt-4 w-full"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.5, type: "spring", stiffness: 100 }}
            >
              <div className="absolute -inset-x-10 -inset-y-5 bg-fuchsia-500/10 blur-3xl rounded-full -rotate-3" />
              <div className="relative flex flex-col items-center md:items-start w-full">
                <span className="text-3xl md:text-5xl font-black bg-gradient-to-r from-fuchsia-400 via-amber-300 to-indigo-400 bg-clip-text text-transparent uppercase italic break-words pr-8 pb-2 inline-block">
                  — {config.nickname}
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Right Side: 2×2 Grid Collage — guaranteed no overlap */}
        <div className="w-full md:w-[55%] grid grid-cols-2 gap-3 md:gap-8 max-w-2xl">
          {photos.map((photo, i) => (
            <motion.div
              key={photo.id}
              className={`relative ${photo.rotate} cursor-pointer`}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + i * 0.2, duration: 0.7, type: "spring", stiffness: 120 }}
              whileHover={{ scale: 1.05, rotate: "0deg", zIndex: 50 }}
            >
              {/* Washi Tape */}
              <div className={`absolute -top-3 left-1/2 -translate-x-1/2 w-14 md:w-20 h-5 md:h-6 ${photo.tapeColor} z-10 shadow-sm border border-white/20`} />

              {/* Polaroid Frame */}
              <div className="w-full bg-white p-2 md:p-3 pb-6 md:pb-8 shadow-2xl rounded-sm">
                <div className="w-full aspect-4/3 bg-gray-100 overflow-hidden relative border border-black/5">
                  <img
                    src={photo.src}
                    alt={`Memory ${photo.id}`}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = `https://via.placeholder.com/400x300/f0fdf4/166534?text=Memory+${photo.id}`; }}
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/10 to-transparent pointer-events-none" />
                </div>

                {/* Caption */}
                <div className="mt-2 md:mt-3 px-2">
                  <p className="text-[10px] md:text-[12px] font-bold text-gray-700 tracking-tight font-mono leading-tight text-center">
                    {photo.caption}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default AlbumStage;
