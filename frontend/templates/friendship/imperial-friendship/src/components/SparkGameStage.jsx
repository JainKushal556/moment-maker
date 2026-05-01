import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

const SparkGameStage = ({ onComplete, onStartPlay }) => {
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const totalSparks = 5;
  const [sparks, setSparks] = useState([]);

  useEffect(() => {
    if (showIntro) return;
    const essentials = [
      { img: "ess1.png" }, { img: "ess2.png" }, { img: "ess3.png" },
      { img: "ess4.png" }, { img: "ess5.png" }
    ];
    const healthyItems = [
      { img: "healthy1.png" }, { img: "healthy2.png" }, { img: "healthy3.png" }
    ];

    // Fixed safe zones to prevent overlap on small screens
    const safePositions = [
      { x: 10, y: 30 }, { x: 40, y: 35 }, { x: 70, y: 30 },
      { x: 25, y: 55 }, { x: 60, y: 55 },
      { x: 15, y: 80 }, { x: 45, y: 75 }, { x: 75, y: 80 }
    ].sort(() => Math.random() - 0.5); // Shuffle positions

    let initialSparks = [];

    // Take 5 essentials
    for (let i = 0; i < 5; i++) {
      const pos = safePositions.pop();
      initialSparks.push({
        id: `ess-${i}`, type: 'essential',
        x: pos.x, y: pos.y, img: essentials[i].img,
        floatX: (Math.random() - 0.5) * 150, // Increased floating range
        floatY: (Math.random() - 0.5) * 150,
        duration: 3 + Math.random() * 3, delay: Math.random() * 1
      });
    }

    // Take 3 healthy items
    for (let i = 0; i < 3; i++) {
      const pos = safePositions.pop();
      initialSparks.push({
        id: `health-${i}`, type: 'healthy',
        x: pos.x, y: pos.y, img: healthyItems[i].img,
        floatX: (Math.random() - 0.5) * 150, // Increased floating range
        floatY: (Math.random() - 0.5) * 150,
        duration: 3 + Math.random() * 3, delay: Math.random() * 1
      });
    }

    setSparks(initialSparks);
  }, [showIntro]);

  const catchSpark = (id, type) => {
    setSparks(prev => {
      let nextSparks = prev.filter(s => s.id !== id);
      if (type === 'healthy' && score > 0) {
        const essentialImgs = ["ess1.png", "ess2.png", "ess3.png", "ess4.png", "ess5.png"];
        nextSparks.push({
          id: `ess-respawn-${Date.now()}`, type: 'essential',
          x: 20 + Math.random() * 60, y: 40 + Math.random() * 40,
          icon: null, img: essentialImgs[Math.floor(Math.random() * essentialImgs.length)],
          floatX: (Math.random() - 0.5) * 150,
          floatY: (Math.random() - 0.5) * 150,
          duration: 3 + Math.random() * 3, delay: 0
        });
      }
      return nextSparks;
    });
    if (type === 'essential') {
      setScore(s => s + 1);
      setFeedback("That's the spirit! 🍻");
      confetti({ particleCount: 15, spread: 50, origin: { y: 0.8 }, colors: ["#d946ef", "#f59e0b", "#6366f1"] });
    } else {
      if (score > 0) { setScore(s => s - 1); setFeedback("Ew! You picked something healthy! 🤢"); }
      else { setFeedback("Not that one — stay away from the veggies! 🥗"); }
    }
  };

  useEffect(() => {
    if (score === totalSparks && !showSuccess) {
      setFeedback("All Essentials Collected! 🎉");
      confetti({ particleCount: 100, spread: 100, origin: { y: 0.5 }, colors: ["#d946ef", "#f59e0b", "#6366f1"] });
      setTimeout(() => setShowSuccess(true), 2000);
    }
  }, [score, totalSparks, showSuccess]);

  if (showIntro) {
    return (
      <motion.div className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {/* Subtle glow behind card */}
        <div className="absolute w-72 h-72 bg-fuchsia-600/20 rounded-full blur-[80px] pointer-events-none" />

        <motion.div
          className="relative z-10 w-full max-w-sm bg-slate-900/70 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-[0_0_60px_rgba(217,70,239,0.15)]"
          initial={{ y: 30, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <motion.div
              className="w-16 h-16 bg-linear-to-br from-fuchsia-500 to-amber-500 rounded-2xl flex items-center justify-center text-3xl shadow-[0_0_25px_rgba(217,70,239,0.5)]"
              animate={{ rotate: [0, 6, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >🎮</motion.div>
          </div>

          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-black text-center mb-1 uppercase tracking-tight">
            <span className="bg-linear-to-r from-fuchsia-400 to-amber-400 bg-clip-text text-transparent pr-4 pb-1 inline-block">Grab Our</span>{" "}
            <span className="bg-linear-to-r from-amber-400 to-indigo-400 bg-clip-text text-transparent pr-4 pb-1 inline-block">Stuff!</span>
          </h1>
          <p className="text-center text-indigo-400 text-sm mb-5 font-medium">Can you grab our essentials without touching the healthy stuff?</p>

          {/* Rules */}
          <div className="space-y-2 mb-5">
            {[
              { icon: "🍺", text: "Tap and collect all 5 essential items" },
              { icon: "🥗", text: "Avoid the healthy food — each costs a point" },
              { icon: "♻️", text: "Dropped a point? A new item respawns!" },
              { icon: "🏆", text: "Collect all 5 to unlock your surprise!" },
            ].map((rule, i) => (
              <motion.div
                key={i}
                className="flex items-center gap-3 bg-white/5 border border-white/8 rounded-xl px-3 py-2.5"
                initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.25 + i * 0.1, duration: 0.4 }}
              >
                <span className="text-lg">{rule.icon}</span>
                <span className="text-indigo-100 text-[13px] leading-tight">{rule.text}</span>
              </motion.div>
            ))}
          </div>

          {/* Button */}
          <motion.button
            onClick={() => {
              setShowIntro(false);
              if (onStartPlay) onStartPlay();
            }}
            className="w-full py-3.5 bg-linear-to-r from-fuchsia-600 to-indigo-600 text-white text-base font-bold rounded-xl shadow-[0_0_20px_rgba(217,70,239,0.4)] border border-white/15"
            initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          >
            Play Now ▶
          </motion.button>
        </motion.div>
      </motion.div>
    );
  }


  if (showSuccess) {
    return (
      <motion.div className="min-h-screen relative flex flex-col items-center justify-center overflow-hidden px-4 text-center z-50" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, ease: "easeOut" }}>
        <motion.h2 className="text-3xl md:text-7xl font-black bg-linear-to-r from-fuchsia-400 to-amber-500 bg-clip-text text-transparent mb-6 drop-shadow-xl px-2 uppercase tracking-tight pr-8 pb-2 inline-block" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
          You've Proved It — You're My Best Friend!
        </motion.h2>
        <motion.p className="text-xl md:text-3xl text-indigo-100/90 mb-10 px-4 font-light" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.8 }}>
          I put together a special surprise, just for you...
        </motion.p>
        <motion.button onClick={onComplete} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={{ delay: 1.5 }} className="px-10 py-4 bg-linear-to-r from-fuchsia-600 to-indigo-600 text-white text-xl font-black rounded-full shadow-[0_0_30px_rgba(217,70,239,0.5)] border border-fuchsia-400/50 uppercase tracking-widest">
          Open the Surprise ✨
        </motion.button>
        <div className="absolute inset-0 flex items-center justify-center -z-10 pointer-events-none">
          <div className="w-[150vw] h-[150vw] md:w-screen md:h-[100vw] bg-[radial-gradient(circle_at_center,rgba(217,70,239,0.15)_0%,transparent_70%)] animate-pulse" />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div className="min-h-screen relative flex flex-col items-center justify-center overflow-hidden px-4">
      <div className="absolute top-12 text-center z-30 w-full px-4">
        <motion.h2 initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-3xl md:text-5xl font-black bg-linear-to-r from-fuchsia-300 to-amber-300 bg-clip-text text-transparent mb-4 drop-shadow-lg uppercase tracking-tight pr-8 pb-2 inline-block">
          {score === totalSparks ? "All Collected! 🎉" : "Grab Our Stuff!"}
        </motion.h2>
        {score < totalSparks && <p className="text-indigo-200 mb-2 text-base md:text-lg font-medium">Avoid the healthy food! 🥗🚫</p>}
        <div className="text-lg md:text-2xl text-indigo-100 font-black bg-slate-800/60 px-6 py-2 md:px-8 md:py-3 rounded-full inline-block backdrop-blur-md border-2 border-fuchsia-500/40 shadow-[0_0_20px_rgba(217,70,239,0.3)]">{score} / {totalSparks}</div>
        <AnimatePresence mode="wait">
          {feedback && (
            <motion.div key={feedback} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-4 text-xl font-bold text-amber-300">{feedback}</motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {sparks.map(spark => (
          <motion.div key={spark.id} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0, transition: { duration: 0.05 } }} transition={{ duration: 0.5, delay: spark.delay, type: "spring" }} className="absolute z-20" style={{ left: `${spark.x}%`, top: `${spark.y}%` }}>
            <motion.div animate={{ x: [0, spark.floatX, -spark.floatX, 0], y: [0, spark.floatY, -spark.floatY, 0] }} transition={{ duration: spark.duration, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }} onMouseDown={() => catchSpark(spark.id, spark.type)} onTouchStart={(e) => { e.preventDefault(); catchSpark(spark.id, spark.type); }} className="cursor-pointer">
              {spark.img ? (
                <img src={spark.img} alt="item" className="w-16 h-16 md:w-20 md:h-20 object-contain drop-shadow-xl hover:scale-125 transition-transform select-none" draggable={false} />
              ) : (
                <div className="text-4xl md:text-6xl drop-shadow-[0_0_20px_rgba(217,70,239,0.8)] hover:scale-125 transition-transform">{spark.icon}</div>
              )}
            </motion.div>
          </motion.div>
        ))}
      </AnimatePresence>

      {score === totalSparks && (
        <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 1 }} className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <div className="w-[150vw] h-[150vw] md:w-screen md:h-[100vw] bg-[radial-gradient(circle_at_center,rgba(217,70,239,0.2)_0%,transparent_70%)] animate-pulse" />
        </motion.div>
      )}
    </motion.div>
  );
};

export default SparkGameStage;
