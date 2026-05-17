import React, { useState } from 'react';
import { CONFIG } from '../config';
import './S4_Timeline.css';

export default function S4_Timeline({ onNext, memories }) {
  const [active, setActive] = useState(0);
  const mem = memories || CONFIG.memories;

  const goNext = () => {
    if (active < mem.length - 1) setActive(a => a + 1);
    else onNext();
  };
  const goPrev = () => setActive(a => Math.max(0, a - 1));

  const m = mem[active];

  return (
    <div className={`s4-scene ${m.isDark ? 'dark-variant' : ''}`}>
      <div className="bg-base" />
      <div className="bg-dark-overlay" />
      <div className="bg-grain" />

      <div className="s4-wrapper">

        {/* Scene counter */}
        <div className="s4-counter">
          {mem.map((_, i) => (
            <span key={i} className={`s4-dot ${i === active ? 'active' : ''}`} />
          ))}
        </div>

        {/* Memory card */}
        <div className={`s4-card ${m.isDark ? 'dark' : ''}`} key={active}>
          {/* Top Tape */}
          <div className="s4-top-tape" />

          <div className="s4-card-top">
            <span className="s4-date">{m.date}</span>
            <span className="gold-rule long" />
          </div>

          <h2 className="s4-headline">{m.headline}</h2>

          <p className="s4-subtext">
            {m.subtext.split('\n').map((l, i) => (
              <span key={i}>{l}<br /></span>
            ))}
          </p>

          {/* Image / GIF slot */}
          {m.hasImage && (
            <div className="s4-img-slot">
              {m.imagePath
                ? <img src={m.imagePath} alt="memory" className="s4-img" style={m.imageStyle} />
                : <div className="s4-img-placeholder">
                    <span>📷 add your photo here</span>
                  </div>
              }
            </div>
          )}

          {/* Bottom section with text and arrow */}
          <div className="s4-card-bottom">
            <p className="s4-bottom-text">
              {m.bottomText ? m.bottomText.split('\n').map((l, i) => <span key={i}>{l}<br/></span>) : null}
            </p>
            <div className="s4-nav-inside">
              {active > 0 && <button className="s4-nav-btn prev" onClick={goPrev}>←</button>}
              <div className="s4-next-wrap">
                <button 
                  className={`s4-nav-btn next round ${active === mem.length - 1 ? 'last-btn' : ''}`} 
                  onClick={goNext}
                >
                  {active === mem.length - 1 && <span className="btn-text">Try Your Luck</span>}
                  <span className="btn-icon">→</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
