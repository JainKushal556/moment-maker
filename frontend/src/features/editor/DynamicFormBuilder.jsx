import { useState, useRef, useEffect, useCallback } from 'react'
import { uploadImage } from '../../services/cloudinary'
import { intros } from '../../data/intros'

// ── SUB-COMPONENT: INTRO SELECTION FIELD ──────────────────────────────────────
function IntroSelectionField({ selectedIntroId, onSelect }) {
  return (
    <div className="ep-section editor-section">
      <div className="ep-section-header">
        <span className="ep-section-num">00</span>
        <span className="ep-section-title">Intro Animation</span>
        <div className="ep-section-line" />
      </div>
      <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '16px', lineHeight: 1.5 }}>
        Choose how your moment will be revealed to the receiver.
      </p>
      
      <div className="intro-options-scroll" style={{ 
        display: 'flex', 
        gap: '12px', 
        overflowX: 'auto', 
        paddingBottom: '16px'
      }}>
        {intros.map(intro => (
          <div 
            key={intro.id}
            onClick={() => onSelect(intro.id)}
            style={{ 
              minWidth: '120px',
              maxWidth: '120px',
              borderRadius: '12px', 
              overflow: 'hidden',
              cursor: 'pointer',
              border: selectedIntroId === intro.id ? '2px solid #f472b6' : '1px solid rgba(255,255,255,0.1)',
              background: selectedIntroId === intro.id ? 'rgba(244,114,182,0.1)' : 'rgba(255,255,255,0.02)',
              transition: 'all 0.2s',
              flexShrink: 0
            }}
          >
             <div style={{ height: '70px', background: '#111', position: 'relative' }}>
                <img 
                    src={intro.thumbnail} 
                    alt={intro.title} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    onError={(e) => { 
                        e.target.style.display = 'none'; 
                        e.target.nextSibling.style.display = 'flex'; 
                    }} 
                />
                <div style={{ 
                    display: 'none', 
                    width: '100%', 
                    height: '100%', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    background: 'linear-gradient(45deg, #f472b6, #c084fc)' 
                }}>
                   <span style={{ fontSize: '20px' }}>✨</span>
                </div>
             </div>
             <div style={{ padding: '8px' }}>
                <h4 style={{ fontSize: '11px', color: 'white', fontWeight: 600, textAlign: 'center', margin: 0 }}>{intro.title}</h4>
             </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── SUB-COMPONENT: SENDER NAME FIELD ─────────────────────────────────────────
function SenderNameField({ currentUser }) {
  const [showTooltip, setShowTooltip] = useState(false)
  const name = currentUser?.displayName || currentUser?.email?.split('@')[0] || "Someone Special"

  return (
    <div className="ep-section editor-section">
      <div className="ep-section-header">
        <span className="ep-section-num">01</span>
        <span className="ep-section-title">Sender Identity</span>
        <div className="ep-section-line" />
      </div>
      <div className="ep-field">
        <div className="ep-label-row">
          <label className="ep-label">Sending As</label>
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              onClick={() => setShowTooltip(!showTooltip)}
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '50%',
                width: '18px',
                height: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'help',
                color: 'rgba(255,255,255,0.4)',
                fontSize: '10px',
                fontFamily: 'serif',
                fontWeight: 'bold'
              }}
            >
              i
            </button>
            {showTooltip && (
              <div style={{
                position: 'absolute',
                bottom: 'calc(100% + 10px)',
                right: '0',
                width: '200px',
                padding: '10px 12px',
                background: '#1a1a1f',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '8px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                fontSize: '11px',
                lineHeight: '1.4',
                color: 'rgba(255,255,255,0.8)',
                zIndex: 100,
                pointerEvents: 'none'
              }}>
                This name is pulled from your account profile. To change it, please update your name in <strong>Account Settings</strong>.
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  right: '4px',
                  border: '6px solid transparent',
                  borderTopColor: '#1a1a1f'
                }} />
              </div>
            )}
          </div>
        </div>
        <div className="ep-input" style={{ 
          background: 'rgba(255,255,255,0.02)', 
          color: 'rgba(255,255,255,0.5)',
          cursor: 'not-allowed',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
          </svg>
          {name}
        </div>
      </div>
    </div>
  )
}

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
  const { label, placeholder, stateKey, maxLength } = field
  const externalValue = customization[stateKey] || ''

  // Local state prevents cursor jumping on every parent re-render
  const [localValue, setLocalValue] = useState(externalValue)
  const debounceRef = useRef(null)

  // Sync local state if the external value changes from a source OTHER than typing
  // (e.g. loading a saved moment or switching templates)
  useEffect(() => {
    setLocalValue(externalValue)
  }, [stateKey, customization[stateKey] === '' ? '' : undefined])

  const handleChange = useCallback((e) => {
    const val = e.target.value
    setLocalValue(val)
    // Debounce the parent update so preview stays live without cursor thrash
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => onUpdate(stateKey, val), 300)
  }, [stateKey, onUpdate])

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
          <span className="ep-char-count">{localValue.length}{maxLength ? ` / ${maxLength}` : ''} chars</span>
        </div>
        <textarea
          className="ep-textarea"
          placeholder={placeholder || 'Type here...'}
          value={localValue}
          onChange={handleChange}
          maxLength={maxLength}
          style={{ minHeight: '200px' }}
          data-lenis-prevent="true"
        />
      </div>
    </div>
  )
}

// ── SUB-COMPONENT: TEXT FIELD ───────────────────────────────────────────────
function TextField({ field, customization, onUpdate, sectionIndex }) {
  const { label, placeholder, stateKey, maxLength } = field
  const externalValue = customization[stateKey] || ''

  const [localValue, setLocalValue] = useState(externalValue)
  const debounceRef = useRef(null)

  useEffect(() => {
    setLocalValue(externalValue)
  }, [stateKey, customization[stateKey] === '' ? '' : undefined])

  const handleChange = useCallback((e) => {
    const val = e.target.value
    setLocalValue(val)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => onUpdate(stateKey, val), 300)
  }, [stateKey, onUpdate])

  return (
    <div className="ep-section editor-section">
      <div className="ep-section-header">
        <span className="ep-section-num">0{sectionIndex}</span>
        <span className="ep-section-title">{label}</span>
        <div className="ep-section-line" />
      </div>
      <div className="ep-field">
        <label className="ep-label">{label}</label>
        <input
          type="text"
          className="ep-input"
          placeholder={placeholder || 'Enter text...'}
          value={localValue}
          onChange={handleChange}
          maxLength={maxLength}
        />
      </div>
    </div>
  )
}

// ── SUB-COMPONENT: TEXT LIST FIELD ──────────────────────────────────────────
function TextListItem({ value, index, onUpdate }) {
  const [localValue, setLocalValue] = useState(value || '')
  const debounceRef = useRef(null)

  useEffect(() => {
    setLocalValue(value || '')
  }, [value])

  const handleChange = useCallback((e) => {
    const val = e.target.value
    setLocalValue(val)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => onUpdate(index, val), 300)
  }, [index, onUpdate])

  return (
    <input
      type="text"
      className="ep-input"
      placeholder={`Enter text for item ${index + 1}...`}
      value={localValue}
      onChange={handleChange}
    />
  )
}

function TextListField({ field, customization, onUpdate, sectionIndex }) {
  const { label, count, stateKey, description } = field
  const values = customization[stateKey] || Array(count).fill('')

  const handleItemUpdate = useCallback((index, val) => {
    const newValues = [...(customization[stateKey] || Array(count).fill(''))]
    newValues[index] = val
    onUpdate(stateKey, newValues)
  }, [stateKey, onUpdate, customization, count])

  return (
    <div className="ep-section editor-section">
      <div className="ep-section-header">
        <span className="ep-section-num">0{sectionIndex}</span>
        <span className="ep-section-title">{label}</span>
        <div className="ep-section-line" />
      </div>
      {description && (
        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '16px', lineHeight: 1.5 }}>
          {description}
        </p>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="ep-field" style={{ margin: 0 }}>
            <label className="ep-label" style={{ fontSize: '10px', marginBottom: '4px', opacity: 0.6 }}>Item {i + 1}</label>
            <TextListItem value={values[i]} index={i} onUpdate={handleItemUpdate} />
          </div>
        ))}
      </div>
    </div>
  )
}

// ── SUB-COMPONENT: SELECT FIELD ───────────────────────────────────────────────
function SelectField({ field, customization, onUpdate, sectionIndex }) {
  const { label, options, stateKey } = field
  const value = customization[stateKey] || (options && options.length > 0 ? options[0].value : '')
  const [isOpen, setIsOpen] = useState(false)
  
  const selectedOption = options?.find(o => o.value === value) || options?.[0]

  return (
    <div className="ep-section editor-section">
      <div className="ep-section-header">
        <span className="ep-section-num">0{sectionIndex}</span>
        <span className="ep-section-title">{label}</span>
        <div className="ep-section-line" />
      </div>
      <div className="ep-field">
        <label className="ep-label">{label}</label>
        <div className="ep-input-wrap" style={{ position: 'relative' }}>
          <button
            type="button"
            className={`ep-input ${isOpen ? 'focus' : ''}`}
            onClick={() => setIsOpen(!isOpen)}
            onBlur={() => setTimeout(() => setIsOpen(false), 200)}
            style={{ 
              width: '100%', 
              textAlign: 'left', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              cursor: 'pointer',
              borderColor: isOpen ? 'var(--ep-accent)' : 'rgba(255, 255, 255, 0.12)',
              background: isOpen ? 'rgba(255, 45, 85, 0.04)' : 'rgba(255, 255, 255, 0.04)',
              boxShadow: isOpen ? '0 0 0 3px var(--ep-accent-glow), 0 4px 16px rgba(0,0,0,0.3)' : 'none'
            }}
          >
            <span style={{ color: value ? '#f5f5f7' : 'rgba(255, 255, 255, 0.25)' }}>
              {selectedOption?.label || 'Select...'}
            </span>
            <div style={{ color: 'rgba(255,255,255,0.4)', transition: 'transform 0.2s', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
            </div>
          </button>
          
          {isOpen && (
            <div style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              left: 0,
              right: 0,
              background: '#1a1a1f',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              overflow: 'hidden',
              zIndex: 100,
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
              display: 'flex',
              flexDirection: 'column',
              padding: '6px'
            }}>
              {options?.map((opt, i) => (
                <div
                  key={i}
                  onClick={() => {
                    onUpdate(stateKey, opt.value);
                    setIsOpen(false);
                  }}
                  style={{
                    padding: '12px 16px',
                    cursor: 'pointer',
                    borderRadius: '8px',
                    background: value === opt.value ? 'rgba(255, 61, 106, 0.1)' : 'transparent',
                    color: value === opt.value ? '#ff3d6a' : 'rgba(255, 255, 255, 0.8)',
                    fontSize: '14px',
                    fontFamily: "'Outfit', sans-serif",
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    if (value !== opt.value) {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                      e.currentTarget.style.color = '#fff';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (value !== opt.value) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)';
                    }
                  }}
                >
                  {opt.label}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── MAIN EXPORT — DYNAMIC FORM BUILDER ────────────────────────────────────────
export default function DynamicFormBuilder({ template, customization = {}, onUpdate, onSave, onShare, saveStatus, setSaveStatus, currentMomentStatus, selectedIntroId, setSelectedIntroId, currentUser }) {

  if (!customization) {
    return <div className="editor-panel p-8 text-white/40 font-mono text-xs uppercase tracking-widest">Initialising...</div>
  }

  const handleSave = async () => {
    await onSave()
  }

  const handleIntroSelect = (id) => {
    if (id !== selectedIntroId) {
      setSelectedIntroId(id)
      if (saveStatus === 'saved') {
        setSaveStatus('idle')
      }
    }
  }

  // Fallback to empty schema if none exists
  const schema = template?.schema || []

  return (
    <div className="editor-panel">
      <div className="editor-panel-scroll" data-lenis-prevent="true">

        {/* ── BRAND HEADER ── */}
        <div className="ep-header">
          <div className="ep-brand-line">
            <div className="ep-brand-dot" />
            <span className="ep-brand-tag">Moment Crafter Studio</span>
          </div>
          <h2 className="ep-title">
            {template?.category ? template.category.replace(/-/g, ' ') : 'Template'} <br/>
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

        <div className="ep-divider" />

        {/* ── INTRO SELECTION ── */}
        <IntroSelectionField 
            selectedIntroId={selectedIntroId} 
            onSelect={handleIntroSelect} 
        />

        {/* ── SENDER IDENTITY ── */}
        <SenderNameField currentUser={currentUser} />

        <div className="ep-divider" />

        {/* ── DYNAMIC SCHEMA RENDERER ── */}
        {schema.map((field, index) => {
          const sectionIndex = index + 2
          
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
            case 'text':
              fieldComponent = (
                <TextField 
                  key={field.id}
                  field={field} 
                  customization={customization} 
                  onUpdate={onUpdate} 
                  sectionIndex={sectionIndex} 
                />
              )
              break
            case 'select':
              fieldComponent = (
                <SelectField 
                  key={field.id}
                  field={field} 
                  customization={customization} 
                  onUpdate={onUpdate} 
                  sectionIndex={sectionIndex} 
                />
              )
              break
            case 'text-list':
              fieldComponent = (
                <TextListField 
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
      <div className="ep-action-bar flex items-center gap-3">
        <div className="flex-1">
          <div className="ep-action-status">
            <div className={`ep-status-dot ${saveStatus === 'saved' ? 'saved' : ''}`} />
            <span className="ep-status-text">
              {saveStatus === 'saved'
                ? (currentMomentStatus === 'shared' ? 'Changes saved' : 'Draft saved to My Moments')
                : saveStatus === 'saving'
                ? 'Uploading & saving...'
                : saveStatus === 'sharing'
                ? (currentMomentStatus === 'shared' ? 'Changes saved' : 'Draft saved to My Moments')
                : (currentMomentStatus === 'shared' ? 'Unsaved changes' : 'Unsaved draft')}
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleSave}
            disabled={saveStatus === 'saving' || saveStatus === 'saved' || saveStatus === 'sharing'}
            className={`ep-save-btn ${saveStatus === 'saved' || saveStatus === 'sharing' ? 'saved' : ''}`}
          >
            {saveStatus === 'saved' || saveStatus === 'sharing' ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
            ) : saveStatus === 'saving' ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: 'spin 1s linear infinite' }}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
            )}
            <span>
              {saveStatus === 'saved' || saveStatus === 'sharing' 
                ? 'Saved' 
                : saveStatus === 'saving' 
                ? 'Saving...' 
                : (currentMomentStatus === 'shared' ? 'Save Changes' : 'Save Draft')}
            </span>
          </button>

          <button
            onClick={onShare}
            disabled={saveStatus !== 'saved' && saveStatus !== 'sharing'}
            className={`ep-share-btn ${saveStatus === 'saved' || saveStatus === 'sharing' ? 'active' : 'disabled'}`}
          >
            {saveStatus === 'sharing' ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: 'spin 1s linear infinite' }}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
            )}
            <span>{saveStatus === 'sharing' ? 'Sharing...' : 'Share'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
