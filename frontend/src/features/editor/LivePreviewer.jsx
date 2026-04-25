import { useState, useRef, useEffect, useContext, useMemo } from 'react'
import { ViewContext } from '../../context/NavContext'
import { useAuth } from '../../context/AuthContext'
import { Check, Share2, Edit3, RotateCcw, PlayCircle } from 'lucide-react'
import { saveMoment, updateMoment } from '../../services/api'
import { uploadImage, base64ToFile, getFirebaseToken } from '../../services/cloudinary'
import { getIntroById } from '../../data/intros'

export default function LivePreviewer({ template, customization, refreshKey, introId, senderName }) {
    const [, setCurrentView, , , , , , , setSharedMomentId, editingMomentId, setEditingMomentId] = useContext(ViewContext)
    const [device, setDevice] = useState('desktop')
    const iframeContainerRef = useRef(null)
    const [iframeScale, setIframeScale] = useState(1)
    const frameRef = useRef(null)
    const [internalRefreshKey, setInternalRefreshKey] = useState(0)

    // Intro Playback State
    const [showIntro, setShowIntro] = useState(false)
    const introConfig = useMemo(() => introId ? getIntroById(introId) : null, [introId])

    // Always keep a ref to the latest customization so iframe load handlers
    // don't get trapped in a stale closure
    const customizationRef = useRef(customization)
    useEffect(() => {
        customizationRef.current = customization
    }, [customization])

    const syncCustomization = (data) => {
        const iframe = frameRef.current
        if (iframe?.contentWindow) {
            iframe.contentWindow.postMessage({ type: 'customize', ...(data ?? customizationRef.current) }, '*')
        }
    }

    // Only sync/reload on template change or explicit refresh
    useEffect(() => {
        if (!showIntro) syncCustomization()
    }, [template, refreshKey, internalRefreshKey, showIntro])

    // Play intro when a new intro is selected
    useEffect(() => {
        if (introConfig) {
            setShowIntro(true)
        }
    }, [introId])

    const handleManualRefresh = () => {
        setInternalRefreshKey(prev => prev + 1)
        if (introConfig) setShowIntro(true)
    }


    useEffect(() => {
        if (!iframeContainerRef.current) return;

        const observer = new ResizeObserver((entries) => {
            for (let entry of entries) {
                let baseWidth = 1280;
                if (device === 'tablet') baseWidth = 768;
                if (device === 'mobile') baseWidth = 390;
                setIframeScale(entry.contentRect.width / baseWidth);
            }
        });

        observer.observe(iframeContainerRef.current);
        return () => observer.disconnect();
    }, [device]);

    useEffect(() => {
        // Sync customization after iframe reload — use ref to avoid stale closure
        const iframe = frameRef.current
        const handleLoad = () => {
            let count = 0
            const interval = setInterval(() => {
                syncCustomization(customizationRef.current)
                count++
                if (count > 5) clearInterval(interval)
            }, 200)
        }
        if (iframe) iframe.addEventListener('load', handleLoad)

        return () => {
            if (iframe) iframe.removeEventListener('load', handleLoad)
        }
    }, [refreshKey, template, internalRefreshKey, showIntro])

    const getFrameStyle = () => {
        switch (device) {
            case 'tablet':
                return {
                    height: '80%', aspectRatio: '768/1024', borderRadius: '24px', maxWidth: '85%',
                    boxShadow: '0 30px 80px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.08)',
                }
            case 'mobile':
                return {
                    height: '80%', aspectRatio: '390/844', borderRadius: '40px', maxWidth: '85%',
                    boxShadow: '0 30px 80px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.08)',
                }
            case 'desktop':
            default:
                return {
                    width: '90%', maxWidth: '1000px', borderRadius: '16px', display: 'flex', flexDirection: 'column',
                    boxShadow: '0 30px 80px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.08)'
                }
        }
    }

    const getContentAspectStyle = () => {
        switch (device) {
            case 'tablet': return { aspectRatio: '768/1024', width: '100%' }
            case 'mobile': return { aspectRatio: '390/844', width: '100%' }
            default: return { aspectRatio: '1280/720', width: '100%' }
        }
    }

    const getIframeDimensions = () => {
        switch (device) {
            case 'tablet': return { width: 768, height: 1024 }
            case 'mobile': return { width: 390, height: 844 }
            default: return { width: 1280, height: 720 }
        }
    }

    // Build the correct iframe src
    const getIframeSrc = () => {
        if (!template) return ''
        return template.url
    }

    const { width: iWidth, height: iHeight } = getIframeDimensions()

    const IntroComp = introConfig?.component;

    return (
        <div className="editor-preview-area relative pt-20">

            <div className="absolute top-6 right-6 flex flex-col items-center gap-2 p-2 bg-[#1a1a1a]/95 backdrop-blur-2xl border border-white/10 rounded-2xl z-50 shadow-2xl">
                {[
                    { id: 'desktop', label: 'Desktop', icon: <><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></> },
                    { id: 'tablet', label: 'Tablet', icon: <><rect width="16" height="20" x="4" y="2" rx="2" ry="2" /><line x1="12" y1="18" x2="12.01" y2="18" /></> },
                    { id: 'mobile', label: 'Phone', icon: <><rect width="12" height="20" x="6" y="2" rx="2" ry="2" /><line x1="12" y1="18" x2="12.01" y2="18" /></> }
                ].map(d => (
                    <button
                        key={d.id}
                        onClick={() => setDevice(d.id)}
                        title={d.label}
                        className={`w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 ${device === d.id ? 'bg-white/15 text-white shadow-lg' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">{d.icon}</svg>
                    </button>
                ))}
            </div>

            <div className="preview-device-frame" style={getFrameStyle()}>
                <div className="browser-header">
                    <div className="browser-dots">
                        <div className="browser-dot" style={{ background: '#ff5f56' }} />
                        <div className="browser-dot" style={{ background: '#ffbd2e' }} />
                        <div className="browser-dot" style={{ background: '#27c93f' }} />
                    </div>
                    <div className="browser-address relative">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="mr-2"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                        momentcrafter.app/v/moment
                        <button
                            onClick={handleManualRefresh}
                            className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-all active:scale-90 z-20"
                            title="Refresh Preview"
                        >
                            <RotateCcw size={14} />
                        </button>
                    </div>
                </div>

                <div className="browser-content bg-black relative overflow-hidden flex-1" ref={iframeContainerRef} style={getContentAspectStyle()}>
                    {showIntro && IntroComp ? (
                        <div className="absolute inset-0 z-50 bg-black">
                            <IntroComp
                                key={internalRefreshKey}
                                senderName={senderName || "Your Name"}
                                onFinish={() => setShowIntro(false)}
                            />
                        </div>
                    ) : template ? (
                        <iframe
                            key={`${refreshKey}-${internalRefreshKey}`}
                            ref={frameRef}
                            src={getIframeSrc()}
                            title="Preview"
                            className="bg-black border-0 absolute top-0 left-0"
                            style={{
                                width: `${iWidth}px`,
                                height: `${iHeight}px`,
                                transform: `scale(${iframeScale})`,
                                transformOrigin: 'top left'
                            }}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/20 font-mono italic">Select a template...</div>
                    )}
                </div>
            </div>
        </div>
    )
}
