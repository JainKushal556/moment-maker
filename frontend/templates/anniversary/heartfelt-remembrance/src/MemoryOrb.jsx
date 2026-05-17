import React from 'react';
import './MemoryOrb.css';

const MemoryOrb = ({ isHovered, isPressing }) => {
  return (
    <div className={`orb-container ${isPressing ? 'pressing' : ''}`}>
      <div className="orb-glow-outer"></div>
      <div className="orb-main">
        <div className="orb-inner-fog"></div>
        <div className="orb-inner-shimmer"></div>
        <div className="orb-light-streak"></div>
        
        {/* Memory Fragments */}
        <div className="orb-fragments">
          {[...Array(6)].map((_, i) => (
            <div key={i} className={`fragment f-${i}`}></div>
          ))}
        </div>

        <div className="orb-particles">
          {[...Array(12)].map((_, i) => (
            <div key={i} className={`orb-particle p-${i}`}></div>
          ))}
        </div>
      </div>
      
      {/* Interactive Proximity Glow */}
      <div className={`orb-proximity-glow ${isHovered ? 'active' : ''}`}></div>
    </div>
  );
};

export default MemoryOrb;
