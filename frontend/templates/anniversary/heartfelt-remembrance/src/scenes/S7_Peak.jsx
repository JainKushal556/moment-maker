import React, { useState, useEffect } from 'react';
import './S7_Peak.css';

const LINES = [
  { text: 'If life erased everything,', delay: 800 },
  { text: "I'd still search for you again.", delay: 2600 },
  { text: '', delay: 4200 },
  { text: 'Out of every version of this life,', delay: 4800 },
  { text: 'this became my favorite one.', delay: 6400 },
];

export default function S7_Peak({ onNext }) {
  const [visible, setVisible] = useState({});
  const [showArrow, setShowArrow] = useState(false);

  useEffect(() => {
    const timers = LINES.map(({ delay }, i) =>
      setTimeout(() => setVisible(v => ({ ...v, [i]: true })), delay)
    );
    const arrowTimer = setTimeout(() => setShowArrow(true), 8200);
    return () => { timers.forEach(clearTimeout); clearTimeout(arrowTimer); };
  }, []);

  return (
    <div className="s7-scene">
      {/* Near-black background — no background image here, pure darkness */}
      <div className="s7-bg" />
      <div className="bg-grain" />

      {/* Tiny ambient particles */}
      <div className="particles">
        {[...Array(12)].map((_, i) => (
          <span key={i} className="particle" style={{
            left: `${Math.random() * 100}%`,
            top:  `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 10}s`,
            animationDuration: `${14 + Math.random() * 8}s`,
            background: 'var(--rose)',
            opacity: 0.4,
          }} />
        ))}
      </div>

      <div className="s7-content">
        {LINES.map(({ text }, i) =>
          text ? (
            <p key={i} className={`s7-line ${visible[i] ? 'in' : ''}`}>
              {text}
            </p>
          ) : (
            <div key={i} className={`s7-divider ${visible[i] ? 'in' : ''}`}>
              <span className="gold-rule" />
            </div>
          )
        )}

        <div className={`s7-arrow ${showArrow ? 'in' : ''}`}>
          <button className="arrow-btn" onClick={onNext}>
            <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
}
