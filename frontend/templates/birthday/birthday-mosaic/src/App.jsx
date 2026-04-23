import { useState, useEffect } from 'react';
import BirthdayLanding from './components/BirthdayLanding.jsx';
import CarouselStage from './components/CarouselStage.jsx';
import { CustomizationProvider } from './context/CustomizationContext.jsx';

export default function App() {
  const [stage, setStage] = useState('landing');
  const [name, setName]   = useState('');

  const handleComplete = (enteredName) => {
    setName(enteredName);
    setStage('carousel');
  };

  return (
    <CustomizationProvider>
      {stage === 'landing' && (
        <BirthdayLanding onComplete={handleComplete} />
      )}
      {stage === 'carousel' && <CarouselStage name={name} />}
    </CustomizationProvider>
  );
}
