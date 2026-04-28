import { useState, useEffect } from 'react'
import { confirmPasswordReset } from 'firebase/auth'
import { auth } from '../../config/firebase'
import './auth.css'

const EyeIcon = ({ show }) => show ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
)

const LockIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
)

export default function ResetPassword({ oobCode }) {
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [status, setStatus] = useState('idle') // 'idle', 'submitting', 'success', 'error'
    const [error, setError] = useState('')

    useEffect(() => {
        document.body.style.overflow = 'hidden'
        if (window.lenis) window.lenis.stop()

        return () => {
            document.body.style.overflow = ''
            if (window.lenis) window.lenis.start()
        }
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{6,}$/
        if (!passwordRegex.test(password)) {
            setError('Password must be at least 6 characters and include a letter, a digit, and a special character.')
            return
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.')
            return
        }

        setStatus('submitting')

        try {
            await confirmPasswordReset(auth, oobCode, password)
            setStatus('success')
        } catch (err) {
            setStatus('error')
            switch (err.code) {
                case 'auth/expired-action-code':
                    setError('The reset link has expired. Please request a new one.')
                    break
                case 'auth/invalid-action-code':
                    setError('The reset link is invalid or has already been used.')
                    break
                case 'auth/weak-password':
                    setError('The password is too weak.')
                    break
                default:
                    setError('An error occurred while resetting your password. Please try again.')
            }
        }
    }

    const handleContinue = () => {
        window.location.href = '/?action=login'
    }

    return (
        <div className="auth-overlay">
            <div className="auth-page">
                {/* Brand + Heading */}
                <div className="auth-top">
                    <div className="auth-brand">
                        <div className="auth-brand-icon">✦</div>
                        <span>MOMENT CRAFTER</span>
                    </div>
                    <h1 className="auth-title">
                        {status === 'success' ? 'Password Reset' : 'New Password'}
                    </h1>
                    <p className="auth-subtitle">
                        {status === 'success' 
                            ? 'Your password has been reset successfully! You can now log in.' 
                            : 'Create a strong password for your account.'}
                    </p>
                </div>

                <div className="auth-card" style={{ marginTop: '2rem' }}>
                    {status === 'success' ? (
                        <div className="auth-form">
                            <div className="auth-banner auth-banner--success">
                                Success! You're ready to jump back in.
                            </div>
                            <button className="auth-submit-btn" onClick={handleContinue}>
                                Start Crafting
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="auth-form">
                            {error && <div className="auth-banner auth-banner--error">{error}</div>}

                            <div className="auth-field-row">
                                <div className="auth-field-icon"><LockIcon /></div>
                                <div className="auth-field-content">
                                    <label className="auth-field-label">New Password</label>
                                    <div className="auth-password-row">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="Letters, numbers & symbols"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            disabled={status === 'submitting'}
                                            autoComplete="new-password"
                                            className="auth-field-input"
                                        />
                                        <button
                                            type="button"
                                            className="auth-eye-btn"
                                            onClick={() => setShowPassword(s => !s)}
                                            tabIndex={-1}
                                        >
                                            <EyeIcon show={showPassword} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="auth-field-row" style={{ borderBottom: 'none' }}>
                                <div className="auth-field-icon"><LockIcon /></div>
                                <div className="auth-field-content">
                                    <label className="auth-field-label">Confirm Password</label>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Repeat new password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        disabled={status === 'submitting'}
                                        autoComplete="new-password"
                                        className="auth-field-input"
                                    />
                                </div>
                            </div>

                            <button className="auth-submit-btn" type="submit" disabled={status === 'submitting'} style={{ marginTop: '1.5rem' }}>
                                {status === 'submitting' ? <span className="auth-spinner" /> : 'Update Password'}
                            </button>
                            
                            <p className="auth-footer-switch" style={{ marginTop: '1.2rem' }}>
                                <button type="button" onClick={handleContinue}>Cancel and go back</button>
                            </p>
                        </form>
                    )}
                </div>
            </div>
        </div>
    )
}
