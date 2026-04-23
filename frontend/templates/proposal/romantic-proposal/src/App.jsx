import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Loader from './components/Loader';
import Greeting from './components/Greeting';
import Question from './components/Question';
import Balloons from './components/Balloons';
import PhotosLetter from './components/PhotosLetter';
import Final from './components/Final';
import Rain from './components/Rain';
import { CustomizationProvider } from './context/CustomizationContext';

function App() {
  const [stage, setStage] = useState('loader');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      setStage('first');
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleNext = (nextStage) => {
    setStage(nextStage);
  };

  return (
    <CustomizationProvider>
      <div className="min-h-screen w-screen relative overflow-hidden bg-gradient-to-br from-[#1a0520] via-black/95 to-[#2c050f]">
        {/* Background glowing effects */}
        <div className="fixed inset-0 bg-[radial-gradient(rgba(255,255,255,0.7)_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.07] z-0 pointer-events-none" />
        <div className="fixed inset-0 z-0 opacity-30 pointer-events-none" style={{ filter: 'blur(100px)', backgroundImage: 'radial-gradient(circle at 20% 25%, rgba(75, 0, 79, 0.7), transparent 40%)' }} />
        <div className="fixed inset-0 z-0 opacity-30 pointer-events-none" style={{ filter: 'blur(100px)', backgroundImage: 'radial-gradient(circle at 80% 80%, rgba(77, 2, 24, 0.7), transparent 40%)' }} />
        
        {!loading && <Rain />}

        <AnimatePresence mode="wait">
          {loading && <Loader key="loader" onComplete={() => setStage('first')} />}
          {stage === 'first' && <Greeting key="first" onNext={() => handleNext('question1')} />}
          {stage === 'question1' && (
            <Question 
              key="question1"
              question="Do you like surprises?"
              subtext="I promise it's worth it..."
              onYes={() => handleNext('question2')}
              isFirst={true}
            />
          )}
          {stage === 'question2' && (
            <Question 
              key="question2"
              question="Do you like me?"
              subtext="Be honest with me..."
              onYes={() => handleNext('balloons')}
              isFirst={false}
            />
          )}
          {stage === 'balloons' && <Balloons key="balloons" onNext={() => handleNext('photos')} />}
          {stage === 'photos' && <PhotosLetter key="photos" onNext={() => handleNext('final')} />}
          {stage === 'final' && <Final key="final" />}
        </AnimatePresence>

      </div>
    </CustomizationProvider>
  );
}

export default App;
