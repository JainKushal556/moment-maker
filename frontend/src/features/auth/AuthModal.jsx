import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import './auth.css'

const GoogleIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
)

const EyeIcon = ({ show }) => show ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
)

export default function AuthModal({ onClose, onSuccess }) {
    const [mode, setMode] = useState('login') // 'login' | 'signup' | 'reset'
    const [displayName, setDisplayName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)

    const { signInWithGoogle, signInWithEmail, signUpWithEmail, resetPassword } = useAuth()

    const clearMessages = () => { setError(''); setMessage('') }

    const handleGoogleSignIn = async () => {
        clearMessages()
        setLoading(true)
        try {
            await signInWithGoogle()
            onSuccess?.()
        } catch (err) {
            setError('Google sign-in failed. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        clearMessages()
        setLoading(true)

        try {
            if (mode === 'signup') {
                if (!displayName.trim()) { setError('Please enter your name.'); setLoading(false); return }
                await signUpWithEmail(email, password, displayName.trim())
                onSuccess?.()
            } else if (mode === 'login') {
                await signInWithEmail(email, password)
                onSuccess?.()
            } else if (mode === 'reset') {
                await resetPassword(email)
                setMessage('Password reset email sent! Check your inbox.')
                setMode('login')
            }
        } catch (err) {
            const msgs = {
                'auth/user-not-found': 'No account found with this email.',
                'auth/wrong-password': 'Incorrect password. Try again.',
                'auth/email-already-in-use': 'This email is already registered. Try logging in.',
                'auth/weak-password': 'Password must be at least 6 characters.',
                'auth/invalid-email': 'Please enter a valid email address.',
                'auth/too-many-requests': 'Too many attempts. Please wait and try again.',
            }
            setError(msgs[err.code] || 'Something went wrong. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const switchMode = (newMode) => { clearMessages(); setMode(newMode) }

    return (
        <div className="auth-overlay" onClick={(e) => e.target === e.currentTarget && onClose?.()}>
            <div className={`auth-modal ${loading ? 'auth-modal--loading' : ''}`}>

                {/* Ambient glow */}
                <div className="auth-glow" />
                <div className="auth-glow auth-glow--2" />

                {/* Close */}
                <button className="auth-close" onClick={onClose} aria-label="Close">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>

                {/* Brand */}
                <div className="auth-brand">
                    <div className="auth-brand-icon">✦</div>
                    <span>Moment Crafter</span>
                </div>

                {/* Title */}
                <div className="auth-heading">
                    <h2>
                        {mode === 'login' && 'Welcome back'}
                        {mode === 'signup' && 'Create your account'}
                        {mode === 'reset' && 'Reset password'}
                    </h2>
                    <p>
                        {mode === 'login' && 'Sign in to access your creations.'}
                        {mode === 'signup' && 'Start crafting beautiful moments.'}
                        {mode === 'reset' && "We'll send you a reset link."}
                    </p>
                </div>

                {/* Error / Message banners */}
                {error && <div className="auth-banner auth-banner--error">{error}</div>}
                {message && <div className="auth-banner auth-banner--success">{message}</div>}

                {/* Google Button */}
                {mode !== 'reset' && (
                    <>
                        <button className="auth-google-btn" onClick={handleGoogleSignIn} disabled={loading}>
                            <GoogleIcon />
                            <span>Continue with Google</span>
                        </button>
                        <div className="auth-divider">
                            <div className="auth-divider-line" />
                            <span>or</span>
                            <div className="auth-divider-line" />
                        </div>
                    </>
                )}

                {/* Form */}
                <form className="auth-form" onSubmit={handleSubmit}>
                    {mode === 'signup' && (
                        <div className="auth-field">
                            <label htmlFor="auth-name">Your name</label>
                            <input
                                id="auth-name"
                                type="text"
                                placeholder="E.g. Arslan Khan"
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                required
                                autoComplete="name"
                                disabled={loading}
                            />
                        </div>
                    )}

                    <div className="auth-field">
                        <label htmlFor="auth-email">Email address</label>
                        <input
                            id="auth-email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            autoComplete="email"
                            disabled={loading}
                        />
                    </div>

                    {mode !== 'reset' && (
                        <div className="auth-field">
                            <label htmlFor="auth-password">Password</label>
                            <div className="auth-password-wrapper">
                                <input
                                    id="auth-password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder={mode === 'signup' ? 'Min. 6 characters' : '••••••••'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    className="auth-eye-btn"
                                    onClick={() => setShowPassword(s => !s)}
                                    tabIndex={-1}
                                    aria-label="Toggle password visibility"
                                >
                                    <EyeIcon show={showPassword} />
                                </button>
                            </div>
                        </div>
                    )}

                    {mode === 'login' && (
                        <button type="button" className="auth-forgot-link" onClick={() => switchMode('reset')}>
                            Forgot password?
                        </button>
                    )}

                    <button className="auth-submit-btn" type="submit" disabled={loading}>
                        {loading ? (
                            <span className="auth-spinner" />
                        ) : (
                            <>
                                {mode === 'login' && 'Sign in'}
                                {mode === 'signup' && 'Create account'}
                                {mode === 'reset' && 'Send reset link'}
                            </>
                        )}
                    </button>
                </form>

                {/* Footer switcher */}
                <p className="auth-footer-switch">
                    {mode === 'login' ? (
                        <>Don&apos;t have an account?&nbsp;
                            <button onClick={() => switchMode('signup')}>Sign up</button>
                        </>
                    ) : mode === 'signup' ? (
                        <>Already have an account?&nbsp;
                            <button onClick={() => switchMode('login')}>Sign in</button>
                        </>
                    ) : (
                        <>Remembered it?&nbsp;
                            <button onClick={() => switchMode('login')}>Back to login</button>
                        </>
                    )}
                </p>
            </div>
        </div>
    )
}
