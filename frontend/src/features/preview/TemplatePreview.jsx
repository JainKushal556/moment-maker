import { useContext, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ViewContext } from '../../context/NavContext'
import { useAuth } from '../../context/AuthContext'
import './template-preview.css'

export default function TemplatePreview() {
    const [currentView, setCurrentView, selectedTemplate, , templateCustomization] = useContext(ViewContext)
    const { currentUser, openAuthModal } = useAuth()
    const containerRef = useRef(null)
    const cardRef = useRef(null)
    const contentRef = useRef(null)
    const actionsRef = useRef(null)
    const iframeContainerRef = useRef(null)
    const iframeRef = useRef(null) // Added to target iframe directly for postMessage
    const [iframeScale, setIframeScale] = useState(1)
    const [deviceView, setDeviceView] = useState('desktop')

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

    // Apply global template customizations to the showcase iframe
    useEffect(() => {
        if (currentView !== 'preview' || !selectedTemplate || !iframeRef.current || !templateCustomization) return;

        const customData = templateCustomization[selectedTemplate.id];
        if (!customData) return;

        const syncData = () => {
             if (iframeRef.current && iframeRef.current.contentWindow) {
                 iframeRef.current.contentWindow.postMessage({ type: 'customize', ...customData }, '*')
             }
        }

        syncData()
        const iframe = iframeRef.current;
        iframe.addEventListener('load', syncData)
        return () => iframe.removeEventListener('load', syncData)
    }, [currentView, selectedTemplate, templateCustomization])

    useEffect(() => {
        if (currentView === 'preview' && selectedTemplate) {
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

    if (currentView !== 'preview' || !selectedTemplate) return null

    const handleCustomize = () => {
        if (!currentUser) {
            // User not logged in — open the auth modal.
            // After successful login, send them straight to the editor.
            openAuthModal(() => setCurrentView('editor'))
            return
        }
        setCurrentView('editor')
    }

    const handleBack = () => {
        setCurrentView('categories')
    }

    return (
        <div ref={containerRef} className={`tp-showcase-container view-${deviceView}`}>
            {/* Premium Animated Background */}
            <div className="tp-bg-gradient" />
            <div className="tp-bg-glow" />

            {/* Top Navigation */}
            <nav className="w-full h-12 flex items-center px-8 md:px-16 border-b border-white/5 bg-black/20 backdrop-blur-md sticky top-0 z-100">
                <div className="max-w-[1600px] mx-auto w-full flex items-center justify-between">
                    <button 
                        className="group flex items-center gap-3 text-white/40 hover:text-white transition-colors"
                        onClick={handleBack}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:-translate-x-1 transition-transform">
                            <polyline points="15 18 9 12 15 6"/>
                        </svg>
                        <span className="text-[10px] font-mono uppercase tracking-[0.3em] font-bold">Back to Explorers</span>
                    </button>

                    {/* Premium Device Switcher */}
                    <div className="tp-device-switcher">
                        <button 
                            className={`tp-device-btn ${deviceView === 'desktop' ? 'active' : ''}`}
                            onClick={() => setDeviceView('desktop')}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                                <line x1="8" y1="21" x2="16" y2="21"/>
                                <line x1="12" y1="17" x2="12" y2="21"/>
                            </svg>
                        </button>
                        <button 
                            className={`tp-device-btn ${deviceView === 'tablet' ? 'active' : ''}`}
                            onClick={() => setDeviceView('tablet')}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <rect x="4" y="2" width="16" height="20" rx="2" ry="2"/>
                                <line x1="12" y1="18" x2="12.01" y2="18"/>
                            </svg>
                        </button>
                        <button 
                            className={`tp-device-btn ${deviceView === 'mobile' ? 'active' : ''}`}
                            onClick={() => setDeviceView('mobile')}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
                                <line x1="12" y1="18" x2="12.01" y2="18"/>
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
                                <div className="tp-play-icon-mini">
                                    <svg viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M8 5v14l11-7z"/>
                                    </svg>
                                </div>
                            </div>
                            <div className="tp-touch-info-mini">
                                <strong>{selectedTemplate.title}</strong>
                                <span>{selectedTemplate.category} Template</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tier 3: Action Buttons */}
                <div ref={actionsRef} className="tp-actions-pills">
                    <button className="tp-pill-btn tp-pill-secondary" onClick={handleBack}>
                        <span>Draft</span>
                    </button>
                    <button className="tp-pill-btn tp-pill-primary" onClick={handleCustomize}>
                        <span>Customize View</span>
                        <div className="tp-pill-arrow">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                <polyline points="9 18 15 12 9 6"/>
                            </svg>
                        </div>
                    </button>
                </div>
            </main>
        </div>
    )
}
