import { useEffect, useContext, useState, useCallback } from 'react'
import { ViewContext } from '../../context/NavContext'
import { useAuth } from '../../context/AuthContext'
import { getMoments, deleteMoment } from '../../services/api'
import { templates } from '../../data/templates'
import './creations.css'

// ── Skeleton Card ────────────────────────────────────────────────
const SkeletonCard = () => (
    <div className="mc-card mc-card--skeleton">
        <div className="mc-card-thumb mc-skeleton-block" />
        <div className="mc-card-body">
            <div className="mc-skeleton-line" style={{ width: '60%' }} />
            <div className="mc-skeleton-line" style={{ width: '40%', height: '11px', marginTop: '6px' }} />
        </div>
        <div className="mc-card-footer">
            <div className="mc-skeleton-line" style={{ width: '45%', height: '32px', borderRadius: '8px' }} />
            <div className="mc-skeleton-line" style={{ width: '30%', height: '32px', borderRadius: '8px' }} />
        </div>
    </div>
)

// ── Moment Card ──────────────────────────────────────────────────
const MomentCard = ({ moment, onEdit, onPreview, onDelete, deleting }) => {
    const template = templates.find(t => t.id === moment.templateId)

    const formattedDate = moment.savedAt
        ? new Date(moment.savedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        : 'Recently saved'

    return (
        <div className={`mc-card ${deleting ? 'mc-card--deleting' : ''}`}>
            {/* Thumbnail */}
            <div className="mc-card-thumb" style={{ backgroundImage: `url(${template?.img || ''})` }}>
                <div className="mc-card-thumb-overlay" />
                <div className="mc-card-badge">{template?.category || 'moment'}</div>
            </div>

            {/* Body */}
            <div className="mc-card-body">
                <h3>{template?.title || 'Custom Moment'}</h3>
                <p className="mc-card-date">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                    {formattedDate}
                </p>
            </div>

            {/* Actions */}
            <div className="mc-card-footer">
                <button className="mc-action-btn mc-action-btn--primary" onClick={() => onEdit(moment)}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                    Edit
                </button>
                <button className="mc-action-btn mc-action-btn--ghost" onClick={() => onPreview(moment)}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                    </svg>
                    Preview
                </button>
                <button
                    className="mc-action-btn mc-action-btn--danger"
                    onClick={() => onDelete(moment.id)}
                    disabled={deleting}
                    aria-label="Delete"
                >
                    {deleting ? (
                        <span className="mc-mini-spinner" />
                    ) : (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                        </svg>
                    )}
                </button>
            </div>
        </div>
    )
}

// ── Main Component ───────────────────────────────────────────────
export default function MyCreations() {
    const [currentView, setCurrentView, , setSelectedTemplate, , setTemplateCustomization, , , , , setEditingMomentId] = useContext(ViewContext)
    const { currentUser, logout } = useAuth()

    const [moments, setMoments] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [deletingId, setDeletingId] = useState(null)

    const fetchMoments = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const data = await getMoments()
            setMoments(data || [])
        } catch (err) {
            // Backend not running yet — show empty state gracefully
            console.warn('Backend not reachable, showing empty state.', err.message)
            setMoments([])
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        if (currentView === 'mycreations' && currentUser) {
            fetchMoments()
        }
    }, [currentView, currentUser, fetchMoments])

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    if (currentView !== 'mycreations') return null

    const handleEdit = (moment) => {
        const template = templates.find(t => t.id === moment.templateId)
        if (!template) return
        setSelectedTemplate(template)
        setTemplateCustomization(prev => ({ ...prev, [template.id]: moment.customization }))
        setEditingMomentId(moment.id)  // remember we're editing an existing moment
        setCurrentView('editor')
    }

    const handlePreview = (moment) => {
        const template = templates.find(t => t.id === moment.templateId)
        if (!template) return
        setSelectedTemplate(template)
        setCurrentView('preview')
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this moment? This cannot be undone.')) return
        setDeletingId(id)
        try {
            await deleteMoment(id)
            setMoments(prev => prev.filter(m => m.id !== id))
        } catch (err) {
            alert('Could not delete. Please try again.')
        } finally {
            setDeletingId(null)
        }
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
        <div className="mc-container">
            <div className="mc-bg-gradient" />
            <div className="mc-bg-glow" />

            {/* Nav */}
            <nav className="mc-nav">
                <div className="mc-nav-inner">
                    <button className="mc-back-btn" onClick={() => setCurrentView('categories')}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <polyline points="15 18 9 12 15 6"/>
                        </svg>
                        <span>Explore</span>
                    </button>

                    <div className="mc-brand">
                        <div className="mc-brand-icon">✦</div>
                        <span>WishCraft</span>
                    </div>

                    <button className="mc-logout-btn" onClick={handleLogout}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                        </svg>
                        <span>Sign out</span>
                    </button>
                </div>
            </nav>

            {/* Header */}
            <header className="mc-header">
                <p className="mc-header-eyebrow">// MY CREATIONS</p>
                <h1 className="mc-header-title">Your Moments</h1>
                <p className="mc-header-sub">
                    Welcome back, <span>{currentUser?.displayName?.split(' ')[0] || 'Creator'}</span> ✦
                </p>
            </header>

            {/* Content */}
            <main className="mc-main">
                {error && (
                    <div className="mc-error-banner">
                        <span>{error}</span>
                        <button onClick={fetchMoments}>Retry</button>
                    </div>
                )}

                {loading ? (
                    <div className="mc-grid">
                        {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
                    </div>
                ) : moments.length > 0 ? (
                    <div className="mc-grid">
                        {moments.map(m => (
                            <MomentCard
                                key={m.id}
                                moment={m}
                                onEdit={handleEdit}
                                onPreview={handlePreview}
                                onDelete={handleDelete}
                                deleting={deletingId === m.id}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="mc-empty-state">
                        <div className="mc-empty-icon">
                            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/>
                                <line x1="4" y1="22" x2="4" y2="15"/>
                            </svg>
                        </div>
                        <h3>No moments yet</h3>
                        <p>You haven&apos;t crafted anything yet.<br/>Start with a template and make something beautiful.</p>
                        <button className="mc-start-btn" onClick={() => setCurrentView('categories')}>
                            <span>Start Creating</span>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <polyline points="9 18 15 12 9 6"/>
                            </svg>
                        </button>
                    </div>
                )}
            </main>
        </div>
    )
}
