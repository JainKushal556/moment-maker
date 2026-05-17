import React, { useState, useEffect } from 'react';
import { CONFIG } from '../config';
import './S8_Letter.css';

export default function S8_Letter({ onNext, finalLetter }) {
  const [displayed, setDisplayed] = useState([]);
  const [showArrow, setShowArrow] = useState(false);
  const lines = finalLetter || CONFIG.finalLetter;

  useEffect(() => {
    let current = 0;
    const revealNext = () => {
      if (current >= lines.length) {
        setTimeout(() => setShowArrow(true), 800);
        return;
      }
      setDisplayed(d => [...d, current]);
      current++;
      const delay = lines[current - 1] === '' ? 600 : 1400;
      setTimeout(revealNext, delay);
    };
    const start = setTimeout(revealNext, 600);
    return () => clearTimeout(start);
  }, []);

  return (
    <div className="s8-scene">
      <div className="bg-base" />
      <div className="bg-dark-overlay" />
      <div className="bg-grain" />

      <div className="s8-letter-container">
        {/* Decorative Torn Paper Behind */}
        <div className="s8-torn-paper" />

        <div className="s8-paper">
          {/* Tape at top */}
          <div className="s8-tape-top" />

          {/* Flower on the left */}
          <div className="s8-flower-dec">
            <img src="/templates/anniversary/heartfelt-remembrance/flower.png" alt="flower" className="s8-flower-img" />
            <div className="s8-flower-tape" />
          </div>

          <div className="s8-paper-inner">
            <div className="s8-paper-top">
              <i className="s8-heart">♥</i>
            </div>

            <div className="s8-letter-body">
              {lines.map((line, i) => (
                <p
                  key={i}
                  className={`s8-line ${line === '' ? 'spacer' : ''} ${displayed.includes(i) ? 'in' : ''}`}
                >
                  {line}
                </p>
              ))}
            </div>

            <p className={`s8-sig-text ${showArrow ? 'in' : ''}`}>
              with everything I have ♥
            </p>
          </div>
        </div>

        {/* Circular Next Button below */}
        <div className={`s8-next-wrap ${showArrow ? 'in' : ''}`}>
          <button className="s8-next-btn" onClick={onNext}>
            <span className="s8-arrow-icon">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}
