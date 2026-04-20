import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCustomization } from '../context/CustomizationContext';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { EffectCoverflow, Navigation, Pagination } from 'swiper/modules';

const FALLBACK_IMAGES = ["./images/1.jpg", "./images/2.jpg", "./images/3.jpg", "./images/4.jpg"];

const PhotosLetter = ({ onNext }) => {
  const [step, setStep] = useState('photos'); // 'photos' | 'envelope' | 'letter'
  const [typedText, setTypedText] = useState("");
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [showConfettiBtn, setShowConfettiBtn] = useState(false);
  const scrollRef = useRef(null);

  const customization = useCustomization();

  // Use uploaded images or fall back to static ones
  const images = (customization?.images || []).map((img, i) => img || FALLBACK_IMAGES[i]);

  // Use custom letter or fall back to default
  const letterContent = customization?.letterContent || `From the moment you came into my life, everything started to change.
You brought colors to my ordinary days, warmth to my silence, and a happiness I didn't even know I was missing.

Every sunrise feels brighter because of you.
Every dream feels possible because you inspire me.
Every challenge feels easier because I imagine you by my side.

You are not just my friend, you're the most special part of my life.
You make me smile, you make my heart race, and you make me want to be a better version of myself.

I don't know what the future holds, but I know one thing for sure.
I want that future with you.`;

  useEffect(() => {
    if (step === 'letter' && !isTypingComplete) {
      let index = 0;
      const interval = setInterval(() => {
        if (index < letterContent.length) {
          setTypedText(letterContent.slice(0, index + 1));
          index++;
          if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
          }
        } else {
          setIsTypingComplete(true);
          setTimeout(() => setShowConfettiBtn(true), 500);
          clearInterval(interval);
        }
      }, 30);
      return () => clearInterval(interval);
    }
  }, [step, isTypingComplete, letterContent]);

  const handleYesForever = () => {
    // Fire confetti
    const opts = { origin: { y: 0.8 }, colors: ["#ff4d6d", "#ff80b5", "#c084fc", "#a855f7", "#f472b6", "#fb7185"] };
    const fire = (ratio, extra) => confetti({ ...opts, ...extra, particleCount: Math.floor(200 * ratio) });
    
    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });

    onNext();
  };

  return (
    <motion.div
      className="fixed inset-0 flex flex-col items-center justify-center p-4 z-10"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      <div className="max-w-[800px] w-full mx-auto text-center">
        <AnimatePresence mode="wait">
          {step === 'photos' && (
            <motion.div key="photos" exit={{ opacity: 0 }} className="w-full">
              
              <h1 className="text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-3 leading-tight drop-shadow-sm">
                From the first day I met you, life became brighter...
              </h1>
              
              <p className="text-pink-200/80 italic text-lg mb-10">
                You've made every moment so special 💕
              </p>

              {/* Swiper Photos Carousel */}
              <div className="max-w-2xl mx-auto mb-10 px-4 md:px-12 relative !overflow-visible">
                <style>{`
                  .swiper-button-next, .swiper-button-prev {
                    color: rgba(255, 255, 255, 0.7) !important;
                    background: rgba(0,0,0,0.6);
                    width: 44px !important;
                    height: 44px !important;
                    border-radius: 50%;
                    top: 50% !important;
                  }
                  .swiper-button-next::after, .swiper-button-prev::after {
                    font-size: 20px !important;
                  }
                  .swiper-slide {
                    width: 280px !important;
                    height: 380px !important;
                  }
                  .swiper-pagination-bullet {
                    background: rgba(236,72,153,0.5) !important;
                    opacity: 1 !important;
                  }
                  .swiper-pagination-bullet-active {
                    background: rgba(236,72,153,1) !important;
                    box-shadow: 0 0 10px rgba(236,72,153,0.8);
                  }
                `}</style>

                <Swiper
                  effect={'coverflow'}
                  grabCursor={true}
                  centeredSlides={true}
                  slidesPerView={'auto'}
                  coverflowEffect={{
                    rotate: 35,
                    stretch: -10,
                    depth: 150,
                    modifier: 1,
                    slideShadows: true,
                  }}
                  navigation={true}
                  pagination={{ clickable: true }}
                  modules={[EffectCoverflow, Navigation, Pagination]}
                  className="w-full h-auto py-8"
                >
                  {images.map((src, i) => (
                    <SwiperSlide key={i}>
                      <div className="w-full h-full rounded-2xl overflow-hidden shadow-[0_4px_25px_rgba(236,72,153,0.3)] border-2 border-pink-500/30 bg-purple-900/30">
                        <img 
                          src={src} 
                          alt="memory" 
                          className="w-full h-full object-cover block" 
                          onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center text-4xl">💕</div>'; }}
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>

              <p className="text-pink-300/60 text-sm mb-4 font-light">
                Now for the most important part...
              </p>

              <button
                className="bg-gradient-to-r from-pink-500 via-purple-500 to-fuchsia-500 hover:-translate-y-1 hover:scale-105 transition-all duration-300 text-white px-8 py-4 rounded-full font-bold shadow-[0_0_20px_rgba(236,72,153,0.5)] flex items-center justify-center mx-auto text-lg"
                onClick={() => setStep('envelope')}
              >
                <Heart className="w-5 h-5 mr-2 fill-current" />
                See the Message <ArrowRight className="w-6 h-6 ml-2" />
              </button>

            </motion.div>
          )}

          {step === 'envelope' && (
            <motion.div key="envelope" exit={{ opacity: 0 }} className="w-full flex flex-col items-center">
              <motion.div
                className="mb-8 flex justify-center"
                animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <img src="./gif/msg.gif" className="w-[112px]" alt="envelope" />
              </motion.div>

              <h1 className="text-4xl md:text-5xl text-white mb-8 leading-tight font-extrabold drop-shadow-md">
                This is just for <span className="text-pink-400">you...</span>
              </h1>

              <div
                className="cursor-pointer transform transition-all duration-300 hover:scale-105 bg-gradient-to-br from-purple-900/30 to-rose-900/30 backdrop-blur-md border border-pink-500/30 rounded-3xl p-8 w-full max-w-[320px] shadow-[0_0_20px_rgba(236,72,153,0.3)]"
                onClick={() => setStep('letter')}
              >
                <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                  <Heart className="w-12 h-12 text-pink-500 mx-auto mb-4 fill-current" />
                </motion.div>
                <p className="text-xl text-pink-200">Tap to see what's inside</p>
              </div>
            </motion.div>
          )}

          {step === 'letter' && (
            <motion.div
              key="letter"
              layout
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, type: "spring", stiffness: 100, damping: 20 }}
              className="max-w-xl mx-auto"
            >
              <div className="bg-gradient-to-br from-purple-950/80 via-pink-950/80 to-fuchsia-950/80 backdrop-blur-xl border border-pink-500/40 shadow-2xl rounded-3xl p-6 md:p-8">
                <div ref={scrollRef} className="h-80 overflow-y-auto text-left pr-3 scrollbar-thin">
                  <div className="text-pink-100 leading-relaxed whitespace-pre-line text-sm md:text-base">
                    {typedText}
                    {!isTypingComplete && (
                      <motion.span
                        className="text-pink-400 font-bold ml-1"
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                      >
                        |
                      </motion.span>
                    )}
                  </div>
                </div>
              </div>

              <AnimatePresence>
                {showConfettiBtn && (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="text-center mt-8"
                  >
                    <h2 className="text-2xl md:text-3xl bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-6 font-bold drop-shadow-md">
                      So, Will you be mine forever?
                    </h2>
                    <button
                      onClick={handleYesForever}
                      className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 py-4 text-xl font-bold rounded-full transition-all duration-300 hover:scale-105 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(236,72,153,0.6)]"
                    >
                      <Heart className="w-5 h-5 mr-2 fill-current" />
                      Yes, forever!
                      <Heart className="w-5 h-5 ml-2 fill-current" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default PhotosLetter;
