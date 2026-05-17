import React, { useRef, useState, useEffect } from 'react';
import './MagneticButton.css';

const MagneticButton = ({ children, onClick }) => {
  const buttonRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = buttonRef.current.getBoundingClientRect();
    const x = (clientX - (left + width / 2)) * 0.35;
    const y = (clientY - (top + height / 2)) * 0.35;
    setPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
    setIsHovered(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  return (
    <div className="button-wrapper">
      <button
        ref={buttonRef}
        className={`magnetic-button ${isHovered ? 'hovered' : ''}`}
        style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
      >
        <span className="button-text">{children}</span>
        <div className="button-glow"></div>
      </button>
      <div className={`button-particles ${isHovered ? 'active' : ''}`}>
        {[...Array(6)].map((_, i) => (
          <div key={i} className={`btn-particle p-${i}`}></div>
        ))}
      </div>
    </div>
  );
};

export default MagneticButton;
