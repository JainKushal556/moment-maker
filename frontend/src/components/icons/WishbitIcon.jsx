import React from 'react';
import wishbitImg from '../../assets/wishbit.png';

const WishbitIcon = ({ size = 24, className = "" }) => {
  return (
    <div 
      className={`inline-flex items-center justify-center select-none pointer-events-none ${className}`}
      style={{ width: size, height: size }}
    >
      <img 
        src={wishbitImg} 
        alt="Wishbit" 
        draggable="false"
        onContextMenu={(e) => e.preventDefault()}
        className="w-full h-full object-contain pointer-events-none select-none"
        style={{ filter: 'drop-shadow(0 0 8px rgba(217, 70, 239, 0.3))' }}
      />
    </div>
  );
};

export default WishbitIcon;
