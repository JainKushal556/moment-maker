import { useEffect, useRef, useState, useCallback } from 'react'
import '../../styles/customization.css'

function debounce(fn, delay = 150) {
  let timer
  return function (...args) { clearTimeout(timer); timer = setTimeout(() => fn.apply(this, args), delay) }
}

const DEFAULT_CUSTOMIZATION = {
  recipientName: '', message: 'Happy New Year', subMessage: 'The Future is Golden',
  accentColor: '#ffd700', glowColor: '#ff00de', font: "'Great Vibes', cursive",
  balloonColor: '#ff5e62', yearOld: '2025', yearNew: '2026',
  fireworkIntensity: 2, animationSpeed: 2, showCity: true
}

const ACCENT_COLORS = ['#ffd700', '#ff5e62', '#00f2fe', '#667eea', '#f093fb', '#28c840']
const GLOW_COLORS = ['#ff00de', '#ffd700', '#00f2fe', '#ff5e62', '#667eea', '#28c840']
const BALLOON_COLORS = ['#ff5e62', '#ffd700', '#00f2fe', '#667eea', '#f093fb', '#ff8c00']

export default function Customization() {
  const iframeRef = useRef(null)
  const [customization, setCustomization] = useState({ ...DEFAULT_CUSTOMIZATION })
  const [savedCustomization, setSavedCustomization] = useState({ ...DEFAULT_CUSTOMIZATION })
  const [activeTab, setActiveTab] = useState('personalize')
  const [unsavedTabs, setUnsavedTabs] = useState({ personalize: false, design: false, effects: false })
  const [templateReady, setTemplateReady] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showResetModal, setShowResetModal] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [showPopover, setShowPopover] = useState(false)
  const [popoverPos, setPopoverPos] = useState({ top: 0, left: 0 })
  const [firstWarningShown, setFirstWarningShown] = useState(false)
  const pendingTabRef = useRef(null)
  const toastTimeoutRef = useRef(null)

  // Send customization to iframe
  const sendCustomization = useCallback((data) => {
    const iframe = iframeRef.current
    if (!iframe || !iframe.contentWindow) return
    iframe.contentWindow.postMessage({ type: 'customize', ...(data || customization) }, '*')
  }, [customization])

  // Message listener
  useEffect(() => {
    const handler = (event) => {
      if (event.data?.type === 'templateReady') { setTemplateReady(true); sendCustomization() }
      if (event.data?.type === 'playing') setIsPlaying(true)
    }
    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [sendCustomization])

  const markUnsaved = useCallback((tabName) => {
    setUnsavedTabs(prev => ({ ...prev, [tabName]: 'dirty' }))
  }, [])

  const updateCustomization = useCallback((key, value, tabName) => {
    setCustomization(prev => {
      const next = { ...prev, [key]: value }
      const iframe = iframeRef.current
      if (iframe?.contentWindow) iframe.contentWindow.postMessage({ type: 'customize', ...next }, '*')
      return next
    })
    markUnsaved(tabName)
  }, [markUnsaved])

  const saveChanges = useCallback(() => {
    setSavedCustomization({ ...customization })
    setUnsavedTabs(prev => {
      const next = { ...prev }
      if (next[activeTab] === 'dirty') next[activeTab] = 'saved'
      return next
    })
    setFirstWarningShown(false)
  }, [customization, activeTab])

  const handleTabClick = useCallback((targetTabId, e) => {
    if (targetTabId === activeTab) return
    if (unsavedTabs[activeTab] === 'dirty') {
      pendingTabRef.current = targetTabId
      if (!firstWarningShown) {
        setToastMessage('You have unsaved changes.')
        setShowToast(true)
        if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current)
        toastTimeoutRef.current = setTimeout(() => setShowToast(false), 3000)
        setFirstWarningShown(true)
      } else {
        const btn = e.currentTarget
        const rect = btn.getBoundingClientRect()
        const container = btn.closest('.demo-controls')?.getBoundingClientRect() || { top: 0, left: 0 }
        setPopoverPos({ top: rect.bottom - container.top + 10, left: rect.left - container.left + rect.width / 2 - 100 })
        setShowPopover(true)
      }
    } else {
      setActiveTab(targetTabId)
    }
  }, [activeTab, unsavedTabs, firstWarningShown])

  const handlePopoverSave = useCallback(() => {
    setShowPopover(false); saveChanges()
    if (pendingTabRef.current) { setActiveTab(pendingTabRef.current); pendingTabRef.current = null }
  }, [saveChanges])

  const handlePopoverDiscard = useCallback(() => {
    setShowPopover(false)
    setCustomization({ ...savedCustomization })
    setUnsavedTabs(prev => ({ ...prev, [activeTab]: 'initial' }))
    setFirstWarningShown(false)
    sendCustomization(savedCustomization)
    if (pendingTabRef.current) { setActiveTab(pendingTabRef.current); pendingTabRef.current = null }
  }, [savedCustomization, activeTab, sendCustomization])

  const handlePlayPause = useCallback(() => {
    const iframe = iframeRef.current
    if (!iframe?.contentWindow) return
    if (!isPlaying) { iframe.contentWindow.postMessage({ type: 'play' }, '*'); setIsPlaying(true) }
    else { iframe.contentWindow.postMessage({ type: 'pause' }, '*'); setIsPlaying(false) }
  }, [isPlaying])

  const handleFullscreen = useCallback(() => {
    const iframe = iframeRef.current
    if (!iframe) return
    const data = savedCustomization
    const params = new URLSearchParams(Object.entries(data).reduce((acc, [k, v]) => ({ ...acc, [k]: String(v) }), {}))
    window.open(iframe.src.split('?')[0] + '?' + params.toString(), '_blank')
  }, [savedCustomization])

  const performFullReset = useCallback(() => {
    setShowResetModal(false)
    setCustomization({ ...DEFAULT_CUSTOMIZATION })
    setSavedCustomization({ ...DEFAULT_CUSTOMIZATION })
    setUnsavedTabs({ personalize: false, design: false, effects: false })
    setFirstWarningShown(false)
    setIsPlaying(false)
    const iframe = iframeRef.current
    if (iframe) { iframe.src = iframe.src.split('?')[0]; setTemplateReady(false) }
  }, [])

  const tabState = unsavedTabs[activeTab]
  let saveStatusText = ''; let saveStatusClass = 'save-status'
  let saveBtnClass = 'btn-save'; let saveBtnContent = <><i className="fas fa-save"></i> Save Changes</>
  if (tabState === 'dirty') { saveStatusText = '● Unsaved'; saveStatusClass += ' unsaved'; saveBtnClass += ' save-active' }
  else if (tabState === 'saved') { saveStatusText = '✓ Saved'; saveStatusClass += ' saved'; saveBtnClass += ' saved'; saveBtnContent = <><i className="fas fa-check"></i> Saved!</> }

  const ColorPicker = ({ colors, value, onChange }) => (
    <div className="color-picker">
      {colors.map(c => <div key={c} className={`color-option${value === c ? ' active' : ''}`} style={{ background: c }} data-color={c} onClick={() => onChange(c)} />)}
    </div>
  )

  return (
    <section className="customization">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Easy Customization</h2>
          <p className="section-subtitle">Design your perfect celebration in minutes—no coding needed.</p>
        </div>
        <div className="customization-demo">
          <div className="demo-controls" style={{ position: 'relative' }}>
            <div className="tab-bar">
              {[
                { id: 'personalize', icon: 'fa-pen', label: 'Personalize' },
                { id: 'design', icon: 'fa-palette', label: 'Design' },
                { id: 'effects', icon: 'fa-wand-magic-sparkles', label: 'Effects' }
              ].map(tab => (
                <button key={tab.id} className={`tab-btn${activeTab === tab.id ? ' active' : ''}`} data-tab={tab.id} onClick={(e) => handleTabClick(tab.id, e)}>
                  <i className={`fas ${tab.icon}`}></i> {tab.label}
                  {unsavedTabs[tab.id] === 'dirty' && <div className="tab-dot active"></div>}
                </button>
              ))}
            </div>

            {/* Personalize Tab */}
            <div className={`tab-panel${activeTab === 'personalize' ? ' active' : ''}`}>
              <div className="control-item"><label>Recipient Name</label><input type="text" id="recipient-input" placeholder="Enter their name..." value={customization.recipientName} onChange={debounce((e) => updateCustomization('recipientName', e.target.value, 'personalize'), 150)} /></div>
              <div className="control-item"><label>Main Message</label><input type="text" id="message-input" value={customization.message} onChange={(e) => updateCustomization('message', e.target.value || 'Happy New Year', 'personalize')} /></div>
              <div className="control-item"><label>Sub Message</label><input type="text" id="sub-message-input" value={customization.subMessage} onChange={(e) => updateCustomization('subMessage', e.target.value || 'The Future is Golden', 'personalize')} /></div>
            </div>

            {/* Design Tab */}
            <div className={`tab-panel${activeTab === 'design' ? ' active' : ''}`}>
              <div className="control-item"><label>Accent Color</label><ColorPicker colors={ACCENT_COLORS} value={customization.accentColor} onChange={(c) => updateCustomization('accentColor', c, 'design')} /></div>
              <div className="control-item"><label>Glow Color</label><ColorPicker colors={GLOW_COLORS} value={customization.glowColor} onChange={(c) => updateCustomization('glowColor', c, 'design')} /></div>
              <div className="control-item"><label>Balloon Color</label><ColorPicker colors={BALLOON_COLORS} value={customization.balloonColor} onChange={(c) => updateCustomization('balloonColor', c, 'design')} /></div>
              <div className="control-item"><label>Font Style</label>
                <select id="font-select" value={customization.font} onChange={(e) => updateCustomization('font', e.target.value, 'design')}>
                  <option value="'Great Vibes', cursive">Great Vibes</option>
                  <option value="'Playfair Display', serif">Playfair Display</option>
                  <option value="'Montserrat', sans-serif">Montserrat</option>
                  <option value="'Roboto Mono', monospace">Roboto Mono</option>
                </select>
              </div>
              <div className="control-row">
                <div className="control-item half"><label>Year (Old)</label><input type="number" id="year-old" value={customization.yearOld} onChange={(e) => updateCustomization('yearOld', e.target.value, 'design')} /></div>
                <div className="control-item half"><label>Year (New)</label><input type="number" id="year-new" value={customization.yearNew} onChange={(e) => updateCustomization('yearNew', e.target.value, 'design')} /></div>
              </div>
            </div>

            {/* Effects Tab */}
            <div className={`tab-panel${activeTab === 'effects' ? ' active' : ''}`}>
              <div className="control-item"><label>Firework Intensity</label><div className="slider-group"><input type="range" id="firework-intensity" min="0" max="4" value={customization.fireworkIntensity} onChange={(e) => updateCustomization('fireworkIntensity', parseInt(e.target.value), 'effects')} /><div className="slider-labels"><span>None</span><span>Normal</span><span>Max</span></div></div></div>
              <div className="control-item"><label>Animation Speed</label><div className="slider-group"><input type="range" id="animation-speed" min="0" max="4" value={customization.animationSpeed} onChange={(e) => updateCustomization('animationSpeed', parseInt(e.target.value), 'effects')} /><div className="slider-labels"><span>Slow</span><span>Normal</span><span>Fast</span></div></div></div>
              <div className="control-item"><div className="toggle-row"><span className="toggle-label">Show City Skyline</span><label className="toggle-switch"><input type="checkbox" id="show-city" checked={customization.showCity} onChange={(e) => updateCustomization('showCity', e.target.checked, 'effects')} /><span className="toggle-slider"></span></label></div></div>
            </div>

            <div className="save-bar">
              <button className={saveBtnClass} id="btn-save" onClick={saveChanges}>{saveBtnContent}</button>
              <span className={saveStatusClass} id="save-status">{saveStatusText}</span>
            </div>

            {/* Mini Popover */}
            {showPopover && (
              <div className="mini-popover show" style={{ top: popoverPos.top, left: popoverPos.left }}>
                <div className="popover-arrow"></div>
                <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)', marginBottom: '12px' }}>You have unsaved changes</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <button className="modal-btn confirm" style={{ fontSize: '0.75rem', padding: '6px 10px' }} onClick={handlePopoverSave}>Save & Switch</button>
                  <button className="modal-btn cancel" style={{ fontSize: '0.75rem', padding: '6px 10px' }} onClick={handlePopoverDiscard}>Discard</button>
                  <button className="modal-btn cancel" style={{ fontSize: '0.75rem', padding: '6px 10px' }} onClick={() => { setShowPopover(false); pendingTabRef.current = null }}>Stay</button>
                </div>
              </div>
            )}
          </div>

          <div className="demo-preview">
            <div className="preview-frame">
              <div className="preview-header">
                <div className="preview-dots"><span className="dot red"></span><span className="dot yellow"></span><span className="dot green"></span></div>
                <span className="preview-title">Live Preview</span>
                <div className="preview-actions">
                  <button className="btn-preview-action" id="btn-play" title={isPlaying ? 'Pause Animation' : 'Play Animation'} onClick={handlePlayPause}><i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'}`}></i></button>
                  <button className="btn-preview-action" id="btn-reset" title="Reset" onClick={() => setShowResetModal(true)}><i className="fas fa-redo"></i></button>
                  <button className="btn-preview-action" id="btn-fullscreen" title="Fullscreen" onClick={handleFullscreen}><i className="fas fa-expand"></i></button>
                </div>
              </div>
              <div className="preview-content">
                <div className="iframe-loading" id="iframe-loading" style={{ display: templateReady ? 'none' : 'flex' }}>
                  <div className="loading-spinner"></div><span>Loading preview...</span>
                </div>
                <iframe ref={iframeRef} id="template-preview" src="/templates/new-year/index.html" title="Template Preview" sandbox="allow-scripts allow-same-origin" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reset Modal */}
      <div className={`modal-overlay${showResetModal ? ' active' : ''}`} id="reset-modal">
        <div className="modal-content">
          <h3 className="modal-title">Reset Everything?</h3>
          <p className="modal-body">This will restore all settings to their defaults and reload the preview.</p>
          <div className="modal-actions">
            <button className="modal-btn cancel" onClick={() => setShowResetModal(false)}>Cancel</button>
            <button className="modal-btn confirm" onClick={performFullReset}>Reset</button>
          </div>
        </div>
      </div>

      {/* Toast */}
      <div className={`soft-toast${showToast ? ' show' : ''}`} id="soft-toast"><i className="fas fa-exclamation-circle"></i><span>{toastMessage}</span></div>
    </section>
  )
}
