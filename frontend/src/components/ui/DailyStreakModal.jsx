import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Check, Lock, X, Crown, Loader2, Sparkles } from 'lucide-react';
import { useWallet } from '../../context/WalletContext';
import WishbitIcon from '../icons/WishbitIcon';

const DailyStreakModal = ({ isOpen, onClose }) => {
  const { streakInfo, claimDaily, claiming } = useWallet();
  const [showConfetti, setShowConfetti] = useState(false);

  // Auto-close after successful claim and animation
  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => {
        setShowConfetti(false);
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showConfetti, onClose]);

  if (!isOpen && !showConfetti) return null;

  // Exact Color Map from WalletView.jsx
  const dayColors = {
    1: 'from-blue-500/20',
    2: 'from-indigo-500/20',
    3: 'from-fuchsia-500/20',
    4: 'from-pink-500/20',
    5: 'from-rose-500/20',
    6: 'from-orange-500/20',
    7: 'from-sun-gold/20'
  };

  const dayBorderColors = {
    1: 'border-blue-500/20',
    2: 'border-indigo-500/20',
    3: 'border-fuchsia-500/20',
    4: 'border-pink-500/20',
    5: 'border-rose-500/20',
    6: 'border-orange-500/20',
    7: 'border-sun-gold/30'
  };

  return (
    <AnimatePresence>
      {(isOpen || showConfetti) && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#050508]/90 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-5xl bg-[#050508] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.8)]"
          >
            {/* Background Glows */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-gradient-to-b from-fuchsia-500/10 to-transparent blur-3xl pointer-events-none" />
            
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 md:top-6 md:right-6 p-2 rounded-full bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 transition-all z-20"
            >
              <X size={18} className="md:w-5 md:h-5" />
            </button>

            <div className="relative z-10 p-6 md:p-12">
              {/* Header - Side-by-side on all screens with padding to avoid cross button */}
              <div className="flex flex-row items-center justify-between gap-4 md:gap-6 mb-8 md:mb-12 pr-10 md:pr-0">
                <div className="flex-1">
                  <h3 className="text-sm md:text-3xl font-black text-white tracking-tight flex items-center gap-2 md:gap-3">
                    <Zap className="text-sun-gold w-4 h-4 md:w-8 md:h-8" size={32} />
                    7-Day Login Streak
                  </h3>
                  <p className="text-[7px] md:text-sm text-white/40 font-medium mt-0.5 md:mt-1 uppercase tracking-[0.1em] md:tracking-widest">
                    Don't miss a day to get the 2x Day 7 bonus!
                  </p>
                  <p className="text-[6px] md:text-[11px] text-fuchsia-400/60 font-bold mt-1 md:mt-2 uppercase tracking-wider flex flex-wrap items-center gap-1 md:gap-1.5">
                    <Sparkles size={10} className="shrink-0 md:w-3 md:h-3" />
                    <span>Even days unlock on next login!</span>
                  </p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl md:rounded-3xl px-3 py-2 md:px-6 md:py-4 backdrop-blur-sm shrink-0 md:mr-16">
                  <div className="flex flex-col items-center gap-0.5 md:gap-1">
                    <p className="text-[6px] md:text-[10px] font-bold text-white/40 uppercase tracking-[0.15em]">Daily streak</p>
                    <div className="flex items-center gap-1.5 md:gap-3">
                      <div className="relative">
                        <Zap size={14} className="md:w-7 md:h-7 text-orange-500 fill-orange-500 drop-shadow-[0_0_10px_rgba(249,115,22,0.4)]" />
                        <div className="absolute inset-0 bg-orange-600 blur-lg opacity-20" />
                      </div>
                      <h4 className="text-sm md:text-4xl font-black text-white tracking-tighter">
                        {streakInfo.count}<span className="text-[8px] md:text-2xl text-white/60 tracking-tighter uppercase ml-0.5">day</span>
                      </h4>
                    </div>
                  </div>
                </div>
              </div>

              {/* Grid - Exact match of WalletView.jsx */}
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-3 mb-4">
                {[1, 2, 3, 4, 5, 6, 7].map((day) => {
                  const isClaimed = streakInfo.claimedDays.includes(day);
                  const isReached = day <= streakInfo.count;
                  const isCompleted = isClaimed;
                  const isCurrent = isReached && !isClaimed;
                  const isLocked = !isReached;
                  const isDeferred = [2, 5].includes(day);
                  const isBonusDay = day === 7;
                  const canClaimToday = !isDeferred || streakInfo.count > day;

                  return (
                    <div 
                      key={day}
                      className={`relative p-3 md:p-6 rounded-2xl border transition-all duration-500 flex flex-col items-center justify-between group overflow-hidden shrink-0 
                        ${day === 7 ? 'col-start-2 w-[120%] -translate-x-[8.33%] aspect-[5/6.5] sm:w-full sm:translate-x-0 sm:aspect-[3/4] sm:col-auto shadow-[0_0_30px_rgba(255,215,0,0.2)]' : 'aspect-[4/6.5] sm:aspect-[3/4]'}
                        ${isCompleted ? 'bg-emerald-500/5 border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.1)]' :
                          isCurrent ? 'bg-white/10 border-fuchsia-500/50 shadow-[0_0_40_40px_rgba(217,70,239,0.15)]' :
                          `bg-white/[0.03] ${dayBorderColors[day]}`
                      }`}
                    >
                      {/* Background Aura Effects */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${dayColors[day]} to-transparent opacity-30`} />
                      
                      {isCompleted && (
                          <div className="absolute inset-0 bg-radial from-emerald-500/10 to-transparent opacity-60" />
                      )}
                      {isCurrent && (
                          <div className="absolute inset-0 bg-radial from-fuchsia-500/20 to-transparent animate-pulse opacity-60" />
                      )}

                      <span className={`text-[9px] font-black uppercase tracking-widest relative z-10 ${
                          isCompleted ? 'text-emerald-400' :
                          isCurrent ? 'text-fuchsia-400 animate-pulse' : 
                          'text-white/30'
                      }`}>Day {day}</span>
                      
                      <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center transition-all duration-500 relative z-10 ${
                          isCompleted ? 'text-emerald-400 bg-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.3)]' :
                          isCurrent ? 'text-fuchsia-400 bg-fuchsia-500/20 shadow-[0_0_20px_rgba(217,70,239,0.4)]' :
                          'text-white/5 bg-white/5 border border-white/5'
                      } ${isCurrent ? 'scale-110' : ''}`}>
                          {isCompleted ? <Check size={24} strokeWidth={3} /> :
                           isCurrent && !canClaimToday ? <Lock size={20} className="animate-pulse" /> :
                           isBonusDay ? <Crown size={24} className={isCurrent ? 'text-sun-gold animate-bounce' : 'text-sun-gold/20'} /> :
                           <WishbitIcon size={28} className={isCurrent ? 'drop-shadow-[0_0_15px_rgba(217,70,239,0.6)]' : 'opacity-[0.15]'} />}
                      </div>

                      <div className="flex items-center gap-2 relative z-10">
                          <span className={`text-base md:text-lg font-black tracking-tighter ${
                              isCompleted ? 'text-emerald-400' :
                              isCurrent ? 'text-white' : 
                              'text-white/20'
                          }`}>
                              {isBonusDay ? (streakInfo.dailyBonus * 2) : streakInfo.dailyBonus}
                          </span>
                          <WishbitIcon size={16} className={isCompleted ? 'drop-shadow-[0_0_5px_rgba(52,211,153,0.5)]' : isCurrent ? 'drop-shadow-[0_0_8px_rgba(217,70,239,0.5)]' : 'opacity-[0.2]'} />
                      </div>

                      {isCurrent && (
                        <div className="relative w-full z-10">
                          <motion.button
                              whileHover={{ scale: canClaimToday && !claiming[`daily-${day}`] ? 1.05 : 1 }}
                              whileTap={{ scale: canClaimToday && !claiming[`daily-${day}`] ? 0.95 : 1 }}
                              onClick={() => {
                                if (canClaimToday && !claiming[`daily-${day}`]) {
                                  claimDaily(day).then(success => success && setShowConfetti(true));
                                }
                              }}
                              disabled={!canClaimToday || claiming[`daily-${day}`]}
                              className={`w-full py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                                  !canClaimToday 
                                  ? 'bg-white/5 text-white/5 cursor-not-allowed border border-white/5 blur-[1px]' 
                                  : claiming[`daily-${day}`]
                                  ? 'bg-white/10 text-white/40 cursor-wait'
                                  : 'bg-white text-black hover:bg-fuchsia-500 hover:text-white shadow-xl shadow-fuchsia-500/20'
                              }`}
                          >
                              {claiming[`daily-${day}`] ? (
                                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="flex justify-center">
                                      <Loader2 size={12} />
                                  </motion.div>
                              ) : !canClaimToday ? 'Pending' : 'Claim'}
                          </motion.button>

                          {!canClaimToday && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                              <span className="text-[7px] font-black text-fuchsia-400 bg-black/40 backdrop-blur-md px-2 py-0.5 rounded border border-fuchsia-500/30 uppercase tracking-[0.2em] shadow-lg">
                                Locked
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

            </div>

            {/* Confetti Overlay */}
            {showConfetti && (
              <div className="absolute inset-0 pointer-events-none z-[100] flex items-center justify-center bg-emerald-500/20 backdrop-blur-sm">
                <motion.div
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  className="bg-emerald-500 text-white px-12 py-6 rounded-3xl font-black text-3xl shadow-[0_0_50px_rgba(16,185,129,0.5)]"
                >
                  REWARD CLAIMED! 🎉
                </motion.div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default DailyStreakModal;
