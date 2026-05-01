import React, { useEffect, useRef } from 'react';

const MusicPlayer = ({ shouldPlay }) => {
  const audioRef = useRef(null);

  useEffect(() => {
    if (shouldPlay && audioRef.current) {
      audioRef.current.volume = 0.8;
      audioRef.current.play().catch(console.log);
    }
  }, [shouldPlay]);

  return (
    <audio ref={audioRef} loop preload="auto">
      <source src="audio/bg.mp3" type="audio/mpeg" />
    </audio>
  );
};

export default MusicPlayer;
