import { createContext, useContext, useState, useEffect } from 'react';

const CustomizationContext = createContext(null);

const DEFAULT_CUSTOMIZATION = {
  images: [null, null, null, null],
  letterContent: `From the moment you came into my life, everything started to change.\nYou brought colors to my ordinary days, warmth to my silence, and a happiness I didn't even know I was missing.\n\nEvery sunrise feels brighter because of you.\nEvery dream feels possible because you inspire me.\nEvery challenge feels easier because I imagine you by my side.\n\nYou are not just my friend, you're the most special part of my life.\nYou make me smile, you make my heart race, and you make me want to be a better version of myself.\n\nI don't know what the future holds, but I know one thing for sure.\nI want that future with you.`
};

export function CustomizationProvider({ children }) {
  const [customization, setCustomization] = useState(DEFAULT_CUSTOMIZATION);

  useEffect(() => {
    const handleMessage = (e) => {
      if (e.data?.type === 'customize') {
        setCustomization(prev => ({
          ...prev,
          ...(e.data.images !== undefined && { images: e.data.images }),
          ...(e.data.letterContent !== undefined && { letterContent: e.data.letterContent }),
        }));
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <CustomizationContext.Provider value={customization}>
      {children}
    </CustomizationContext.Provider>
  );
}

export function useCustomization() {
  return useContext(CustomizationContext);
}
