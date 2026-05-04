import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import './Intro_ScratchCard2.css';

const Intro_ScratchCard2 = ({ senderName, onFinish }) => {
  const canvasRef = useRef(null);
  const wrapperRef = useRef(null);
  const [isFinished, setIsFinished] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const isDrawing = useRef(false);
  const lastPoint = useRef(null);
  const brushImage = useRef(null);
  const lastCheckTime = useRef(0);

  // Initialize Canvas
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = wrapper.clientWidth;
    canvas.height = wrapper.clientHeight;

    // Create Textured Brush (Like the repo's preset)
    const brushCanvas = document.createElement('canvas');
    const bctx = brushCanvas.getContext('2d');
    const size = Math.min(canvas.width * 0.15, 120); // Matched with original intensity
    brushCanvas.width = size;
    brushCanvas.height = size;

    // Create a rough circular gradient
    const gradient = bctx.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2);
    gradient.addColorStop(0, 'rgba(0,0,0,1)');
    gradient.addColorStop(0.6, 'rgba(0,0,0,0.8)');
    gradient.addColorStop(1, 'rgba(0,0,0,0)');
    
    bctx.fillStyle = gradient;
    bctx.beginPath();
    bctx.arc(size/2, size/2, size/2, 0, Math.PI * 2);
    bctx.fill();

    // Add some "roughness" to the brush
    for(let i = 0; i < 150; i++) {
      const x = Math.random() * size;
      const y = Math.random() * size;
      const dist = Math.sqrt(Math.pow(x - size/2, 2) + Math.pow(y - size/2, 2));
      if (dist < size/2) {
        bctx.clearRect(x, y, 2, 2); // Random cutouts for texture
      }
    }
    brushImage.current = brushCanvas;

    // Draw Pink Gradient Scratch Layer (Matching User Image)
    const bgGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    bgGradient.addColorStop(0, '#e85cc1'); 
    bgGradient.addColorStop(0.5, '#ff758c'); 
    bgGradient.addColorStop(1, '#ff8b8b'); 
    
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add "Moment Maker" Diagonal Watermark Pattern (Larger)
    const patternCanvas = document.createElement('canvas');
    const pctx = patternCanvas.getContext('2d');
    const pWidth = 400; // Increased width
    const pHeight = 250; // Increased height
    patternCanvas.width = pWidth;
    patternCanvas.height = pHeight;

    pctx.font = "bold 40px 'Outfit'"; // Much larger font
    pctx.fillStyle = "rgba(255, 255, 255, 0.08)"; // Slightly lower opacity for larger text
    pctx.textAlign = "center";
    pctx.textBaseline = "middle";
    
    // Rotate and draw text
    pctx.translate(pWidth / 2, pHeight / 2);
    pctx.rotate(-Math.PI / 8); // Slightly less rotation for larger text
    pctx.fillText("Moment Crafter", 0, 0);
    
    const pattern = ctx.createPattern(patternCanvas, 'repeat');
    ctx.fillStyle = pattern;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add texture noise
    for (let i = 0; i < 5000; i++) {
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.1})`;
      ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 1, 1);
    }

    // Centered Text Hint
    const fontSize = Math.max(22, Math.min(canvas.width * 0.08, 45)); // Dynamic font size based on container width
    ctx.font = `bold ${fontSize}px 'Outfit'`;
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)"; // White text for contrast
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    
    // Add subtle shadow to text
    ctx.shadowColor = "rgba(0, 0, 0, 0.2)";
    ctx.shadowBlur = 10;
    ctx.fillText("SCRATCH TO REVEAL ✨", canvas.width / 2, canvas.height / 2);
    ctx.shadowBlur = 0; // Reset shadow
    
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    initCanvas();
    
    const wrapper = wrapperRef.current;
    const resizeObserver = new ResizeObserver(() => {
      initCanvas();
    });
    
    if (wrapper) resizeObserver.observe(wrapper);
    
    return () => {
      if (wrapper) resizeObserver.unobserve(wrapper);
    };
  }, [initCanvas]);

  // Pixel check logic - Optimized with throttling
  const checkProgress = useCallback(() => {
    const now = Date.now();
    if (now - lastCheckTime.current < 200) return; // Only check every 200ms
    lastCheckTime.current = now;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparentPixels = 0;

    // Use a larger stride for faster checking
    const stride = 4 * 128; 
    for (let i = 0; i < pixels.length; i += stride) { 
      if (pixels[i + 3] < 128) {
        transparentPixels++;
      }
    }

    const totalCheckPixels = pixels.length / stride;
    const percentage = (transparentPixels / totalCheckPixels) * 100;

    if (percentage > 20 && !isFinished) { // Lowered to match original (15-20%)
      handleComplete();
    }
  }, [isFinished]);

  const handleComplete = () => {
    setIsFinished(true);
    const confettiCanvas = document.getElementById('scratch-confetti-canvas-2');
    if (confettiCanvas) {
      const myConfetti = confetti.create(confettiCanvas, { resize: true });
      myConfetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ff4d6d', '#ffffff', '#ff8fa3']
      });
    }
    setTimeout(() => setShowButton(true), 800);
  };

  // Interaction Handlers
  const getPos = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches ? e.touches[0] : e;
    
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (touch.clientX - rect.left) * scaleX,
      y: (touch.clientY - rect.top) * scaleY
    };
  };

  const startDrawing = (e) => {
    if (isFinished) return;
    isDrawing.current = true;
    lastPoint.current = getPos(e);
  };

  const draw = (e) => {
    if (!isDrawing.current || isFinished) return;
    e.preventDefault();

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const currentPoint = getPos(e);
    
    ctx.globalCompositeOperation = 'destination-out';
    
    // Draw using the textured brush image
    if (brushImage.current && lastPoint.current) {
      const dist = Math.sqrt(Math.pow(currentPoint.x - lastPoint.current.x, 2) + Math.pow(currentPoint.y - lastPoint.current.y, 2));
      const angle = Math.atan2(currentPoint.x - lastPoint.current.x, currentPoint.y - lastPoint.current.y);
      const brushSize = brushImage.current.width;

      // Draw brush with larger step for performance (brushSize / 4)
      const step = brushSize / 6;
      for (let i = 0; i < dist; i += step) {
        const x = lastPoint.current.x + (Math.sin(angle) * i) - brushSize / 2;
        const y = lastPoint.current.y + (Math.cos(angle) * i) - brushSize / 2;
        ctx.drawImage(brushImage.current, x, y);
      }
      
      // Final stamp at current point
      ctx.drawImage(brushImage.current, currentPoint.x - brushSize / 2, currentPoint.y - brushSize / 2);
    }

    lastPoint.current = currentPoint;
    checkProgress();
  };

  const stopDrawing = () => {
    isDrawing.current = false;
    lastPoint.current = null;
  };

  return (
    <div className="scratch-wrapper-full" ref={wrapperRef}>
      <canvas 
        id="scratch-confetti-canvas-2"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 100 }} 
      />
      <div className="reveal-content-full">
        {/* Unique Animated Background Elements */}
        <div className="mesh-gradient-wrapper">
          <div className="mesh-ball ball-1"></div>
          <div className="mesh-ball ball-2"></div>
          <div className="mesh-ball ball-3"></div>
        </div>
        
        <div className="bokeh-overlay">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="bokeh-orb"
              animate={{
                x: [0, Math.random() * 100 - 50, 0],
                y: [0, Math.random() * 100 - 50, 0],
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 5 + Math.random() * 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${100 + Math.random() * 200}px`,
                height: `${100 + Math.random() * 200}px`,
              }}
            />
          ))}
        </div>

        <div className="reveal-bg-glow"></div>
        <AnimatePresence>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="main-reveal-area"
          >
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 0.8, y: 0 }}
              transition={{ delay: 0.3 }}
              className="reveal-header-top"
            >
              FROM {senderName.toUpperCase()}
            </motion.div>

            <motion.h1 
              className="reveal-main-name"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              Not just a message...
            </motion.h1>

            <motion.div 
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "100%" }}
              transition={{ delay: 0.8, duration: 1 }}
              className="reveal-star-divider"
            >
              <div className="divider-line"></div>
              <Sparkles size={14} className="divider-star-icon" fill="currentColor" />
              <div className="divider-line"></div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
              className="reveal-pill-badge-wrapper"
            >
              <div className="badge-heart">❤️</div>
              <div className="reveal-pill-badge">
                SURPRISE FOR YOU
              </div>
            </motion.div>

            <motion.p 
              className="reveal-main-msg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 0.9, y: 0 }}
              transition={{ delay: 1.4 }}
            >
              A little piece I built for you.<br/>
              Ready for the next step?
            </motion.p>
            
            {showButton && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 200, delay: 1.7 }}
                className="reveal-btn-container"
              >
                <motion.button 
                  className="reveal-final-btn"
                  whileHover={{ scale: 1.05, boxShadow: "0 15px 40px rgba(255, 77, 109, 0.6)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onFinish}
                >
                  Let's Go <Sparkles size={20} className="btn-sparkle" />
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <canvas 
        ref={canvasRef} 
        className={`scratch-canvas-full ${isFinished ? 'fade-out' : ''}`}
        onMouseDown={startDrawing}
        onTouchStart={startDrawing}
        onMouseMove={draw}
        onTouchMove={draw}
        onMouseUp={stopDrawing}
        onMouseOut={stopDrawing}
        onTouchEnd={stopDrawing}
      />
      
    </div>
  );
};

export default Intro_ScratchCard2;
