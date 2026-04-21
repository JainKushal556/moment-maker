import { useState, useRef } from 'react'
import { uploadImage } from '../../services/cloudinary'

// ── SUB-COMPONENT: IMAGE GALLERY FIELD ────────────────────────────────────────
function ImageGalleryField({ field, customization, onUpdate, sectionIndex }) {
  const { label, description, maxCount, stateKey } = field
  const images = customization[stateKey] || Array(maxCount).fill(null)
  
  const hiddenFileInput = useRef(null)
  const [activeIndex, setActiveIndex] = useState(null)

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file || activeIndex === null) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const newImages = [...images]
      newImages[activeIndex] = ev.target.result
      onUpdate(stateKey, newImages)
      setActiveIndex(null) // Reset
    }
    reader.readAsDataURL(file)
    // Clear the input value so the same file can be uploaded again if removed
    e.target.value = ''
  }

  const handleRemoveImage = (index) => {
    const newImages = [...images]
    newImages[index] = null
    onUpdate(stateKey, newImages)
  }

  const triggerUpload = (index) => {
    setActiveIndex(index)
    hiddenFileInput.current?.click()
  }

  return (
    <div className="ep-section editor-section">
      <div className="ep-section-header">
        <span className="ep-section-num">0{sectionIndex}</span>
        <span className="ep-section-title">{label}</span>
        <div className="ep-section-line" />
      </div>
      {description && (
        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '12px', lineHeight: 1.5 }}>
          {description}
        </p>
      )}

      {/* Hidden single file input used by all buttons */}
      <input
        ref={hiddenFileInput}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleImageUpload}
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        {Array.from({ length: maxCount }).map((_, i) => (
          <div key={i} style={{ position: 'relative' }}>
            {images[i] ? (
              <div style={{
                position: 'relative', borderRadius: '12px', overflow: 'hidden',
                aspectRatio: '3/4', border: '1px solid rgba(236,72,153,0.4)'
              }}>
                <img
                  src={images[i]}
                  alt={`${label} ${i + 1}`}
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
                onClick={() => triggerUpload(i)}
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
  )
}

// ── SUB-COMPONENT: TEXT AREA FIELD ───────────────────────────────────────────
function TextAreaField({ field, customization, onUpdate, sectionIndex }) {
  const { label, placeholder, stateKey } = field
  const value = customization[stateKey] || ''

  return (
    <div className="ep-section editor-section">
      <div className="ep-section-header">
        <span className="ep-section-num">0{sectionIndex}</span>
        <span className="ep-section-title">{label}</span>
        <div className="ep-section-line" />
      </div>
      <div className="ep-field">
        <div className="ep-label-row">
          <label className="ep-label">{label}</label>
          <span className="ep-char-count">{value.length} chars</span>
        </div>
        <textarea
          className="ep-textarea"
          placeholder={placeholder || 'Type here...'}
          value={value}
          onChange={(e) => onUpdate(stateKey, e.target.value)}
          style={{ minHeight: '200px' }}
        />
      </div>
    </div>
  )
}

// ── MAIN EXPORT — DYNAMIC FORM BUILDER ────────────────────────────────────────
export default function DynamicFormBuilder({ template, customization, onUpdate, onSave }) {
  const [saveStatus, setSaveStatus] = useState('idle')

  const handleSave = () => {
    setSaveStatus('saving')
    onSave()
    setTimeout(() => {
      setSaveStatus('saved')
      setTimeout(() => setSaveStatus('idle'), 2500)
    }, 800)
  }

  // Fallback to empty schema if none exists
  const schema = template?.schema || []

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
            {template?.category ? template.category.charAt(0).toUpperCase() + template.category.slice(1) : 'Template'} <br/>
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
            <div className="ep-info-name">{template?.title || 'Custom Template'}</div>
            <div className="ep-info-type">Template {template?.isPremium ? '• Premium' : ''}</div>
          </div>
        </div>

        {schema.length > 0 && <div className="ep-divider" />}

        {/* ── DYNAMIC SCHEMA RENDERER ── */}
        {schema.map((field, index) => {
          const sectionIndex = index + 1
          
          let fieldComponent = null
          switch (field.type) {
            case 'image-gallery':
              fieldComponent = (
                <ImageGalleryField 
                  key={field.id}
                  field={field} 
                  customization={customization} 
                  onUpdate={onUpdate} 
                  sectionIndex={sectionIndex} 
                />
              )
              break
            case 'textarea':
              fieldComponent = (
                <TextAreaField 
                  key={field.id}
                  field={field} 
                  customization={customization} 
                  onUpdate={onUpdate} 
                  sectionIndex={sectionIndex} 
                />
              )
              break
            default:
              fieldComponent = (
                <div key={field.id} style={{ color: 'red', padding: '10px' }}>
                  Unsupported field type: {field.type}
                </div>
              )
          }

          return (
            <div key={field.id}>
              {fieldComponent}
              {index < schema.length - 1 && <div className="ep-divider" />}
            </div>
          )
        })}

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
