import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { CONFIG } from '../config';
import './S2_Quiz.css';

export default function S2_Quiz({ onNext }) {
  const [selected, setSelected] = useState(null);
  const [shake, setShake]       = useState(false);
  const [correct, setCorrect]   = useState(false);
  const [showWrongOverlay, setShowWrongOverlay] = useState(false);
  const [showCorrectOverlay, setShowCorrectOverlay] = useState(false);

  const handlePick = (opt) => {
    if (correct || showWrongOverlay || showCorrectOverlay) return;
    setSelected(opt);
    if (opt === CONFIG.quizCorrect) {
      setCorrect(true);
      // Popper fatbe
      confetti({
        particleCount: 200,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#e07a90', '#c9a46c', '#ffffff', '#fdf4e7'],
        ticks: 300
      });
      setShowCorrectOverlay(true);
      setTimeout(onNext, 4000);
    } else {
      setShake(true);
      setShowWrongOverlay(true);
      setTimeout(() => setShake(false), 600);
      // Auto-hide the overlay after 6 seconds (increased as requested)
      setTimeout(() => setShowWrongOverlay(false), 6000);
    }
  };

  return (
    <div className="s2-scene">
      <div className="bg-base" />
      <div className="bg-dark-overlay" />
      <div className="bg-grain" />

      {/* Particles */}
      <div className="particles">
        {[...Array(15)].map((_, i) => (
          <span key={i} className="particle" style={{
            left: `${Math.random() * 100}%`,
            top:  `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 6}s`,
            animationDuration: `${10 + Math.random() * 6}s`,
          }} />
        ))}
      </div>

      <div className={`s2-card ${shake ? 'shake' : ''} ${correct ? 'correct' : ''}`}>
        {/* Top ornament */}
        <div className="s2-top-ornament">
          <span className="gold-rule" />
          <span className="s2-label">a small question</span>
          <span className="gold-rule" />
        </div>

        <h2 className="s2-question">Do you remember what today is?</h2>

        <div className="s2-options">
          {CONFIG.quizOptions.map(opt => (
            <button
              key={opt}
              className={`s2-option
                ${selected === opt && opt !== CONFIG.quizCorrect ? 'wrong' : ''}
                ${opt === CONFIG.quizCorrect && (selected || correct) ? 'right' : ''}
              `}
              onClick={() => handlePick(opt)}
            >
              {opt}
            </button>
          ))}
        </div>

        {/* Feedback */}
        {selected && !correct && (
          <p className="s2-feedback wrong-msg">hmm… not quite. try again 🌹</p>
        )}
        {correct && (
          <p className="s2-feedback right-msg">yes. ✦ you remember.</p>
        )}
      </div>

      {/* Wrong Answer Full Screen Overlay */}
      {showWrongOverlay && (
        <div className="s2-wrong-overlay">
          <div className="s2-wrong-content">
            <img src="/templates/anniversary/heartfelt-remembrance/wrong.gif" alt="Wrong!" className="s2-wrong-gif" />
            <h2 className="s2-wrong-text">
              Why did you give the wrong answer? 🙄<br/>
              <button className="s2-try-again-btn" onClick={() => setShowWrongOverlay(false)}>
                Try again!
              </button>
            </h2>
          </div>
        </div>
      )}

      {/* Correct Answer Full Screen Overlay */}
      {showCorrectOverlay && (
        <div className="s2-correct-overlay">
          <div className="s2-correct-content">
            <img src="/templates/anniversary/heartfelt-remembrance/answer.webp" alt="Correct!" className="s2-correct-gif" />
            <h2 className="s2-correct-text">
              Yes, you remember! ✨<br/>
            </h2>
          </div>
        </div>
      )}
    </div>
  );
}
