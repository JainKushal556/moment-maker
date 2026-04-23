import { useEffect, useRef, useState } from 'react'
import { getPublicMoment } from '../../services/api'
import { templates } from '../../data/templates'

export default function PublicViewer({ momentId }) {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [momentData, setMomentData] = useState(null)
    const [template, setTemplate] = useState(null)
    const iframeRef = useRef(null)

    useEffect(() => {
        const fetchMoment = async () => {
            try {
                // Handle Visitor ID for Session Tracking
                let visitorId = localStorage.getItem('moment_visitor_id');
                if (!visitorId) {
                    // Generate a simple unique ID for this device
                    visitorId = 'v_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
                    localStorage.setItem('moment_visitor_id', visitorId);
                }

                const data = await getPublicMoment(momentId, visitorId)
                setMomentData(data)
                
                // Find matching template config
                const t = templates.find(temp => temp.id === data.templateId)
                if (!t) throw new Error("Template not found")
                
                setTemplate(t)
            } catch (err) {
                console.error(err)
                if (err.message?.includes("time limit") || err.message?.includes("viewer limit")) {
                    setError("This moment link has expired.")
                } else {
                    setError(err.message || "This moment doesn't exist or has been removed.")
                }
            } finally {
                setLoading(false)
            }
        }
        fetchMoment()
    }, [momentId])

    useEffect(() => {
        if (!iframeRef.current || !momentData) return

        const iframe = iframeRef.current
        const sendData = () => {
            iframe.contentWindow?.postMessage({
                type: 'customize',
                ...momentData.customization
            }, '*')
        }

        // Send immediately on load
        iframe.addEventListener('load', sendData)
        
        // Also fire periodically for 5 seconds to ensure the iframe's React app catches it 
        // even if it hydrates AFTER the iframe DOM load event fires.
        const interval = setInterval(sendData, 500)
        const timeout = setTimeout(() => clearInterval(interval), 5000)

        return () => {
            iframe.removeEventListener('load', sendData)
            clearInterval(interval)
            clearTimeout(timeout)
        }
    }, [momentData])

    if (loading) {
        return (
            <div style={{ backgroundColor: '#0a0a12', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', fontFamily: 'Inter, sans-serif' }}>
                 <div className="mc-mini-spinner" style={{ width: 30, height: 30, borderTopColor: '#f472b6' }}></div>
            </div>
        )
    }

    if (error || !template) {
        return (
            <div style={{ backgroundColor: '#0a0a12', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: 'rgba(255,255,255,0.5)', fontFamily: 'Inter, sans-serif' }}>
                <h2>Oops!</h2>
                <p>{error}</p>
                <a href="/" style={{ color: '#c084fc', marginTop: '20px', textDecoration: 'none' }}>Make your own moment</a>
            </div>
        )
    }

    return (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'black' }}>
            <iframe
                ref={iframeRef}
                src={template.url}
                style={{ width: '100%', height: '100%', border: 'none' }}
                title="A Special Moment"
                allow="autoplay; fullscreen"
            />
            {/* Subtle watermark encouraging them to create their own */}
            <a 
                href="/" 
                target="_blank"
                rel="noreferrer"
                style={{
                    position: 'absolute',
                    bottom: '20px',
                    right: '20px',
                    color: 'rgba(255, 255, 255, 0.4)',
                    textDecoration: 'none',
                    fontSize: '12px',
                    fontFamily: 'Inter, sans-serif',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    padding: '6px 12px',
                    borderRadius: '50px',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    transition: 'all 0.3s ease'
                }}
                onMouseEnter={e => {
                    e.currentTarget.style.color = '#fff'
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)'
                }}
                onMouseLeave={e => {
                    e.currentTarget.style.color = 'rgba(255, 255, 255, 0.4)'
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
                }}
            >
                Made with WishCraft
            </a>
        </div>
    )
}
