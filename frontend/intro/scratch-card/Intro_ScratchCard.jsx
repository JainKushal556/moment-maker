import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import './Intro_ScratchCard.css';

const Intro_ScratchCard = ({ senderName, onFinish }) => {
  const canvasRef = useRef(null);
  const wrapperRef = useRef(null);
  const isDrawingRef = useRef(false);
  const lastPosRef = useRef({ x: 0, y: 0 });
  const [isFinished, setIsFinished] = useState(false);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    const wrapper = wrapperRef.current;
    
    const handleResize = () => {
      if (!wrapper) return;
      canvas.width = wrapper.clientWidth;
      canvas.height = wrapper.clientHeight;
      drawMetallicLayer(ctx, canvas.width, canvas.height);
    };

    const drawMetallicLayer = (context, w, h) => {
      const gradient = context.createLinearGradient(0, 0, w, h);
      gradient.addColorStop(0, '#1e3a8a'); // Deep blue
      gradient.addColorStop(0.3, '#3b82f6'); // Lighter blue
      gradient.addColorStop(0.5, '#60a5fa'); 
      gradient.addColorStop(0.7, '#3b82f6');
      gradient.addColorStop(1, '#1e3a8a');
      
      context.fillStyle = gradient;
      context.fillRect(0, 0, w, h);

      for (let i = 0; i < 2000; i++) {
        context.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.15})`;
        context.beginPath();
        context.arc(Math.random() * w, Math.random() * h, Math.random() * 2.5, 0, Math.PI * 2);
        context.fill();
      }

      // Draw center text
      context.font = `bold clamp(25px, 6cqw, 50px) 'Quicksand', sans-serif`;
      context.fillStyle = "rgba(255,255,255,0.9)";
      context.textAlign = "center";
      context.fillText("SCRATCH TO REVEAL!", w / 2, h / 2);
    };

    const getCoordinates = (e) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      
      // Calculate scale factors if the canvas CSS size doesn't match its attribute size
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      
      return {
        x: (clientX - rect.left) * scaleX,
        y: (clientY - rect.top) * scaleY
      };
    };

    const startDrawing = (e) => {
      if (isFinished) return;
      isDrawingRef.current = true;
      lastPosRef.current = getCoordinates(e);
    };

    const draw = (e) => {
      if (!isDrawingRef.current || isFinished) return;
      if (e.cancelable) e.preventDefault();
      
      const currentPos = getCoordinates(e);
      
      context.globalCompositeOperation = 'destination-out';
      context.beginPath();
      context.moveTo(lastPosRef.current.x, lastPosRef.current.y);
      context.lineTo(currentPos.x, currentPos.y);
      
      context.lineWidth = Math.min(canvas.width * 0.15, 120); 
      context.lineCap = 'round';
      context.lineJoin = 'round';
      context.stroke();

      lastPosRef.current = currentPos;
    };

    const stopDrawing = () => {
      if (!isDrawingRef.current) return;
      isDrawingRef.current = false;
      checkScratchPercentage();
    };

    const checkScratchPercentage = () => {
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;
      let transparentPixels = 0;
      
      for (let i = 3; i < pixels.length; i += 32) {
        if (pixels[i] < 128) {
          transparentPixels++;
        }
      }
      
      const totalPixelsChecked = pixels.length / 32;
      const percentCleared = (transparentPixels / totalPixelsChecked) * 100;

      if (percentCleared > 15) {
        triggerReveal();
      }
    };

    const triggerReveal = () => {
      setIsFinished(true);
      
      const confettiCanvas = document.getElementById('scratch-confetti-canvas');
      if (confettiCanvas) {
        const myConfetti = confetti.create(confettiCanvas, { resize: true });
        myConfetti({
          particleCount: 150,
          spread: 100,
          origin: { y: 0.5 },
          colors: ['#ff4d4d', '#f59e0b', '#22d3ee', '#ffffff']
        });
      }

      setTimeout(() => setShowButton(true), 400);
    };

    const context = ctx; // for compatibility with names inside
    handleResize();

    // Use ResizeObserver for accurate container dimensions
    const resizeObserver = new ResizeObserver(() => {
        handleResize();
    });
    if (wrapper) resizeObserver.observe(wrapper);

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseleave', stopDrawing);

    canvas.addEventListener('touchstart', startDrawing, { passive: false });
    canvas.addEventListener('touchmove', draw, { passive: false });
    canvas.addEventListener('touchend', stopDrawing);

    return () => {
      if (wrapper) resizeObserver.unobserve(wrapper);
      canvas.removeEventListener('mousedown', startDrawing);
      canvas.removeEventListener('mousemove', draw);
      canvas.removeEventListener('mouseup', stopDrawing);
      canvas.removeEventListener('mouseleave', stopDrawing);
      canvas.removeEventListener('touchstart', startDrawing);
      canvas.removeEventListener('touchmove', draw);
      canvas.removeEventListener('touchend', stopDrawing);
    };
  }, [isFinished]);

  return (
    <div className="scratch-wrapper-full" ref={wrapperRef}>
      <canvas 
        id="scratch-confetti-canvas"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 100 }} 
      />
      <div className="reveal-content-full">
        <AnimatePresence>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="message-area-full"
          >
            <h1 className="full-name">Hi! It's <span>{senderName}</span></h1>
            <div className="full-divider"></div>
            <p className="full-msg">
              There is something special for you inside.<br/>
              Let's open it and see!
            </p>
            
            {showButton && (
              <motion.button 
                className="full-reveal-btn"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05 }}
                onClick={onFinish}
              >
                Enter Surprise <Sparkles size={24} />
              </motion.button>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <canvas 
        ref={canvasRef} 
        className={`scratch-canvas-full ${isFinished ? 'hidden' : ''}`}
      />
    </div>
  );
};

export default Intro_ScratchCard;
