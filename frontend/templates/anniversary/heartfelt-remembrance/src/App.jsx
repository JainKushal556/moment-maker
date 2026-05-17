import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { CONFIG } from './config';
import S1_Hook     from './scenes/S1_Hook';
import S2_Quiz     from './scenes/S2_Quiz';
import S4_Timeline from './scenes/S4_Timeline';
import S5_Spin     from './scenes/S5_Spin';
import S7_Peak     from './scenes/S7_Peak';
import S8_Letter   from './scenes/S8_Letter';
import S9_End      from './scenes/S9_End';
import './index.css';

const SCENES = [
  S1_Hook,
  S2_Quiz,
  S4_Timeline,
  S5_Spin,
  S7_Peak,
  S8_Letter,
  S9_End,
];

const fontSets = {
  set1: {
    serif: "'Cormorant Garamond', serif",
    script: "'Dancing Script', cursive",
    ui: "'Outfit', sans-serif"
  },
  set2: {
    serif: "'Playfair Display', serif",
    script: "'Great Vibes', cursive",
    ui: "'Montserrat', sans-serif"
  },
  set3: {
    serif: "'EB Garamond', serif",
    script: "'Alex Brush', cursive",
    ui: "'Poppins', sans-serif"
  },
  set4: {
    serif: "'Libre Baskerville', serif",
    script: "'Petit Formal Script', cursive",
    ui: "'Open Sans', sans-serif"
  }
};

export default function App() {
  const [current, setCurrent]         = useState(0);
  const [flashing, setFlashing]       = useState(false);
  const [selectedFontSet, setSelectedFontSet] = useState('set1');
  const [partnerName, setPartnerName] = useState(CONFIG.partnerName);
  const [anniversaryDate, setAnniversaryDate] = useState(CONFIG.anniversaryDate);
  const [moments, setMoments] = useState(CONFIG.moments);
  const [timelineImages, setTimelineImages] = useState(() => CONFIG.memories.map(m => m.imagePath));
  const [memDates, setMemDates] = useState(() => CONFIG.memories.map(m => m.date));
  const [memHeadlines, setMemHeadlines] = useState(() => CONFIG.memories.map(m => m.headline));
  const [memSubtexts, setMemSubtexts] = useState(() => CONFIG.memories.map(m => m.subtext));
  const [memBottomTexts, setMemBottomTexts] = useState(() => CONFIG.memories.map(m => m.bottomText));
  const [finalLetterInput, setFinalLetterInput] = useState(() => CONFIG.finalLetter.filter(line => line !== ''));

  const finalLetter = useMemo(() => {
    const lines = [...finalLetterInput];
    lines.splice(3, 0, ''); // Pause after 3rd line
    lines.splice(6, 0, ''); // Pause after 5th line (which is now index 6)
    return lines;
  }, [finalLetterInput]);

  const memories = useMemo(() => {
    return [0, 1, 2].map(i => ({
      date: memDates[i] || '',
      headline: memHeadlines[i] || '',
      subtext: memSubtexts[i] || '',
      bottomText: memBottomTexts[i] || '',
      hasImage: !!timelineImages[i],
      imagePath: timelineImages[i] || ''
    }));
  }, [memDates, memHeadlines, memSubtexts, memBottomTexts, timelineImages]);
  const audioRef = useRef(null);
  const fadeInterval = useRef(null);

  const fadeAudioIn = () => {
    if (!audioRef.current) return;
    clearInterval(fadeInterval.current);
    const audio = audioRef.current;
    audio.volume = 0;
    audio.play().catch(e => console.log('Autoplay prevented:', e));
    
    let vol = 0;
    fadeInterval.current = setInterval(() => {
      if (vol < 0.6) {
        vol = Math.min(vol + 0.05, 0.6);
        audio.volume = vol;
      } else {
        clearInterval(fadeInterval.current);
      }
    }, 400);
  };

  const fadeAudioDown = () => {
    if (!audioRef.current) return;
    clearInterval(fadeInterval.current);
    const audio = audioRef.current;
    let vol = audio.volume;
    fadeInterval.current = setInterval(() => {
      if (vol > 0.15) {
        vol = Math.max(vol - 0.05, 0.15);
        audio.volume = vol;
      } else {
        clearInterval(fadeInterval.current);
      }
    }, 400);
  };

  useEffect(() => {
    const handleMessage = (e) => {
      if (e.data?.type === 'customize') {
        const {
          selectedFontSet,
          partnerName,
          anniversaryDate,
          moments,
          timelineImages,
          memDates,
          memHeadlines,
          memSubtexts,
          memBottomTexts,
          finalLetter
        } = e.data;

        if (selectedFontSet !== undefined) setSelectedFontSet(selectedFontSet);
        if (partnerName !== undefined) setPartnerName(partnerName);
        if (anniversaryDate !== undefined) setAnniversaryDate(anniversaryDate);
        if (moments !== undefined) setMoments(moments);
        if (timelineImages !== undefined) setTimelineImages(timelineImages);
        if (memDates !== undefined) setMemDates(memDates);
        if (memHeadlines !== undefined) setMemHeadlines(memHeadlines);
        if (memSubtexts !== undefined) setMemSubtexts(memSubtexts);
        if (memBottomTexts !== undefined) setMemBottomTexts(memBottomTexts);
        if (finalLetter !== undefined) setFinalLetterInput(finalLetter);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  useEffect(() => {
    const fonts = fontSets[selectedFontSet] || fontSets.set1;
    document.documentElement.style.setProperty('--font-serif', fonts.serif);
    document.documentElement.style.setProperty('--font-script', fonts.script);
    document.documentElement.style.setProperty('--font-ui', fonts.ui);
  }, [selectedFontSet]);

  useEffect(() => {
    // Attempt to play music immediately when page loads
    fadeAudioIn();
    
    // Fallback: If browser blocks autoplay, start music on first click anywhere on the page
    const handleFirstClick = () => {
      if (audioRef.current && audioRef.current.paused) {
        fadeAudioIn();
      }
      document.removeEventListener('click', handleFirstClick);
    };
    document.addEventListener('click', handleFirstClick);
    
    return () => document.removeEventListener('click', handleFirstClick);
  }, []);

  const goNext = useCallback(() => {
    if (flashing) return;

    setFlashing(true);
    
    // Change scene at the mid-point of the fade (700ms)
    setTimeout(() => {
      const nextScene = Math.min(current + 1, SCENES.length - 1);
      setCurrent(nextScene);
      
      // Fade down music on the last scene
      if (nextScene === SCENES.length - 1) {
        fadeAudioDown();
      }
    }, 700);

    // Remove the transition overlay after it fully finishes (1400ms)
    setTimeout(() => {
      setFlashing(false);
    }, 1400);
  }, [current, flashing]);

  const restart = useCallback(() => {
    setFlashing(true);
    
    setTimeout(() => {
      setCurrent(0);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }, 700);

    setTimeout(() => {
      setFlashing(false);
    }, 1400);
  }, []);

  const CurrentScene = SCENES[current];

  return (
    <div className="anniversary-app">
      <audio ref={audioRef} src="/templates/anniversary/heartfelt-remembrance/bg-music.mp3" loop />
      <CurrentScene
        onNext={goNext}
        onRestart={restart}
        sceneIndex={current}
        total={SCENES.length}
        partnerName={partnerName}
        anniversaryDate={anniversaryDate}
        moments={moments}
        memories={memories}
        finalLetter={finalLetter}
      />
      {flashing && <div className="warp-flash" />}
    </div>
  );
}
