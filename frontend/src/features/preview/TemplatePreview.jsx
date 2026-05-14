import { useContext, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ViewContext } from '../../context/NavContext'
import { useAuth } from '../../context/AuthContext'
import { useWallet } from '../../context/WalletContext'
import WishbitIcon from '../../components/icons/WishbitIcon'
import './template-preview.css'

export default function TemplatePreview() {
    const [currentView, navigateTo, selectedTemplate, , templateCustomization] = useContext(ViewContext)
    const { currentUser, openAuthModal, favorites, handleToggleFavorite } = useAuth()
    const containerRef = useRef(null)
    const cardRef = useRef(null)
    const contentRef = useRef(null)
    const actionsRef = useRef(null)
    const iframeContainerRef = useRef(null)
    const iframeRef = useRef(null) // Added to target iframe directly for postMessage
    const [iframeScale, setIframeScale] = useState(1)
    const [deviceView, setDeviceView] = useState('desktop')
    const [isTogglingFavorite, setIsTogglingFavorite] = useState(false)
    const [hasSeenPreview, setHasSeenPreview] = useState(false)
    const [isMobileFullPreview, setIsMobileFullPreview] = useState(false)
    const [refreshKey, setRefreshKey] = useState(0)
    const autoExitDone = useRef(false)
    const { unlockedTemplates, templatePrices, unlock } = useWallet()
    const price = templatePrices[selectedTemplate?.id] || 100
    const isUnlockedGlobal = unlockedTemplates?.includes(selectedTemplate?.id)
    const [isUnlocking, setIsUnlocking] = useState(false)

    const handleGlobalUnlock = async () => {
        if (!currentUser) {
            openAuthModal()
            return
        }
        setIsUnlocking(true)
        try {
            await unlock(selectedTemplate.id)
        } catch (err) {
            alert(err.message || "Failed to unlock template")
        } finally {
            setIsUnlocking(false)
        }
    }

    const isFavorite = favorites?.includes(selectedTemplate?.id)

    const handleRefresh = () => {
        setRefreshKey(prev => prev + 1)
    }

    // Lock body scroll on desktop when preview is active
    useEffect(() => {
        document.body.style.overflow = 'hidden'
        return () => { document.body.style.overflow = '' }
    }, [])

    // Handle initial resize scaling
    useEffect(() => {
        if (!iframeContainerRef.current || currentView !== 'preview') return;

        const observer = new ResizeObserver((entries) => {
            for (let entry of entries) {
                // Determine base dimensions based on current view mode
                let baseWidth = 1280;
                let baseHeight = 720;

                if (isMobileFullPreview) {
                    baseWidth = 393;
                    baseHeight = 852;
                } else {
                    if (deviceView === 'tablet') { baseWidth = 768; baseHeight = 1024; }
                    if (deviceView === 'mobile') { baseWidth = 393; baseHeight = 852; }
                }

                const scaleX = entry.contentRect.width / baseWidth;
                const scaleY = entry.contentRect.height / baseHeight;
                
                // Use the minimum scale to ensure it fits both width and height (no scrolling)
                let scale = Math.min(scaleX, scaleY);
                
                // Prevent over-scaling (zooming) on desktop when not in fullscreen
                if (deviceView === 'desktop' && !isMobileFullPreview) {
                    scale = Math.min(scale, 1);
                }

                setIframeScale(scale);
            }
        });

        observer.observe(iframeContainerRef.current);
        return () => observer.disconnect();
    }, [currentView, selectedTemplate, deviceView, isMobileFullPreview]);

    // Apply global template customizations and track scroll progress
    useEffect(() => {
        if (currentView !== 'preview' || !selectedTemplate || !iframeRef.current) return;

        const customData = templateCustomization?.[selectedTemplate.id];

        const handleTemplateMessage = (event) => {
            const data = event.data;
            if (!data || typeof data !== 'object') return;

            console.log("Template Message Received:", data.type);

            // Slightly more relaxed check to ensure we don't miss it during re-renders
            const isFromIframe = iframeRef.current && event.source === iframeRef.current.contentWindow;

            if (data.type === 'TEMPLATE_COMPLETED') {
                console.log("Unlock Signal Detected!");
                setHasSeenPreview(true);
            }
        };

        window.addEventListener('message', handleTemplateMessage);

        const setupIframeLogic = () => {
            const iframe = iframeRef.current;
            if (!iframe || !iframe.contentWindow) return;

            // Prevent running on about:blank
            if (iframe.contentWindow.location.href === 'about:blank') return;

            // Sync Customization Data
            if (customData) {
                iframe.contentWindow.postMessage({ type: 'customize', ...customData }, '*');
            }
        };

        const iframe = iframeRef.current;
        iframe.addEventListener('load', setupIframeLogic);

        if (iframe.contentDocument?.readyState === 'complete' && iframe.contentWindow?.location?.href !== 'about:blank') {
            setupIframeLogic();
        }

        return () => {
            if (iframe) iframe.removeEventListener('load', setupIframeLogic);
            window.removeEventListener('message', handleTemplateMessage);
        };
    }, [currentView, selectedTemplate, templateCustomization])

    useEffect(() => {
        if (currentView === 'preview') {
            const originalStyle = window.getComputedStyle(document.body).overflow;
            const originalHtmlStyle = window.getComputedStyle(document.documentElement).overflow;
            
            // Apply strict locking
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';
            document.body.style.position = 'fixed';
            document.body.style.width = '100%';
            document.body.style.height = '100%';
            document.body.style.touchAction = 'none'; // Prevent touch gestures from scrolling

            return () => {
                document.body.style.overflow = originalStyle;
                document.documentElement.style.overflow = originalHtmlStyle;
                document.body.style.position = '';
                document.body.style.width = '';
                document.body.style.height = '';
                document.body.style.touchAction = '';
            };
        }
    }, [currentView, isMobileFullPreview]);

    useEffect(() => {
        if (currentView === 'preview' && selectedTemplate) {
            setHasSeenPreview(false);

            // Entrance animation - more subtle and premium
            const tl = gsap.timeline({ 
                defaults: { 
                    ease: "expo.out",
                    duration: 1.4
                } 
            })

            tl.fromTo(containerRef.current,
                { opacity: 0 },
                { opacity: 1, duration: 0.6 }
            )
            .fromTo(cardRef.current,
                { y: 40, opacity: 0, scale: 0.98 },
                { y: 0, opacity: 1, scale: 1, clearProps: "opacity,transform" },
                "-=0.4"
            )
            .fromTo(contentRef.current,
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, clearProps: "opacity,transform" },
                "-=1.1"
            )
            .fromTo(actionsRef.current,
                { y: 15, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, clearProps: "opacity,transform" },
                "-=0.9"
            )
        }
    }, [currentView, selectedTemplate])

    // Unlock animation and auto-exit when hasSeenPreview becomes true for the first time
    useEffect(() => {
        if (hasSeenPreview && !autoExitDone.current) {
            // Mark as done so it doesn't repeat
            autoExitDone.current = true;

            // Softly exit fullscreen if active
            if (isMobileFullPreview) {
                setTimeout(() => {
                    setIsMobileFullPreview(false);
                }, 800); 
            }

            if (actionsRef.current) {
                const customizeBtn = actionsRef.current.querySelector('.tp-pill-primary');
                if (customizeBtn) {
                    gsap.fromTo(customizeBtn,
                        { scale: 1 },
                        {
                            scale: 1.05,
                            duration: 0.3,
                            yoyo: true,
                            repeat: 1,
                            ease: "power2.out",
                            clearProps: "scale"
                        }
                    );
                }
            }
        }
    }, [hasSeenPreview]); // Remove isMobileFullPreview from dependencies to avoid re-triggering

    if (currentView !== 'preview' || !selectedTemplate) return null

    const [showUnlockWarning, setShowUnlockWarning] = useState(false)

    // --- LivePreviewer-style inline frame sizing ---
    const getFrameStyle = () => {
        const base = {
            borderRadius: '32px',
            overflow: 'hidden',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.12)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 30px 60px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.05)',
            display: 'flex',
            flexDirection: 'column',
            padding: '6px', // Gap between border and content
            transition: 'all 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
        }

        if (isMobileFullPreview) {
            return { 
                ...base, 
                width: '100%', 
                height: '100%', 
                aspectRatio: '9/16',
                borderRadius: '0', 
                border: 'none', 
                padding: '0', 
                background: '#000',
                backdropFilter: 'none',
                boxShadow: 'none'
            }
        }

        switch (deviceView) {
            case 'tablet':
            case 'mobile':
                return { ...base, width: 'max-content', height: 'auto' }
            case 'desktop':
            default:
                return { ...base, width: '100%', maxWidth: '920px', height: 'auto' }
        }
    }

    const getIframeDimensions = () => {
        if (isMobileFullPreview) {
            return { width: 393, height: 852 }
        }
        switch (deviceView) {
            case 'tablet': return { width: 768, height: 1024 }
            case 'mobile': return { width: 393, height: 852 }
            default: return { width: 1280, height: 720 }
        }
    }

    const getContentAspectStyle = () => {
        const base = {
            position: 'relative',
            borderRadius: isMobileFullPreview ? '0' : '26px', // Matches outer 32px - 6px padding
            overflow: 'hidden',
            background: '#000',
            transition: 'all 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
            isolation: 'isolate',
            maskImage: 'radial-gradient(white, black)',
            WebkitMaskImage: 'radial-gradient(white, black)',
            transform: 'translateZ(0)',
        }

        if (isMobileFullPreview) {
            return { 
                ...base, 
                width: '100%', 
                height: '100%', 
                maxWidth: 'none',
                maxHeight: 'none',
                aspectRatio: '9/16',
                margin: '0',
                borderRadius: '0'
            }
        }

        switch (deviceView) {
            case 'tablet':
                return { ...base, height: '80vh', aspectRatio: '768/1024' }
            case 'mobile':
                return { ...base, height: '80vh', aspectRatio: '390/844' }
            case 'desktop':
            default:
                return { ...base, width: '100%', aspectRatio: '16/9' }
        }
    }


    const handleCustomize = () => {
        if (!hasSeenPreview) {
            setShowUnlockWarning(true)
            setTimeout(() => setShowUnlockWarning(false), 4000) // Auto-hide after 4s
            return
        }
        if (!currentUser) {
            openAuthModal(() => navigateTo('editor'))
            return
        }
        navigateTo('editor')
    }

    const handleBack = () => {
        navigateTo('gallery')
    }

    const onToggleFavorite = async () => {
        setIsTogglingFavorite(true)
        await handleToggleFavorite(selectedTemplate.id)
        setIsTogglingFavorite(false)
    }

    return (
        <div ref={containerRef} className={`tp-showcase-container view-${deviceView} ${isMobileFullPreview ? 'tp-mobile-fullscreen' : ''}`}>
            {/* Premium Animated Background */}
            <div className="tp-bg-gradient" />
            <div className="tp-bg-glow" />

            {/* Top Navigation */}
            <nav className="w-full h-12 flex items-center px-6 md:px-12 border-b border-white/5 bg-black/20 backdrop-blur-md sticky top-0 z-100">
                <div className="w-full flex items-center justify-between">
                    <button
                        className="group flex items-center gap-3 text-white/40 hover:text-white transition-colors"
                        onClick={handleBack}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:-translate-x-1 transition-transform">
                            <polyline points="15 18 9 12 15 6" />
                        </svg>
                        <span className="text-[10px] font-mono uppercase tracking-[0.3em] font-bold">Back to Gallery</span>
                    </button>

                    {/* Mobile & Desktop Actions */}
                    <div className="flex items-center gap-2">
                        {/* Refresh Button */}
                        <button
                            className="tp-device-btn"
                            onClick={handleRefresh}
                            title="Refresh Preview"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 2v6h-6M3 12a9 9 0 0 1 15-6.7L21 8M3 22v-6h6M21 12a9 9 0 0 1-15 6.7L3 16" />
                            </svg>
                        </button>

                        {/* Mobile Fullscreen Toggle */}
                        <button
                            className={`tp-device-btn tp-mobile-only tp-pulse-white ${isMobileFullPreview ? 'tp-fs-active' : ''}`}
                            onClick={() => setIsMobileFullPreview(!isMobileFullPreview)}
                            title={isMobileFullPreview ? "Exit Full Screen" : "Full Screen Preview"}
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="tp-fullscreen-svg">
                                {isMobileFullPreview ? (
                                    <>
                                        <path className="tp-arrow-in-tl" d="M3 8h5V3M8 8l-5-5" />
                                        <path className="tp-arrow-in-br" d="M21 16h-5v5M16 16l5 5" />
                                    </>
                                ) : (
                                    <>
                                        <path className="tp-arrow-out-tr" d="M13 5h6v6M19 5l-7 7" />
                                        <path className="tp-arrow-out-bl" d="M11 19H5v-6M5 19l7-7" />
                                    </>
                                )}
                            </svg>
                        </button>

                        {/* Premium Device Switcher - Desktop Only */}
                        <div className="tp-device-switcher hidden md:flex">
                            <button
                                className={`tp-device-btn ${deviceView === 'desktop' ? 'active' : ''}`}
                                onClick={() => setDeviceView('desktop')}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                                    <line x1="8" y1="21" x2="16" y2="21" />
                                    <line x1="12" y1="17" x2="12" y2="21" />
                                </svg>
                            </button>
                            <button
                                className={`tp-device-btn ${deviceView === 'tablet' ? 'active' : ''}`}
                                onClick={() => setDeviceView('tablet')}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
                                    <line x1="12" y1="18" x2="12.01" y2="18" />
                                </svg>
                            </button>
                            <button
                                className={`tp-device-btn ${deviceView === 'mobile' ? 'active' : ''}`}
                                onClick={() => setDeviceView('mobile')}
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                                    <line x1="12" y1="18" x2="12.01" y2="18" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="tp-content-main">
                {/* Left Column: Description & Actions */}
                <div className="tp-left-column">
                    {/* Tier 2: Description & Message (Side by Side) */}
                    <div ref={contentRef} className="tp-info-section">
                        <div className="tp-info-row">
                            <div className="tp-description-points">
                                {(selectedTemplate.features || [
                                    { emoji: "✨", text: "Premium layout, perfect for memories" },
                                    { emoji: "🔒", text: "Secure, ad-free and private viewing" }
                                ]).map((feature, idx) => (
                                    <div key={idx} className="tp-trust-point">
                                        <span className="tp-emoji">{feature.emoji}</span> {feature.text}
                                    </div>
                                ))}
                            </div>

                            <div className="tp-touch-card-mini">
                                <div className="tp-touch-thumb-mini">
                                    <img src={selectedTemplate.img} alt={selectedTemplate.title} />
                                    <div className="tp-music-visualizer">
                                        <div className="tp-bar"></div>
                                        <div className="tp-bar"></div>
                                        <div className="tp-bar"></div>
                                        <div className="tp-bar"></div>
                                    </div>
                                </div>
                                <div className="tp-touch-info-mini">
                                    <strong>{selectedTemplate.title}</strong>
                                    <span>
                                        {selectedTemplate.category?.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase())}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tier 3: Action Buttons */}
                    <div ref={actionsRef} className="tp-actions-pills">
                        <button
                            className="tp-pill-btn tp-pill-secondary"
                            onClick={onToggleFavorite}
                            disabled={isTogglingFavorite}
                        >
                            <span className="flex items-center gap-2">
                                {isFavorite ? (
                                    <>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" className="text-pink-500">
                                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                                        </svg>
                                        Remove from favorite
                                    </>
                                ) : (
                                    <>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                                        </svg>
                                        Add to favorite
                                    </>
                                )}
                            </span>
                        </button>
                        <button
                            className={`tp-pill-btn tp-pill-primary ${(!isUnlockedGlobal || !hasSeenPreview) ? 'tp-btn-locked' : ''}`}
                            onClick={!isUnlockedGlobal ? handleGlobalUnlock : handleCustomize}
                            disabled={isUnlocking}
                        >
                            <span>
                                {!isUnlockedGlobal 
                                    ? (price === 0 ? 'Claim for 0' : `Unlock for ${price}`)
                                    : (hasSeenPreview ? 'Customize View' : 'Explore to Unlock')}
                            </span>
                            <div className="tp-pill-arrow">
                                {!isUnlockedGlobal ? (
                                    <WishbitIcon size={28} className="drop-shadow-none" />
                                ) : hasSeenPreview ? (
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                        <polyline points="9 18 15 12 9 6" />
                                    </svg>
                                ) : (
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="3" y="11" width="18" height="11" rx="5" ry="5" />
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                    </svg>
                                )}
                            </div>
                        </button>
                    </div>
                </div>

                <div className="tp-right-column">
                    <div ref={cardRef} className="tp-card-wrapper" style={getFrameStyle()}>
                        <div
                            ref={iframeContainerRef}
                            style={getContentAspectStyle()}
                        >
                            {(() => {
                                const { width: iWidth, height: iHeight } = getIframeDimensions();
                                return (
                                    <iframe
                                        key={refreshKey}
                                        ref={iframeRef}
                                        src={selectedTemplate.url}
                                        title="Template Preview"
                                        className="tp-preview-iframe"
                                        style={{
                                            position: 'absolute',
                                            top: isMobileFullPreview ? 0 : '50%',
                                            left: isMobileFullPreview ? 0 : '50%',
                                            width: isMobileFullPreview ? '100%' : `${iWidth}px`,
                                            height: isMobileFullPreview ? '100%' : `${iHeight}px`,
                                            transform: isMobileFullPreview ? 'none' : `translate(-50%, -50%) scale(${iframeScale})`,
                                            transformOrigin: 'center center',
                                            border: 'none',
                                            display: 'block',
                                            pointerEvents: 'auto',
                                            borderRadius: 'inherit',
                                            backfaceVisibility: 'hidden',
                                            WebkitBackfaceVisibility: 'hidden',
                                        }}
                                    />
                                );
                            })()}
                            <div className="tp-iframe-deadzone" />
                        </div>
                    </div>
                </div>
            </main>

            {/* Unlock Warning Toast */}
            {showUnlockWarning && (
                <div className="fixed bottom-24 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-[480px] z-[10000]">
                    <div className="relative overflow-hidden bg-[#1a0b2e]/80 backdrop-blur-3xl border border-white/10 p-1.5 rounded-2xl flex items-center gap-4 shadow-[0_25px_60px_rgba(0,0,0,0.6)] animate-in fade-in zoom-in-95 slide-in-from-bottom-10 duration-500">
                        {/* Inner Glow */}
                        <div className="absolute inset-0 bg-radial-at-tl from-fuchsia-500/10 via-transparent to-transparent pointer-events-none" />
                        
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-fuchsia-600/20 to-pink-600/20 flex items-center justify-center shrink-0 border border-fuchsia-500/20 relative group">
                            <div className="absolute inset-0 bg-fuchsia-500/20 blur-lg rounded-full animate-pulse" />
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f472b6" strokeWidth="2.5" className="relative z-10">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                            </svg>
                        </div>
                        
                        <div className="flex-1 pr-4">
                            <p className="text-white/95 text-[11px] md:text-[13px] font-bold leading-snug tracking-tight">
                                Please watch the full preview to unlock customization ✨
                            </p>
                        </div>

                        {/* Subtle Progress Bar */}
                        <div className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-fuchsia-500 to-pink-500 w-full animate-toast-progress" />
                    </div>
                </div>
            )}
        </div>
    )
}
