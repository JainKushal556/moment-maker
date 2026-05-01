import { useState, useEffect, useRef } from 'react';
import { Heart } from 'lucide-react';
import TextType from './TextType';
import './index.css';

function App() {
    const [currentStage, setCurrentStage] = useState(0);
    const [isLetterOpen, setIsLetterOpen] = useState(false);
    const [isTypingFinished, setIsTypingFinished] = useState(false);
    const [loadProgress, setLoadProgress] = useState(0);
    const [showBlast, setShowBlast] = useState(false);
    const [boxesOpen, setBoxesOpen] = useState([false, false, false, false]);
    
    // Customization State
    const [letterHeader, setLetterHeader] = useState("To My Cutest Girl,");
    const [letterBody, setLetterBody] = useState("I just want to say this… you look really beautiful 💖 Your smile is honestly my favorite thing 😊 There’s something so cute and soft about you that I can’t explain 🌸 The way you smile, the way you look… it just stays in my mind ✨ You make everything feel a little better just by being you 💫 I don’t say this enough, but you’re really special to me ❤️");
    const [images, setImages] = useState([
        './images/gifts/gift1.jpg',
        './images/gifts/gift2.jpg',
        './images/gifts/gift3.jpg',
        './images/gifts/gift4.jpg'
    ]);
    const [selectedFontSet, setSelectedFontSet] = useState('set1');

    const fontSets = {
        set1: {
            cursive: "'Dancing Script', cursive",
            body: "'Inter', sans-serif",
            accent: "'Outfit', sans-serif"
        },
        set2: {
            cursive: "'Satisfy', cursive",
            body: "'Quicksand', sans-serif",
            accent: "'Patrick Hand', cursive"
        },
        set3: {
            cursive: "'Pinyon Script', cursive",
            body: "'Montserrat', sans-serif",
            accent: "'Indie Flower', cursive"
        }
    };

    const audioRef = useRef(null);



    useEffect(() => {
        // Petals effect
        const container = document.getElementById('petals-container');
        if (!container) return;

        // Clear existing petals just in case
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

    useEffect(() => {
        if (currentStage === 5) {
            setLoadProgress(0);
            const duration = 7000;
            const interval = 30;
            const increment = 100 / (duration / interval);

            const timer = setInterval(() => {
                setLoadProgress((prev) => {
                    if (prev >= 100) {
                        clearInterval(timer);
                        setShowBlast(true);
                        return 100;
                    }
                    return prev + increment;
                });
            }, interval);

            return () => clearInterval(timer);
        }
    }, [currentStage]);

    // Send unlock signal to parent (editor/preview) when user reaches the final stage
    useEffect(() => {
        if (currentStage === 4) {
            window.parent.postMessage({ type: 'TEMPLATE_COMPLETED' }, '*');
        }
    }, [currentStage]);

    useEffect(() => {
        const handleMessage = (e) => {
            if (e.data?.type === 'customize') {
                const { letterHeader, letterBody, images, selectedFontSet } = e.data;
                if (letterHeader !== undefined) setLetterHeader(letterHeader);
                if (letterBody !== undefined) setLetterBody(letterBody);
                if (images !== undefined && Array.isArray(images)) setImages(images);
                if (selectedFontSet !== undefined) setSelectedFontSet(selectedFontSet);
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    useEffect(() => {
        const fonts = fontSets[selectedFontSet] || fontSets.set1;
        document.documentElement.style.setProperty('--font-cursive', fonts.cursive);
        document.documentElement.style.setProperty('--font-body', fonts.body);
        document.documentElement.style.setProperty('--font-accent', fonts.accent);
    }, [selectedFontSet]);

    useEffect(() => {
        const playMusic = () => {
            if (audioRef.current && audioRef.current.paused) {
                audioRef.current.play()
                    .then(() => {
                        console.log("Music started successfully");
                        window.removeEventListener('click', playMusic);
                    })
                    .catch(e => console.log("Play blocked by browser, waiting for interaction..."));
            }
        };

        // Attempt to play immediately on load (may be blocked by browser)
        playMusic();

        // Fallback: wait for the first click anywhere to play
        window.addEventListener('click', playMusic);
        return () => window.removeEventListener('click', playMusic);
    }, []);

    const handleStart = () => {
        console.log("Start button clicked, attempting to play music...");
        if (audioRef.current) {
            audioRef.current.volume = 1.0;
            audioRef.current.play()
                .then(() => console.log("Music playing successfully!"))
                .catch(e => {
                    console.error("Audio play failed:", e);
                    // Fallback: try playing again on next interaction
                });
        }
        setCurrentStage(5);
    };

    return (
        <div className="min-h-screen flex items-center justify-center overflow-hidden">
            <audio
                ref={audioRef}
                src="./audio/background_music.mp3"
                loop
                autoPlay
                preload="auto"
                style={{ display: 'none' }}
            />
            {/* Full Screen Blast Effect */}
            {showBlast && (
                <div className="fixed inset-0 z-[999] pointer-events-none overflow-hidden">
                    {/* Flying Hearts */}
                    {[...Array(40)].map((_, i) => (
                        <div
                            key={i}
                            className="floating-heart"
                            style={{
                                left: `${Math.random() * 100}vw`,
                                animationDelay: `${Math.random() * 3}s`,
                                animationDuration: `${4 + Math.random() * 3}s`,
                                fontSize: `${30 + Math.random() * 40}px`,
                                filter: `hue-rotate(${Math.random() * 360}deg)`
                            }}
                        >
                            ❤️
                        </div>
                    ))}

                    {/* Big Center Heart Blast */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Heart className="w-80 h-80 text-rose-500 fill-rose-400 opacity-0 animate-heart-blast" />
                    </div>
                </div>
            )}

            {/* Background */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none w-full h-full">
                <div className="absolute inset-0 w-full h-full" style={{
                    background: `radial-gradient(ellipse 85% 65% at 8% 8%, rgba(175, 109, 255, 0.1), transparent 60%),
                             radial-gradient(ellipse 75% 60% at 75% 35%, rgba(255, 235, 170, 0.1), transparent 62%),
                             radial-gradient(ellipse 70% 60% at 15% 80%, rgba(255, 100, 180, 0.1), transparent 62%),
                             radial-gradient(ellipse 70% 60% at 92% 92%, rgba(120, 190, 255, 0.1), transparent 62%),
                             linear-gradient(180deg, #fff1f2 0%, #ffe4e6 100%)`
                }}></div>
            </div>

            {/* Falling Petals */}
            <div className="petals-container" id="petals-container"></div>

            {/* Stage 0: Intro */}
            <div id="stage-intro" className={`stage px-4 py-6 flex-col items-center justify-center ${currentStage === 0 ? 'active animate-fade-in' : ''}`}>
                <div className="flex flex-col items-center justify-center relative text-center">

                    {/* Title */}
                    <h1 className="text-4xl md:text-5xl mb-2 tracking-wide">
                        <span className="gift-ui-title-script">Just</span>{" "}
                        <span className="gift-ui-title-plain">for you</span>
                    </h1>

                    {/* Divider */}
                    <div className="gift-divider">
                        <div className="gift-divider-line"></div>
                        <span className="gift-divider-heart">❤</span>
                        <div className="gift-divider-line"></div>
                    </div>

                    {/* Gift Button */}
                    <button
                        id="start-btn"
                        onClick={handleStart}
                        className="gift-btn-outer"
                        tabIndex="0"
                        aria-label="Open gift"
                    >
                        {/* Glow ring */}
                        <div className="gift-btn-glow"></div>

                        {/* Inner frosted circle */}
                        <div className="gift-btn-inner">
                            <span className="gift-btn-emoji">🎁</span>
                            <div className="gift-blush gift-blush-left"></div>
                            <div className="gift-blush gift-blush-right"></div>
                        </div>

                        {/* Floating hearts */}
                        <span className="gift-float-heart gift-float-heart-1">❤</span>
                        <span className="gift-float-heart gift-float-heart-2">❤</span>
                    </button>

                    {/* Tap label */}
                    <p className="gift-tap-label">Tap to open</p>
                </div>
            </div>

            {/* Stage 3: Letter */}
            <div id="stage-letter" className={`stage px-4 py-6 flex-col items-center justify-center ${currentStage === 3 ? 'active animate-fade-in' : ''}`}>
                {!isLetterOpen ? (
                    <div id="envelope-view" className="flex flex-col items-center animate-fade-in">
                        <button onClick={() => setIsLetterOpen(true)} id="open-letter-btn" className="group relative cursor-pointer heart-btn transition-transform duration-200">
                            <div className="w-72 h-48 bg-rose-200 rounded-lg shadow-xl flex items-center justify-center relative overflow-hidden">
                                <div className="absolute bottom-0 w-full h-1/2 bg-rose-300/30"></div>
                                <div className="bg-white/70 backdrop-blur-md shadow-md rounded-full p-3 relative">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-rose-500">
                                        <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"></path>
                                        <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                                    </svg>
                                </div>
                            </div>
                            <p className="mt-6 text-rose-500/70 text-sm font-medium text-center animate-pulse">Tap to read letter</p>
                        </button>
                    </div>
                ) : (
                    <div id="letter-content" className="w-full max-w-lg bg-[#fffdf8] p-8 md:p-12 rounded-2xl relative shadow-2xl border border-[#fce7f3] animate-smooth-reveal">
                        {/* Decorative corner pinning */}
                        <div className="absolute top-4 left-4 w-3 h-3 rounded-full bg-rose-200/50 shadow-inner"></div>
                        <div className="absolute top-4 right-4 w-3 h-3 rounded-full bg-rose-200/50 shadow-inner"></div>

                        <h3 className="font-dancing text-4xl font-bold text-rose-500 mb-6 border-b border-rose-100 pb-4" style={{ textAlign: 'left' }}>{letterHeader}</h3>
                        <div className="text-gray-800 font-serif text-lg leading-loose tracking-wide" style={{ textAlign: 'left' }}>
                            <TextType
                                text={letterBody}
                                typingSpeed={40}
                                loop={false}
                                showCursor={true}
                                cursorCharacter="|"
                                className="letter-text"
                                onFinished={() => setIsTypingFinished(true)}
                            />
                        </div>
                        <div className="h-20 mt-4 flex items-center justify-center">
                            {isTypingFinished && (
                                <button onClick={() => setCurrentStage(4)} id="continue-to-outro" className="btn-primary px-8 py-3 text-white rounded-full font-medium tracking-wide shadow-xl transition-all duration-300 flex items-center gap-2 animate-fade-in" style={{ background: '#E43D75' }}>
                                    One last thing
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Stage 4: Outro */}
            <div id="stage-outro" className={`stage px-4 py-6 flex-col items-center justify-center text-center ${currentStage === 4 ? 'active animate-fade-in' : ''}`}>
                <div className="mb-4">
                    <img style={{ height: '100px' }} src="./gifs/happy.gif" alt="Happy" className="w-48 h-auto rounded-lg shadow-md" />
                </div>
                <h1 className="text-4xl md:text-5xl font-dancing text-rose-500/85 font-semibold mb-3">You're My Whole World</h1>
                <p className="text-rose-400/80">Never forget how much you mean to me</p>
            </div>

            {/* Stage 5: Finding Beauty */}
            <div id="stage-finding" className={`stage px-4 py-6 flex-col items-center justify-start pt-20 text-center ${currentStage === 5 ? 'active animate-fade-in' : ''}`}>
                <div className="relative flex flex-col items-center justify-start">
                    <h2 className="text-3xl md:text-4xl font-dancing text-rose-500/90 font-bold animate-pulse-heart">
                        Finding Most Beautiful Thing In This World
                    </h2>
                    <div className="mt-2 flex justify-center gap-2">
                        <div className="w-2 h-2 bg-rose-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-rose-400 rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></div>
                        <div className="w-2 h-2 bg-rose-400 rounded-full animate-bounce" style={{ animationDelay: '400ms' }}></div>
                    </div>
                    <div className="mt-4 flex flex-col items-center gap-12">
                        <div
                            // style={{
                            //     height: '350px',
                            //     width: '420px',

                            // }} 
                            className=" rounded-full overflow-hidden shadow-lg border-2 border-rose-100/30 flex items-center justify-center">
                            <img
                                src="./gifs/searching.gif"
                                alt="Searching..."
                                className="w-full h-full object-cover scale-[2.8]"
                            />
                        </div>

                        {/* Cute Progress Loader / Result Button */}
                        <div style={{ marginTop: '20px' }} className="mt-[200px] flex flex-col items-center gap-4 w-full">
                            {loadProgress < 100 ? (
                                <div className="loader-container" style={{ height: 'auto', background: 'transparent' }}>
                                    <div className="loader-card">
                                        <div className="heart">❤️</div>
                                        <div className="progress-bar">
                                            <div className="progress-fill" style={{ width: `${Math.round(loadProgress)}%` }}></div>
                                        </div>
                                        <p className="percent">{Math.round(loadProgress)}%</p>
                                        <p className="text">Finding something special...</p>
                                    </div>
                                </div>
                            ) : (
                                <button style={{ backgroundColor: '#E43D75', padding: '5px 15px' }}
                                    onClick={() => setCurrentStage(6)}
                                    className="text-white rounded-full font-bold tracking-widest uppercase shadow-2xl hover:scale-105 transition-all duration-300 animate-fade-in border-b-4 border-[#b52656] active:border-b-0 active:translate-y-1 block bg-[#E43D75] px-4 py-1 mt-8"
                                >
                                    Check The Result
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {/* Stage 6: Gift Boxes */}
            <div id="stage-gifts" className={`stage px-4 py-6 flex-col items-center justify-start pt-12 text-center ${currentStage === 6 ? 'active animate-fade-in' : ''}`}>
                <h2 className="text-3xl font-dancing text-rose-500 font-bold mb-8">Ohh... Its Youuu ☺️🫠</h2>

                <div className="gift-container">
                    {[1, 2, 3, 4].map((item, index) => (
                        <div
                            key={index}
                            className={`gift-box cursor-pointer overflow-hidden ${boxesOpen[index] ? 'open shadow-xl' : 'shadow-md hover:shadow-lg'}`}
                            onClick={() => {
                                const newBoxesOpen = [...boxesOpen];
                                newBoxesOpen[index] = true;
                                setBoxesOpen(newBoxesOpen);
                            }}
                        >
                            {boxesOpen[index] ? (
                                <img
                                    src={images[index] || `./images/gifts/gift${index + 1}.jpg`}
                                    alt={`Gift ${index + 1}`}
                                    className="w-full h-full object-cover animate-fade-in"
                                />
                            ) : (
                                "🎁"
                            )}
                        </div>
                    ))}
                </div>

                <div className="mt-12 flex flex-col items-center gap-4">
                    <p className="mt-10 text-[#E43D75] font-bold text-sm animate-pulse uppercase tracking-wider">Click The Boxes And See How Cute 😍 U Are</p>
                    {boxesOpen.every(b => b) && (
                        <button style={{ backgroundColor: '#E43D75', padding: '5px 15px' }}
                            onClick={() => setCurrentStage(3)}
                            className="mt-6 px-[26px] py-[5px] bg-[#E43D75] text-white rounded-full font-bold shadow-xl hover:scale-105 transition-all animate-bounce border-b-4 border-[#b52656] active:border-b-0 active:translate-y-1"
                        >
                            Few words just for you.
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default App;
