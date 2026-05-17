import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { CONFIG } from '../config';
import './S9_End.css';

export default function S9_End({ moments, anniversaryDate, memories }) {
  const activeMoments = moments !== undefined ? moments : CONFIG.moments;
  const activeAnniversaryDate = anniversaryDate !== undefined ? anniversaryDate : CONFIG.anniversaryDate;
  const activeMemories = memories !== undefined ? memories : CONFIG.memories;
  const [show, setShow]       = useState(false);
  const [showSub, setShowSub] = useState(false);
  const [trail, setTrail]     = useState([]);

  useEffect(() => {
    // Signal parent platform that template is completed and customizer buttons can be unlocked
    window.parent.postMessage({ type: 'TEMPLATE_COMPLETED' }, '*');

    // Popper blast on entry
    confetti({
      particleCount: 180,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#e07a90', '#c9a46c', '#ffffff', '#fdf4e7'],
      ticks: 300
    });

    const t = [
      setTimeout(() => setShow(true),    600),
      setTimeout(() => setShowSub(true), 2400),
    ];
    return () => t.forEach(clearTimeout);
  }, []);

  const lastSpawnTime = useRef(0);

  const handleMouseMove = (e) => {
    const now = Date.now();
    // Only spawn one image every 1 second (1000ms)
    if (now - lastSpawnTime.current > 500) {
      // Extract images from the memories timeline dynamically
      let imgs = activeMemories.filter(m => m.hasImage && m.imagePath).map(m => m.imagePath);
      // Fallback if no timeline images are available
      if (imgs.length === 0) imgs = ['/templates/anniversary/heartfelt-remembrance/flower.png'];
      const newImg = {
        id: Math.random(),
        x: e.clientX,
        y: e.clientY,
        src: imgs[Math.floor(Math.random() * imgs.length)],
        rot: Math.random() * 20 - 10
      };
      setTrail(prev => [...prev.slice(-5), newImg]);
      lastSpawnTime.current = now;
      
      // Auto remove after animation
      setTimeout(() => {
        setTrail(prev => prev.filter(img => img.id !== newImg.id));
      }, 3000); 
    }
  };

  const handleTouchMove = (e) => {
    const touch = e.touches[0];
    handleMouseMove({ clientX: touch.clientX, clientY: touch.clientY });
  };

  return (
    <div 
      className="s9-scene" 
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
    >
      <div className="s9-bg" />
      <div className="bg-grain" />

      {/* Interactive Memory Trail */}
      {trail.map(img => (
        <div 
          key={img.id}
          className="s9-trail-img"
          style={{ 
            left: img.x, 
            top: img.y,
            transform: `translate(-50%, -50%) rotate(${img.rot}deg)`
          }}
        >
          <img src={img.src} alt="" />
        </div>
      ))}

      {/* Fading particles */}
      <div className="particles">
        {[...Array(18)].map((_, i) => (
          <span key={i} className="particle" style={{
            left: `${Math.random() * 100}%`,
            top:  `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 6}s`,
            animationDuration: `${14 + Math.random() * 10}s`,
            background: i % 2 === 0 ? 'var(--rose)' : 'var(--gold)',
          }} />
        ))}
      </div>

      <div className="s9-content">
        <h1 className={`s9-happy ${show ? 'in' : ''}`}>
          HAPPY ANNIVERSARY
        </h1>

        <p className={`s9-main ${showSub ? 'in' : ''}`}>
          {activeMoments} beautiful moments...
        </p>
        <p className={`s9-sub ${showSub ? 'in' : ''}`}>
          and a lifetime to go.
        </p>

        <div className={`s9-ornament ${showSub ? 'in' : ''}`}>
          <span className="gold-rule long" />
          <i className="s9-heart">♥</i>
          <span className="gold-rule long" />
        </div>

        <p className={`s9-date ${showSub ? 'in' : ''}`}>
          {activeAnniversaryDate}
        </p>

        {/* Interaction Hint */}
        <div className={`s9-hint ${showSub ? 'in' : ''}`}>
          <span className="s9-hint-desktop">move mouse to reveal memories</span>
          <span className="s9-hint-mobile">slide finger to reveal memories</span>
        </div>
      </div>
    </div>
  );
}
