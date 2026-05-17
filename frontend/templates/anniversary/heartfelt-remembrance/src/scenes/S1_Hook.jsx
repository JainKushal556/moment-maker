import React, { useState, useEffect } from 'react';
import './S1_Hook.css';

const LINES = [
  { id: 0, text: 'This was never just another year.',  delay: 600  },
  { id: 1, text: 'It became a collection of moments.', delay: 3200 },
];

export default function S1_Hook({ onNext }) {
  const [visible, setVisible]   = useState({});
  const [showGif, setShowGif]   = useState(false);
  const [showCTA, setShowCTA]   = useState(false);
  const [canClick, setCanClick] = useState(false);

  useEffect(() => {
    const timers = [
      setTimeout(() => setShowGif(true),    300),
      setTimeout(() => setVisible(v => ({ ...v, 0: true })), 1500),
      setTimeout(() => setVisible(v => ({ ...v, 1: true })), 4000),
      setTimeout(() => setShowCTA(true),    6500),
      setTimeout(() => setCanClick(true),   6500),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="s1-scene" onClick={canClick ? onNext : undefined}>
      {/* Background */}
      <div className="bg-base" />
      <div className="bg-dark-overlay" />
      <div className="bg-grain" />

      {/* Ambient glow */}
      <div className="s1-glow" />

      {/* Particles */}
      <div className="particles">
        {[...Array(20)].map((_, i) => (
          <span key={i} className="particle" style={{
            left: `${Math.random() * 100}%`,
            top:  `${80 + Math.random() * 20}%`,
            animationDelay: `${Math.random() * 8}s`,
            animationDuration: `${10 + Math.random() * 8}s`,
          }} />
        ))}
      </div>

      {/* Text + GIF layout */}
      <div className="s1-content">

        {/* ════════════════════════════════════════
            GIF SLOT — place your GIF in /public/
            and change the src below.
            Recommended size: 180×180px
            ════════════════════════════════════════ */}
        <div className={`s1-gif-wrap ${showGif ? 'in' : ''}`}>
          <img
            src="/templates/anniversary/heartfelt-remembrance/peach-and-goma.webp"
            alt="character"
            className="s1-gif"
            onError={e => { e.target.style.display = 'none'; }}
          />
          {/* ↑ If file not found, GIF hides itself automatically */}
        </div>

        {/* Lines */}
        {LINES.map(({ id, text }) => (
          <p key={id} className={`s1-line ${visible[id] ? 'in' : ''}`}>
            {text}
          </p>
        ))}

        {/* CTA */}
        <p className={`s1-line s1-cta ${showCTA ? 'in' : ''}`}>
          touch gently.
        </p>

      </div>
    </div>
  );
}
