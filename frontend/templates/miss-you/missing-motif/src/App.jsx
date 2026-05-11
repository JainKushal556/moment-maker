import { useState, useEffect, useRef } from 'react'
import './index.css'

import Step1_Greeting from './steps/Step1_Greeting'
import Step2_FogWipe from './steps/Step2_FogWipe'
import Step3_Memories from './steps/Step3_Memories'
import Step4_Letter from './steps/Step4_Letter'
import Step5_Outro from './steps/Step5_Outro'

const TOTAL_STEPS = 5

export default function App() {
  const [step, setStep] = useState(1)
  const [transitioning, setTransitioning] = useState(false)
  const [flashOverlay, setFlashOverlay] = useState(false)
  const audioRef = useRef(null)
  const audioRef2 = useRef(null)
  const [audioStarted, setAudioStarted] = useState(false)

  // Configuration management
  const [config, setConfig] = useState({
    recipientName: "Hey... are you there?",
    images: [
      'images/memory1.png',
      'images/memory2.png',
      'images/memory3.png',
      'images/memory4.png',
    ],
    captions: [
      "I remember this day so well.",
      "I miss your beautiful smile.",
      "I wish we were together right now.",
      "Every memory of you makes me happy.",
    ],
    letterHeader: "Dear my love,",
    letterBody: `I am sitting here alone and thinking about you. I really wish you were here with me right now. I miss everything about you—your voice, your smile, and how you hold my hand. 

Being away from you is very hard. The days feel so long and quiet without you. I am just waiting for the day when we can meet again.

I just wanted to tell you that I think about you all the time. No matter how far we are, you are the only one in my heart. I miss you so much.

I love you.`,
    outroLine1: "I miss you every day.",
    outroLine2: "I want to see you soon.",
    outroFinal: "I love you so much.",
    senderName: "— Yours forever",
    ...window.config
  })

  useEffect(() => {
    // Listen for config updates (from parent window/editor)
    const handleMessage = (event) => {
      if (event.data && (event.data.type === 'UPDATE_CONFIG' || event.data.type === 'customize')) {
        const newConfig = event.data.type === 'customize' ? event.data : event.data.config;
        setConfig(prev => ({ ...prev, ...newConfig }));
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Security & Interaction Protections
  useEffect(() => {
    const disableContextMenu = (e) => e.preventDefault()
    const disableDevTools = (e) => {
      if (
        e.keyCode === 123 || // F12
        (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74)) || // Ctrl+Shift+I/J
        (e.ctrlKey && e.keyCode === 85) // Ctrl+U
      ) {
        e.preventDefault()
      }
    }

    document.addEventListener('contextmenu', disableContextMenu)
    document.addEventListener('keydown', disableDevTools)

    return () => {
      document.removeEventListener('contextmenu', disableContextMenu)
      document.removeEventListener('keydown', disableDevTools)
    }
  }, [])

  // Start BGM on first interaction
  const startAudio = () => {
    if (audioStarted) return
    
    const play1 = audioRef.current ? audioRef.current.play() : Promise.resolve()
    const play2 = audioRef2.current ? audioRef2.current.play() : Promise.resolve()

    Promise.all([play1, play2]).then(() => {
      setAudioStarted(true)
      if (audioRef.current) audioRef.current.volume = 0
      if (audioRef2.current) audioRef2.current.volume = 0

      // Coordinated fade in
      let vol1 = 0
      let vol2 = 0
      const fade = setInterval(() => {
        vol1 = Math.min(vol1 + 0.05, 0.85) // Song 1 max 85%
        vol2 = Math.min(vol2 + 0.03, 0.30) // Song 2 max 30% (Co-vocal layer)
        
        if (audioRef.current) audioRef.current.volume = vol1
        if (audioRef2.current) audioRef2.current.volume = vol2
        
        if (vol1 >= 0.85 && vol2 >= 0.30) clearInterval(fade)
      }, 200)
    }).catch(() => {})
  }

  const goNext = () => {
    if (transitioning || step >= TOTAL_STEPS) return
    startAudio()
    setTransitioning(true)
    setFlashOverlay(true)
    setTimeout(() => {
      setStep(s => s + 1)
      setTimeout(() => {
        setFlashOverlay(false)
        setTransitioning(false)
      }, 50)
    }, 800)
  }

  // Start audio on first click anywhere
  useEffect(() => {
    const handler = () => startAudio()
    window.addEventListener('pointerdown', handler, { once: true })
    return () => window.removeEventListener('pointerdown', handler)
  }, [audioStarted])

  return (
    <>
      {/* BGM Layers */}
      <audio
        ref={audioRef}
        src="music/Miss You.mp3"
        loop
        preload="auto"
      />
      <audio
        ref={audioRef2}
        src="music/Baatein.mp3"
        loop
        preload="auto"
      />

      {/* Flash transition overlay */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9990,
          background: '#04060a',
          opacity: flashOverlay ? 1 : 0,
          transition: flashOverlay ? 'opacity 0.6s ease-in' : 'opacity 0.8s ease-out',
          pointerEvents: 'none',
        }}
      />



      {/* Steps */}
      {step === 1 && <Step1_Greeting onNext={goNext} config={config} />}
      {step === 2 && <Step2_FogWipe onNext={goNext} config={config} />}
      {step === 3 && <Step3_Memories onNext={goNext} config={config} />}
      {step === 4 && <Step4_Letter onNext={goNext} config={config} />}
      {step === 5 && <Step5_Outro config={config} />}
    </>
  )
}
