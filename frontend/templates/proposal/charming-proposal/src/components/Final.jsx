import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Heart, MapPin, Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

const Final = ({ locationName }) => {
  const [accepted, setAccepted] = useState(false);
  const [dateConfirmed, setDateConfirmed] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const scrollRef = useRef(null);

  // Send unlock signal to parent (editor/preview) when user reaches the final stage
  useEffect(() => {
    if (dateConfirmed) {
      window.parent.postMessage({ type: 'TEMPLATE_COMPLETED' }, '*');
    }
  }, [dateConfirmed]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 240;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Generate next 30 days starting from tomorrow
  const dates = useMemo(() => {
    return Array.from({ length: 30 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() + i + 1);
      return d;
    });
  }, []);

  const handleYes = () => {
    setAccepted(true);
    const duration = 5 * 1000;
    const end = Date.now() + duration;
    const isMobile = window.innerWidth < 768;
    const particleCountPerFrame = isMobile ? 2 : 4;

    (function frame() {
      confetti({
        particleCount: particleCountPerFrame,
        angle: 60,
        spread: 60,
        origin: { x: 0 },
        colors: ['#ff4d6d', '#ff80b5', '#FFD700', '#f472b6', '#ffffff']
      });
      confetti({
        particleCount: particleCountPerFrame,
        angle: 120,
        spread: 60,
        origin: { x: 1 },
        colors: ['#ff4d6d', '#ff80b5', '#FFD700', '#f472b6', '#ffffff']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  };

  const handleConfirmDate = (e) => {
    e.preventDefault();
    if (!selectedDate) return;
    
    setDateConfirmed(true);
    const isMobile = window.innerWidth < 768;
    confetti({
      particleCount: isMobile ? 50 : 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ff4d6d', '#ff80b5', '#FFD700', '#ffffff']
    });
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 overflow-y-auto md:overflow-hidden no-scrollbar flex flex-col bg-[#1a040d]/60 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2.5 }}
    >
      <div className="flex-1 flex flex-col items-center justify-center p-4 py-12 md:py-6">
        <div className="max-w-3xl text-center w-full">
          {!accepted ? (
            <>
              <motion.div
                initial={{ scale: 0.95, opacity: 0, filter: 'blur(10px)' }}
                animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
                transition={{ duration: 2.5, delay: 0.5 }}
              >
                <h1 className="text-5xl md:text-6xl text-white font-serif font-primary italic mb-10 md:mb-12 drop-shadow-[0_0_25px_rgba(255,255,255,0.3)]">
                  Will you be mine, forever?
                </h1>
              </motion.div>
              
              <motion.div
                className="flex justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.5, delay: 2 }}
              >
                <button
                  onClick={handleYes}
                  className="group relative px-12 md:px-16 py-5 bg-white/10 text-white border border-white hover:border-white transition-all duration-700 text-xl md:text-2xl tracking-[0.3em] uppercase overflow-hidden rounded-full shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_50px_rgba(255,255,255,0.5)]"
                >
                  <span className="relative z-10 group-hover:text-[#4a0f2b] transition-colors duration-500 flex items-center justify-center gap-3 font-bold">
                    <Heart className="w-8 h-8 fill-red-500 text-red-500" /> 
                    YES 
                    <Heart className="w-8 h-8 fill-red-500 text-red-500" />
                  </span>
                  <div className="absolute inset-0 w-full h-full bg-white scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] z-0" />
                </button>
              </motion.div>
            </>
          ) : !dateConfirmed ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5 }}
              className="w-full max-w-md mx-auto bg-black/40 backdrop-blur-xl border border-white/20 p-8 md:p-6 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
            >
              <Heart className="w-16 h-16 text-red-500 fill-red-500 mx-auto mb-6 animate-pulse drop-shadow-[0_0_15px_rgba(239,68,68,0.6)]" />
              <h2 className="text-3xl md:text-4xl text-white font-serif font-primary italic mb-2">Our First Date</h2>
              <p className="text-white/60 text-[10px] tracking-widest uppercase mb-10">Choose a day that's special for us</p>
              
              <div className="space-y-6 md:space-y-4 text-left">
                {/* Luxury Decorated Location Card */}
                <div className="relative group">
                  {/* Outer Glow */}
                  <div className="absolute -inset-1 bg-linear-to-r from-pink-500/20 to-rose-600/20 rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition duration-1000"></div>
                  
                  <div className="relative bg-black/40 border border-white/10 p-3.5 md:p-5 rounded-2xl flex items-center gap-3.5 md:gap-4 shadow-2xl overflow-hidden">
                    {/* Subtle Shimmer Overlay */}
                    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                      <div className="absolute top-0 -inset-full h-full w-1/2 block transform -skew-x-12 bg-linear-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
                    </div>
                    
                    <motion.div 
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                      className="relative z-10 bg-linear-to-br from-pink-500 to-rose-600 p-3 md:p-4 rounded-xl shadow-[0_8px_25px_rgba(255,77,109,0.5)]"
                    >
                      <MapPin className="h-5 w-5 md:h-7 md:w-7 text-white" />
                    </motion.div>
                    
                    <div className="relative z-10">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="h-px w-5 bg-pink-500/50"></span>
                        <p className="text-pink-400 text-[8px] md:text-[9px] tracking-[0.4em] uppercase font-bold">Exclusive Venue</p>
                      </div>
                      <p className="text-white text-xl md:text-4xl font-serif font-primary italic tracking-wider drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">{locationName || "Taj Hotel"}</p>
                      <p className="text-white/40 text-[10px] mt-1 md:mt-2 tracking-widest italic font-light flex items-center gap-2">
                        <span className="w-1 h-1 bg-pink-500 rounded-full animate-pulse"></span>
                        A beautiful evening awaits us...
                      </p>
                    </div>
                  </div>
                </div>

                {/* Unique Date Picker */}
                <div className="space-y-4 relative group/dates">
                  <div className="flex items-center justify-between mb-2 ml-1">
                    <div className="flex items-center gap-2 text-white/50">
                      <CalendarIcon size={14} />
                      <p className="text-[10px] tracking-[0.2em] uppercase">Select Date</p>
                    </div>
                    {/* Desktop Scroll Hint */}
                    <p className="hidden md:block text-[9px] text-white/30 uppercase tracking-widest italic">Scroll to explore</p>
                  </div>
                  
                  <div className="relative">
                    {/* Left Scroll Button */}
                    <button 
                      onClick={() => scroll('left')}
                      className="absolute left-[-20px] top-1/2 -translate-y-1/2 z-20 p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white/40 hover:text-white transition-all hidden md:flex items-center justify-center backdrop-blur-md opacity-0 group-hover/dates:opacity-100"
                    >
                      <ChevronLeft size={20} />
                    </button>

                    <div 
                      ref={scrollRef}
                      className="flex overflow-x-auto gap-4 pb-4 no-scrollbar -mx-2 px-2 snap-x scroll-smooth"
                    >
                      {dates.map((date) => {
                        const isSelected = selectedDate?.toDateString() === date.toDateString();
                        return (
                          <motion.button
                            key={date.toISOString()}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedDate(date)}
                            className={`shrink-0 w-20 h-24 rounded-2xl border transition-all duration-500 flex flex-col items-center justify-center gap-1 snap-start
                              ${isSelected 
                                ? 'bg-linear-to-b from-pink-400 to-rose-600 text-white border-transparent scale-105 shadow-[0_10px_20px_rgba(255,77,109,0.3)]' 
                                : 'bg-white/5 text-white/60 border-white/10 hover:border-white/30'}`}
                          >
                            <span className={`text-[9px] uppercase tracking-widest ${isSelected ? 'text-white/80' : 'text-white/40'}`}>
                              {date.toLocaleString('default', { weekday: 'short' })}
                            </span>
                            <span className="text-2xl font-serif font-primary italic leading-none">{date.getDate()}</span>
                            <span className={`text-[9px] uppercase tracking-widest ${isSelected ? 'text-white/80' : 'text-white/40'}`}>
                              {date.toLocaleString('default', { month: 'short' })}
                            </span>
                          </motion.button>
                        );
                      })}
                    </div>

                    {/* Right Scroll Button */}
                    <button 
                      onClick={() => scroll('right')}
                      className="absolute right-[-20px] top-1/2 -translate-y-1/2 z-20 p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white/40 hover:text-white transition-all hidden md:flex items-center justify-center backdrop-blur-md opacity-0 group-hover/dates:opacity-100"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>

                  {/* Mobile Scroll Hint */}
                  <div className="md:hidden flex justify-center items-center gap-2 mt-1">
                    <div className="h-px w-4 bg-white/10"></div>
                    <p className="text-[8px] text-white/30 uppercase tracking-[0.2em] italic">Scroll to view</p>
                    <div className="h-px w-4 bg-white/10"></div>
                  </div>
                </div>

                <AnimatePresence>
                  {selectedDate && (
                    <motion.button 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      onClick={handleConfirmDate}
                      className="w-full py-5 bg-linear-to-r from-[#ff4d6d] to-[#ff80b5] hover:from-[#ff3d5d] hover:to-[#ff70a5] text-white rounded-2xl transition-all duration-500 uppercase tracking-[0.3em] text-sm font-bold shadow-[0_15px_35px_rgba(255,77,109,0.3)] hover:shadow-[0_20px_45px_rgba(255,77,109,0.5)] transform hover:-translate-y-1 active:scale-95"
                    >
                      Confirm Date 💕
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 2 }}
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <img 
                  src="gif/peach-goma.webp" 
                  alt="Peach and Goma" 
                  className="w-40 md:w-48 h-auto object-contain mx-auto mb-6 drop-shadow-xl"
                />
              </motion.div>
              <h1 className="text-5xl md:text-6xl text-white font-serif font-primary italic mb-4 md:mb-6 drop-shadow-[0_0_25px_rgba(255,255,255,0.4)]">
                It's a Date!
              </h1>
              <p className="text-xl md:text-xl text-white/90 tracking-[0.4em] uppercase font-light mt-4 md:mt-6 drop-shadow-md">
                Here's to our forever. I love you.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Final;
