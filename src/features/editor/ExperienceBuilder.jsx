import { useState } from 'react'

const THEMES = [
    { id: 'cosmic', title: 'Cosmic', img: 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=200&q=80' },
    { id: 'ocean', title: 'Ocean', img: 'https://images.unsplash.com/photo-1439405326854-014607f694d7?w=200&q=80' },
    { id: 'bloom', title: 'Bloom', img: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=200&q=80' }
]

export default function ExperienceBuilder({ template, customization, onUpdate, onSave }) {
  const [activeTheme, setActiveTheme] = useState('cosmic')
  const [saveStatus, setSaveStatus] = useState('idle') // idle | saving | saved

  const isSpecialLetter = template?.id === 'cp-v1'

  const handleSave = () => {
    setSaveStatus('saving')
    onSave()
    setTimeout(() => {
        setSaveStatus('saved')
        setTimeout(() => setSaveStatus('idle'), 2500)
    }, 800)
  }

  return (
    <div className="editor-panel">
      {/* ── SCROLLABLE AREA ── */}
      <div className="editor-panel-scroll">

        {/* ── BRAND HEADER ── */}
        <div className="ep-header">
          <div className="ep-brand-line">
            <div className="ep-brand-dot" />
            <span className="ep-brand-tag">WishCraft Studio</span>
          </div>
          <h2 className="ep-title">
            {isSpecialLetter ? 'Letter' : 'Moment'} <br/>
            <span className="ep-title-accent">Editor</span>
          </h2>
        </div>

        {/* ── TEMPLATE INFO CARD ── */}
        <div className="ep-info-card">
          <div className="ep-info-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
          </div>
          <div>
            <div className="ep-info-name">{template?.title || 'Warm Compliment'}</div>
            <div className="ep-info-type">
              {isSpecialLetter ? 'Interactive Letter • Friendship' : 'Template • Custom'}
            </div>
          </div>
        </div>

        {/* ── DIVIDER ── */}
        <div className="ep-divider" />

        {/* ── SECTION 01: LETTER PROPERTIES ── */}
        <div className="ep-section editor-section">
          <div className="ep-section-header">
            <span className="ep-section-num">01</span>
            <span className="ep-section-title">{isSpecialLetter ? 'Letter Properties' : 'Details'}</span>
            <div className="ep-section-line" />
          </div>

          <div className="ep-fields">
            {/* Recipient — only for non-letter templates */}
            {!isSpecialLetter && (
              <div className="ep-field">
                <label className="ep-label">Recipient Name</label>
                <input
                  type="text"
                  className="ep-input"
                  placeholder="Who is this for?"
                  value={customization.recipientName}
                  onChange={(e) => onUpdate('recipientName', e.target.value)}
                />
              </div>
            )}

            {/* Letter Header — only for letter templates */}
            {isSpecialLetter && (
              <div className="ep-field">
                <label className="ep-label">Opening Line</label>
                <div className="ep-input-wrap">
                  <div className="ep-input-icon">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>
                  </div>
                  <input
                    type="text"
                    className="ep-input ep-input-with-icon"
                    placeholder="e.g. For you,"
                    value={customization.letterTitle || ''}
                    onChange={(e) => onUpdate('letterTitle', e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Message Body */}
            <div className="ep-field">
              <div className="ep-label-row">
                <label className="ep-label">
                  {isSpecialLetter ? 'Your Letter' : 'Personal Message'}
                </label>
                <span className="ep-char-count">
                  {(isSpecialLetter ? (customization.letterBody || '') : (customization.message || '')).length} chars
                </span>
              </div>
              <textarea
                className="ep-textarea"
                placeholder={isSpecialLetter 
                  ? "Pour your heart out here... Tell them what they mean to you." 
                  : "Write something meaningful..."
                }
                value={isSpecialLetter ? (customization.letterBody || '') : (customization.message || '')}
                onChange={(e) => onUpdate(isSpecialLetter ? 'letterBody' : 'message', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* ── SECTION 02: ATMOSPHERE (non-letter only) ── */}
        {!isSpecialLetter && (
          <>
            <div className="ep-divider" />
            <div className="ep-section editor-section">
              <div className="ep-section-header">
                <span className="ep-section-num">02</span>
                <span className="ep-section-title">Atmosphere</span>
                <div className="ep-section-line" />
              </div>
              <div className="grid grid-cols-3 gap-2">
                {THEMES.map(theme => (
                  <button
                    key={theme.id}
                    onClick={() => setActiveTheme(theme.id)}
                    className={`ep-theme-thumb ${activeTheme === theme.id ? 'active' : ''}`}
                  >
                    <img src={theme.img} alt={theme.title} />
                    <span className="ep-theme-label">{theme.title}</span>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ── DECORATIVE TIPS ── */}
        {isSpecialLetter && (
          <>
            <div className="ep-divider" />
            <div className="ep-tips editor-section">
              <div className="ep-section-header">
                <span className="ep-section-num">02</span>
                <span className="ep-section-title">Tips</span>
                <div className="ep-section-line" />
              </div>
              <div className="ep-tip-cards">
                <div className="ep-tip">
                  <span className="ep-tip-emoji">💌</span>
                  <p>Be authentic. The best letters come from the heart, not from perfection.</p>
                </div>
                <div className="ep-tip">
                  <span className="ep-tip-emoji">✨</span>
                  <p>Mention a specific moment or memory — it makes the letter unforgettable.</p>
                </div>
              </div>
            </div>
          </>
        )}

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
