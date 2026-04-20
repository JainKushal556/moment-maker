import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import Swal from 'sweetalert2';

const Question = ({ question, subtext, onYes, isFirst }) => {
  const handleNoClick = () => {
    if (isFirst) {
      Swal.fire({
        title: "But this one is special!",
        text: "You need to open it... please?",
        imageUrl: "./gif/please.gif",
        imageWidth: 200,
        imageHeight: 200,
        background: "#2a1528",
        color: "#fce7f3",
        timer: 3000,
        showConfirmButton: false,
        customClass: { popup: 'rounded-3xl' }
      });
    } else {
      Swal.fire({
        title: "Please say yes!",
        text: "I really hope you do...",
        imageUrl: "./gif/tears.gif",
        imageWidth: 200,
        imageHeight: 200,
        background: "#2a1528",
        color: "#fce7f3",
        timer: 3000,
        showConfirmButton: false,
        customClass: { popup: 'rounded-3xl' }
      });
    }
  };

  return (
    <motion.div
      className="fixed inset-0 flex flex-col items-center justify-center p-4 z-10"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.8 }}
    >
      <div className="text-center max-w-2xl mx-auto">
        <motion.div
          className="mb-8 flex justify-center"
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-500/20 to-purple-500/20 border-2 border-purple-400/40 flex items-center justify-center backdrop-blur-sm">
            <Heart className="w-12 h-12 text-purple-400 fill-current" />
          </div>
        </motion.div>

        <motion.h1
          className="text-4xl md:text-5xl font-extrabold text-white mb-4 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {question}
        </motion.h1>

        <motion.p
          className="text-purple-200/90 text-xl font-medium mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {subtext}
        </motion.p>

        <motion.div
          className="flex flex-wrap gap-6 justify-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <button
            onClick={onYes}
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white px-8 py-3 text-xl font-bold rounded-full transition-all duration-300 hover:scale-105 shadow-[0_0_15px_rgba(34,197,94,0.4)]"
          >
            Yes 💕
          </button>
          <button
            onClick={handleNoClick}
            className="bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-400 hover:to-rose-500 text-white px-8 py-3 text-xl font-bold rounded-full transition-all duration-300 hover:scale-105 shadow-[0_0_15px_rgba(239,68,68,0.4)]"
          >
            No 😔
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Question;
