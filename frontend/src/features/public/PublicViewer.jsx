import { useEffect, useRef, useState } from 'react'
import { getPublicMoment } from '../../services/api'
import { templates } from '../../data/templates'

const CACHE_NAME = 'moment-images-cache';

async function processAndCacheImages(customization, blobUrlsRef) {
    if (!customization) return customization;
    
    // Deep clone to avoid mutating the original state unexpectedly
    const processed = JSON.parse(JSON.stringify(customization));

    async function processNode(node) {
        if (typeof node === 'string') {
            if (node.includes('res.cloudinary.com')) {
                try {
                    const cache = await caches.open(CACHE_NAME);
                    const cachedResponse = await cache.match(node);
                    
                    if (cachedResponse) {
                        const blob = await cachedResponse.blob();
                        const blobUrl = URL.createObjectURL(blob);
                        blobUrlsRef.current.push(blobUrl);
                        console.log(`[Cache] Image loaded directly from local cache:\n${node}`);
                        return blobUrl;
                    } else {
                        console.log(`[Cache] Downloading & saving image to local cache:\n${node}`);
                        const response = await fetch(node);
                        if (response.ok) {
                            const cacheResponse = response.clone();
                            await cache.put(node, cacheResponse);
                            const blob = await response.blob();
                            const blobUrl = URL.createObjectURL(blob);
                            blobUrlsRef.current.push(blobUrl);
                            return blobUrl;
                        }
                    }
                } catch (err) {
                    console.error("[Cache] Failed to process image caching:", err);
                }
            }
            return node;
        } else if (Array.isArray(node)) {
            return await Promise.all(node.map(item => processNode(item)));
        } else if (typeof node === 'object' && node !== null) {
            const newObj = {};
            for (const key of Object.keys(node)) {
                newObj[key] = await processNode(node[key]);
            }
            return newObj;
        }
        return node;
    }

    return await processNode(processed);
}

export default function PublicViewer({ momentId }) {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [momentData, setMomentData] = useState(null)
    const [template, setTemplate] = useState(null)
    const iframeRef = useRef(null)
    const blobUrlsRef = useRef([])

    useEffect(() => {
        // Cleanup blob URLs on unmount to free memory
        return () => {
            if (blobUrlsRef.current) {
                blobUrlsRef.current.forEach(url => URL.revokeObjectURL(url));
            }
        };
    }, []);

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
                
                // Process and cache any Cloudinary images
                if (data.customization) {
                    data.customization = await processAndCacheImages(data.customization, blobUrlsRef);
                }
                
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
                Made with Moment Crafter
            </a>
        </div>
    )
}
