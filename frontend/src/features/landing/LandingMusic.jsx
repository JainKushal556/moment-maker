import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import landingMusic from '../../assets/LandingPageMusic.mp3';

const LandingMusic = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const audioRef = useRef(null);

    useEffect(() => {
        // Initialize audio
        const audio = new Audio(landingMusic);
        audio.loop = true;
        audioRef.current = audio;
        
        const playAudio = async () => {
            try {
                await audio.play();
                setIsPlaying(true);
                setIsMuted(false);
            } catch (err) {
                console.log("Autoplay blocked. Waiting for user interaction.");
                setIsPlaying(false);
                
                // Add a one-time listener for any user interaction to start the music
                const startOnInteraction = async () => {
                    try {
                        await audio.play();
                        setIsPlaying(true);
                        setIsMuted(false);
                        window.removeEventListener('click', startOnInteraction);
                        window.removeEventListener('touchstart', startOnInteraction);
                    } catch (e) {
                        console.error("Interaction play failed:", e);
                    }
                };
                
                window.addEventListener('click', startOnInteraction);
                window.addEventListener('touchstart', startOnInteraction);
            }
        };

        playAudio();

        // Cleanup on unmount
        return () => {
            if (audio) {
                audio.pause();
                audio.src = ''; // Clear source to stop downloading
                audioRef.current = null;
            }
        };
    }, []);

    const toggleMusic = (e) => {
        e.stopPropagation(); // Prevent triggering other click listeners
        if (!audioRef.current) return;

        if (audioRef.current.paused) {
            audioRef.current.play().then(() => {
                setIsPlaying(true);
                setIsMuted(false);
                audioRef.current.muted = false;
            }).catch(err => console.error("Error playing audio:", err));
        } else {
            if (isMuted) {
                audioRef.current.muted = false;
                setIsMuted(false);
            } else {
                audioRef.current.muted = true;
                setIsMuted(true);
            }
        }
    };

    return (
        <motion.div 
            className="fixed bottom-6 left-6 lg:bottom-10 lg:left-10 z-[100] flex items-center gap-3"
            initial={{ opacity: 0, scale: 0.8, x: -20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ delay: 2, duration: 1, ease: "easeOut" }}
        >
            <button
                onClick={toggleMusic}
                className="relative group flex items-center justify-center w-11 h-11 lg:w-13 lg:h-13 rounded-full bg-[#050508] p-[1.5px] overflow-hidden shadow-2xl transition-transform hover:scale-105 active:scale-95"
                title={isMuted ? "Unmute Music" : "Mute Music"}
            >
                {/* Rotating Gradient Border */}
                <div className={`absolute inset-[-100%] bg-gradient-to-br from-[#d946ef] via-[#f472b6] to-[#fb923c] ${isPlaying && !isMuted ? 'animate-spin-slow' : 'opacity-40'}`}></div>
                
                {/* Inner Content Container */}
                <div className="absolute inset-[1.5px] rounded-full bg-[#050508] flex items-center justify-center z-10">
                    <AnimatePresence mode="wait">
                        {isMuted || !isPlaying ? (
                            <motion.div
                                key="muted"
                                initial={{ opacity: 0, rotate: -90 }}
                                animate={{ opacity: 1, rotate: 0 }}
                                exit={{ opacity: 0, rotate: 90 }}
                                transition={{ duration: 0.3 }}
                            >
                                <VolumeX className="w-4 h-4 lg:w-5 lg:h-5 text-white/50" />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="playing"
                                initial={{ opacity: 0, rotate: -90 }}
                                animate={{ opacity: 1, rotate: 0 }}
                                exit={{ opacity: 0, rotate: 90 }}
                                transition={{ duration: 0.3 }}
                                className="flex items-end gap-[2px] h-3"
                            >
                                {[1, 2, 3, 4].map((i) => (
                                    <motion.div
                                        key={i}
                                        className="w-[2px] bg-gradient-to-t from-fuchsia-500 to-pink-400"
                                        animate={{ 
                                            height: [4, 12, 6, 10, 4]
                                        }}
                                        transition={{ 
                                            duration: 0.8, 
                                            repeat: Infinity,
                                            delay: i * 0.15,
                                            ease: "easeInOut"
                                        }}
                                    />
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </button>

            {/* Premium Label */}
            <AnimatePresence>
                {!isMuted && isPlaying && (
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="hidden md:flex flex-col"
                    >
                        <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-fuchsia-400/80 leading-none mb-1">
                            Audio Active
                        </span>
                        <span className="text-[8px] uppercase tracking-[0.1em] text-white/30 leading-none">
                            Ambient Mix
                        </span>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default LandingMusic;
