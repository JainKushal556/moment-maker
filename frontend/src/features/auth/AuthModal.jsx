import { useState, useEffect } from 'react'
import { useRive, useStateMachineInput } from '@rive-app/react-canvas'
import { useAuth } from '../../context/AuthContext'
import './auth.css'

const STATE_MACHINE = 'Login Machine'

/* ── Icons ── */
const GoogleIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
)

const EyeIcon = ({ show }) => show ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
        <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
)

const EmailIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M22 7l-10 7L2 7" />
    </svg>
)

const LockIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
)

const PersonIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
)

/* ── Component ── */
export default function AuthModal({ onClose, onSuccess }) {
    const [mode, setMode] = useState('login')
    const [displayName, setDisplayName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [rememberMe, setRememberMe] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const [cooldown, setCooldown] = useState(0)

    const {
        signInWithGoogle, signInWithEmail, signUpWithEmail, resetPassword,
        unverifiedUser, resendVerificationEmail, checkEmailVerification, logout
    } = useAuth()

    /* ── Rive Bear ── */
    const { rive, RiveComponent } = useRive({
        src: '/assets/login_teddy.riv',
        stateMachines: STATE_MACHINE,
        autoplay: true,
    })
    const isCheckingInput = useStateMachineInput(rive, STATE_MACHINE, 'isChecking')
    const numLookInput    = useStateMachineInput(rive, STATE_MACHINE, 'numLook')
    const isHandsUpInput  = useStateMachineInput(rive, STATE_MACHINE, 'isHandsUp')
    const trigSuccess     = useStateMachineInput(rive, STATE_MACHINE, 'trigSuccess')
    const trigFail        = useStateMachineInput(rive, STATE_MACHINE, 'trigFail')

    /* Bear handlers */
    const onEmailFocus  = () => { if (isCheckingInput) isCheckingInput.value = true }
    const onEmailBlur   = () => { if (isCheckingInput) isCheckingInput.value = false }
    const onEmailChange = (e) => {
        setEmail(e.target.value)
        if (numLookInput) numLookInput.value = Math.min(100, (e.target.value.length / 25) * 100)
    }
    const onPasswordFocus = () => { if (isHandsUpInput) isHandsUpInput.value = true }
    const onPasswordBlur  = () => { if (isHandsUpInput) isHandsUpInput.value = false }

    useEffect(() => {
        let timer
        if (cooldown > 0) timer = setInterval(() => setCooldown(c => c - 1), 1000)
        return () => clearInterval(timer)
    }, [cooldown])

    const clearMessages = () => { setError(''); setMessage('') }

    const handleGoogleSignIn = async () => {
        clearMessages()
        setLoading(true)
        try {
            await signInWithGoogle()
            onSuccess?.()
        } catch {
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
                const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{6,}$/
                if (!passwordRegex.test(password)) {
                    setError('Password must be at least 6 characters and include a letter, a digit, and a special character.')
                    setLoading(false)
                    return
                }
                const result = await signUpWithEmail(email, password, displayName.trim())
                if (result.user?.emailVerified) onSuccess?.()
            } else if (mode === 'login') {
                const result = await signInWithEmail(email, password)
                if (result.user?.emailVerified) {
                    trigSuccess?.fire()
                    setTimeout(() => onSuccess?.(), 1200)
                }
            } else if (mode === 'reset') {
                await resetPassword(email)
                setMessage('Password reset email sent! Check your inbox.')
                setMode('login')
            }
        } catch (err) {
            trigFail?.fire()
            const msgs = {
                'auth/user-not-found':      'No account found with this email.',
                'auth/wrong-password':       'Incorrect password. Try again.',
                'auth/invalid-credential':   'Invalid email or password.',
                'auth/email-already-in-use': 'This email is already registered.',
                'auth/weak-password':        'Password must be at least 6 characters.',
                'auth/invalid-email':        'Please enter a valid email address.',
                'auth/too-many-requests':    'Too many attempts. Please wait.',
            }
            setError(msgs[err.code] || 'Something went wrong. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const switchMode = (newMode) => { clearMessages(); setMode(newMode) }

    const handleResend = async () => {
        if (cooldown > 0) return
        try {
            await resendVerificationEmail()
            clearMessages()
            setMessage('Verification email sent! Check your inbox.')
            setCooldown(60)
        } catch (err) {
            setError(err.code === 'auth/too-many-requests'
                ? 'Too many attempts. Please wait.'
                : 'Failed to send verification email.')
        }
    }

    const handleCheckVerification = async () => {
        clearMessages()
        setLoading(true)
        const isVerified = await checkEmailVerification()
        setLoading(false)
        if (isVerified) onSuccess?.()
        else setError('Email not verified yet. Please check your inbox.')
    }

    const handleSignOut = async () => {
        await logout()
        setMode('signup')
        clearMessages()
        setCooldown(0)
    }

    const headings = {
        login:  { title: 'Welcome back',    sub: 'Sign in to access your creations.' },
        signup: { title: 'Create account',  sub: 'Start crafting beautiful moments.' },
        reset:  { title: 'Reset password',  sub: "We'll send you a reset link." },
    }

    /* ── Email Verification Screen ── */
    if (unverifiedUser) {
        return (
            <div className="auth-overlay" onClick={(e) => e.target === e.currentTarget && onClose?.()}>
                <div className="auth-page">
                    <button className="auth-close" onClick={onClose} aria-label="Close">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>

                    <div className="auth-top">
                        <div className="auth-brand">
                            <div className="auth-brand-icon">✦</div>
                            <span>MOMENT CRAFTER</span>
                        </div>
                        <h1 className="auth-title" style={{ fontSize: '2rem' }}>Check your email</h1>
                        <p className="auth-subtitle">
                            Sent a link to<br />
                            <strong style={{ color: '#c084fc' }}>{unverifiedUser.email}</strong>
                        </p>
                    </div>

                    <div className="auth-bear-wrap">
                        <RiveComponent />
                    </div>

                    <div className="auth-card">
                        {error   && <div className="auth-banner auth-banner--error">{error}</div>}
                        {message && <div className="auth-banner auth-banner--success">{message}</div>}

                        <button className="auth-submit-btn" onClick={handleCheckVerification} disabled={loading}>
                            {loading ? <span className="auth-spinner" /> : "I've verified my email"}
                        </button>
                        <div className="auth-divider"><div className="auth-divider-line" /><span>OR</span><div className="auth-divider-line" /></div>
                        <button type="button" className="auth-google-btn" onClick={handleResend} disabled={cooldown > 0 || loading}>
                            {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend verification email'}
                        </button>
                        <p className="auth-footer-switch" style={{ marginTop: '1.2rem' }}>
                            <button onClick={handleSignOut}>Use a different account</button>
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    /* ── Main Screen ── */
    return (
        <div className="auth-overlay" onClick={(e) => e.target === e.currentTarget && onClose?.()}>
            <div className="auth-page">

                {/* Close */}
                <button className="auth-close" onClick={onClose} aria-label="Close">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>

                {/* Brand + Heading */}
                <div className="auth-top">
                    <div className="auth-brand">
                        <div className="auth-brand-icon">✦</div>
                        <span>MOMENT CRAFTER</span>
                    </div>
                    <h1 className="auth-title">{headings[mode].title}</h1>
                    <p className="auth-subtitle">{headings[mode].sub}</p>
                </div>

                {/* Bear */}
                <div className="auth-bear-wrap">
                    <RiveComponent />
                </div>

                {/* Card */}
                <div className="auth-card">
                    {error   && <div className="auth-banner auth-banner--error">{error}</div>}
                    {message && <div className="auth-banner auth-banner--success">{message}</div>}

                    <form onSubmit={handleSubmit} className="auth-form">

                        {/* Name — signup only */}
                        {mode === 'signup' && (
                            <div className="auth-field-row">
                                <div className="auth-field-icon"><PersonIcon /></div>
                                <div className="auth-field-content">
                                    <label className="auth-field-label">Name</label>
                                    <input
                                        type="text"
                                        placeholder="Your full name"
                                        value={displayName}
                                        onChange={(e) => setDisplayName(e.target.value)}
                                        required disabled={loading} autoComplete="name"
                                        className="auth-field-input"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Email */}
                        <div className="auth-field-row">
                            <div className="auth-field-icon"><EmailIcon /></div>
                            <div className="auth-field-content">
                                <label className="auth-field-label">Email</label>
                                <input
                                    type="email"
                                    placeholder="What's your email address?"
                                    value={email}
                                    onChange={onEmailChange}
                                    onFocus={onEmailFocus}
                                    onBlur={onEmailBlur}
                                    required disabled={loading} autoComplete="email"
                                    className="auth-field-input"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        {mode !== 'reset' && (
                            <div className="auth-field-row" style={{ borderBottom: 'none' }}>
                                <div className="auth-field-icon"><LockIcon /></div>
                                <div className="auth-field-content">
                                    <label className="auth-field-label">Password</label>
                                    <div className="auth-password-row">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="Enter your password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            onFocus={onPasswordFocus}
                                            onBlur={onPasswordBlur}
                                            required disabled={loading}
                                            autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                                            className="auth-field-input"
                                        />
                                        <button type="button" className="auth-eye-btn"
                                            onClick={() => setShowPassword(s => !s)} tabIndex={-1}>
                                            <EyeIcon show={showPassword} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Remember me + Forgot password */}
                        {mode === 'login' && (
                            <div className="auth-meta-row">
                                <label className="auth-remember">
                                    <input type="checkbox" checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        className="auth-checkbox" />
                                    <span>Remember me</span>
                                </label>
                                <button type="button" className="auth-forgot-link"
                                    onClick={() => switchMode('reset')}>
                                    Forgot password?
                                </button>
                            </div>
                        )}

                        {/* Submit */}
                        <button className="auth-submit-btn" type="submit" disabled={loading}>
                            {loading ? <span className="auth-spinner" /> : (
                                <>
                                    {mode === 'login'  && 'Sign In'}
                                    {mode === 'signup' && 'Create account'}
                                    {mode === 'reset'  && 'Send reset link'}
                                </>
                            )}
                        </button>
                    </form>

                    {/* OR + Google */}
                    {mode !== 'reset' && (
                        <>
                            <div className="auth-divider">
                                <div className="auth-divider-line" />
                                <span>OR</span>
                                <div className="auth-divider-line" />
                            </div>
                            <button className="auth-google-btn" onClick={handleGoogleSignIn} disabled={loading}>
                                <GoogleIcon />
                                <span>Continue with Google</span>
                            </button>
                        </>
                    )}

                    {/* Footer */}
                    <p className="auth-footer-switch">
                        {mode === 'login' ? (
                            <>Don&apos;t have an account?&nbsp;
                                <button onClick={() => switchMode('signup')}>Sign up</button></>
                        ) : mode === 'signup' ? (
                            <>Already have an account?&nbsp;
                                <button onClick={() => switchMode('login')}>Sign in</button></>
                        ) : (
                            <>Remembered it?&nbsp;
                                <button onClick={() => switchMode('login')}>Back to login</button></>
                        )}
                    </p>
                </div>
            </div>
        </div>
    )
}
