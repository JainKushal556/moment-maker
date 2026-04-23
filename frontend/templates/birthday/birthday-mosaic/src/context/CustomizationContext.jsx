import { createContext, useContext, useState, useEffect } from 'react';

const CustomizationContext = createContext(null);

const DEFAULT_CUSTOMIZATION = {
  recipientName: 'Rashmii',
  personalMessage: 'Remember, you deserve every happiness in the world. Celebrate big and enjoy every moment!',
  images: [
    './images/r1.png', 
    './images/r2.png', 
    './images/r3.png', 
    './images/r4.png', 
    './images/r5.jpg'
  ]
};

export function CustomizationProvider({ children }) {
  const [customization, setCustomization] = useState(DEFAULT_CUSTOMIZATION);

  useEffect(() => {
    const handleMessage = (e) => {
      if (e.data?.type === 'customize') {
        setCustomization(prev => ({
          ...prev,
          ...(e.data.recipientName !== undefined && { recipientName: e.data.recipientName }),
          ...(e.data.personalMessage !== undefined && { personalMessage: e.data.personalMessage }),
          ...(e.data.images !== undefined && { images: e.data.images }),
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
