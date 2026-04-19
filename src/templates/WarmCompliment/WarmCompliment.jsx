import React, { useState, useEffect, useRef } from 'react';
import './WarmCompliment.css';

export default function WarmCompliment({ customization }) {
    const [currentStage, setCurrentStage] = useState(0);
    const [scanText, setScanText] = useState('Scanning...');
    const [showReceipt, setShowReceipt] = useState(false);
    const [flippedCards, setFlippedCards] = useState([false, false, false]);
    const [letterOpen, setLetterOpen] = useState(false);
    
    const petalsRef = useRef(null);
    const scanTexts = ['Checking smile...', 'Measuring cuteness...', 'Detecting sweetness...', 'Almost done...'];

    // Falling Petals Effect
    useEffect(() => {
        if (!petalsRef.current) return;
        
        const container = petalsRef.current;
        // Clean up previous petals
        container.innerHTML = '';
        
        const petalColors = ['#ffc6c4', '#ffd6e0', '#fde2ea', '#e9d5ff', '#ffe4c7'];
        const petalCount = 20;

        for (let i = 0; i < petalCount; i++) {
            const petal = document.createElement('div');
            petal.className = 'petal';

            const size = Math.random() * 12 + 8; // 8-20px
            const left = Math.random() * 100; // 0-100%
            const delay = Math.random() * 10; // 0-10s delay
            const duration = Math.random() * 10 + 10; // 10-20s duration
            const color = petalColors[Math.floor(Math.random() * petalColors.length)];

            petal.style.width = size + 'px';
            petal.style.height = size + 'px';
            petal.style.left = left + '%';
            petal.style.backgroundColor = color;
            petal.style.animationDuration = duration + 's';
            petal.style.animationDelay = delay + 's';
            petal.style.boxShadow = '0 2px 10px rgba(255, 182, 193, 0.3)';

            container.appendChild(petal);
        }

        return () => {
            if (container) container.innerHTML = '';
        };
    }, []);

    // Scanner Effect
    useEffect(() => {
        if (currentStage === 1) {
            let index = 0;
            const interval = setInterval(() => {
                if (index < scanTexts.length) {
                    setScanText(scanTexts[index]);
                    index++;
                }
            }, 1100);

            const timeout = setTimeout(() => {
                clearInterval(interval);
                setShowReceipt(true);
            }, 4800);

            return () => {
                clearInterval(interval);
                clearTimeout(timeout);
            };
        }
    }, [currentStage]);

    // Outro Event Trigger
    useEffect(() => {
        if (currentStage === 4) {
            // Give small delay and then postMessage to parent just like original
            const timeout = setTimeout(() => {
                window.parent.postMessage({ type: 'preview_complete' }, '*');
            }, 1500);
            return () => clearTimeout(timeout);
        }
    }, [currentStage]);

    const handleCardClick = (index) => {
        const newFlipped = [...flippedCards];
        newFlipped[index] = !newFlipped[index];
        setFlippedCards(newFlipped);
    };

    return (
        <div className="warm-compliment min-h-full h-full relative bg-rose-50 antialiased select-none font-sans overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 z-0 pointer-events-none w-full h-full">
                <div className="absolute inset-0 w-full h-full" style={{
                    background: `
                        radial-gradient(ellipse 85% 65% at 8% 8%, rgba(175, 109, 255, 0.1), transparent 60%),
                        radial-gradient(ellipse 75% 60% at 75% 35%, rgba(255, 235, 170, 0.1), transparent 62%),
                        radial-gradient(ellipse 70% 60% at 15% 80%, rgba(255, 100, 180, 0.1), transparent 62%),
                        radial-gradient(ellipse 70% 60% at 92% 92%, rgba(120, 190, 255, 0.1), transparent 62%),
                        linear-gradient(180deg, #fff5f7 0%, #fde7ee 100%)
                    `
                }}></div>
            </div>

            {/* Falling Petals */}
            <div className="petals-container" ref={petalsRef}></div>

            <div className="relative z-10 w-full h-full flex flex-col items-center justify-center pt-8">
                {/* Stage 0: Intro */}
                {currentStage === 0 && (
                    <div className="px-4 py-6 flex flex-col items-center justify-center animate-fade-in w-full">
                        <div className="flex flex-col items-center justify-center relative text-center">
                            <div>
                                <h1 className="text-4xl md:text-5xl font-['Dancing_Script'] font-semibold text-rose-500/85 tracking-wide">
                                    Just for you
                                </h1>
                            </div>
                            <button 
                                onClick={() => setCurrentStage(1)}
                                className="mt-8 relative group will-change-transform heart-btn-template transition-transform duration-200"
                                tabIndex="0"
                            >
                                <div className="absolute inset-0 bg-rose-300/60 rounded-full blur-xl opacity-50 group-hover:opacity-80 transition-opacity duration-500"></div>
                                <div className="relative w-32 h-32 bg-white rounded-full shadow-xl flex items-center justify-center border-4 border-rose-100">
                                    <div className="animate-pulse-heart">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-heart w-14 h-14 text-rose-400 fill-current" aria-hidden="true">
                                            <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"></path>
                                        </svg>
                                    </div>
                                </div>
                            </button>
                            <p className="text-rose-400/70 text-sm font-medium tracking-wide mt-4">Tap to open</p>
                        </div>
                    </div>
                )}

                {/* Stage 1: Scanner */}
                {currentStage === 1 && (
                    <div className="px-4 py-6 flex flex-col items-center justify-center w-full animate-fade-in">
                        {!showReceipt ? (
                            <div className="flex flex-col items-center">
                                <div className="relative w-72 h-72 flex items-center justify-center">
                                    <div className="absolute inset-0 border-4 border-rose-400/50 rounded-full scanner-ring"></div>
                                    <div className="absolute inset-4 border-4 border-rose-200/40 rounded-full scanner-inner"></div>
                                    <div className="absolute inset-0 rounded-full overflow-hidden">
                                        <div className="w-full h-1/2 bg-linear-to-b from-transparent to-rose-300/25 border-b-2 border-rose-400 scanner-line"></div>
                                    </div>
                                    <div className="bg-white/70 backdrop-blur-md p-6 rounded-full shadow-sm z-10">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" className="w-12 h-12" style={{fill: '#fb7185'}}>
                                            <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"></path>
                                        </svg>
                                    </div>
                                </div>
                                <p key={scanText} className="mt-8 text-xl text-gray-600 font-medium animate-slide-in">{scanText}</p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center">
                                <div className="receipt bg-white w-72 p-6 shadow-2xl relative mb-8 animate-slide-down">
                                    <div className="text-center border-b-2 border-dashed border-gray-200 pb-4 mb-4">
                                        <div className="flex justify-center mb-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-rose-300">
                                                <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"></path>
                                                <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"></path>
                                                <path d="M12 17.5v-11"></path>
                                            </svg>
                                        </div>
                                        <h2 className="font-bold text-gray-500 text-sm tracking-widest">OFFICIAL REPORT</h2>
                                        <p className="text-xs text-gray-400">{new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric'})}</p>
                                    </div>
                                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -z-10">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 24 24" fill="none" className="text-rose-100 fill-current opacity-40">
                                            <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"></path>
                                        </svg>
                                    </div>
                                    <div className="space-y-3 font-mono text-sm text-gray-600 mb-6">
                                        <div className="flex justify-between"><span>ITEM:</span><span className="font-bold">YOU</span></div>
                                        <div className="flex justify-between"><span>CUTENESS:</span><span className="font-bold">UNLIMITED</span></div>
                                        <div className="flex justify-between"><span>SWEETNESS:</span><span className="font-bold">OVERLOAD</span></div>
                                        <div className="flex justify-between"><span>VIBE:</span><span className="font-bold">PERFECT</span></div>
                                    </div>
                                    <div className="border-t-2 border-dashed border-gray-200 pt-4 text-center">
                                        <p className="font-bold text-rose-500/85 text-lg mb-1">TOTAL: 100% LOVELY</p>
                                        <p className="text-xs text-gray-400">||| || ||| || ||||</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setCurrentStage(2)}
                                    className="btn-primary-template px-8 py-3 text-white rounded-full font-medium tracking-wide shadow-xl transition-all duration-300 flex items-center gap-2 animate-btn-delayed-intro"
                                    style={{background: 'linear-gradient(to right, #fb7185, #f43f5e)'}}
                                >
                                    Continue
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5">
                                        <path d="M18 8L22 12L18 16"></path><path d="M2 12H22"></path>
                                    </svg>
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Stage 2: Gallery */}
                {currentStage === 2 && (
                    <div className="px-4 py-6 flex flex-col items-center justify-center w-full animate-fade-in">
                        <h2 className="text-4xl md:text-5xl text-balance font-[Dancing_Script] font-semibold text-rose-500/85 mb-8 z-10 text-center">
                            My favorite things about you
                        </h2>
                        <div className="relative w-full max-w-md h-96 flex items-center justify-center">
                            <div className={`absolute top-0 left-3 md:left-14 z-10 card-container w-40 h-48 ${flippedCards[0] ? 'flipped' : ''}`} style={{transform: 'rotate(-6deg)'}} onClick={() => handleCardClick(0)}>
                                <div className="card-inner">
                                    <div className="card-front bg-white p-3 shadow-xl flex flex-col items-center">
                                        <div className="w-full h-32 bg-amber-400 bg-opacity-20 flex items-center justify-center mb-4 overflow-hidden relative">
                                            <div className="absolute inset-0 opacity-10 bg-black mix-blend-overlay"></div>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-rose-50"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" x2="9.01" y1="9" y2="9"></line><line x1="15" x2="15.01" y1="9" y2="9"></line></svg>
                                        </div>
                                        <div className="px-2 py-2 bg-white"><div className="flex justify-center space-x-1"><div className="w-8 h-0.5 bg-pink-200 rounded-full"></div><div className="w-6 h-0.5 bg-purple-200 rounded-full"></div><div className="w-10 h-0.5 bg-rose-200 rounded-full"></div></div></div>
                                    </div>
                                    <div className="card-back bg-white p-4 shadow-xl flex flex-col justify-center text-center border-2 border-rose-100">
                                        <p className="text-sm text-gray-700 font-medium leading-relaxed">Being around you makes even ordinary days feel special.</p>
                                    </div>
                                </div>
                            </div>
                            <div className={`absolute top-3 md:top-4 right-4 md:right-14 z-20 card-container w-40 h-48 ${flippedCards[1] ? 'flipped' : ''}`} style={{transform: 'rotate(12deg)'}} onClick={() => handleCardClick(1)}>
                                <div className="card-inner">
                                    <div className="card-front bg-white p-3 shadow-xl flex flex-col items-center">
                                        <div className="w-full h-32 bg-purple-400 bg-opacity-20 flex items-center justify-center mb-4 overflow-hidden relative">
                                            <div className="absolute inset-0 opacity-10 bg-black mix-blend-overlay"></div>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-rose-50"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" x2="9.01" y1="9" y2="9"></line><line x1="15" x2="15.01" y1="9" y2="9"></line></svg>
                                        </div>
                                        <div className="px-2 py-2 bg-white"><div className="flex justify-center space-x-1"><div className="w-8 h-0.5 bg-pink-200 rounded-full"></div><div className="w-6 h-0.5 bg-purple-200 rounded-full"></div><div className="w-10 h-0.5 bg-rose-200 rounded-full"></div></div></div>
                                    </div>
                                    <div className="card-back bg-white p-4 shadow-xl flex flex-col justify-center text-center border-2 border-rose-100">
                                        <p className="text-sm text-gray-700 font-medium leading-relaxed">I love how your eyes light up when you talk about things you love.</p>
                                    </div>
                                </div>
                            </div>
                            <div className={`absolute bottom-4 left-1/2 -translate-x-1/2 z-30 card-container w-40 h-48 ${flippedCards[2] ? 'flipped' : ''}`} style={{transform: 'translateX(-50%) rotate(-2deg)'}} onClick={() => handleCardClick(2)}>
                                <div className="card-inner">
                                    <div className="card-front bg-white p-3 shadow-xl flex flex-col items-center">
                                        <div className="w-full h-32 bg-rose-400 bg-opacity-20 flex items-center justify-center mb-4 overflow-hidden relative">
                                            <div className="absolute inset-0 opacity-10 bg-black mix-blend-overlay"></div>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-rose-50"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" x2="9.01" y1="9" y2="9"></line><line x1="15" x2="15.01" y1="9" y2="9"></line></svg>
                                        </div>
                                        <div className="px-2 py-2 bg-white"><div className="flex justify-center space-x-1"><div className="w-8 h-0.5 bg-pink-200 rounded-full"></div><div className="w-6 h-0.5 bg-purple-200 rounded-full"></div><div className="w-10 h-0.5 bg-rose-200 rounded-full"></div></div></div>
                                    </div>
                                    <div className="card-back bg-white p-4 shadow-xl flex flex-col justify-center text-center border-2 border-rose-100">
                                        <p className="text-sm text-gray-700 font-medium leading-relaxed">Your laugh is literally my favorite sound in the entire universe. Never stop.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <p className="text-rose-400/60 text-sm mt-4 font-medium animate-pulse">Tap the cards to flip them</p>
                        <button 
                            onClick={() => setCurrentStage(3)}
                            className="btn-primary-template mt-4 px-8 py-3 text-white rounded-full font-medium tracking-wide shadow-xl transition-all duration-300 flex items-center gap-2 animate-btn-delayed-intro"
                            style={{background: 'linear-gradient(to right, #fb7185, #f43f5e)'}}
                        >
                            One more thing
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5"><path d="M18 8L22 12L18 16"></path><path d="M2 12H22"></path></svg>
                        </button>
                    </div>
                )}

                {/* Stage 3: Letter */}
                {currentStage === 3 && (
                    <div className="px-4 py-6 flex flex-col items-center justify-center w-full">
                        {!letterOpen ? (
                            <div className="flex flex-col items-center animate-fade-in">
                                <button 
                                    onClick={() => setLetterOpen(true)}
                                    className="group relative cursor-pointer heart-btn-template transition-transform duration-200"
                                >
                                    <div className="w-72 h-48 bg-rose-200 rounded-lg shadow-xl flex items-center justify-center relative overflow-hidden">
                                        <div className="absolute bottom-0 w-full h-1/2 bg-rose-300/30"></div>
                                        <div className="bg-white/70 backdrop-blur-md shadow-md rounded-full p-3 relative">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-rose-500"><path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"></path><rect x="2" y="4" width="20" height="16" rx="2"></rect></svg>
                                        </div>
                                    </div>
                                    <p className="mt-6 text-rose-500/70 text-sm font-medium text-center animate-pulse">Tap to read letter</p>
                                </button>
                            </div>
                        ) : (
                            <div className="w-full max-w-lg bg-white/90 backdrop-blur-sm p-8 md:p-12 rounded-lg relative shadow-lg animate-slide-in">
                                <h3 className="font-[Dancing_Script] text-3xl font-medium text-rose-500/85 mb-4 text-left">
                                    {customization?.letterTitle || "For you,"}
                                </h3>
                                <div className="text-gray-700 leading-relaxed text-justify">
                                    <p>{customization?.letterBody || "I wanted to make something a little different for you, just to remind you how much you mean to me. Thank you for being my person. Thank you for the laughs, the patience, and for sharing your world with me. You are genuinely wonderful, and I hope this little surprise made you smile today."}</p>
                                </div>
                                <button 
                                    onClick={() => setCurrentStage(4)}
                                    className="btn-primary-template mx-auto mt-8 px-8 py-3 text-white rounded-full font-medium tracking-wide shadow-xl transition-all duration-300 flex items-center gap-2 animate-btn-delayed-intro"
                                    style={{background: 'linear-gradient(to right, #fb7185, #f43f5e)'}}
                                >
                                    One last thing
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Stage 4: Outro */}
                {currentStage === 4 && (
                    <div className="px-4 py-6 flex flex-col items-center justify-center text-center animate-fade-in w-full">
                        <div className="mb-4">
                            <img src="/templates/compliment/gifs/happy.gif" alt="Happy" className="w-40 h-auto" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-[Dancing_Script] text-rose-500/85 font-semibold mb-3">You're the best</h1>
                        <p className="text-rose-400/80">Don't ever forget it</p>
                    </div>
                )}
            </div>
        </div>
    );
}
