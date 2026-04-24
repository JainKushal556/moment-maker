import { useEffect, useRef, useState, useCallback } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import '../../styles/customization.css'

const DEFAULT_CUSTOMIZATION = {
  recipientName: 'Rashmii',
  personalMessage: 'Remember, you deserve every happiness in the world. Celebrate big and enjoy every moment!',
  images: [
    '/templates/birthday/birthday-mosaic/images/r1.png',
    '/templates/birthday/birthday-mosaic/images/r2.png',
    '/templates/birthday/birthday-mosaic/images/r3.png',
    '/templates/birthday/birthday-mosaic/images/r4.png',
    '/templates/birthday/birthday-mosaic/images/r5.jpg'
  ]
}

const ACCENT_COLORS = ['#00f2fe', '#7000ff', '#ff00de', '#ffd700', '#ff5e62', '#28c840']
const GLOW_COLORS = ['#ff00de', '#00f2fe', '#7000ff', '#ffd700', '#ff5e62', '#00ffaa']

export default function Customization() {
  const containerRef = useRef(null)
  const iframeRef = useRef(null)
  const [customization, setCustomization] = useState({ ...DEFAULT_CUSTOMIZATION })
  const [activeTab, setActiveTab] = useState('personalize')
  const [templateReady, setTemplateReady] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  // GSAP Entry Animations
  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 80%',
      }
    })

    tl.from('.cust-label', { opacity: 0, y: 20, duration: 0.6 })
      .from('.cust-title', { opacity: 0, y: 30, duration: 0.8 }, '-=0.4')
      .from('.cust-subtitle', { opacity: 0, y: 20, duration: 0.8 }, '-=0.6')
      .from('.studio-panel', { opacity: 0, x: -50, duration: 1, ease: 'power4.out' }, '-=0.4')
      .from('.studio-viewport', { opacity: 0, x: 50, duration: 1, ease: 'power4.out' }, '-=1')
  }, { scope: containerRef })

  // Send customization to iframe
  const sendCustomization = useCallback((data) => {
    const iframe = iframeRef.current
    if (!iframe || !iframe.contentWindow) return
    iframe.contentWindow.postMessage({ type: 'customize', ...(data || customization) }, '*')
  }, [customization])

  // Message listener
  useEffect(() => {
    const handler = (event) => {
      if (event.data?.type === 'templateReady') { 
        setTemplateReady(true)
        sendCustomization() 
      }
      if (event.data?.type === 'playing') setIsPlaying(true)
    }
    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [sendCustomization])

  const updateField = (key, value) => {
    const next = { ...customization, [key]: value }
    setCustomization(next)
    sendCustomization(next)
  }

  const handlePlayPause = () => {
    const iframe = iframeRef.current
    if (!iframe?.contentWindow) return
    if (!isPlaying) { 
      iframe.contentWindow.postMessage({ type: 'play' }, '*')
      setIsPlaying(true) 
    } else { 
      iframe.contentWindow.postMessage({ type: 'pause' }, '*')
      setIsPlaying(false) 
    }
  }

  const handleReset = () => {
    setCustomization({ ...DEFAULT_CUSTOMIZATION })
    sendCustomization(DEFAULT_CUSTOMIZATION)
  }

  return (
    <section className="customization" ref={containerRef}>
      <div className="container">
        <header className="cust-header">
          <span className="cust-label">The Studio</span>
          <h2 className="cust-title">Personalize The Magic</h2>
          <p className="cust-subtitle">
            Experience our 3D Photo Mosaic engine. 
            Real-time customization for moments that last a lifetime.
          </p>
        </header>

        <div className="cust-grid">
          {/* Studio Panel */}
          <aside className="studio-panel">
            <nav className="studio-tabs">
              <button 
                className={`studio-tab-btn ${activeTab === 'personalize' ? 'active' : ''}`}
                onClick={() => setActiveTab('personalize')}
              >
                Personalize
              </button>
              <button 
                className={`studio-tab-btn ${activeTab === 'design' ? 'active' : ''}`}
                onClick={() => setActiveTab('design')}
              >
                Gallery
              </button>
              <button 
                className={`studio-tab-btn ${activeTab === 'effects' ? 'active' : ''}`}
                onClick={() => setActiveTab('effects')}
              >
                Status
              </button>
            </nav>

            <div className="studio-content">
              {activeTab === 'personalize' && (
                <div className="tab-fade-in">
                  <div className="studio-group">
                    <label className="studio-label">Recipient Name</label>
                    <input 
                      type="text" 
                      className="studio-input"
                      placeholder="e.g. Sarah"
                      value={customization.recipientName}
                      onChange={(e) => updateField('recipientName', e.target.value)}
                    />
                  </div>
                  <div className="studio-group">
                    <label className="studio-label">Birthday Wish</label>
                    <textarea 
                      className="studio-input"
                      style={{ height: '120px', resize: 'none' }}
                      value={customization.personalMessage}
                      onChange={(e) => updateField('personalMessage', e.target.value)}
                    />
                  </div>
                </div>
              )}

              {activeTab === 'design' && (
                <div className="tab-fade-in">
                   <div className="studio-group">
                    <label className="studio-label">Mosaic Engine</label>
                    <p className="studio-subtitle" style={{ fontSize: '0.8rem', marginTop: '0' }}>
                        This template uses an automated 3D carousel. Upload your own photos in the full editor to see them come alive.
                    </p>
                  </div>
                  <div className="studio-group">
                    <label className="studio-label">Current Gallery</label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                        {customization.images.map((img, i) => (
                            <div key={i} style={{ aspectRatio: '1/1', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                                <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.5 }} />
                            </div>
                        ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'effects' && (
                <div className="tab-fade-in">
                  <div className="studio-group">
                    <label className="studio-label">Interactive Status</label>
                    <div style={{ padding: '20px', background: 'rgba(0, 242, 254, 0.05)', border: '1px solid rgba(0, 242, 254, 0.1)', borderRadius: '4px' }}>
                        <p style={{ fontSize: '0.85rem', color: 'var(--studio-accent)' }}>● Studio Link Active</p>
                        <p style={{ fontSize: '0.75rem', marginTop: '10px', color: 'var(--studio-text-dim)' }}>
                            The 3D preview is currently synchronized with your inputs. Any changes to the name or message will reflect instantly.
                        </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <footer className="studio-footer">
              <button className="studio-btn-save" onClick={() => alert('Start your journey to use this template!')}>
                Use This Template
              </button>
            </footer>
          </aside>

          {/* Viewport Display */}
          <div className="studio-viewport">
            <div className="viewport-header">
              <div className="viewport-status">
                <div className="status-dot"></div>
                Live Preview
              </div>
              <div className="viewport-controls">
                <button className="viewport-btn" onClick={handlePlayPause}>
                  <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'}`}></i>
                </button>
                <button className="viewport-btn" onClick={handleReset}>
                  <i className="fas fa-undo"></i>
                </button>
              </div>
            </div>

            <div className="viewport-iframe-container">
              {!templateReady && (
                <div className="viewport-loader">
                  <div className="loader-spinner"></div>
                  <span className="studio-label">Syncing 3D Mosaic...</span>
                </div>
              )}
              <iframe 
                ref={iframeRef} 
                src="/templates/birthday/birthday-mosaic/index.html" 
                title="Preview" 
                onLoad={() => setTemplateReady(true)}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
