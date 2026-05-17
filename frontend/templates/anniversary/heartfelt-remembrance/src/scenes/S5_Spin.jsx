import React, { useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import { CONFIG } from '../config';
import './S5_Spin.css';

const SEG = CONFIG.spinSegments;
const COLORS = ['#e28a99','#e4b568','#9eab65','#7ba0c0','#9484b1','#e6929c'];

export default function S5_Spin({ onNext }) {
  const [spinning, setSpinning]   = useState(false);
  const [result, setResult]       = useState(null);
  const [rotation, setRotation]   = useState(0);
  const [showCard, setShowCard]   = useState(false);
  const [wonPrize, setWonPrize]   = useState(null);
  const spinsRef = useRef(0);
  const luckCounter = useRef(0);

  const PRIZES = [
    { 
      id: 'shopping',
      title: 'A Shopping Date', 
      sub: '(meaning unlimited shopping ✨)', 
      img: '/templates/anniversary/heartfelt-remembrance/bubududu.webp' 
    },
    { 
      id: 'dinner',
      title: 'A Dinner Date', 
      sub: '(at your favorite place 🥂)', 
      img: '/templates/anniversary/heartfelt-remembrance/party.webp' 
    },
    {
      id: 'luck',
      title: 'Better luck next time!',
      sub: '(maybe spin again? 🙈)',
      img: '/templates/anniversary/heartfelt-remembrance/betterluck.webp'
    },
    {
      id: 'movie',
      title: 'A Movie Date',
      sub: '(popcorn and cuddles included 🍿)',
      img: '/templates/anniversary/heartfelt-remembrance/movie.gif'
    },
    {
      id: 'ride',
      title: 'A Special Ride!',
      sub: '(I will be your horse, ride on me! 🐎)',
      img: '/templates/anniversary/heartfelt-remembrance/riding.gif'
    }
  ];

  const spin = () => {
    if (spinning || showCard) return;
    setResult(null);
    setSpinning(true);

    let landIdx = Math.floor(Math.random() * SEG.length);
    let prize = PRIZES[landIdx % PRIZES.length];

    // Luck limit: No more than 2 'luck' in a row
    if (prize.id === 'luck') {
      luckCounter.current++;
      if (luckCounter.current > 2) {
        const nonLuckIdx = SEG.map((_, i) => i).filter(i => PRIZES[i % PRIZES.length].id !== 'luck');
        landIdx = nonLuckIdx[Math.floor(Math.random() * nonLuckIdx.length)];
        prize = PRIZES[landIdx % PRIZES.length];
        luckCounter.current = 0;
      }
    } else {
      luckCounter.current = 0;
    }

    const extra     = 1800 + Math.random() * 1440; 
    const segAngle  = 360 / SEG.length;
    const landAngle = 360 - (landIdx * segAngle + segAngle / 2);
    const newRot    = rotation + extra + landAngle - (rotation % 360);

    setRotation(newRot);
    setTimeout(() => {
      setSpinning(false);
      setResult(SEG[landIdx]);
      setWonPrize(prize);
      setTimeout(() => {
        setShowCard(true);
        if (prize.id !== 'luck') {
          confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#e28a99', '#e4b568', '#9eab65', '#7ba0c0', '#9484b1', '#e6929c']
          });
        }
      }, 400);
    }, 3500);
    spinsRef.current++;
  };

  const closeCard = () => { setShowCard(false); setResult(null); };

  return (
    <div className="s5-scene">
      <div className="bg-base" />
      <div className="bg-dark-overlay" />
      <div className="bg-grain" />

      <div className="s5-spin-card">
        {/* Decorative Flower */}
        <div className="s5-flower-dec">
          <div className="s5-flower-tape" />
          <img src="/templates/anniversary/heartfelt-remembrance/flower.png" alt="flower" className="s5-flower-img" />
        </div>

        {/* Card fold */}
        <div className="s5-fold" />

        <div className="s5-content">
          <div className="s5-header reveal in">
            <p className="s5-eyebrow">spin to reveal</p>
            <div className="s5-tiny-heart">♥</div>
          </div>
          <h2 className="s5-title reveal in">A Wheel of Rewards</h2>

        {/* Wheel */}
        <div className="s5-wheel-wrap">
          <div className="s5-pointer">
            <svg viewBox="0 0 24 24" fill="var(--rose)"><path d="M12 21l-12-18h24z"/></svg>
          </div>
          <svg
            className="s5-wheel"
            viewBox="0 0 300 300"
            style={{ transform: `rotate(${rotation}deg)`, transition: spinning ? 'transform 3.5s cubic-bezier(0.17,0.67,0.12,1)' : 'none' }}
          >
            {SEG.map((seg, i) => {
              const angle   = (360 / SEG.length);
              const start   = i * angle;
              const end     = start + angle;
              const startRad = (start - 90) * Math.PI / 180;
              const endRad   = (end   - 90) * Math.PI / 180;
              const x1 = 150 + 140 * Math.cos(startRad);
              const y1 = 150 + 140 * Math.sin(startRad);
              const x2 = 150 + 140 * Math.cos(endRad);
              const y2 = 150 + 140 * Math.sin(endRad);
              const midRad = ((start + end) / 2 - 90) * Math.PI / 180;
              const tx = 150 + 90 * Math.cos(midRad);
              const ty = 150 + 90 * Math.sin(midRad);
              return (
                <g key={i}>
                  <path
                    d={`M150,150 L${x1},${y1} A140,140 0 0,1 ${x2},${y2} Z`}
                    fill={COLORS[i % COLORS.length]}
                    opacity={0.85}
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="1"
                  />
                  <text
                    x={tx} y={ty}
                    textAnchor="middle" dominantBaseline="middle"
                    fontSize="11" fill="rgba(255,255,255,0.9)"
                    transform={`rotate(${start + angle / 2}, ${tx}, ${ty})`}
                    fontFamily="Outfit, sans-serif"
                  >
                    {seg.emoji}
                  </text>
                </g>
              );
            })}
            {/* Center hub */}
            <circle cx="150" cy="150" r="24" fill="#faf4f5" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.15))" />
            <text x="150" y="152" textAnchor="middle" dominantBaseline="middle" fontSize="18" fill="var(--rose)">♥</text>
          </svg>
        </div>

        {/* Action Area */}
        <div className="s5-action-area">
          <div className="s5-spin-row">
            <button className={`s5-spin-btn ${spinning ? 'spinning' : ''}`} onClick={spin} disabled={spinning}>
              {spinning ? 'SPINNING...' : spinsRef.current > 0 && !result ? 'SPIN AGAIN' : 'SPIN'}
            </button>
            <span className="s5-curvy-arrow">⤴</span>
          </div>
          <p className="s5-action-hint">Click to spin the wheel</p>
        </div>
        </div> {/* Closes .s5-content */}

        {/* Skip */}
        <button className="s5-skip" onClick={onNext}>Skip</button>
      </div>

      {/* Result card overlay */}
      {showCard && result && (
        <div className="s5-card-overlay" onClick={closeCard}>
          <div className="s5-result-wrapper" onClick={e => e.stopPropagation()}>
            <div className="s5-result-card">
              <div className="s5-result-emoji" style={{ marginBottom: '16px' }}>
                <img src={wonPrize?.img} alt="Winner" style={{ width: '140px', borderRadius: '12px' }} />
              </div>
              <p className="s5-result-label">you won!</p>
              <div className="gold-rule center long" style={{margin:'14px auto'}} />
              <p className="s5-result-text">
                {wonPrize?.title}<br/>
                <span style={{ fontSize: '1rem', color: 'var(--rose)', fontStyle: 'normal' }}>
                  {wonPrize?.sub}
                </span>
              </p>
              
            <div className="s5-card-actions">
                <div className="s5-ss-area">
                  {wonPrize?.id !== 'luck' && (
                    <>
                      <div className="s5-ss-text-wrap">
                        <p className="s5-ss-text">Take a screenshot to prove your reward, okay? 😉</p>
                        {/* Screenshot GIF near the line */}
                        <div className="s5-side-gif">
                          <img src="/templates/anniversary/heartfelt-remembrance/ss.webp" alt="Screenshot" />
                        </div>
                      </div>
                      <button className="s5-final-next" onClick={onNext}>Continue →</button>
                    </>
                  )}
                  {wonPrize?.id === 'luck' && (
                    <button className="s5-final-next" onClick={closeCard}>Try Again ↩</button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Decorative Whelle at bottom right */}
      <div className="s5-extra-dec">
        <img src="/templates/anniversary/heartfelt-remembrance/whelle.webp" alt="decoration" />
      </div>
    </div>
  );
}
