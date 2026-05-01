import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCards, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-cards';

// ── helpers ─────────────────────────────────────────────────────────────────
const PURPLE_COLORS = ['#9333ea', '#a855f7', '#7c3aed', '#6d28d9', '#4c1d95'];
const fireConfetti = (opts = {}) => confetti({ colors: PURPLE_COLORS, ...opts });

const useParticles = (count) => {
  return useMemo(() =>
    Array.from({ length: count }).map((_, i) => ({
      id: i,
      amp: 10 + Math.random() * 20,
      dur: 0.9 + Math.random() * 0.5,
      delay: i * 0.03 + Math.random() * 0.1,
      width: 40 + Math.random() * 40,
      blur: 4 + Math.random() * 6,
      opacityPeak: 0.6 + Math.random() * 0.4,
      curve: (Math.random() > 0.5 ? 1 : -1) * (0.6 + Math.random() * 0.6),
    })), [count]
  );
};

const BlowingAir = ({ blowing }) => {
  const particles = useParticles(20);
  const [distance, setDistance] = useState(800);

  useEffect(() => {
    const handleResize = () => {
      // Calculate distance to reach exactly the center from the right edge
      setDistance(window.innerWidth / 2 + 150);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      <AnimatePresence>
        {blowing && (
          <div className="absolute right-[-150px] top-[48%] md:top-[42%]">
            {/* Main gust */}
            <motion.div
              initial={{ x: 0, opacity: 0 }}
              animate={{
                x: [0, -distance * 0.5, -distance * 1.1],
                y: [0, -20, 0],
                opacity: [0, 0.9, 0],
              }}
              transition={{ duration: 1.1, ease: "easeOut" }}
              className="absolute h-10 rounded-full"
              style={{
                width: distance * 0.8,
                background: "linear-gradient(270deg, rgba(255,255,255,0), rgba(180,220,255,0.9), rgba(255,255,255,0))",
                filter: "blur(15px)",
              }}
            />

            {/* Secondary gust */}
            <motion.div
              initial={{ x: 0, opacity: 0 }}
              animate={{
                x: [0, -distance * 0.6, -distance * 1.2],
                y: [15, 30, 10],
                opacity: [0, 0.7, 0],
              }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.05 }}
              className="absolute h-8 rounded-full"
              style={{
                width: distance * 0.7,
                background: "linear-gradient(270deg, rgba(255,255,255,0), rgba(150,200,255,0.7), rgba(255,255,255,0))",
                filter: "blur(18px)",
              }}
            />

            {/* Particles */}
            {particles.map((p) => (
              <motion.div
                key={p.id}
                initial={{ x: 0, y: 0, opacity: 0, scale: 0.6 }}
                animate={{
                  x: [0, -distance * 0.6, -distance * 1.1],
                  y: [0, p.curve * p.amp * 2, p.curve * (p.amp * 0.5)],
                  opacity: [0, p.opacityPeak, 0],
                  scale: [0.6, 1.4, 0.8],
                }}
                transition={{
                  duration: p.dur * 1.1,
                  delay: p.delay,
                  ease: "easeOut",
                }}
                className="absolute rounded-full"
                style={{
                  width: p.width,
                  height: 10,
                  background: "linear-gradient(270deg, rgba(255,255,255,0), rgba(200,230,255,1), rgba(255,255,255,0))",
                  filter: `blur(${p.blur}px)`,
                }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Btn = ({ onClick, className = '', children }) => (
  <button
    onClick={onClick}
    className={`md:text-lg font-medium px-8 py-3 btn-shadow rounded-full hover:scale-105 active:scale-95 transition-all duration-200 flex items-center gap-2 will-change-transform focus:outline-none ${className}`}
  >
    {children}
  </button>
);

// ── Background decorations (exact from original index.html) ──────────────────
const Decorations = () => {
  // Original streamers logic, but with purple colors
  const getPoint = (t, p0, p1, p2) => {
    const r = 1 - t;
    return {
      x: r * r * p0.x + 2 * r * t * p1.x + t * t * p2.x,
      y: r * r * p0.y + 2 * r * t * p1.y + t * t * p2.y
    };
  };

  const getTangent = (t, p0, p1, p2) => {
    const dx = 2 * (1 - t) * (p1.x - p0.x) + 2 * t * (p2.x - p1.x);
    const dy = 2 * (1 - t) * (p1.y - p0.y) + 2 * t * (p2.y - p1.y);
    const mag = Math.hypot(dx, dy) || 1;
    return { x: dx / mag, y: dy / mag };
  };

  const calculatePoints = (tVal, side) => {
    const p0L = { x: 0, y: 50 }, p1L = { x: 250, y: 140 }, p2L = { x: 500, y: 0 };
    const p0R = { x: 1000, y: 50 }, p1R = { x: 750, y: 140 }, p2R = { x: 500, y: 0 };

    const pt = side === "left" ? getPoint(tVal, p0L, p1L, p2L) : getPoint(tVal, p0R, p1R, p2R);
    const tan = side === "left" ? getTangent(tVal, p0L, p1L, p2L) : getTangent(tVal, p0R, p1R, p2R);

    const size = (window.innerWidth > 768 ? 40 : 60) / 2;
    const px = tan.x, py = tan.y;
    const nx = -py, ny = px;

    let finalNx = nx, finalNy = ny;
    if (finalNy < 0) { finalNx = -finalNx; finalNy = -finalNy; }

    const v1x = pt.x - px * size, v1y = pt.y - py * size;
    const v2x = pt.x + px * size, v2y = pt.y + py * size;
    const v3x = pt.x + 38 * finalNx, v3y = pt.y + 38 * finalNy;

    return `${v1x.toFixed(2)},${v1y.toFixed(2)} ${v2x.toFixed(2)},${v2y.toFixed(2)} ${v3x.toFixed(2)},${v3y.toFixed(2)}`;
  };

  const colors = ["fill-[#9333ea]", "fill-[#a855f7]", "fill-[#7c3aed]", "fill-[#6d28d9]", "fill-[#4c1d95]"];
  const isMobile = window.innerWidth < 768;
  const count = isMobile ? 3 : 12;

  return (
    <motion.div
      initial={{ y: -120, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1.5, ease: "easeOut" }}
      className="pointer-events-none fixed inset-0 z-40 overflow-hidden"
    >
      <div className="relative h-28 md:h-32 lg:h-48 w-full">
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1000 160" preserveAspectRatio="none">
          <path d="M 0 50 Q 250 140 500 0" className="fill-none stroke-[#4c1d95]/30" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M 1000 50 Q 750 140 500 0" className="fill-none stroke-[#4c1d95]/30" strokeWidth="1.5" strokeLinecap="round" />
          {Array.from({ length: isMobile ? 3 : count }).map((_, i) => (
            <polygon key={`L${i}`} points={calculatePoints((i + 1) / ((isMobile ? 3 : count) + 1), "left")} className={`${colors[i % colors.length]} opacity-80`} />
          ))}
          {Array.from({ length: isMobile ? 2 : count }).map((_, i) => (
            <polygon key={`R${i}`} points={calculatePoints((i + 1) / ((isMobile ? 2 : count) + 1), "right")} className={`${colors[(i + 1) % colors.length]} opacity-80`} />
          ))}
        </svg>
      </div>
    </motion.div>
  );
};

const RainDecoration = () => {
  const items = [
    { src: './images/rain/heart_balloon.webp', alt: 'Heart Balloon', isBalloon: true },
    { src: './images/rain/red_balloon.webp', alt: 'Red Balloon', isBalloon: true },
    { src: './images/rain/download.png', alt: 'Gift Decoration', isBalloon: false },
    { src: './images/rain/gift_box_1.png', alt: 'Gift Box 1', isBalloon: false },
    { src: './images/rain/gift_box_2.png', alt: 'Gift Box 2', isBalloon: false },
    { src: './images/rain/teddy.webp', alt: 'Teddy Bear', isBalloon: false },
  ];

  const isMobile = window.innerWidth < 768;
  const [elements] = useState(() =>
    Array.from({ length: isMobile ? 4 : 18 }).map((_, i) => {
      const item = items[i % items.length];
      return {
        id: i,
        ...item,
        left: Math.random() < 0.5 ? Math.random() * 30 : 70 + Math.random() * 30,
        delay: Math.random() * 40, // Increased delay to spread items out
        duration: 25 + Math.random() * 15, // Very slow and majestic
        size: item.isBalloon ? (80 + Math.random() * 60) : (50 + Math.random() * 40), // Balloons are significantly larger
        initialRotate: Math.random() * 360,
      };
    })
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <AnimatePresence>
        {elements.map((el) => (
          <motion.div
            key={el.id}
            initial={{ y: -200, x: `${el.left}vw`, opacity: 0, rotate: el.initialRotate }}
            animate={{
              y: '120vh', // Go all the way past the bottom
              opacity: [0, 1, 1, 0],
              rotate: el.initialRotate + (Math.random() > 0.5 ? 240 : -240)
            }}
            transition={{
              duration: el.duration,
              delay: el.delay,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute drop-shadow-xl"
          >
            <img
              src={el.src}
              alt={el.alt}
              style={{ width: el.size, height: 'auto' }}
              className="object-contain"
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

const BgDecos = () => (
  <>
    <div className="fixed top-[25%] -left-52 w-[420px] h-[420px] rounded-full bg-[radial-gradient(circle_at_center,#4c1d95_0%,#4c1d95_40%,transparent_70%)] blur-3xl opacity-20 pointer-events-none" />
    <div className="fixed -top-30 -right-50 w-[450px] h-[450px] rounded-full bg-[radial-gradient(circle_at_center,#6d28d9_0%,#6d28d9_40%,transparent_72%)] blur-3xl opacity-10 pointer-events-none" />
    <div className="fixed -bottom-40 -right-50 w-[420px] h-[420px] rounded-full bg-[radial-gradient(circle_at_center,#2e1065_0%,#2e1065_40%,transparent_70%)] blur-3xl opacity-30 pointer-events-none" />
    <div className="fixed inset-0 bg-black/20 pointer-events-none" />
  </>
);

// ── Stage -1: Welcome ────────────────────────────────────────────────────────
function StageWelcome({ onStart }) {
  const isMobile = window.innerWidth < 768;
  const hearts = Array.from({ length: isMobile ? 6 : 8 });

  return (
    <div className="relative z-10 flex min-h-screen flex-col items-center justify-center p-4 md:p-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="max-w-2xl"
      >
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight drop-shadow-[0_0_30px_rgba(168,85,247,0.5)] font-heading">
          Happy Birthday, Beautiful!
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-purple-200/80 mb-12 font-medium font-body">
          Today is all about celebrating you and the joy you bring to my life
        </p>

        <div className="relative h-24 mb-12 flex items-center justify-center gap-4">
          {hearts.map((_, i) => (
            <motion.div
              key={i}
              initial={{ y: 0, scale: 1 }}
              animate={{
                y: [0, -20, 0],
                scale: [1, 1.2, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut"
              }}
              className="text-2xl md:text-3xl"
            >
              <svg className="w-8 h-8 text-purple-500 fill-purple-500 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
        >
          <button
            onClick={onStart}
            className="group relative px-8 py-3 md:px-10 md:py-4 bg-purple-600 text-white rounded-full font-semibold text-base sm:text-lg md:text-xl shadow-[0_0_30px_rgba(147,51,234,0.3)] hover:shadow-[0_0_40px_rgba(147,51,234,0.5)] hover:scale-105 active:scale-95 transition-all duration-300"
          >
            <span className="relative z-10 flex items-center gap-2">
              Start the Celebration 🚀
            </span>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}

// ── Animated Cake Component (Loading Screen) ──────────────────────────────────
const cakeSvgContent = `
<svg id="cake" version="1.1" x="0px" y="0px" width="200px" height="500px" viewBox="0 0 200 500">
    <path fill="#a88679" d="M173.667-13.94c-49.298,0-102.782,0-147.334,0c-3.999,0-4-16.002,0-16.002
		c44.697,0,96.586,0,147.334,0C177.667-29.942,177.668-13.94,173.667-13.94z">
        <animate id="bizcocho_3" attributeName="d" calcMode="spline" keySplines="0 0 1 1; 0 0 1 1" begin="relleno_2.end" dur="0.3s" fill="freeze" values="
                          M173.667-13.94c-49.298,0-102.782,0-147.334,0c-3.999,0-4-16.002,0-16.002
		c44.697,0,96.586,0,147.334,0C177.667-29.942,177.668-13.94,173.667-13.94z
                          ;
                          M173.667,411.567c-47.995,12.408-102.955,12.561-147.334,0
		c-3.848-1.089-0.189-16.089,3.661-15.002c44.836,12.66,90.519,12.753,139.427,0.07
		C173.293,395.631,177.541,410.566,173.667,411.567z
                          ;
                          M173.667,427.569c-49.795,0-101.101,0-147.334,0c-3.999,0-4-16.002,0-16.002
		c46.385,0,97.539,0,147.334,0C177.668,411.567,177.667,427.569,173.667,427.569z
                          " />
    </path>
    <path fill="#8b6a60" d="M100-178.521c1.858,0,3.364,1.506,3.364,3.363c0,0,0,33.17,0,44.227
		c0,19.144,0,57.431,0,76.574c0,10.152,0,40.607,0,40.607c0,1.858-1.506,3.364-3.364,3.364l0,0c-1.858,0-3.364-1.506-3.364-3.364c0,0,0-30.455,0-40.607c0-19.144,0-57.432,0-76.575c0-11.057,0-44.226,0-44.226C96.636-177.015,98.142-178.521,100-178.521
		L100-178.521z">
        <animate id="relleno_2" attributeName="d" calcMode="spline" keySplines="0 0 1 1; 0 0 1 1; 0 0 0.58 1" begin="bizcocho_2.end" dur="0.5s" fill="freeze" values="
                          M100-178.521c1.858,0,3.364,1.506,3.364,3.363c0,0,0,33.17,0,44.227
		c0,19.144,0,57.431,0,76.574c0,10.152,0,40.607,0,40.607c0,1.858-1.506,3.364-3.364,3.364l0,0c-1.858,0-3.364-1.506-3.364-3.364c0,0,0-30.455,0-40.607c0-19.144,0-57.432,0-76.575c0-11.057,0-44.226,0-44.226C96.636-177.015,98.142-178.521,100-178.521
		L100-178.521z
                          ;
                          M100,267.257c1.858,0,3.364,1.506,3.364,3.363c0,0,0,33.17,0,44.227
		c0,19.143,0,57.43,0,76.574c0,10.151,0,40.606,0,40.606c0,1.858-1.506,3.364-3.364,3.364l0,0c-1.858,0-3.364-1.506-3.364-3.364
		c0,0,0-30.455,0-40.606c0-19.145,0-57.432,0-76.576c0-11.057,0-44.225,0-44.225C96.636,268.763,98.142,267.257,100,267.257
		L100,267.257z
                          ;
                          M93.928,405.433c-0.655,6.444-0.102,9.067,2.957,11.798c0,0,8.083,5.571,16.828,3.503
		c18.629-4.406,43.813,6.194,50.792,7.791c14.75,3.375,9.162,6.867,9.162,6.867c-2.412,2.258-58.328,0-73.667,0l0,0
		c-1.858,0-69.995,2.133-73.667,0c0,0-3.337-2.439,6.172-5.992c11.375-4.25,52.875,8.822,47.139-9.442
		c-6.333-20.167,5.226-21.514,5.226-21.514c3.435-0.915,12.78-6.663,10.923-0.546L93.928,405.433z
                          ;
                          M102.242,427.569c5.348,0,14.079,0,17.462,0c0,0,17.026,0,27.504,0
		c19.143,0,20.39-3.797,26.459,0c3,1.877,0,7.823,0,7.823c-2.412,2.258-58.328,0-73.667,0l0,0c-1.858,0-67.187,0-73.667,0
		c0,0-4.125-4.983,0-7.823c5.201-3.58,16.085,0,23.725,0c8.841,0,20.762,0,20.762,0c3.686,0,8.597,0,19.511,0H102.242z
                          " />
    </path>
    <path fill="#a88679" d="M173.667-15.929c-46.512,0-105.486,0-147.334,0c-3.999,0-4-16.002,0-16.002
		c43.566,0,97.96,0,147.334,0C177.667-31.931,177.666-15.929,173.667-15.929z">
        <animate id="bizcocho_2" attributeName="d" calcMode="spline" keySplines="0 0 1 1; 0 0 1 1; 0.25 0 0.58 1" begin="relleno_1.end" dur="0.5s" fill="freeze" values="
                          M173.667-15.929c-46.512,0-105.486,0-147.334,0c-3.999,0-4-16.002,0-16.002
		c43.566,0,97.96,0,147.334,0C177.667-31.931,177.666-15.929,173.667-15.929z
                          ;
                          M173.434,445.393c-47.269,8.001-105.245,8.001-147.334,0c-3.929-0.747-0.692-16.543,3.243-15.824
		c43.828,8.001,92.165,8.001,140.739,0C174.029,428.918,177.377,444.726,173.434,445.393z
                          ;
                          M173.667,449.514c-47.576-5.454-102.799-5.744-147.333,0c-3.966,0.512-3.938-15.297,0-16.002
		c43.683-7.823,97.646-8.026,147.333,0C177.616,434.15,177.642,449.969,173.667,449.514z
                          ;
                          M173.667,451.394c-49.298,0-102.782,0-147.334,0c-3.999,0-4-16.002,0-16.002
		c44.697,0,96.586,0,147.334,0C177.667,435.392,177.668,451.394,173.667,451.394z
                          " />
    </path>
    <path fill="#8b6a60" d="M101.368-73.685c0,12.164,0,15.18,0,28.519c0,22.702,0-13.661,0,8.304c0,14.48,0,18.233,0,30.512
		c0,1.753-2.958,1.847-2.958,0c0-12.68,0-16.277,0-30.401c0-21.983,0,11.66,0-8.305c0-13.027,0-15.992,0-28.628
		C98.411-75.883,101.368-75.592,101.368-73.685z">
        <animate id="relleno_1" attributeName="d" calcMode="spline" keySplines="0 0 1 1; 0 0 1 1; 0 0 0.6 1" begin="bizcocho_1.end" dur="0.5s" fill="freeze" values="
                          M101.368-73.685c0,12.164,0,15.18,0,28.519c0,22.702,0-13.661,0,8.304c0,14.48,0,18.233,0,30.512
		c0,1.753-2.958,1.847-2.958,0c0-12.68,0-16.277,0-30.401c0-21.983,0,11.66,0-8.305c0-13.027,0-15.992,0-28.628
		C98.411-75.883,101.368-75.592,101.368-73.685z
                          ;
                          M101.368,350.885c0,12.164,0,65.18,0,78.518c0,22.703,0-33.66,0-11.695c0,14.48,0,28.232,0,40.512
		c0,1.753-2.958,1.847-2.958,0c0-12.68,0-26.277,0-40.402c0-21.982,0,31.66,0,11.695c0-13.027,0-65.992,0-78.627
		C98.411,348.686,101.368,348.977,101.368,350.885z
                          ;
                          M128.38,447.567c37.626,6.312,39.303,13.658,26.833,12.833c-22.653-1.499-13.636-0.831-23.302-0.831
		c-14.48,0-17.884,0-30.163,0c-2.087,0-2.068,0-3.915,0c-13.333,0-8.963,0-23.088,0c-11.668,0-14.062,5.995-27.532,1.164
		c-12.629-4.529,38.667-3.167,46.833-17.333C100.077,432.94,105.546,443.736,128.38,447.567z
                          ;
                          M173.667,451.394c2.875,0,2.997,9.257,0,9.131c-22.662-0.956-32.09-0.956-41.756-0.956
		c-14.48,0-17.884,0-30.163,0c-2.087,0-2.068,0-3.915,0c-13.333,0-8.963,0-23.088,0c-11.668,0-34.99-0.294-48.412,1.831
		c-4.109,0.65-3.01-10.006,0-10.006C37.129,451.394,149.379,451.394,173.667,451.394z
                          " />
    </path>
    <path fill="#a88679" d="M173.667,21.571c-33.174,0-111.467,0-147.334,0c-4,0-4-16.002,0-16.002c39.836,0,105.982,0,147.334,0
		C177.668,5.569,177.667,21.571,173.667,21.571z">
        <animate id="bizcocho_1" attributeName="d" calcMode="spline" keySplines="0 0 1 1; 0 0 1 1; 0 0 1 1; 0.25 0 1 1; 0 0 1 1; 0.25 0 0.6 1" begin="2s" dur="0.8s" fill="freeze" values="
                          M173.667,21.571c-33.174,0-111.467,0-147.334,0c-4,0-4-16.002,0-16.002c39.836,0,105.982,0,147.334,0
		C177.668,5.569,177.667,21.571,173.667,21.571z
                          ;
                          M173.667,459.569c-33.197,16.002-110.782,16.002-147.334,0c-3.664-1.604,1.614-15.617,5.337-14.153
		c40.702,16.002,94.289,16.104,136.505,0.103C171.917,444.1,177.271,457.832,173.667,459.569z
                          ;
                          M171.817,475.571c-39.361-3.001-105.438-2.571-143.556,0c-3.991,0.27-7.377-14.736-3.387-15.014
		c41.553-2.888,104.421-3.121,150.51-0.233C179.378,460.574,175.806,475.875,171.817,475.571z
                          ;
                          M171.817,459.564c-38.8-12.188-104.504-13.762-143.556,0c-3.772,1.329-7.961-12.604-4.178-13.905
		c40.864-14.064,105.114-15.52,151.918-0.973C179.822,445.874,175.634,460.762,171.817,459.564z
                          ;
                          M173.667,475.571c-46.376-5.005-105.924-4.003-147.334,0c-3.981,0.385-3.479-15.421,0.479-16.002
		c43.087-6.327,97.705-7.083,146.855,0.438C177.621,460.613,177.644,476,173.667,475.571z
                          ;
                          M173.667,474.117c-46.376,1.866-105.638,2.01-147.334,0c-3.995-0.192-3.52-16.144,0.479-16.002
		c43.794,1.55,96.341,1.541,145.723,0C176.532,457.99,177.663,473.956,173.667,474.117z
                          ;
                          M173.667,475.571c-46.512,0-105.486,0-147.334,0c-3.999,0-4-16.002,0-16.002c43.566,0,97.96,0,147.334,0
		C177.667,459.569,177.666,475.571,173.667,475.571z
                          " />
    </path>
    <path fill="#fefae9" d="M104.812,113.216c0,3.119-2.164,5.67-4.812,5.67c-2.646,0-4.812-2.551-4.812-5.67c0-5.594,0-16.782,0-22.375
	c0-5.143,0-15.427,0-20.568c0-7.333,0-21.998,0-29.33c0-5.523,0-16.569,0-22.092c0-3.295,0-9.885,0-13.181
	C95.188,2.551,97.353,0,100,0c2.648,0,4.812,2.551,4.812,5.669c0,3.248,0,9.743,0,12.991c0,5.428,0,16.284,0,21.711
	c0,7.618,0,22.854,0,30.472c0,4.952,0,14.854,0,19.807C104.812,96.292,104.812,107.576,104.812,113.216z">
        <animate id="crema" attributeName="d" calcMode="spline" keySplines="0 0 1 1; 0 0 1 1; 0 0 1 1; 0.25 0 1 1; 0 0 1 1; 0 0 0.58 1" begin="bizcocho_3.end" dur="2s" fill="freeze" values="
                          M104.812,113.216c0,3.119-2.164,5.67-4.812,5.67c-2.646,0-4.812-2.551-4.812-5.67c0-5.594,0-16.782,0-22.375
	c0-5.143,0-15.427,0-20.568c0-7.333,0-21.998,0-29.33c0-5.523,0-16.569,0-22.092c0-3.295,0-9.885,0-13.181
	C95.188,2.551,97.353,0,100,0c2.648,0,4.812,2.551,4.812,5.669c0,3.248,0,9.743,0,12.991c0,5.428,0,16.284,0,21.711
	c0,7.618,0,22.854,0,30.472c0,4.952,0,14.854,0,19.807C104.812,96.292,104.812,107.576,104.812,113.216z
                          ;
                          M104.812,405.897c0,3.119-2.164,5.67-4.812,5.67c-2.646,0-4.812-2.551-4.812-5.67c0-5.594,0-16.782,0-22.376
	c0-5.143,0-15.426,0-20.568c0-7.332,0-21.997,0-29.33c0-5.522,0-16.568,0-22.092c0-3.295,0-9.885,0-13.181
	c0-3.118,2.165-5.669,4.812-5.669c2.648,0,4.812,2.551,4.812,5.669c0,3.247,0,9.743,0,12.991c0,5.428,0,16.283,0,21.711
	c0,7.618,0,22.854,0,30.473c0,4.951,0,14.854,0,19.807C104.812,388.972,104.812,400.256,104.812,405.897z
                          ;
                          M111.873,411.567c-3.119,0-9.226,0-11.874,0c-2.646,0-7.748,0-10.867,0c-7.086,0-12.698,0-18.292,0
	c-6.592,0-12.871,7.371-19.166,3.008c-10.043-6.961-7.776-10.169,2.991-17.745c12.61-8.873,27.713,1.994,25.919-7.531
	c-2.589-13.742,11.008-14.513,11.365-17.789c0.441-4.051,4.235-11.107,8.051-8.175c3.113,2.393,1.007,8.008,0,13.159
	c-1.871,9.569,8.058,2.113,9.494,14.155c2.592,21.732,21.184-0.675,29.309,7.976c5.216,5.553,18.413,5.552,15.426,12.942
	c-3.131,7.745-15.825-4.369-23.8,2.903C126.261,418.271,118.301,411.567,111.873,411.567z
                          ;
                          M111.873,411.567c-3.119,0-9.226,0-11.874,0c-2.646,0-9.734,4.069-12.853,4.069
	c-7.086,0-10.712-4.069-16.306-4.069c-6.592,0-12.12,6.013-19.166,3.008c-7.053-3.008-7.458,2.026-18.659,1.165
	c-6.832-0.525-7.522-3.034-7.533-6.265c-0.037-10.336,22.073-2.452,36.613-2.628c10.234-0.124,19.856-1.439,37.905-2.102
	c16.642-0.61,32.699,1.552,46.009,1.927c12.438,0.351,29.663-8.99,31.532,3.315c0.773,5.093-5.605,3.342-11.211,9.579
	c-5.093,5.667-7.59-4.605-12.965-3.832c-8.269,1.189-14.962-8.537-22.937-1.265C126.261,418.271,118.301,411.567,111.873,411.567z
                          ;
                          M110.946,413.652c-2.904-1.137-8.405-2.748-12.446-0.97c-6.099,2.685-7.273,10.358-13.253,8.242
	c-7.843-2.775-8.953-5.008-14.546-5.01c-24.653-0.011-4.849,26.507-18.264,26.507c-12.377,0,5.791-33.537-19.422-26.682
	c-7.703,2.095-9.806-0.942-9.817-4.173c-0.037-10.336,24.357-4.544,38.897-4.72c10.234-0.124,19.856-1.439,37.905-2.102
	c16.642-0.61,32.699,1.552,46.009,1.927c12.438,0.351,28.973-8.865,31.532,3.315c1.449,6.896,0.318,15.624-3.874,15.624
	c-7.619,0-1.788-15.192-19.243-7.111c-7.581,3.51-15.963-9.738-26.669,1.066C120.644,426.744,118.381,416.561,110.946,413.652z
                          ;
                          M111.547,413.9c-2.969-0.956-8.775-0.949-13.167-0.5c-14.667,1.5-8.325,16.508-14.667,16.666
	c-6.667,0.166-0.167-13.5-13.013-14.151c-30.471-1.545-5.572,46.651-18.987,46.651c-12.377,0,10.333-50.166-18.667-44.5
	c-7.835,1.531-9.537-1.417-9.548-4.647c-0.037-10.336,23.675-5.177,38.215-5.353c10.234-0.124,20.618-1.671,38.667-2.333
	c16.642-0.61,32.023,1.458,45.333,1.833c12.438,0.351,33.819-8.431,33.199,4.001c-0.532,10.666,0.414,26.166-5.245,25.833
	c-7.606-0.447-2.954-31.5-19.243-18.899c-7.985,6.177-17.658-5.969-27.377,5.732C118.88,434.066,121.38,417.067,111.547,413.9z
                          ;
                          M111.547,415.233c-6.667-0.834-9.667,4.667-13.833,3.333c-19.649-6.291-8.158,22.176-14.5,22.334
	c-6.667,0.166,2.833-18-13.333-22.167c-29.544-7.615-9.667,43.833-20.167,43.833c-10.333,0,8.004-55.006-16.833-39
	c-7.5,4.833-9.508-3.78-9.299-7.004c0.799-12.329,23.592-7.153,38.132-7.329c10.234-0.124,20.238-1.505,38.287-2.167
	c16.642-0.61,32.903,1.125,46.213,1.5c12.438,0.351,35.058-5.579,31.863,6.451c-5.532,20.833,1.25,28.216-4.409,27.883
	c-7.606-0.447-6.058-37.895-20.62-23.333c-10.167,10.166-15.972-0.747-25,12C119.547,443.568,121.798,416.515,111.547,415.233z
                          " />
    </path>
    <rect x="10" y="475.571" fill="#fefae9" width="180" height="4" />
</svg>
`;

const RawCakeSVG = React.memo(() => (
  <div dangerouslySetInnerHTML={{ __html: cakeSvgContent }} className="relative z-0" />
));

const AnimatedCakeSVG = ({ isBlown }) => {
  const fuegoStyle = isBlown ? { opacity: 0, animation: 'none', transition: 'opacity 0.5s ease-out' } : {};

  return (
    <div className="relative flex flex-col items-center justify-center scale-[0.6] sm:scale-75 transform origin-bottom mt-[-120px] mb-8">
      <div id="cake-container" className="relative w-[200px] flex justify-center" style={{ clipPath: 'inset(250px -100px -100px -100px)' }}>
        <div className="velas" style={{ zIndex: 10 }}>
          <div className="fuego" style={fuegoStyle}></div>
          <div className="fuego" style={fuegoStyle}></div>
          <div className="fuego" style={fuegoStyle}></div>
          <div className="fuego" style={fuegoStyle}></div>
          <div className="fuego" style={fuegoStyle}></div>
        </div>
        <RawCakeSVG />
      </div>
    </div>
  );
};

// ── Balloon Pop after candle ──────────────────────────────────────────────────
const BALLOON_CONFIG = [
  { id: 0, color: '#a855f7', glow: '#9333ea', word: 'You' },
  { id: 1, color: '#ec4899', glow: '#db2777', word: 'Are' },
  { id: 2, color: '#06b6d4', glow: '#0891b2', word: 'A' },
  { id: 3, color: '#f59e0b', glow: '#d97706', word: 'Cutiepie ☺️' },
];

const PremiumBalloon = ({ config, onPop }) => {
  const [popped, setPopped] = useState(false);
  const [showBurst, setShowBurst] = useState(false);
  const [showWord, setShowWord] = useState(false);

  const handleClick = () => {
    if (popped) return;
    setShowBurst(true);
    setPopped(true);
    setTimeout(() => {
      setShowWord(true);
      onPop();
    }, 350);
  };

  return (
    <div className="relative flex flex-col items-center shrink-0 w-16 sm:w-20 md:w-[90px] min-h-[100px] md:min-h-[130px]">
      <AnimatePresence>
        {!popped && (
          <motion.button
            onClick={handleClick}
            initial={{ y: 20, opacity: 0, scale: 0.6 }}
            animate={{ y: [0, -18, 0], opacity: 1, scale: 1 }}
            exit={{ scale: [1, 1.5, 0], opacity: [1, 1, 0], transition: { duration: 0.3 } }}
            transition={{
              opacity: { duration: 0.4 },
              scale: { duration: 0.4 },
              y: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' },
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.88 }}
            className="relative focus:outline-none cursor-pointer group w-full"
            style={{ display: 'block' }}
          >
            <svg viewBox="0 0 80 100" className="w-full h-auto drop-shadow-2xl">
              <defs>
                <filter id={`glow-${config.id}`} x="-40%" y="-40%" width="180%" height="180%">
                  <feGaussianBlur stdDeviation="5" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
                <radialGradient id={`grad-${config.id}`} cx="35%" cy="30%" r="60%">
                  <stop offset="0%" stopColor="white" stopOpacity="0.5" />
                  <stop offset="50%" stopColor={config.color} stopOpacity="0.9" />
                  <stop offset="100%" stopColor={config.glow} stopOpacity="1" />
                </radialGradient>
              </defs>
              <ellipse cx="40" cy="42" rx="35" ry="40"
                fill={`url(#grad-${config.id})`}
                style={{ filter: `drop-shadow(0 0 14px ${config.glow}bb)` }}
              />
              <ellipse cx="28" cy="25" rx="10" ry="12" fill="white" opacity="0.3" />
              <ellipse cx="40" cy="82" rx="4" ry="5" fill={config.glow} />
              <path d="M40 87 Q45 93 40 100" stroke={config.glow} strokeWidth="1.5" fill="none" opacity="0.7" />
            </svg>
            <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-300"
              style={{ boxShadow: `0 0 30px 10px ${config.glow}` }} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Shockwave burst */}
      <AnimatePresence>
        {showBurst && (
          <motion.div
            className="absolute top-[35%] left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none w-10 h-10 md:w-14 md:h-14"
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 5, opacity: 0 }}
            exit={{}}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            style={{ border: `3px solid ${config.color}`, boxShadow: `0 0 20px ${config.glow}` }}
          />
        )}
      </AnimatePresence>

      {/* Revealed word after pop */}
      <AnimatePresence>
        {showWord && (
          <motion.span
            initial={{ opacity: 0, scale: 0.4, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 14 }}
            className="absolute top-4 md:top-6 left-1/2 -translate-x-1/2 font-bold text-sm sm:text-base md:text-lg text-center whitespace-nowrap select-none"
            style={{ color: config.color, textShadow: `0 0 12px ${config.glow}`, minWidth: 60 }}
          >
            {config.word}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
};

// ── Stage 0: Loading ─────────────────────────────────────────────────────────
function StageLoading({ onDone }) {
  const [loadComplete, setLoadComplete] = useState(false);
  const [isBlown, setIsBlown] = useState(false);
  const [isBlowing, setIsBlowing] = useState(false);
  const [showBalloons, setShowBalloons] = useState(false);
  const [poppedCount, setPoppedCount] = useState(0);
  const [showCutiepie, setShowCutiepie] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setLoadComplete(true);
    }, 8000);
    return () => clearTimeout(t);
  }, []);

  // Once all 4 balloons are popped → show cutiepie message → proceed
  useEffect(() => {
    if (poppedCount === 4) {
      setShowCutiepie(true);
      // No auto-transition — user clicks "Ur Best Looks" to proceed
    }
  }, [poppedCount]);

  const handleBlow = () => {
    setIsBlowing(true);
    setTimeout(() => setIsBlown(true), 950);
    setTimeout(() => setShowBalloons(true), 1800);
  };

  const handlePop = () => setPoppedCount(c => c + 1);

  return (
    <div className="relative z-10 flex min-h-screen items-center justify-center p-4 md:p-6">
      <Decorations />
      <RainDecoration />
      <BlowingAir blowing={isBlowing} />
      <div className="flex flex-col items-center">

        {/* Cake — fades out when balloons appear */}
        <AnimatePresence>
          {!showBalloons && (
            <motion.div
              key="cake"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85, y: 30, transition: { duration: 0.6 } }}
              transition={{ duration: 0.6 }}
            >
              <AnimatedCakeSVG isBlown={isBlown} />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-col items-center justify-center w-full min-h-[180px]">
          <AnimatePresence mode="wait">

            {!loadComplete && (
              <motion.div key="loading" className="flex flex-col items-center gap-4 mt-[-40px]"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: -10 }} exit={{ opacity: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                <p className="text-lg sm:text-xl md:text-2xl font-semibold text-foreground text-center mb-1 font-body">
                  Crafting your special birthday cake... 🎂✨
                </p>
                <div className="loader md:h-[18px]! md:w-[210px]!" />
              </motion.div>
            )}

            {loadComplete && !showBalloons && (
              <motion.button
                key="blow-btn"
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={handleBlow}
                disabled={isBlowing}
                className="mt-[-40px] px-6 py-2 md:px-8 md:py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-bold text-base sm:text-lg md:text-xl shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] hover:scale-105 active:scale-95 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed font-heading"
              >
                Blow the Candle! 🌬️
              </motion.button>
            )}

            {showBalloons && !showCutiepie && (
              <motion.div key="balloons"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -20 }}
                className="flex flex-col items-center gap-10"
              >
                {/* Shimmer instruction text — with extra bottom gap */}
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="text-base sm:text-lg md:text-xl font-semibold text-center select-none mb-2 font-body"
                  style={{
                    background: 'linear-gradient(90deg, #a855f7, #ec4899, #a855f7)',
                    backgroundSize: '200%',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    animation: 'shimmer 2s linear infinite',
                  }}
                >
                  ✨ Click on the balloons ✨
                </motion.p>

                {/* 4 Premium Balloons with staggered spring entry */}
                <div className="flex items-center justify-center gap-3 sm:gap-6 md:gap-10 flex-wrap px-2">
                  {BALLOON_CONFIG.map((cfg, i) => (
                    <motion.div
                      key={cfg.id}
                      initial={{ y: 100, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.18 * i, duration: 0.75, type: 'spring', stiffness: 170, damping: 13 }}
                    >
                      <PremiumBalloon config={cfg} onPop={handlePop} />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {showCutiepie && (
              <motion.div
                key="cutiepie"
                initial={{ opacity: 0, scale: 0.75, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, type: 'spring', stiffness: 180, damping: 16 }}
                className="flex flex-col items-center gap-5"
              >
                {/* Sparkle top row */}
                <motion.div className="flex gap-3 text-2xl"
                  initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                >
                  {['✨', '🌸', '💜', '🌸', '✨'].map((s, i) => (
                    <motion.span key={i}
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 1.3, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
                    >{s}</motion.span>
                  ))}
                </motion.div>

                {/* Big glowing cutiepie text */}
                <motion.p
                  className="text-2xl sm:text-4xl md:text-6xl font-bold text-center select-none px-2 font-accent"
                  animate={{ scale: [1, 1.03, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  style={{
                    background: 'linear-gradient(90deg, #f9a8d4, #c084fc, #818cf8, #f9a8d4)',
                    backgroundSize: '300%',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    filter: 'drop-shadow(0 0 22px rgba(192,132,252,0.8))',
                    animation: 'shimmer 3s linear infinite',
                  }}
                >
                  You Are A Cutiepie ☺️
                </motion.p>

                {/* Decorative line */}
                <motion.div
                  initial={{ width: 0 }} animate={{ width: '80%' }}
                  transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' }}
                  className="h-[2px] rounded-full"
                  style={{ background: 'linear-gradient(90deg, transparent, #c084fc, #ec4899, #c084fc, transparent)' }}
                />

                {/* Ur Best Looks button */}
                <motion.button
                  initial={{ opacity: 0, y: 20, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.6, type: 'spring', stiffness: 200, damping: 14 }}
                  onClick={onDone}
                  className="relative mt-2 px-10 py-4 rounded-full font-bold text-lg md:text-xl text-white overflow-hidden group font-heading"
                  style={{
                    background: 'linear-gradient(135deg, #7c3aed, #ec4899, #7c3aed)',
                    backgroundSize: '200%',
                    animation: 'shimmer 3s linear infinite',
                    boxShadow: '0 0 30px rgba(168,85,247,0.5), 0 0 60px rgba(236,72,153,0.25)',
                  }}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <span>Ur Best Looks</span>
                    <motion.span animate={{ x: [0, 5, 0] }} transition={{ duration: 1, repeat: Infinity }}>→</motion.span>
                  </span>
                  {/* Shine sweep */}
                  <motion.div
                    className="absolute inset-0 opacity-20"
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear', repeatDelay: 1 }}
                    style={{ background: 'linear-gradient(90deg, transparent, white, transparent)', width: '50%' }}
                  />
                </motion.button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// ── Stage 1: Intro card ──────────────────────────────────────────────────────
function StageIntro({ onNext }) {
  return (
    <motion.div
      className="relative z-10 flex min-h-screen items-center justify-center p-4 md:p-6"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      <div className="flex items-center justify-center w-full">
        <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-7 rounded-[60px] card-shadow min-w-48 w-full max-w-[440px] relative flex flex-col items-center gap-4">
          <div className="relative h-44 md:h-52 bg-gradient-to-b from-white/10 to-purple-900/30 w-full rounded-[40px] flex items-end justify-center gif-box-shadow">
            <img loading="lazy" src="./goma-peach.gif" alt="Cute" className="w-26 md:w-32" />
          </div>
          <div className="text-center">
            <h1
              className="text-2xl md:text-3xl font-semibold text-white drop-shadow-lg leading-tight will-change-transform"
              style={{ filter: 'drop-shadow(0 0 20px rgba(147, 51, 234, 0.6))' }}
            >
              A Cutiepie was born today, 21 years ago!
            </h1>
            <p className="mt-4 text-foreground will-change-transform">Yes, it&apos;s YOU! A little surprise awaits...</p>
          </div>
          <motion.div
            className="mt-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1, transition: { duration: 0.5, delay: 0.5 } }}
          >
            <Btn onClick={onNext} className="bg-purple-600/30 text-white border border-purple-500/30 backdrop-blur-md">
              {/* Gift icon */}
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="8" width="18" height="4" rx="1" /><path d="M12 8v13" /><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" /><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5" /></svg>
              Start the surprise
            </Btn>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

// ── Cake component ───────────────────────────────────────────────────────────
function Cake({ lit }) {
  return (
    <div className="flex flex-col items-center">
      <div className="cake">
        <div className="plate" />
        <div className="layer layer-bottom" />
        <div className="layer layer-middle" />
        <div className="layer layer-top" />
        <div className="icing" />
        <div className="drip drip1" />
        <div className="drip drip2" />
        <div className="drip drip3" />
        <div className="candle">
          {lit && (
            <motion.div
              className="flame"
              initial={{ opacity: 0, scaleY: 0.2, y: 10 }}
              animate={{ opacity: 1, scaleY: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// ── Stage 2: Cake (Decorate + Candle) ───────────────────────────────────────
function StageCake({ onNext, decorated, onDecorate }) {
  const [lit, setLit] = useState(false);

  const handleDecorate = () => {
    onDecorate();
    setTimeout(() => fireConfetti({ particleCount: 80, spread: 90, origin: { y: 0.6 } }), 500);
  };
  const handleLight = () => {
    setLit(true);
    setTimeout(() => fireConfetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } }), 500);
    setTimeout(() => fireConfetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } }), 1000);
  };

  return (
    <motion.div
      className="relative z-10 flex min-h-screen items-center justify-center p-4 md:p-6"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-7 rounded-[60px] card-shadow min-w-48 w-full max-w-[440px] relative flex flex-col items-center gap-4 my-10">
        {/* Happy birthday text - shows after candle lit */}
        <motion.div
          className="w-full text-center text-3xl md:text-4xl font-semibold text-white drop-shadow-lg leading-tight px-4 will-change-transform"
          style={{ filter: 'drop-shadow(0 0 20px rgba(147, 51, 234, 0.6))' }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={lit ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.5 }}
        >
          Happy Birthday, Cutiepiee!
        </motion.div>

        {/* Cake area */}
        <div className="relative h-72 bg-gradient-to-b from-white/10 to-purple-900/30 w-full flex items-end justify-center rounded-[40px] gif-box-shadow pb-10">
          <Cake lit={lit} />
        </div>

        {/* Button sequence */}
        <AnimatePresence mode="wait">
          {!decorated && (
            <motion.div key="decorate" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1, transition: { delay: 0.5 } }} exit={{ opacity: 0, scale: 0.8 }}>
              <Btn onClick={handleDecorate} className="bg-purple-600/30 text-white border border-purple-500/30 backdrop-blur-md">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72" /><path d="m14 7 3 3" /><path d="M5 6v4" /><path d="M19 14v4" /><path d="M10 2v2" /><path d="M7 8H3" /><path d="M21 16h-4" /><path d="M11 3H9" /></svg>
                Decorate
              </Btn>
            </motion.div>
          )}
          {decorated && !lit && (
            <motion.div key="light" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1, transition: { delay: 0.5 } }} exit={{ opacity: 0, scale: 0.8 }}>
              <Btn onClick={handleLight} className="bg-purple-600/30 text-white border border-purple-500/30 backdrop-blur-md">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3q1 4 4 6.5t3 5.5a1 1 0 0 1-14 0 5 5 0 0 1 1-3 1 1 0 0 0 5 0c0-2-1.5-3-1.5-5q0-2 2.5-4" /></svg>
                Light the Candle
              </Btn>
            </motion.div>
          )}
          {lit && (
            <motion.div key="balloons" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1, transition: { delay: 2 } }}>
              <Btn onClick={onNext} className="bg-purple-600/30 text-white border border-purple-500/30 backdrop-blur-md">
                Pop the Balloons
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8L22 12L18 16" /><path d="M2 12H22" /></svg>
              </Btn>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ── Stage 3: Balloon popping (separate from cake) ────────────────────────────
const BALLOONS = [
  { id: 1, xPct: 20, topPct: 18, color: '#9333ea' },
  { id: 2, xPct: 40, topPct: 24, color: '#a855f7' },
  { id: 3, xPct: 60, topPct: 24, color: '#7c3aed' },
  { id: 4, xPct: 80, topPct: 18, color: '#6d28d9' },
];
const WORDS = ['You', 'are', 'a', 'Cutiee'];

function StageBalloons({ onNext }) {
  const [popped, setPopped] = useState([]);
  const allPopped = popped.length === 4;

  // Container ref for measuring
  const containerRef = useRef(null);
  const [containerSize, setContainerSize] = useState({ w: 0, h: 0 });
  // Wave offset for rope animation
  const [wave, setWave] = useState(0);
  // Knot positions (bottom of each balloon)
  const knotRefs = useRef(new Map());
  const [knotPositions, setKnotPositions] = useState({});

  const measureKnots = useCallback(() => {
    const box = containerRef.current?.getBoundingClientRect();
    if (!box) return;
    const positions = {};
    BALLOONS.forEach(b => {
      const el = knotRefs.current.get(b.id);
      if (!el) return;
      const r = el.getBoundingClientRect();
      positions[b.id] = { x: r.left - box.left + r.width / 2, y: r.top - box.top + r.height / 2 };
    });
    setKnotPositions(positions);
  }, []);

  // Track container size
  useEffect(() => {
    const obs = new ResizeObserver(() => {
      if (containerRef.current) {
        setContainerSize({ w: containerRef.current.clientWidth, h: containerRef.current.clientHeight });
        measureKnots();
      }
    });
    if (containerRef.current) obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, [measureKnots]);

  // Wave animation
  useEffect(() => {
    let raf;
    const tick = () => {
      setWave(w => (w + 0.02) % (2 * Math.PI));
      measureKnots();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [measureKnots]);

  useEffect(() => {
    if (allPopped) fireConfetti({ particleCount: 90, spread: 85, startVelocity: 38, origin: { y: 0.6 }, ticks: 190 });
  }, [allPopped]);

  const handlePop = (id) => {
    if (popped.includes(id)) return;
    setPopped(p => [...p, id]);
    fireConfetti({ particleCount: 45, spread: 45, startVelocity: 28, origin: { y: 0.6 }, ticks: 100 });
  };

  // Build SVG rope path for each balloon (cubic bezier to bottom-center)
  const buildRopePath = (balloonIdx) => {
    const b = BALLOONS[balloonIdx];
    const pos = knotPositions[b.id];
    if (!pos || !containerSize.w || !containerSize.h) return '';
    const sx = pos.x, sy = pos.y;
    const a = 18 * Math.sin(wave + balloonIdx);
    const cx1 = sx + 0.4 * a;
    const cy1 = sy + 80;
    const cx2 = 0.5 * containerSize.w + 0.2 * a;
    const cy2 = 0.7 * containerSize.h;
    const ex = 0.5 * containerSize.w;
    const ey = containerSize.h;
    return `M ${sx} ${sy} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${ex} ${ey}`;
  };

  return (
    <motion.div
      className="relative z-10 px-3 md:px-6 py-10 w-full min-h-screen flex flex-col items-center justify-center"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      {/* Card with balloons inside */}
      <div
        ref={containerRef}
        className="relative h-[55vh] bg-black/40 backdrop-blur-xl border border-white/10 p-7 rounded-[60px] card-shadow w-full max-w-[440px] flex flex-col items-center gap-4"
      >
        {/* Instruction text */}
        <motion.div
          className="text-xl md:text-2xl text-center text-secondary font-semibold will-change-transform"
          animate={{ opacity: allPopped ? 0 : 1 }}
          transition={{ duration: 0.5 }}
        >
          Pop all 4 balloons
        </motion.div>

        {/* Word labels */}
        {BALLOONS.map((b, i) => (
          <motion.div
            key={`word-${b.id}`}
            className="absolute text-xl md:text-2xl font-semibold pointer-events-none"
            style={{ left: `${b.xPct}%`, top: `${b.topPct + 16}%`, transform: 'translateX(-50%)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: popped.includes(b.id) ? 1 : 0 }}
          >
            <span className="text-primary drop-shadow">{WORDS[i]}</span>
          </motion.div>
        ))}

        {/* Balloons */}
        <AnimatePresence>
          {BALLOONS.map(b => !popped.includes(b.id) && (
            <motion.button
              key={b.id}
              className="absolute"
              style={{ left: `${b.xPct}%`, top: `${b.topPct}%`, transform: 'translateX(-50%)' }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.3, transition: { duration: 0.2 } }}
              onClick={() => handlePop(b.id)}
              aria-label={`Balloon ${b.id}`}
            >
              <div className="relative">
                {/* Balloon body */}
                <div
                  className="h-24 w-20 md:h-28 rounded-[50%_50%_45%_45%/55%_55%_45%_45%]"
                  style={{
                    background: `radial-gradient(60% 60% at 35% 35%, rgba(255,255,255,0.6) 0 26%, transparent 27%), linear-gradient(145deg, ${b.color}, rgba(255,255,255,0.3))`,
                    boxShadow: 'inset -6px -10px 16px rgba(0,0,0,0.18), 0 10px 22px rgba(0,0,0,0.22)'
                  }}
                />
                {/* Balloon knot (diamond) — ref used for rope attachment point */}
                <div
                  ref={el => { if (el) knotRefs.current.set(b.id, el); else knotRefs.current.delete(b.id); }}
                  className="mx-auto -mt-1 h-3 w-3 rotate-45 relative z-10"
                  style={{ background: b.color }}
                />
              </div>
            </motion.button>
          ))}
        </AnimatePresence>

        {/* SVG rope strings — drawn from each knot to bottom center */}
        <svg
          className="pointer-events-none absolute inset-0"
          width={containerSize.w}
          height={containerSize.h}
        >
          {BALLOONS.map((b, idx) => {
            if (popped.includes(b.id)) return null;
            const d = buildRopePath(idx);
            return d ? (
              <path
                key={`rope-${b.id}`}
                d={d}
                stroke="rgba(0,0,0,0.25)"
                strokeWidth="1.4"
                fill="none"
              />
            ) : null;
          })}
        </svg>
      </div>

      {/* Next button */}
      <div className="mt-8 flex justify-center">
        <AnimatePresence>
          {allPopped && (
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1, transition: { delay: 0.5 } }}>
              <Btn onClick={onNext} className="bg-purple-600/30 text-white border border-purple-500/30 backdrop-blur-md">
                Next
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8L22 12L18 16" /><path d="M2 12H22" /></svg>
              </Btn>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ── Stage 4: Photo Carousel (Some Sweet Moments) ─────────────────────────────
function StageCarousel({ onNext }) {
  return (
    <motion.div
      className="relative z-10 flex min-h-screen flex-col items-center justify-center p-4 md:p-8"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-7 rounded-[60px] card-shadow min-w-48 w-full max-w-[440px] relative flex flex-col items-center gap-4 my-10">

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center will-change-transform"
        >
          <h2 className="text-2xl md:text-3xl font-semibold text-white will-change-transform">
            Some Sweet Moments
          </h2>
          <p className="text-sm text-purple-300/80 mt-1 will-change-transform">
            (Swipe for more)
          </p>
        </motion.div>

        {/* Carousel Container */}
        <div className="relative p-6 bg-gradient-to-b from-white/10 to-purple-900/30 w-full rounded-[40px] flex items-end justify-center gif-box-shadow">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="w-[215px] h-[280px] md:w-[237px] md:h-[310px]"
          >
            <Swiper
              effect="cards"
              modules={[EffectCards, Autoplay]}
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              className="w-full h-full"
            >
              {[1, 2, 3, 4].map((n) => (
                <SwiperSlide key={n} className="rounded-3xl p-2 bg-gradient-to-tr from-purple-900/40 via-violet-900/40 to-black/40 backdrop-blur-sm border border-white/10">
                  <div className="relative h-full w-full rounded-2xl overflow-hidden">
                    {/* Hearts */}
                    <svg className="absolute top-2 left-2 w-5 h-5 z-10 text-purple-400 fill-purple-400 opacity-90" viewBox="0 0 24 24">
                      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                    </svg>
                    <svg className="absolute top-2 right-2 w-5 h-5 z-10 text-purple-400 fill-purple-400 opacity-90" viewBox="0 0 24 24">
                      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                    </svg>
                    <img
                      loading="lazy"
                      src={`./images/${n}.jpg`}
                      alt={`Memory ${n}`}
                      className="h-full w-full rounded-2xl object-cover"
                      style={{ filter: 'drop-shadow(0 8px 16px rgba(244, 114, 182, 0.2))' }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-black/10 to-pink-100/10 pointer-events-none rounded-2xl" />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </motion.div>
        </div>

        {/* Action Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1, transition: { delay: 0.5 } }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="mt-4 flex justify-center"
        >
          <Btn onClick={onNext} className="bg-purple-600/30 text-white border border-purple-500/30 backdrop-blur-md">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
            Open My Message
          </Btn>
        </motion.div>

      </div>
    </motion.div>
  );
}

// ── Stage 5: Message Card (Cover → Letter) ───────────────────────────────────
const LETTER = `Happy Birthday, Cutiepie! You deserve all the happiness, love, and smiles in the world today and always. You have this special way of making everything around you brighter, your smile, your kindness, and the way you make people feel truly cared for. I hope your day is filled with laughter, surprises, and moments that make your heart happy. You're truly one of a kind, and I just want you to know how special you are. Keep being the amazing person you are, spreading joy wherever you go. Wishing you endless happiness, success, and all the sweet things life has to offer. 💗`;

function StageMessage({ onNext }) {
  const [tapped, setTapped] = useState(false);
  const [typed, setTyped] = useState('');

  const handleTap = () => {
    if (tapped) return;
    setTapped(true);
    fireConfetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setTyped(LETTER.slice(0, i));
      if (i >= LETTER.length) clearInterval(interval);
    }, 35);
  };

  return (
    <motion.div
      className="relative z-10 flex min-h-screen flex-col items-center justify-center p-4 md:p-8"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-7 rounded-[60px] card-shadow min-w-48 w-full max-w-[440px] relative flex flex-col items-center gap-4 my-10">

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center will-change-transform"
        >
          <h2 className="text-2xl md:text-3xl font-semibold text-white text-center will-change-transform">
            A Special Message
          </h2>
          <p className="text-purple-300/80 text-sm">Tap to open</p>
        </motion.div>

        {/* Card Container */}
        <div
          onClick={handleTap}
          className="relative h-[300px] w-full rounded-[40px] overflow-hidden cursor-pointer transition-all flex items-center justify-center max-w-[300px]"
          style={{
            boxShadow: 'inset 3px 2px 6px #a0829640, -2px -2px 6px #c8aabe4d'
          }}
        >
          {/* Inner Message Box (Visible when cover slides) */}
          <div className="absolute inset-0 p-4 flex items-center justify-center">
            <div className="h-full w-full bg-black/60 rounded-[35px] p-6 overflow-y-auto text-white/90 whitespace-pre-wrap text-sm leading-relaxed text-left scrollbar-thin scrollbar-thumb-purple-500"
              style={{
                boxShadow: '0 0 25px rgba(168, 85, 247, 0.4), inset 0 0 10px rgba(168, 85, 247, 0.1)'
              }}>
              {typed}
              {typed.length < LETTER.length && typed.length > 0 && (
                <span className="inline-block w-1.5 h-3 ml-0.5 bg-purple-400 animate-pulse" />
              )}
            </div>
          </div>

          {/* Cover */}
          <motion.div
            className="absolute inset-0 z-20 bg-[#ffedea] transition-all"
            animate={{ x: tapped ? '-100%' : '0%' }}
            transition={{ duration: 1, ease: "easeInOut" }}
            style={{
              backgroundImage: 'url(./images/cover.webp)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="absolute inset-0 bg-black/5 flex items-center justify-center pointer-events-none">
              {!tapped && (
                <div className="text-white font-bold text-xl drop-shadow-lg bg-black/30 px-6 py-2 rounded-full animate-bounce">
                  Tap Here ✨
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Next Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1, transition: { delay: 0.5 } }}
          className="mt-4 flex justify-center"
        >
          <Btn onClick={onNext} className="bg-purple-600/30 text-white border border-purple-500/30 backdrop-blur-md">
            Next
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
          </Btn>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ── Stage 6: Final Gift (One Last Thing...) ──────────────────────────────────
function StageGift({ onReplay }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
    fireConfetti({ particleCount: 100, spread: 180, origin: { y: 0.6 } });
  };

  return (
    <motion.div
      className="relative z-10 flex min-h-screen flex-col items-center justify-center p-4 md:p-8"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
    >
      <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-7 rounded-[60px] card-shadow min-w-48 w-full max-w-[440px] relative flex flex-col items-center gap-4 my-10">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-2xl md:text-3xl font-semibold text-white leading-tight will-change-transform text-center"
        >
          One Last Thing...
        </motion.h2>

        <div className="flex flex-col items-center py-8 bg-gradient-to-b from-white/10 to-purple-900/30 rounded-[40px] gif-box-shadow w-full">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1, transition: { delay: 0.5 } }}
            className="flex justify-center will-change-transform mb-4"
          >
            <button
              className="hover:scale-105 transition-transform duration-300 active:scale-95"
              onClick={handleOpen}
            >
              <img src="./images/giftbox.png" alt="Gift box" className="h-32 md:h-36 object-contain" />
            </button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 1 } }}
            className="text-purple-300/80 text-sm font-medium animate-bounce"
          >
            Tap the gift
          </motion.div>
        </div>

        {/* Modal */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="fixed p-4 inset-0 z-[100] grid place-items-center bg-black/30 backdrop-blur-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
            >
              <motion.div
                initial={{ scale: 0.75, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.97, opacity: 0 }}
                transition={{ duration: 1, type: "spring", stiffness: 200 }}
                className="relative z-10 max-w-[440px] w-full rounded-[60px] p-8 text-center bg-gradient-to-b from-black/80 to-purple-900/40 backdrop-blur-2xl border border-white/10 shadow-2xl flex flex-col items-center gap-6"
              >
                <img src="./images/surprise.gif" alt="Surprise" className="w-44 md:w-52 object-cover rounded-2xl shadow-md" />
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-white">Surprise! 🎉</h3>
                  <p className="text-purple-200/80">Hope you liked your little journey!</p>
                </div>
                <Btn onClick={onReplay} className="bg-purple-600/30 text-white border border-purple-500/30 backdrop-blur-md">
                  {/* Replay icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /></svg>
                  Replay Journey
                </Btn>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ── Stage 1: Ur Best Looks (Holographic Parallax Stack) ─────────────────────
const DEFAULT_LABELS = ['Always Glowing ✨', 'Pure Magic 💜', 'Absolutely Radiant 🌸', 'Ur Best Look 👑'];

function StageBestLooks({ onNext, images = [] }) {
  const displayPhotos = useMemo(() => {
    if (images && images.length > 0) {
      return images.map((img, i) => ({ src: img, label: DEFAULT_LABELS[i] || 'Memory ✨' }));
    }
    return [
      { src: './images/1.jpg', label: 'Always Glowing ✨' },
      { src: './images/2.jpg', label: 'Pure Magic 💜' },
      { src: './images/3.jpg', label: 'Absolutely Radiant 🌸' },
      { src: './images/4.jpg', label: 'Ur Best Look 👑' },
    ];
  }, [images]);

  const [topIdx, setTopIdx] = useState(0);
  const [thrown, setThrown] = useState({}); // { idx: direction }
  const [allSeen, setAllSeen] = useState(false);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  useEffect(() => {
    const onMove = (e) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      setMouse({
        x: (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2),
        y: (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2),
      });
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  const throwCard = () => {
    const dir = Math.random() > 0.5 ? 1 : -1;
    setThrown(prev => ({ ...prev, [topIdx]: dir }));
    setTimeout(() => {
      const next = topIdx + 1;
      if (next >= displayPhotos.length) {
        setAllSeen(true);
        fireConfetti({ particleCount: 160, spread: 180, origin: { y: 0.5 } });
        setTimeout(() => fireConfetti({ particleCount: 80, spread: 120, origin: { y: 0.65 } }), 400);
        // Auto-transition after confetti — no button needed
        setTimeout(() => onNext(), 2500);
      } else {
        setTopIdx(next);
      }
    }, 380);
  };

  return (
    <motion.div
      className="relative z-10 flex min-h-screen flex-col items-center justify-center p-4"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      {/* Title */}
      <AnimatePresence>
        {!allSeen && (
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20, transition: { duration: 0.5 } }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-center mb-10 select-none absolute top-[10%]"
          >
            <h2
              className="text-2xl sm:text-3xl md:text-4xl font-bold font-heading"
              style={{
                background: 'linear-gradient(90deg, #c084fc, #818cf8, #f9a8d4, #c084fc)',
                backgroundSize: '300%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                animation: 'shimmer 3s linear infinite',
                filter: 'drop-shadow(0 0 24px rgba(192,132,252,0.9))',
              }}
            >
              ✨ Ur Best Looks ✨
            </h2>
            <p className="text-purple-300/70 text-sm mt-2 font-body">
              Tap card to reveal · {displayPhotos.length - topIdx} left
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Card Stack */}
      <div
        ref={containerRef}
        className="relative select-none"
        style={{ width: 280, height: 380 }}
      >
        {displayPhotos.map((photo, i) => {
          const isThrown = thrown[i] !== undefined;
          const stackPos = i - topIdx;
          if (i < topIdx && !isThrown) return null;
          const isTop = i === topIdx && !isThrown;
          const scale = isThrown ? 0.9 : Math.max(0.82, 1 - stackPos * 0.055);
          const yOff = isThrown ? 0 : stackPos * 11;
          const rz = isThrown ? 0 : (stackPos % 2 === 0 ? -stackPos * 1.8 : stackPos * 1.8);

          return (
            <motion.div
              key={i}
              className="absolute inset-0 rounded-3xl"
              style={{ zIndex: isThrown ? 50 : displayPhotos.length - stackPos, cursor: isTop ? 'pointer' : 'default' }}
              initial={{ y: -420, opacity: 0, scale: 0.7, rotateZ: Math.random() * 20 - 10 }}
              animate={isThrown
                ? { x: thrown[i] * 680, y: -180, rotate: thrown[i] * 38, opacity: 0, scale: 0.8 }
                : {
                  y: isTop ? mouse.y * 6 : yOff,
                  x: isTop ? mouse.x * 5 : 0,
                  scale,
                  rotateX: isTop ? -mouse.y * 9 : 0,
                  rotateY: isTop ? mouse.x * 11 : 0,
                  rotateZ: isTop ? 0 : rz,
                  opacity: stackPos > 3 ? 0 : 1,
                }
              }
              transition={isThrown
                ? { duration: 0.38, ease: 'easeIn' }
                : {
                  y: { delay: i * 0.07, type: 'spring', stiffness: 190, damping: 22 },
                  x: { duration: 0.07 },
                  rotateX: { duration: 0.07 },
                  rotateY: { duration: 0.07 },
                  scale: { duration: 0.3 },
                }
              }
              onClick={isTop ? throwCard : undefined}
              whileTap={isTop ? { scale: 0.96 } : {}}
            >
              {/* Card body */}
              <div
                className="relative w-full h-full rounded-3xl overflow-hidden"
                style={{
                  boxShadow: isTop
                    ? '0 0 0 1px rgba(192,132,252,0.55), 0 24px 64px rgba(0,0,0,0.65), 0 0 50px rgba(147,51,234,0.45), 0 0 100px rgba(147,51,234,0.12)'
                    : `0 ${10 + stackPos * 5}px ${35 + stackPos * 12}px rgba(0,0,0,0.55)`,
                }}
              >
                <img
                  src={photo.src}
                  alt={`Look ${i + 1}`}
                  className="w-full h-full object-cover"
                  draggable={false}
                />

                {/* Holographic iridescent overlay */}
                {isTop && (
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: `conic-gradient(from ${170 + mouse.x * 50}deg at ${50 + mouse.x * 22}% ${50 + mouse.y * 22}%, rgba(147,51,234,0.13), rgba(6,182,212,0.11), rgba(236,72,153,0.13), rgba(99,102,241,0.11), rgba(147,51,234,0.13))`,
                      mixBlendMode: 'screen',
                    }}
                  />
                )}

                {/* Light sweep shimmer */}
                {isTop && (
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    animate={{ x: ['-100%', '220%'] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'linear', repeatDelay: 2 }}
                    style={{
                      background: 'linear-gradient(105deg, transparent 38%, rgba(255,255,255,0.2) 50%, transparent 62%)',
                      width: '60%',
                    }}
                  />
                )}

                {/* Neon border */}
                <div
                  className="absolute inset-0 rounded-3xl pointer-events-none"
                  style={{
                    border: isTop ? '1px solid rgba(192,132,252,0.55)' : '1px solid rgba(192,132,252,0.12)',
                    boxShadow: isTop ? 'inset 0 0 28px rgba(147,51,234,0.28)' : 'none',
                  }}
                />

                {/* Caption */}
                {isTop && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 p-5"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15, duration: 0.5 }}
                    style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.72))' }}
                  >
                    <p
                      className="text-white font-semibold text-center text-sm md:text-base"
                      style={{ textShadow: '0 0 14px rgba(192,132,252,0.9)' }}
                    >
                      {photo.label}
                    </p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Progress dots */}
      <AnimatePresence>
        {!allSeen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex gap-2 mt-8"
          >
            {displayPhotos.map((_, i) => (
              <motion.div
                key={i}
                className="h-1.5 rounded-full"
                animate={{
                  width: i === topIdx ? 28 : 8,
                  backgroundColor: thrown[i] !== undefined ? '#7c3aed' : i === topIdx ? '#c084fc' : '#374151',
                }}
                transition={{ duration: 0.3 }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* All seen → confetti only, no text/button — auto-transitions via onNext() */}
    </motion.div>
  );
}

// ── Stage 2: Tree Animation ──────────────────────────────────────────────────
function StageTree({ onNext, letterHeader, letterBody }) {
  const canvasRef = useRef(null);
  const [done, setDone] = useState(false);
  const [showLetter, setShowLetter] = useState(false);

  useEffect(() => {
    console.log("StageTree mounted");
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const WIDTH = 1100;
    const HEIGHT = 680;
    const isMobile = window.innerWidth < 768;
    canvas.width = WIDTH;
    canvas.height = HEIGHT;

    // --- Embedded Love.js Logic ---
    function random(min, max) { return min + Math.floor(Math.random() * (max - min + 1)); }
    function bezier(cp, t) {
      const p1 = cp[0].mul((1 - t) * (1 - t));
      const p2 = cp[1].mul(2 * t * (1 - t));
      const p3 = cp[2].mul(t * t);
      return p1.add(p2).add(p3);
    }
    function inheart(x, y, r) {
      const z = ((x / r) * (x / r) + (y / r) * (y / r) - 1) ** 3 - (x / r) ** 2 * (y / r) ** 3;
      return z < 0;
    }

    const Point = function (x, y) { this.x = x || 0; this.y = y || 0; };
    Point.prototype = {
      clone: function () { return new Point(this.x, this.y); },
      add: function (o) { return new Point(this.x + o.x, this.y + o.y); },
      sub: function (o) { return new Point(this.x - o.x, this.y - o.y); },
      div: function (n) { return new Point(this.x / n, this.y / n); },
      mul: function (n) { return new Point(this.x * n, this.y * n); }
    };

    const Heart = function () {
      const points = [];
      for (let i = 10; i < 30; i += 0.2) {
        const t = i / Math.PI;
        const x = 16 * Math.pow(Math.sin(t), 3);
        const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
        points.push(new Point(x, y));
      }
      this.points = points;
      this.length = points.length;
    };
    Heart.prototype = { get: function (i, scale) { return this.points[i].mul(scale || 1); } };

    const Seed = function (tree, point, scale, color) {
      this.tree = tree;
      this.heart = { point, scale: scale || 1, color: color || '#FFC0CB', figure: new Heart() };
      this.cirle = { point, scale: scale || 1, color: color || '#FFC0CB', radius: 5 };
    };
    Seed.prototype = {
      draw: function () { this.drawHeart(); this.drawText(); },
      drawHeart: function () {
        const ctx = this.tree.ctx, h = this.heart;
        ctx.save(); ctx.fillStyle = h.color; ctx.translate(h.point.x, h.point.y); ctx.beginPath(); ctx.moveTo(0, 0);
        for (let i = 0; i < h.figure.length; i++) { const p = h.figure.get(i, h.scale); ctx.lineTo(p.x, -p.y); }
        ctx.closePath(); ctx.fill(); ctx.restore();
      },
      drawText: function () {
        const ctx = this.tree.ctx, h = this.heart;
        const fs = Math.round(10 * h.scale);
        const lineH = fs * 1.4;
        ctx.save(); ctx.fillStyle = h.color; ctx.translate(h.point.x, h.point.y);
        ctx.font = `bold ${fs}px Arial`; ctx.textAlign = "left";
        ctx.fillText("Click Me :)", 28 * h.scale, 0);
        ctx.restore();
      },

      canMove: function () { return this.cirle.point.y < (this.tree.height + 20); },
      move: function (x, y) { this.clear(); this.drawCirle(); this.cirle.point = this.cirle.point.add(new Point(x, y)); },
      drawCirle: function () {
        const ctx = this.tree.ctx, c = this.cirle;
        ctx.save(); ctx.fillStyle = c.color; ctx.translate(c.point.x, c.point.y); ctx.scale(c.scale, c.scale);
        ctx.beginPath(); ctx.arc(0, 0, c.radius, 0, 2 * Math.PI); ctx.fill(); ctx.restore();
      },
      canScale: function () { return this.heart.scale > 0.2; },
      scale: function (s) { this.clear(); this.drawCirle(); this.drawHeart(); this.heart.scale *= s; },
      clear: function () {
        const c = this.cirle, r = 60 * c.scale;
        this.tree.ctx.clearRect(c.point.x - r, c.point.y - r, r * 2.5, r * 2.5);
      },
      hover: function (x, y) {
        const d = Math.sqrt((x - this.heart.point.x) ** 2 + (y - this.heart.point.y) ** 2);
        return d < 80 * this.heart.scale;
      }
    };

    const Branch = function (tree, p1, p2, p3, r, l, b) {
      this.tree = tree; this.p1 = p1; this.p2 = p2; this.p3 = p3; this.radius = r; this.length = l || 100;
      this.len = 0; this.t = 1 / (this.length - 1); this.branchs = b || [];
    };
    Branch.prototype = {
      grow: function () {
        if (this.len <= this.length) {
          const p = bezier([this.p1, this.p2, this.p3], this.len * this.t);
          this.draw(p); this.len++; this.radius *= 0.97;
        } else {
          this.tree.removeBranch(this); this.tree.addBranchs(this.branchs);
        }
      },
      draw: function (p) {
        const ctx = this.tree.ctx; ctx.save(); ctx.beginPath(); ctx.fillStyle = '#FFC0CB';
        ctx.moveTo(p.x, p.y); ctx.arc(p.x, p.y, this.radius, 0, 2 * Math.PI); ctx.fill(); ctx.restore();
      }
    };

    const Bloom = function (tree, point, figure, color, alpha, angle, scale, place, speed) {
      this.tree = tree; this.point = point; this.color = color || `rgb(255,${random(0, 255)},${random(0, 255)})`;
      this.alpha = alpha || random(0.3, 1); this.angle = angle || random(0, 360); this.scale = scale || 0.1;
      this.place = place; this.speed = speed; this.figure = figure;
    };
    Bloom.prototype = {
      flower: function () { this.draw(); this.scale += 0.1; if (this.scale > 1) this.tree.removeBloom(this); },
      draw: function () {
        const ctx = this.tree.ctx, f = this.figure; ctx.save(); ctx.fillStyle = this.color; ctx.globalAlpha = this.alpha;
        ctx.translate(this.point.x, this.point.y); ctx.scale(this.scale, this.scale); ctx.rotate(this.angle);
        ctx.beginPath(); ctx.moveTo(0, 0);
        for (let i = 0; i < f.length; i++) { const p = f.get(i); ctx.lineTo(p.x, -p.y); }
        ctx.fill(); ctx.restore();
      }
    };

    const Tree = function (canvas, width, height, opt) {
      this.canvas = canvas; this.ctx = canvas.getContext('2d'); this.width = width; this.height = height; this.opt = opt || {};
      this.record = {}; this.init();
    };
    Tree.prototype = {
      init: function () {
        const s = this.opt.seed || {};
        this.seed = new Seed(this, new Point(s.x || this.width / 2, s.y || this.height / 2), s.scale, s.color);
        this.branchs = []; this.addBranchs(this.opt.branch || []);
        const b = this.opt.bloom || {}, f = this.seed.heart.figure; this.blooms = []; this.bloomsCache = [];
        for (let i = 0; i < (b.num || 500); i++) {
          let x, y; while (true) {
            x = random(20, (b.width || this.width) - 20); y = random(20, (b.height || this.height) - 20);
            if (inheart(x - this.width / 2, this.height - (this.height - 40) / 2 - y, 240)) {
              this.bloomsCache.push(new Bloom(this, new Point(x, y), f)); break;
            }
          }
        }
      },
      addBranchs: function (bs) { bs.forEach(b => this.branchs.push(new Branch(this, new Point(b[0], b[1]), new Point(b[2], b[3]), new Point(b[4], b[5]), b[6], b[7], b[8]))); },
      removeBranch: function (b) { const i = this.branchs.indexOf(b); if (i > -1) this.branchs.splice(i, 1); },
      canGrow: function () { return this.branchs.length > 0; },
      grow: function () { this.branchs.slice().forEach(b => b.grow()); },
      canFlower: function () { return this.bloomsCache.length > 0 || this.blooms.length > 0; },
      flower: function (n) {
        this.bloomsCache.splice(0, n).forEach(b => this.blooms.push(b));
        this.blooms.slice().forEach(b => b.flower());
      },
      removeBloom: function (b) { const i = this.blooms.indexOf(b); if (i > -1) this.blooms.splice(i, 1); },
      snapshot: function (k, x, y, w, h) { this.record[k] = { image: this.ctx.getImageData(x, y, w, h), point: new Point(x, y), width: w, height: h }; },
      move: function (k, x, y) {
        const r = this.record[k], p = r.point, sp = r.speed || 10;
        const nx = p.x + sp < x ? p.x + sp : x, ny = p.y + sp < y ? p.y + sp : y;
        this.ctx.clearRect(p.x, p.y, r.width, r.height); this.ctx.putImageData(r.image, nx, ny);
        r.point = new Point(nx, ny); r.speed = Math.max(2, sp * 0.95); return nx < x || ny < y;
      },
      toDataURL: function () { return this.canvas.toDataURL(); }
    };



    // Enforce uniform scaling at the JS level so the bloom (leaves) and branches 
    // perfectly align. We will scale the entire canvas using CSS for mobile instead.
    const scaleFactor = 1;
    const treeBaseY = HEIGHT;

    const scaleBranchData = (data) => {
      return data.map(b => {
        const scaled = [
          WIDTH / 2 + (b[0] - WIDTH / 2) * scaleFactor,
          treeBaseY + (b[1] - HEIGHT) * scaleFactor,
          WIDTH / 2 + (b[2] - WIDTH / 2) * scaleFactor,
          treeBaseY + (b[3] - HEIGHT) * scaleFactor,
          WIDTH / 2 + (b[4] - WIDTH / 2) * scaleFactor,
          treeBaseY + (b[5] - HEIGHT) * scaleFactor,
          b[6] * scaleFactor,
          b[7],
        ];
        if (b[8]) scaled.push(scaleBranchData(b[8]));
        return scaled;
      });
    };

    const rawBranchData = [[550, 680, 570, 250, 500, 200, 30, 100, [
      [540, 500, 455, 417, 340, 400, 13, 100, [[450, 435, 434, 430, 394, 395, 2, 40]]],
      [550, 445, 600, 356, 680, 345, 12, 100, [[578, 400, 648, 409, 661, 426, 3, 80]]],
      [539, 281, 537, 248, 534, 217, 3, 40],
      [546, 397, 413, 247, 328, 244, 9, 80, [[427, 286, 383, 253, 371, 205, 2, 40], [498, 345, 435, 315, 395, 330, 4, 60]]],
      [546, 357, 608, 252, 678, 221, 6, 100, [[590, 293, 646, 277, 648, 271, 2, 80]]]
    ]]];

    const opts = {
      seed: {
        x: WIDTH / 2,
        y: HEIGHT / 2 + 50, // Keep desktop initialization exact for mobile to preserve physics
        color: "#FFC0CB",
        scale: 1.2
      },
      branch: scaleBranchData(rawBranchData),
      bloom: { num: 700, width: 1080, height: 650 },
      footer: { width: 1200, height: 5, speed: 10 }
    };

    const tree = new Tree(canvas, WIDTH, HEIGHT, opts);
    let hold = true;
    let isRunning = true;

    const onClick = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) * (WIDTH / rect.width);
      const y = (e.clientY - rect.top) * (HEIGHT / rect.height);
      if (tree.seed.hover(x, y)) {
        hold = false;
        tree.seed.clear(); // Instantly clear text and heart
        tree.seed.drawHeart(); // Re-draw only heart without text
        canvas.removeEventListener("click", onClick);
        canvas.style.cursor = 'default';
      }
    };
    canvas.addEventListener("click", onClick);
    canvas.style.cursor = 'pointer';

    const run = async () => {
      console.log("Starting Tree Animation");
      tree.seed.draw();
      while (hold && isRunning) await new Promise(r => setTimeout(r, 10));
      if (!isRunning) return;
      while (tree.seed.canScale() && isRunning) { tree.seed.scale(0.95); await new Promise(r => setTimeout(r, 10)); }
      while (tree.seed.canMove() && isRunning) { tree.seed.move(0, 2); await new Promise(r => setTimeout(r, 10)); }
      if (!isRunning) return;
      do { tree.grow(); await new Promise(r => setTimeout(r, 10)); } while (tree.canGrow() && isRunning);
      if (!isRunning) return;
      do { tree.flower(2); await new Promise(r => setTimeout(r, 10)); } while (tree.canFlower() && isRunning);
      if (!isRunning) return;
      
      // Move tree to the right (but less than before)
      if (isMobile) {
        tree.snapshot("p1", 0, 0, WIDTH, HEIGHT);
        while (tree.move("p1", 120, 0) && isRunning) await new Promise(r => setTimeout(r, 10));
      } else {
        tree.snapshot("p1", 240, 0, 610, 680);
        while (tree.move("p1", 500, 0) && isRunning) await new Promise(r => setTimeout(r, 10));
      }
      
      if (!isRunning) return;
      setShowLetter(true);
      setDone(true);
      // Notify parent to unlock customization button
      window.parent.postMessage({ type: 'TEMPLATE_COMPLETED' }, '*');
    };

    run();
    return () => { isRunning = false; canvas.removeEventListener("click", onClick); };
  }, []);

  return (
    <div className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-[3px] overflow-hidden">

      {/* Single canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-contain"
        style={{ 
          objectPosition: "center",
          transform: window.innerWidth < 768 ? "scale(3.2) translateY(30%)" : "none",
          transformOrigin: window.innerWidth < 768 ? "center 95%" : "center"
        }}
      />



      {/* ── MOBILE letter: Centered overlay over the tree ── */}
      <div className="md:hidden absolute inset-0 z-30 flex items-center justify-center px-6 pointer-events-none">
        <AnimatePresence>
          {showLetter && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="pointer-events-auto relative p-8 bg-black/50 backdrop-blur-md border border-white/20 rounded-[32px] shadow-2xl w-full max-w-[370px] flex flex-col justify-center text-center mt-[35vh]"
            >
              {/* Top-left GIF */}
              <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-12 -left-6 w-20 h-20 z-20"
              >
                <img src="./goma-peach.gif" alt="cute" className="w-full h-full object-contain" />
              </motion.div>

              <h2 className="text-3xl font-bold text-pink-300 mb-3 font-accent">
                {letterHeader}
              </h2>
              <p className="text-sm text-white/95 leading-relaxed font-light italic font-body">
                {letterBody}
              </p>
              <div className="mt-5 text-pink-200 font-bold text-lg font-heading">— Happy Birthday! ✨</div>

              {/* Bottom-right GIF */}
              <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 4, repeat: Infinity }}
                className="absolute -bottom-10 -right-6 w-24 h-24 z-20"
              >
                <img src="./peach-goma.gif" alt="cute" className="w-full h-full object-contain" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── DESKTOP letter: overlay shifted right ── */}
      <div className="hidden md:block absolute left-[200px] top-1/2 -translate-y-1/2 w-full max-w-[480px] z-30 pointer-events-none">
        <AnimatePresence>
          {showLetter && (
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="pointer-events-auto relative p-10 bg-black/20 backdrop-blur-md border border-white/10 rounded-[40px] shadow-2xl ml-10"
            >
              <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-16 -left-12 w-24 h-24 z-20"
              >
                <img src="./goma-peach.gif" alt="cute" className="w-full h-full object-contain" />
              </motion.div>

              <h2 className="text-3xl font-bold text-pink-300 mb-4 font-accent">
                {letterHeader}
              </h2>
              <p className="text-lg text-white/90 leading-relaxed font-light italic font-body">
                {letterBody}
              </p>
              <div className="mt-6 text-pink-200 font-bold text-lg font-heading">— Happy Birthday! ✨</div>

              <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 4, repeat: Infinity }}
                className="absolute -bottom-10 -right-10 w-28 h-28 z-20"
              >
                <img src="./peach-goma.gif" alt="cute" className="w-full h-full object-contain" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}

// ── Root App ─────────────────────────────────────────────────────────────────
const STAGES = ['welcome', 'loading', 'bestlooks', 'tree'];

export default function App() {
  const [stage, setStage] = useState(-1);
  const [decorated, setDecorated] = useState(false);
  const audioRef = useRef(null);

  // Customization State
  const [letterHeader, setLetterHeader] = useState("To My Queen...");
  const [letterBody, setLetterBody] = useState("Just like this tree blossomed from a small heart, your love has grown into something more beautiful than I ever imagined.\n\nEvery leaf on this tree represents a sweet memory we've shared. You are my greatest adventure.");
  const [images, setImages] = useState([
    './images/1.jpg',
    './images/2.jpg',
    './images/3.jpg',
    './images/4.jpg'
  ]);
  const [selectedFontSet, setSelectedFontSet] = useState('set1');

  const fontSets = {
    set1: {
      heading: "'Shantell Sans', sans-serif",
      body: "'Comfortaa', sans-serif",
      accent: "'Dancing Script', cursive"
    },
    set2: {
      heading: "'Outfit', sans-serif",
      body: "'Inter', sans-serif",
      accent: "'Satisfy', cursive"
    },
    set3: {
      heading: "'Playfair Display', serif",
      body: "'Lora', serif",
      accent: "'Great Vibes', cursive"
    },
    set4: {
      heading: "'Quicksand', sans-serif",
      body: "'Patrick Hand', cursive",
      accent: "'Pacifico', cursive"
    }
  };

  useEffect(() => {
    const handleMessage = (e) => {
      if (e.data?.type === 'customize') {
        const { letterHeader, letterBody, images, selectedFontSet } = e.data;
        if (letterHeader !== undefined) setLetterHeader(letterHeader);
        if (letterBody !== undefined) setLetterBody(letterBody);
        if (images !== undefined && Array.isArray(images)) setImages(images);
        if (selectedFontSet !== undefined) setSelectedFontSet(selectedFontSet);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  useEffect(() => {
    const fonts = fontSets[selectedFontSet] || fontSets.set1;
    document.documentElement.style.setProperty('--font-heading', fonts.heading);
    document.documentElement.style.setProperty('--font-body', fonts.body);
    document.documentElement.style.setProperty('--font-accent', fonts.accent);
  }, [selectedFontSet]);

  const startCelebration = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio('./birthday-song.mp3');
      audioRef.current.loop = true;
    }
    // Set timestamp to 0 seconds (start from the beginning)
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(err => {
      console.warn("Audio playback failed (usually due to browser policy):", err);
    });
    setStage(0);
  };

  const next = () => setStage(s => s + 1);
  const replay = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setStage(-1);
    setDecorated(false);
  };

  return (
    <main className="min-h-screen overflow-hidden relative font-sans">
      <BgDecos />
      <AnimatePresence>
        {decorated && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
            <Decorations />
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence mode="wait">
        {stage === -1 && <StageWelcome key="welcome" onStart={startCelebration} />}
        {stage === 0 && <StageLoading key="loading" onDone={next} />}
        {stage === 1 && <StageBestLooks key="bestlooks" onNext={next} images={images} />}
        {stage === 2 && <StageTree key="tree" onNext={next} letterHeader={letterHeader} letterBody={letterBody} />}
      </AnimatePresence>

      <AnimatePresence>
        {stage > -1 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="fixed bottom-4 left-0 md:left-auto md:right-4 z-[999] pointer-events-none"
          >
            <img
              src="./game.gif"
              alt="decoration"
              className={`transition-all duration-700 object-contain ${stage === 2 ? 'w-20 h-20 md:w-28 md:h-28 opacity-40' : 'w-32 h-32 md:w-48 md:h-48 opacity-90'
                }`}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
