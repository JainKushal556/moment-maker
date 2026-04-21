import { useState, useContext, useEffect } from 'react'
import { ViewContext } from '../../context/NavContext'
import { useAuth } from '../../context/AuthContext'
import './share.css'

export default function ShareView() {
    const [currentView, setCurrentView, , , , , , sharedMomentId] = useContext(ViewContext)
    const { currentUser, logout } = useAuth()
    const [copied, setCopied] = useState(false)

    const [generatedLink, setGeneratedLink] = useState('')
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        if (currentView === 'share') {
            // Build the clean public link using the current domain and saved moment ID
            const host = window.location.host
            if (sharedMomentId) {
                setGeneratedLink(`${host}/w/${sharedMomentId}`)
            } else {
                setGeneratedLink(`${host}/w/demo`)
            }
            setCopied(false)
            // Stagger entrance
            setTimeout(() => setIsLoaded(true), 100)
        } else {
            setIsLoaded(false)
        }
    }, [currentView, sharedMomentId])

    if (currentView !== 'share') return null

    const handleCopy = () => {
        navigator.clipboard?.writeText(`https://${generatedLink}`)
        setCopied(true)
        setTimeout(() => setCopied(false), 2500)
    }

    const handleWhatsApp = () => {
        window.open(`https://wa.me/?text=I made something special for you! ✨ https://${generatedLink}`, '_blank')
    }

    const handleEmail = () => {
        window.open(`mailto:?subject=Something special for you ✨&body=I made something just for you! Open it here: https://${generatedLink}`, '_blank')
    }

    const handleMessenger = () => {
        window.open(`https://www.facebook.com/dialog/send?link=https://${generatedLink}&app_id=0&redirect_uri=https://${generatedLink}`, '_blank')
    }

    const handlePreview = () => {
        setCurrentView('editor')
    }

    const handleCreateNew = () => {
        setCurrentView('categories')
    }

    const handleLogout = async () => {
        try {
            await logout()
            setCurrentView('landing')
        } catch (error) {
            console.error('Logout failed', error)
        }
    }

    return (
        <div className="share-container">
            {/* ── Top Navigation ── */}
            {/* ── Minimal Top Navigation ── */}
            <div style={{ position: 'absolute', top: '30px', left: '40px', zIndex: 10 }}>
                <button 
                    onClick={() => setCurrentView('mycreations')}
                    style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: 'rgba(255, 255, 255, 0.7)',
                        padding: '8px 16px',
                        borderRadius: '100px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '14px',
                        fontWeight: '500',
                        backdropFilter: 'blur(10px)',
                        transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.color = '#fff'
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)'
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
                    }}
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="19" y1="12" x2="5" y2="12"></line>
                        <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                    Back to My Creations
                </button>
            </div>

            {/* ── Main Content ── */}
            <main className={`share-content ${isLoaded ? 'visible' : ''}`}>
                {/* Hero Icon */}
                <div className="share-hero-icon">
                    <div className="share-icon-glow"></div>
                    <div className="share-icon-circle">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5.8 11.3 2 22l10.7-3.8z"/>
                            <path d="M4 3h.01"/><path d="M22 8h.01"/><path d="M15 2h.01"/><path d="M22 20h.01"/><path d="M20 12h.01"/><path d="M12 4h.01"/><path d="M18 5l-2.9 2.9"/><path d="m9 15 3 3"/><path d="m15 13 3 3"/>
                        </svg>
                    </div>
                    {/* Sparkle stars */}
                    <div className="share-sparkle share-sparkle-1">★</div>
                    <div className="share-sparkle share-sparkle-2">★</div>
                    <div className="share-sparkle share-sparkle-3">★</div>
                </div>

                {/* Heading */}
                <h1 className="share-heading">It's ready to shine!</h1>
                <p className="share-subtitle">
                    Your magical moment has been crafted. Share it with<br/>
                    your favorite person now.
                </p>

                {/* Share Card */}
                <div className="share-card">
                    {/* Link Section */}
                    <div className="share-link-section">
                        <label className="share-link-label">YOUR UNIQUE LINK</label>
                        <div className="share-link-box">
                            <div className="share-link-url">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="share-link-icon">
                                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                                </svg>
                                <span>{generatedLink}</span>
                            </div>
                            <button className={`share-copy-btn ${copied ? 'copied' : ''}`} onClick={handleCopy}>
                                {copied ? (
                                    <>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                        Copied!
                                    </>
                                ) : (
                                    <>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                                        Copy
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="share-divider">
                        <div className="share-divider-line"></div>
                        <span className="share-divider-text">Or share directly</span>
                        <div className="share-divider-line"></div>
                    </div>

                    {/* Social Buttons */}
                    <div className="share-socials">
                        <button className="share-social-btn" onClick={handleWhatsApp}>
                            <div className="share-social-icon whatsapp">
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                            </div>
                            <span>WhatsApp</span>
                        </button>
                        <button className="share-social-btn" onClick={handleMessenger}>
                            <div className="share-social-icon messenger">
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.36 2 2 6.13 2 11.7c0 2.91 1.2 5.42 3.15 7.22V22l2.96-1.63c.84.23 1.72.36 2.64.36h.25c5.64 0 10-4.13 10-9.7S17.64 2 12 2zm1.08 13.06l-2.56-2.73L5.68 15.06l4.89-5.19 2.56 2.73 4.84-2.73-4.89 5.19z"/></svg>
                            </div>
                            <span>Messenger</span>
                        </button>
                        <button className="share-social-btn" onClick={handleEmail}>
                            <div className="share-social-icon email">
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                            </div>
                            <span>Email</span>
                        </button>
                    </div>

                    {/* Preview Button */}
                    <button className="share-preview-btn" onClick={handlePreview}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                            <circle cx="12" cy="12" r="3"/>
                        </svg>
                        Preview as Recipient
                    </button>
                </div>
            </main>
        </div>
    )
}
