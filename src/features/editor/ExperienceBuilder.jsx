import { useState, useRef } from 'react'

// ── PROPOSAL-SPECIFIC EDITOR ────────────────────────────────────────
function ProposalEditor({ customization, onUpdate, onSave }) {
  const [saveStatus, setSaveStatus] = useState('idle')
  const fileRef0 = useRef(null)
  const fileRef1 = useRef(null)
  const fileRef2 = useRef(null)
  const fileRef3 = useRef(null)
  const fileRefs = [fileRef0, fileRef1, fileRef2, fileRef3]

  const handleSave = () => {
    setSaveStatus('saving')
    onSave()
    setTimeout(() => {
      setSaveStatus('saved')
      setTimeout(() => setSaveStatus('idle'), 2500)
    }, 800)
  }

  const handleImageUpload = (index, e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const newImages = [...(customization.images || [null, null, null, null])]
      newImages[index] = ev.target.result
      onUpdate('images', newImages)
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveImage = (index) => {
    const newImages = [...(customization.images || [null, null, null, null])]
    newImages[index] = null
    onUpdate('images', newImages)
    if (fileRefs[index].current) fileRefs[index].current.value = ''
  }

  const images = customization.images || [null, null, null, null]

  return (
    <div className="editor-panel">
      <div className="editor-panel-scroll">

        {/* ── BRAND HEADER ── */}
        <div className="ep-header">
          <div className="ep-brand-line">
            <div className="ep-brand-dot" />
            <span className="ep-brand-tag">WishCraft Studio</span>
          </div>
          <h2 className="ep-title">
            Proposal <br/>
            <span className="ep-title-accent">Editor</span>
          </h2>
        </div>

        {/* ── TEMPLATE INFO CARD ── */}
        <div className="ep-info-card">
          <div className="ep-info-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </div>
          <div>
            <div className="ep-info-name">Romantic Proposal</div>
            <div className="ep-info-type">Template • Premium</div>
          </div>
        </div>

        <div className="ep-divider" />

        {/* ── SECTION 01: MEMORY GALLERY ── */}
        <div className="ep-section editor-section">
          <div className="ep-section-header">
            <span className="ep-section-num">01</span>
            <span className="ep-section-title">Memory Gallery</span>
            <div className="ep-section-line" />
          </div>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '12px', lineHeight: 1.5 }}>
            Upload 4 photos that will appear in the interactive gallery.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {[0, 1, 2, 3].map((i) => (
              <div key={i} style={{ position: 'relative' }}>
                <input
                  ref={fileRefs[i]}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={(e) => handleImageUpload(i, e)}
                />
                {images[i] ? (
                  <div style={{
                    position: 'relative', borderRadius: '12px', overflow: 'hidden',
                    aspectRatio: '3/4', border: '1px solid rgba(236,72,153,0.4)'
                  }}>
                    <img
                      src={images[i]}
                      alt={`Memory ${i + 1}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                    <button
                      onClick={() => handleRemoveImage(i)}
                      style={{
                        position: 'absolute', top: '6px', right: '6px',
                        width: '24px', height: '24px', borderRadius: '50%',
                        background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(255,255,255,0.2)',
                        color: 'white', cursor: 'pointer', fontSize: '16px', lineHeight: 1,
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}
                    >×</button>
                  </div>
                ) : (
                  <button
                    onClick={() => fileRefs[i].current?.click()}
                    style={{
                      width: '100%', aspectRatio: '3/4', borderRadius: '12px',
                      border: '1.5px dashed rgba(236,72,153,0.35)',
                      background: 'rgba(236,72,153,0.05)',
                      cursor: 'pointer', color: 'rgba(255,255,255,0.4)',
                      display: 'flex', flexDirection: 'column',
                      alignItems: 'center', justifyContent: 'center', gap: '8px',
                      fontSize: '12px', transition: 'all 0.2s'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = 'rgba(236,72,153,0.7)'
                      e.currentTarget.style.background = 'rgba(236,72,153,0.1)'
                      e.currentTarget.style.color = 'rgba(255,255,255,0.7)'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = 'rgba(236,72,153,0.35)'
                      e.currentTarget.style.background = 'rgba(236,72,153,0.05)'
                      e.currentTarget.style.color = 'rgba(255,255,255,0.4)'
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="3" y="3" width="18" height="18" rx="2"/>
                      <circle cx="8.5" cy="8.5" r="1.5"/>
                      <path d="m21 15-5-5L5 21"/>
                    </svg>
                    <span>Photo {i + 1}</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="ep-divider" />

        {/* ── SECTION 02: PERSONAL LETTER ── */}
        <div className="ep-section editor-section">
          <div className="ep-section-header">
            <span className="ep-section-num">02</span>
            <span className="ep-section-title">Personal Letter</span>
            <div className="ep-section-line" />
          </div>
          <div className="ep-field">
            <div className="ep-label-row">
              <label className="ep-label">Your Message</label>
              <span className="ep-char-count">{(customization.letterContent || '').length} chars</span>
            </div>
            <textarea
              className="ep-textarea"
              placeholder="Pour your heart out here... Tell them what they mean to you."
              value={customization.letterContent || ''}
              onChange={(e) => onUpdate('letterContent', e.target.value)}
              style={{ minHeight: '200px' }}
            />
          </div>
        </div>

      </div>

      {/* ── STICKY ACTION BAR ── */}
      <div className="ep-action-bar">
        <div className="ep-action-status">
          <div className={`ep-status-dot ${saveStatus === 'saved' ? 'saved' : ''}`} />
          <span className="ep-status-text">
            {saveStatus === 'saved' ? 'All changes synced' : saveStatus === 'saving' ? 'Syncing...' : 'Unsaved draft'}
          </span>
        </div>
        <button
          onClick={handleSave}
          disabled={saveStatus === 'saving'}
          className={`ep-save-btn ${saveStatus === 'saved' ? 'saved' : ''}`}
        >
          {saveStatus === 'saved' ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
          )}
          <span>{saveStatus === 'saved' ? 'Published' : saveStatus === 'saving' ? 'Saving…' : 'Save & Preview'}</span>
        </button>
      </div>
    </div>
  )
}

// ── MAIN EXPORT — delegates to template-specific editor ───────────────
export default function ExperienceBuilder({ template, customization, onUpdate, onSave }) {
  // Currently only one template exists; extend here for future templates
  return <ProposalEditor customization={customization} onUpdate={onUpdate} onSave={onSave} />
}
