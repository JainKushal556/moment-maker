import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import Background from './components/Background';
import Loader from './components/Loader';
import Greeting from './components/Greeting';
import PhotosLetter from './components/PhotosLetter';
import Letter from './components/Letter';
import Question from './components/Question';
import Final from './components/Final';

function App() {
  const [stage, setStage] = useState('loader');
  const audioRef = useRef(null);

  // Customization State
  const [selectedFontSet, setSelectedFontSet] = useState('set1');
  const [letterBody, setLetterBody] = useState("In your smile, I find my home. You are the first thing I think of when I wake up and the last before I fall asleep. You are my peace, my joy, and the soul I always searched for.\n\nEvery moment with you is a gift I promise to never take for granted. Thank you for being my safe place and the best part of my world. I will cherish you, always.");
  const [locationName, setLocationName] = useState('Taj Hotel');
  const [images, setImages] = useState([
    '/templates/proposal/charming-proposal/images/memory1.png',
    '/templates/proposal/charming-proposal/images/memory2.png',
    '/templates/proposal/charming-proposal/images/memory3.png',
    '/templates/proposal/charming-proposal/images/memory4.png'
  ]);

  useEffect(() => {
    audioRef.current = new Audio('music/bgm.mp3');
    audioRef.current.loop = true;
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  useEffect(() => {
    const handleMessage = (e) => {
      if (e.data?.type === 'customize') {
        const { selectedFontSet, letterBody, locationName, images } = e.data;
        if (selectedFontSet !== undefined) setSelectedFontSet(selectedFontSet);
        if (letterBody !== undefined) setLetterBody(letterBody);
        if (locationName !== undefined) setLocationName(locationName);
        if (images !== undefined && Array.isArray(images)) setImages(images);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleStart = () => {
    if (audioRef.current) {
      audioRef.current.volume = 0.5;
      audioRef.current.play().catch(e => console.log("Audio autoplay prevented", e));
    }
    setStage('greeting');
  };

  const themeClass = `theme-${selectedFontSet.replace('set', '') === '1' ? 'classic' : selectedFontSet.replace('set', '') === '2' ? 'modern' : selectedFontSet.replace('set', '') === '3' ? 'whimsical' : 'royal'}`;

  return (
    <div className={`min-h-screen w-screen relative overflow-hidden ${themeClass}`}>
      <Background />

      <div className="relative z-10 h-full w-full">
        <AnimatePresence mode="wait">
          {stage === 'loader' && <Loader key="loader" onComplete={handleStart} />}
          {stage === 'greeting' && <Greeting key="greeting" onNext={() => setStage('gallery')} />}
          {stage === 'gallery' && <PhotosLetter key="gallery" images={images} onNext={() => setStage('letter')} />}
          {stage === 'letter' && <Letter key="letter" body={letterBody} onNext={() => setStage('buildup')} />}
          {stage === 'buildup' && <Question key="buildup" onNext={() => setStage('final')} />}
          {stage === 'final' && <Final key="final" locationName={locationName} />}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;
