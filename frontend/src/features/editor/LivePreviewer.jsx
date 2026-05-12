import { useState, useRef, useEffect, useContext, useMemo } from 'react'
import { ViewContext } from '../../context/NavContext'
import { useAuth } from '../../context/AuthContext'
import { Check, Share2, Edit3, RotateCcw, PlayCircle } from 'lucide-react'
import { saveMoment, updateMoment } from '../../services/api'
import { uploadImage, base64ToFile, getFirebaseToken } from '../../services/cloudinary'
import { getIntroById } from '../../data/intros'

export default function LivePreviewer({ template, customization, refreshKey, introId, senderName, isMobileFullPreview, setIsMobileFullPreview, deviceView }) {
    const [, navigateTo, , , , , , , setSharedMomentId, editingMomentId, setEditingMomentId] = useContext(ViewContext)
    const iframeContainerRef = useRef(null)
    const [iframeScale, setIframeScale] = useState(1)
    const frameRef = useRef(null)
    const [internalRefreshKey, setInternalRefreshKey] = useState(0)

    // Intro Playback State
    const [showIntro, setShowIntro] = useState(false)
    const introConfig = useMemo(() => introId ? getIntroById(introId) : null, [introId])

    // Generate shareable URL
    const getMomentUrl = () => {
        const domain = typeof window !== 'undefined' ? window.location.origin : 'momentcrafter.app'
        if (editingMomentId) {
            return `${domain}/w/${editingMomentId}`
        }
        return `${domain}/w/moment`
    }

    // Always keep a ref to the latest customization so iframe load handlers
    // don't get trapped in a stale closure
    const customizationRef = useRef(customization)
    useEffect(() => {
        customizationRef.current = customization
    }, [customization])

    const syncCustomization = (data) => {
        const iframe = frameRef.current
        if (iframe?.contentWindow) {
            // Send the explicit data or the current customization prop
            iframe.contentWindow.postMessage({ type: 'customize', ...(data ?? customization) }, '*')
        }
    }

    // Only sync/reload on template change or explicit refresh
    useEffect(() => {
        if (!showIntro) syncCustomization(customization)
    }, [template, refreshKey, internalRefreshKey, showIntro, customization])

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

    // Link global refresh button (from header) to local refresh logic
    useEffect(() => {
        if (refreshKey > 0) {
            handleManualRefresh()
        }
    }, [refreshKey])


    useEffect(() => {
        if (!iframeContainerRef.current) return;

        const observer = new ResizeObserver((entries) => {
            for (let entry of entries) {
                let baseWidth = 1280;
                if (deviceView === 'tablet') baseWidth = 768;
                if (deviceView === 'mobile') baseWidth = 393;
                setIframeScale(entry.contentRect.width / baseWidth);
            }
        });

        observer.observe(iframeContainerRef.current);
        return () => observer.disconnect();
    }, [deviceView]);

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
    }, [refreshKey, template, internalRefreshKey, showIntro, customization?.selectedFontSet])

    const getFrameStyle = () => {
        const base = {
            borderRadius: '24px',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 30px 80px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.08)',
            overflow: 'hidden',
            background: '#000'
        }
        if (isMobileFullPreview) {
            return { ...base, height: '100%', width: '100%', aspectRatio: '9/16', borderRadius: '0' }
        }
        switch (deviceView) {
            case 'tablet':
                return { ...base, height: '85%', aspectRatio: '768/1024', borderRadius: '24px' }
            case 'mobile':
                return {
                    ...base, height: '90%', aspectRatio: '390/844', borderRadius: '24px'
                }
            case 'desktop':
            default:
                return { 
                    ...base, 
                    width: '90%', 
                    maxWidth: '1000px', 
                    borderRadius: '16px'
                }
        }
    }

    const getContentAspectStyle = () => {
        if (isMobileFullPreview) {
            return { flex: 1, width: '100%', position: 'relative' }
        }
        return { flex: deviceView === 'desktop' ? 'none' : 1, width: '100%', position: 'relative', aspectRatio: deviceView === 'desktop' ? '16/9' : undefined }
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

    // Build the correct iframe src
    const getIframeSrc = () => {
        if (!template) return ''
        return template.url
    }

    const { width: iWidth, height: iHeight } = getIframeDimensions()

    const IntroComp = introConfig?.component;

    return (
        <div className="editor-preview-area relative pt-0 md:pt-20">



            <div className="preview-device-frame" style={getFrameStyle()}>
                <div className="browser-header">
                    <div className="browser-dots hidden md:flex">
                        <div className="browser-dot" style={{ background: '#ff5f56' }} />
                        <div className="browser-dot" style={{ background: '#ffbd2e' }} />
                        <div className="browser-dot" style={{ background: '#27c93f' }} />
                    </div>
                    <div className="browser-address relative flex items-center justify-center px-4 md:px-10 gap-3 overflow-hidden">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="shrink-0 opacity-50"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                        <span className="truncate text-[10px] font-mono text-white/50 select-none">
                            {getMomentUrl()}
                        </span>
                    </div>
                </div>

                <div className="browser-content bg-black relative overflow-hidden flex-1" ref={iframeContainerRef} style={getContentAspectStyle()}>
                    {showIntro && IntroComp ? (
                        <div 
                            className="absolute inset-0 z-50 bg-black"
                            style={isMobileFullPreview ? { width: '100%', height: '100%' } : {
                                width: `${iWidth}px`,
                                height: `${iHeight}px`,
                                transform: `scale(${iframeScale})`,
                                transformOrigin: 'top left'
                            }}
                        >
                            <IntroComp
                                key={`${refreshKey}-${internalRefreshKey}`}
                                senderName={senderName || "Your Name"}
                                onFinish={() => setShowIntro(false)}
                            />
                        </div>
                    ) : template ? (
                        <iframe
                            key={`${refreshKey}-${internalRefreshKey}-${customization?.selectedFontSet || ''}`}
                            ref={frameRef}
                            src={getIframeSrc()}
                            title="Preview"
                            className="bg-black border-0 absolute top-0 left-0"
                            style={isMobileFullPreview ? { width: '100%', height: '100%' } : {
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
