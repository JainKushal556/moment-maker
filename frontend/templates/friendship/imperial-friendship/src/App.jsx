import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import IntroStage from './components/IntroStage';
import QuestionStage from './components/QuestionStage';
import StartStage from './components/StartStage';
import AlbumStage from './components/AlbumStage';
import SparkGameStage from './components/SparkGameStage';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  const [currentView, setCurrentView] = useState("question");
  const [stage, setStage] = useState(0);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  // Configuration management
  const [config, setConfig] = useState({
    selectedFontSet: 'set1',
    letterHeader: 'Dear Friend,',
    letterBody: "I still have no idea how I've survived your terrible jokes and endless drama.\n\nFrom our stupid fights to roasting each other relentlessly, it's been pure chaos.\n\nBut honestly? You're the most annoying person I know, yet somehow, my absolute favorite.\n\nSo here's a little trip down memory lane to remind you of the beautiful mess we've made together.",
    nickname: 'Sid',
    captions: [
      "Summer Nights & Laughter ♡",
      "Best Friends Forever ♡",
      "Memories We Made ♡",
      "Always By My Side ♡"
    ],
    memoryWords: '“Still one of my favorite moments with you.”',
    images: [
      "images/1.jpg",
      "images/2.jpg",
      "images/3.jpg",
      "images/4.jpg"
    ],
    ...window.config
  });

  useEffect(() => {
    // Listen for config updates (from parent window)
    const handleMessage = (event) => {
      if (event.data && (event.data.type === 'UPDATE_CONFIG' || event.data.type === 'customize')) {
        const newConfig = event.data.type === 'customize' ? event.data : event.data.config;
        setConfig(prev => ({ ...prev, ...newConfig }));
      }
    };
    window.addEventListener('message', handleMessage);

    // Initial font application
    applyFontTheme(config.selectedFontSet);

    return () => window.removeEventListener('message', handleMessage);
  }, []);

  useEffect(() => {
    applyFontTheme(config.selectedFontSet);
  }, [config.selectedFontSet]);

  const applyFontTheme = (set) => {
    const fonts = {
      set1: 'Outfit',
      set2: 'Playfair Display',
      set3: 'Caveat',
      set4: 'Space Mono'
    };
    const fontName = fonts[set] || 'Outfit';
    document.documentElement.style.setProperty('--primary-font', `'${fontName}', sans-serif`);
    // Also update body style for Tailwind compatibility if needed, 
    // but the --primary-font variable should be used in tailwind.config.js or index.css
    document.body.style.fontFamily = `'${fontName}', sans-serif`;
  };

  const handleQuestionAnswered = () => {
    setCurrentView("miniGame");
  };

  const handleMiniGameComplete = () => {
    setCurrentView("loading");
    setTimeout(() => {
      setCurrentView("stages");
    }, 6000);
  };

  const renderContent = () => {
    if (currentView === "question") {
      return <QuestionStage key="question" onNext={handleQuestionAnswered} />;
    }
    if (currentView === "miniGame") {
      return <SparkGameStage key="miniGame" onComplete={handleMiniGameComplete} onStartPlay={() => setIsMusicPlaying(true)} />;
    }
    if (currentView === "loading") {
      return <IntroStage key="loading" />;
    }

    const stages = [
      <StartStage key="start" config={config} onNext={() => setStage(1)} />,
      <AlbumStage key="album" config={config} />
    ];
    return stages[stage];
  };

  return (
    <div className="min-h-dvh bg-linear-to-br from-indigo-950 via-slate-950 to-fuchsia-950 overflow-hidden" style={{ fontFamily: "var(--primary-font)" }}>
      <MusicPlayer shouldPlay={isMusicPlaying} />
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-size-[50px_50px]" />

      <AnimatePresence mode="wait">
        <motion.div
          key={currentView === "stages" ? `stage-${stage}` : currentView}
          initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="min-h-screen"
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>

    </div>
  );
}

