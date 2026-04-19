import { useState, useRef, useEffect, useContext, lazy, Suspense } from 'react'
import { ViewContext } from '../../context/NavContext'
import { Check, Share2, Edit3 } from 'lucide-react'

const WarmCompliment = lazy(() => import('../../templates/WarmCompliment/WarmCompliment'))

export default function LivePreviewer({ template, customization, refreshKey }) {
    const [, setCurrentView] = useContext(ViewContext)
    const [device, setDevice] = useState('desktop')
    const frameRef = useRef(null)
    const customizationRef = useRef(customization)
    const revealTimerRef = useRef(null)
    const fallbackTimerRef = useRef(null)
    const [isSharing, setIsSharing] = useState(false)
    const [visiblePreviewKey, setVisiblePreviewKey] = useState(-1)

    const syncCustomization = () => {
        const iframe = frameRef.current
        if (iframe?.contentWindow) {
            iframe.contentWindow.postMessage({ type: 'customize', ...customizationRef.current }, '*')
        }
    }

    const clearCompletionTimers = () => {
        if (revealTimerRef.current) {
            window.clearTimeout(revealTimerRef.current)
        }

        if (fallbackTimerRef.current) {
            window.clearTimeout(fallbackTimerRef.current)
        }
    }

    useEffect(() => {
        customizationRef.current = customization
    }, [customization])

    useEffect(() => {
        syncCustomization()
    }, [customization, template, refreshKey])

    useEffect(() => {
        let completionResolved = false

        const revealOptions = (delay = 0) => {
            clearCompletionTimers()
            revealTimerRef.current = window.setTimeout(() => {
                setVisiblePreviewKey(refreshKey)
            }, delay)
        }

        const handleMessage = (e) => {
            if (e.data?.type !== 'preview_complete') return
            completionResolved = true
            revealOptions(400)
        }
        window.addEventListener('message', handleMessage)

        const iframe = frameRef.current
        const handleLoad = () => {
            syncCustomization()

            const fallbackDelay = template?.id === 'cp-v1' ? 8000 : 1200
            fallbackTimerRef.current = window.setTimeout(() => {
                if (completionResolved) return
                completionResolved = true
                revealOptions(250)
            }, fallbackDelay)
        }

        if (iframe) {
            iframe.addEventListener('load', handleLoad)
        }

        // No fallback timer for interactive templates like cp-v1; we strictly wait for the 'preview_complete' message.

        return () => {
            clearCompletionTimers()
            if (iframe) iframe.removeEventListener('load', handleLoad)
            window.removeEventListener('message', handleMessage)
        }
    }, [refreshKey, template])

    useEffect(() => {
        return () => {
            clearCompletionTimers()
        }
    }, [])

    const getFrameStyle = () => {
        switch (device) {
            case 'tablet':
                return {
                    width: '65%',
                    height: '90%',
                    borderRadius: '20px',
                    boxShadow: '0 30px 80px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.08)',
                }
            case 'mobile':
                return {
                    width: '28%',
                    height: '90%',
                    borderRadius: '36px',
                    boxShadow: '0 30px 80px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.08)',
                }
            default:
                return {
                    width: '100%',
                    height: '100%',
                    borderRadius: '0px',
                    boxShadow: 'none',
                }
        }
    }

    const handleShare = () => {
        setIsSharing(true)
        setTimeout(() => {
            setIsSharing(false)
            setVisiblePreviewKey(-1)
            setCurrentView('share')
        }, 1200)
    }

    return (
        <div className="editor-preview-area relative">
            {visiblePreviewKey === refreshKey && visiblePreviewKey !== -1 && (
                <div className="preview-complete-overlay">
                    <div className="preview-choice-card">
                        <div className="preview-choice-badge">
                            <div className="preview-choice-badge-icon">
                                <Check size={18} strokeWidth={3} />
                            </div>
                            <span>Preview Ready</span>
                        </div>

                        <div className="preview-choice-copy">
                            <h1>Choose what to do next</h1>
                            <p>{template?.title || 'Your moment'} is ready. Keep editing or share it now.</p>
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
                                <span>{isSharing ? 'Opening Share...' : 'Share'}</span>
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

            <div
                className="preview-device-frame"
                style={getFrameStyle()}
            >
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

                <div className="browser-content bg-black relative overflow-hidden h-full">
                    {template ? (
                        template.isReact ? (
                            <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-white/50 bg-black">Loading...</div>}>
                                {template.id === 'cp-v1' && <WarmCompliment customization={customization} key={refreshKey} />}
                            </Suspense>
                        ) : (
                            <iframe key={refreshKey} ref={frameRef} src={template.url} title="Preview" className="bg-black w-full h-full border-0" />
                        )
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/20 font-mono italic">Select a template...</div>
                    )}
                </div>
            </div>
        </div>
    )
}
