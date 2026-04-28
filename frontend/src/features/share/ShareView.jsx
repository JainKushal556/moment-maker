import { useState, useContext, useEffect } from 'react'
import { ViewContext } from '../../context/NavContext'
import './share.css'

export default function ShareView() {
    const [currentView, navigateTo, , , , , , sharedMomentId] = useContext(ViewContext)
    const [copied, setCopied] = useState(false)
    const [generatedLink, setGeneratedLink] = useState('')
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        if (currentView === 'share') {
            const host = window.location.host
            setGeneratedLink(`${host}/w/${sharedMomentId || 'demo'}`)
            setCopied(false)
            const timer = setTimeout(() => setIsLoaded(true), 100)
            return () => clearTimeout(timer)
        }

        setIsLoaded(false)
    }, [currentView, sharedMomentId])

    if (currentView !== 'share') return null

    const fallbackCopy = (text) => {
        const textArea = document.createElement('textarea')
        textArea.value = text
        textArea.style.position = 'fixed'
        textArea.style.left = '-999999px'
        textArea.style.top = '-999999px'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        try {
            document.execCommand('copy')
            setCopied(true)
            setTimeout(() => setCopied(false), 2500)
        } catch (err) {
            console.error('Fallback copy failed', err)
        }
        document.body.removeChild(textArea)
    }

    const handleCopy = () => {
        const textToCopy = `https://${generatedLink}`
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(textToCopy)
                .then(() => {
                    setCopied(true)
                    setTimeout(() => setCopied(false), 2500)
                })
                .catch(() => {
                    fallbackCopy(textToCopy)
                })
        } else {
            fallbackCopy(textToCopy)
        }
    }

    const handleWhatsApp = () => {
        window.open(`https://wa.me/?text=I made something special for you! https://${generatedLink}`, '_blank')
    }

    const handleEmail = () => {
        window.open(`mailto:?subject=Something special for you&body=I made something just for you. Open it here: https://${generatedLink}`, '_blank')
    }

    const handleMessenger = () => {
        window.open(`https://www.facebook.com/dialog/send?link=https://${generatedLink}&app_id=0&redirect_uri=https://${generatedLink}`, '_blank')
    }

    return (
        <div className="share-container">
            <div
                className="share-bg-grid"
                style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
                    backgroundSize: '32px 32px'
                }}
            />
            <div className="share-bg-glow share-bg-glow-one" />
            <div className="share-bg-glow share-bg-glow-two" />

            <nav className="share-topbar">
                <div className="share-topbar-inner">
                    <button className="share-nav-btn" onClick={() => navigateTo('editor')}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <polyline points="15 18 9 12 15 6" />
                        </svg>
                        <span>Back to Editor</span>
                    </button>

                    <button className="share-nav-btn share-nav-btn-secondary" onClick={() => navigateTo('moments')}>
                        <span>My Moments</span>
                    </button>
                </div>
            </nav>

            <main className={`share-content ${isLoaded ? 'visible' : ''}`}>
                <section className="share-panel" aria-label="Share your moment">
                    <header className="share-panel-header">
                        <div>
                            <span className="share-panel-kicker">Ready to share</span>
                            <h1 className="share-heading">Your Moment</h1>
                        </div>

                        <div className="share-status-list">
                            <span>Link created</span>
                            <span>Private view</span>
                            <span>Easy sharing</span>
                        </div>
                    </header>

                    <div className="share-limits-box">
                        <div className="share-limit-item">
                            <svg className="share-limit-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                            <div className="share-limit-texts">
                                <span className="share-limit-title">Validity Limit</span>
                                <span className="share-limit-desc">Expires 5 minutes after creation or update.</span>
                            </div>
                        </div>
                        <div className="share-limit-item">
                            <svg className="share-limit-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                            <div className="share-limit-texts">
                                <span className="share-limit-title">Access Limit</span>
                                <span className="share-limit-desc">Allows a maximum of 4 unique viewer sessions.</span>
                            </div>
                        </div>
                    </div>

                    <div className="share-link-section">
                        <label className="share-link-label">Share Link</label>
                        <div className="share-link-box">
                            <div className="share-link-url">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="share-link-icon">
                                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                                </svg>
                                <span>{generatedLink}</span>
                            </div>

                            <button className={`share-copy-btn ${copied ? 'copied' : ''}`} onClick={handleCopy}>
                                {copied ? (
                                    <>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                        Copied
                                    </>
                                ) : (
                                    <>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></svg>
                                        Copy
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="share-divider">
                        <div className="share-divider-line" />
                        <span className="share-divider-text">Send Directly</span>
                        <div className="share-divider-line" />
                    </div>

                    <div className="share-socials">
                        <button className="share-social-btn whatsapp-btn" onClick={handleWhatsApp}>
                            <div className="share-social-icon whatsapp">
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                            </div>
                            <span>WhatsApp</span>
                        </button>

                        <button className="share-social-btn messenger-btn" onClick={handleMessenger}>
                            <div className="share-social-icon messenger">
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.36 2 2 6.13 2 11.7c0 2.91 1.2 5.42 3.15 7.22V22l2.96-1.63c.84.23 1.72.36 2.64.36h.25c5.64 0 10-4.13 10-9.7S17.64 2 12 2zm1.08 13.06l-2.56-2.73L5.68 15.06l4.89-5.19 2.56 2.73 4.84-2.73-4.89 5.19z" /></svg>
                            </div>
                            <span>Messenger</span>
                        </button>

                        <button className="share-social-btn email-btn" onClick={handleEmail}>
                            <div className="share-social-icon email">
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                            </div>
                            <span>Email</span>
                        </button>
                    </div>

                    {/* Buttons removed as requested */}
                </section>
            </main>
        </div>
    )
}
