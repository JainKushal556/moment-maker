import { useContext, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ViewContext } from '../../context/NavContext'
import { useAuth } from '../../context/AuthContext'
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
    const isFavorite = favorites?.includes(selectedTemplate?.id)

    // Handle initial resize scaling
    useEffect(() => {
        if (!iframeContainerRef.current || currentView !== 'preview') return;

        const observer = new ResizeObserver((entries) => {
            for (let entry of entries) {
                let baseWidth = 1280;
                if (deviceView === 'tablet') baseWidth = 768;
                if (deviceView === 'mobile') baseWidth = 390;
                setIframeScale(entry.contentRect.width / baseWidth);
            }
        });

        observer.observe(iframeContainerRef.current);
        return () => observer.disconnect();
    }, [currentView, selectedTemplate, deviceView]);

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
        if (currentView === 'preview' && selectedTemplate) {
            setHasSeenPreview(false);

            // Entrance animation
            const tl = gsap.timeline({ defaults: { ease: "power4.out" } })

            tl.fromTo(containerRef.current,
                { opacity: 0 },
                { opacity: 1, duration: 0.8 }
            )
                .fromTo(cardRef.current,
                    { y: 60, opacity: 0, scale: 0.95 },
                    { y: 0, opacity: 1, scale: 1, duration: 1.2 },
                    "-=0.4"
                )
                .fromTo(contentRef.current,
                    { y: 30, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.8 },
                    "-=0.8"
                )
                .fromTo(actionsRef.current,
                    { y: 20, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.8 },
                    "-=0.6"
                )
        }
    }, [currentView, selectedTemplate])

    // Unlock animation when hasSeenPreview becomes true
    useEffect(() => {
        if (hasSeenPreview && actionsRef.current) {
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
    }, [hasSeenPreview]);

    if (currentView !== 'preview' || !selectedTemplate) return null

    const [showUnlockWarning, setShowUnlockWarning] = useState(false)

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
        <div ref={containerRef} className={`tp-showcase-container view-${deviceView}`}>
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

                    {/* Premium Device Switcher */}
                    <div className="tp-device-switcher hidden md:flex mr-4 md:mr-24">
                        <button
                            className={`tp-device-btn ${deviceView === 'desktop' ? 'active' : ''}`}
                            onClick={() => setDeviceView('desktop')}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                                <line x1="8" y1="21" x2="16" y2="21" />
                                <line x1="12" y1="17" x2="12" y2="21" />
                            </svg>
                        </button>
                        <button
                            className={`tp-device-btn ${deviceView === 'tablet' ? 'active' : ''}`}
                            onClick={() => setDeviceView('tablet')}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
                                <line x1="12" y1="18" x2="12.01" y2="18" />
                            </svg>
                        </button>
                        <button
                            className={`tp-device-btn ${deviceView === 'mobile' ? 'active' : ''}`}
                            onClick={() => setDeviceView('mobile')}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                                <line x1="12" y1="18" x2="12.01" y2="18" />
                            </svg>
                        </button>
                    </div>
                </div>
            </nav>

            <main className="tp-content-main">
                {/* Tier 1: The Mockup Card */}
                <div ref={cardRef} className={`tp-card-wrapper view-${deviceView}`}>
                    <div className="tp-card-inner">
                        <div className="tp-card-glass">
                            <div className={`tp-iframe-container view-${deviceView}`} ref={iframeContainerRef}>
                                <iframe
                                    ref={iframeRef}
                                    src={selectedTemplate.url}
                                    title="Template Preview"
                                    className={`tp-preview-iframe view-${deviceView}`}
                                    style={{ transform: `scale(${iframeScale})` }}
                                />
                                {/* Overlay to prevent iframe interaction while scrolling/animating */}
                                <div className="tp-iframe-deadzone" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tier 2: Description & Message (Side by Side) */}
                <div ref={contentRef} className="tp-info-section">
                    <div className="tp-info-row">
                        <div className="tp-description-points">
                            <div className="tp-trust-point">
                                <span className="tp-emoji">✨</span> Premium layout, perfect for memories
                            </div>
                            <div className="tp-trust-point">
                                <span className="tp-emoji">🔒</span> Secure, ad-free and private viewing
                            </div>
                        </div>

                        <div className="tp-touch-card-mini">
                            <div className="tp-touch-thumb-mini">
                                <img src={selectedTemplate.img} alt="" />
                            </div>
                            <div className="tp-touch-info-mini">
                                <strong>{selectedTemplate.title}</strong>
                                <span className="capitalize">{selectedTemplate.category}</span>
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
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" className="text-pink-500">
                                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                                    </svg>
                                    Remove from favorite
                                </>
                            ) : (
                                <>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                                    </svg>
                                    Add to favorite
                                </>
                            )}
                        </span>
                    </button>
                    <button
                        className={`tp-pill-btn tp-pill-primary ${!hasSeenPreview ? 'tp-btn-locked' : ''}`}
                        onClick={handleCustomize}
                    >
                        <span>{hasSeenPreview ? 'Customize View' : 'Explore to Unlock'}</span>
                        <div className="tp-pill-arrow">
                            {hasSeenPreview ? (
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                    <polyline points="9 18 15 12 9 6" />
                                </svg>
                            ) : (
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                </svg>
                            )}
                        </div>
                    </button>
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
