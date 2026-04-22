import { useState, useRef, useEffect, useContext } from 'react'
import { ViewContext } from '../../context/NavContext'
import { useAuth } from '../../context/AuthContext'
import { Check, Share2, Edit3 } from 'lucide-react'
import { saveMoment, updateMoment } from '../../services/api'
import { uploadImage, base64ToFile, getFirebaseToken } from '../../services/cloudinary'

export default function LivePreviewer({ template, customization, refreshKey }) {
    const [, setCurrentView, , , , , , , setSharedMomentId, editingMomentId, setEditingMomentId] = useContext(ViewContext)
    const [device, setDevice] = useState('desktop')
    const iframeContainerRef = useRef(null)
    const [iframeScale, setIframeScale] = useState(1)
    const frameRef = useRef(null)
    const revealTimerRef = useRef(null)
    const fallbackTimerRef = useRef(null)
    const [isSharing, setIsSharing] = useState(false)
    const [visiblePreviewKey, setVisiblePreviewKey] = useState(-1)

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

    const clearCompletionTimers = () => {
        if (revealTimerRef.current) window.clearTimeout(revealTimerRef.current)
        if (fallbackTimerRef.current) window.clearTimeout(fallbackTimerRef.current)
    }

    // Sync whenever customization, template or refreshKey changes
    useEffect(() => {
        syncCustomization()
    }, [customization, template, refreshKey])

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
        const handleMessage = (e) => {
            if (e.data?.type !== 'preview_complete') return
            revealTimerRef.current = window.setTimeout(() => {
                setVisiblePreviewKey(refreshKey)
            }, 7000)
        }
        window.addEventListener('message', handleMessage)

        // Sync customization after iframe reload — use ref to avoid stale closure
        const iframe = frameRef.current
        const handleLoad = () => {
            setTimeout(() => {
                syncCustomization(customizationRef.current)
            }, 300)
        }
        if (iframe) iframe.addEventListener('load', handleLoad)

        return () => {
            clearCompletionTimers()
            if (iframe) iframe.removeEventListener('load', handleLoad)
            window.removeEventListener('message', handleMessage)
        }
    }, [refreshKey, template])

    useEffect(() => {
        return () => { clearCompletionTimers() }
    }, [])

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

    const { currentUser, openAuthModal } = useAuth()

    const executeShare = async () => {
        setIsSharing(true)
        try {
            // Images are already uploaded to Cloudinary during the "Save as Draft" step.
            // Here we only need to update the status to 'shared'.
            let data
            if (editingMomentId) {
                data = await updateMoment(editingMomentId, {
                    templateId: template.id,
                    title: template.title,
                    status: 'shared',
                    customization: customization
                })
            } else {
                // Edge case: user clicks Share without saving a draft first
                data = await saveMoment({
                    templateId: template.id,
                    title: template.title,
                    status: 'shared',
                    customization: customization
                })
            }
            setSharedMomentId(data.id)
            setEditingMomentId(null)
            setVisiblePreviewKey(-1)
            setCurrentView('share')
        } catch (error) {
            console.error("Failed to share moment", error)
            alert("Could not create share link. Please try again.")
        } finally {
            setIsSharing(false)
        }
    }

    const handleShare = () => {
        if (!currentUser) {
            openAuthModal(() => {
                executeShare()
            })
            return
        }
        executeShare()
    }

    // Build the correct iframe src — append ?preview=1 for proposal template
    const getIframeSrc = () => {
        if (!template) return ''
        if (template.id === 'romantic-proposal') return `${template.url}?preview=1`
        return template.url
    }

    const { width: iWidth, height: iHeight } = getIframeDimensions()

    return (
        <div className="editor-preview-area relative">
            {visiblePreviewKey === refreshKey && visiblePreviewKey !== -1 && (
                <div className="preview-complete-overlay">
                    <div className="preview-choice-card">
                        <div className="preview-choice-badge">
                            <div className="preview-choice-badge-icon">
                                <Check size={18} strokeWidth={3} />
                            </div>
                            <span>Moment Ready</span>
                        </div>

                        <div className="preview-choice-copy">
                            <h1>Your moment is ready</h1>
                            <p>{template?.title || 'Your moment'} is saved as a preview. Keep editing or open the share page.</p>
                        </div>

                        <div className="preview-choice-actions">
                            <button
                                onClick={() => setVisiblePreviewKey(-1)}
                                className="preview-choice-btn preview-choice-btn-secondary"
                            >
                                <span className="preview-choice-btn-icon">
                                    <Edit3 size={18} strokeWidth={2.4} />
                                </span>
                                <span>Continue Editing</span>
                            </button>

                            <button
                                onClick={handleShare}
                                disabled={isSharing}
                                className="preview-choice-btn preview-choice-btn-primary"
                            >
                                <span className="preview-choice-btn-icon">
                                    <Share2 size={18} strokeWidth={2.4} />
                                </span>
                                <span>{isSharing ? 'Opening Share...' : 'Open Share'}</span>
                            </button>
                        </div>

                        <div className="preview-choice-meta">
                            <span>{template?.title || 'Custom moment'}</span>
                            <span className="preview-choice-meta-dot" />
                            <span>{device}</span>
                        </div>
                    </div>
                </div>
            )}

            <div className="absolute top-0 right-1 flex items-center gap-2 p-1.5 bg-[#1a1a1a]/80 backdrop-blur-xl border border-white/10 rounded-full z-30 shadow-2xl">
                {[
                    { id: 'desktop', label: 'Desktop', icon: <><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></> },
                    { id: 'tablet', label: 'Tablet', icon: <><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></> },
                    { id: 'mobile', label: 'Phone', icon: <><rect width="12" height="20" x="6" y="2" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></> }
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
                    <div className="browser-address">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="mr-2"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                        wishcraft.app/v/moment
                    </div>
                </div>

                <div className="browser-content bg-black relative overflow-hidden flex-1" ref={iframeContainerRef} style={getContentAspectStyle()}>
                    {template ? (
                        <iframe
                            key={refreshKey}
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
