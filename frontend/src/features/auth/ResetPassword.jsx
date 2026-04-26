import { useState } from 'react'
import { confirmPasswordReset } from 'firebase/auth'
import { auth } from '../../config/firebase'
import './auth.css'

const EyeIcon = ({ show }) => show ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
)

export default function ResetPassword({ oobCode }) {
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [status, setStatus] = useState('idle') // 'idle', 'submitting', 'success', 'error'
    const [error, setError] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (password !== confirmPassword) {
            setError('Passwords do not match.')
            return
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters.')
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

    if (status === 'success') {
        return (
            <div style={{ backgroundColor: '#050508', width: '100vw', height: '100vh', position: 'relative' }}>
                <div className="auth-overlay" style={{ position: 'absolute' }}>
                    <div className="auth-modal">
                        <div className="auth-glow" />
                        <div className="auth-glow auth-glow--2" />
                        
                        <div className="auth-brand">
                            <div className="auth-brand-icon">✦</div>
                            <span>Moment Crafter</span>
                        </div>

                        <div className="auth-heading">
                            <h2>Password Reset</h2>
                            <p style={{ marginTop: '0.5rem', marginBottom: '1.5rem', color: 'rgba(255,255,255,0.7)' }}>Your password has been reset successfully! You can now log in.</p>
                        </div>

                        <div className="auth-form" style={{ marginTop: '1rem' }}>
                            <button className="auth-submit-btn" onClick={handleContinue}>
                                Continue to App
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div style={{ backgroundColor: '#050508', width: '100vw', height: '100vh', position: 'relative' }}>
            <div className="auth-overlay" style={{ position: 'absolute' }}>
                <div className={`auth-modal ${status === 'submitting' ? 'auth-modal--loading' : ''}`}>
                    <div className="auth-glow" />
                    <div className="auth-glow auth-glow--2" />
                    
                    <div className="auth-brand">
                        <div className="auth-brand-icon">✦</div>
                        <span>Moment Crafter</span>
                    </div>

                    <div className="auth-heading">
                        <h2>Create new password</h2>
                        <p style={{ marginTop: '0.5rem', marginBottom: '1.5rem', color: 'rgba(255,255,255,0.7)' }}>Enter your new password below.</p>
                    </div>

                    {error && <div className="auth-banner auth-banner--error">{error}</div>}

                    <form className="auth-form" onSubmit={handleSubmit}>
                        <div className="auth-field">
                            <label htmlFor="auth-password">New Password</label>
                            <div className="auth-password-wrapper">
                                <input
                                    id="auth-password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Min. 6 characters"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    autoComplete="new-password"
                                    disabled={status === 'submitting'}
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

                        <div className="auth-field">
                            <label htmlFor="auth-confirm-password">Confirm Password</label>
                            <input
                                id="auth-confirm-password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Min. 6 characters"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                autoComplete="new-password"
                                disabled={status === 'submitting'}
                            />
                        </div>

                        <button className="auth-submit-btn" type="submit" disabled={status === 'submitting'} style={{ marginTop: '1rem' }}>
                            {status === 'submitting' ? (
                                <span className="auth-spinner" />
                            ) : (
                                'Reset Password'
                            )}
                        </button>
                        
                        <button type="button" className="auth-forgot-link" style={{marginTop: '1.5rem', textAlign: 'center', width: '100%'}} onClick={handleContinue}>
                            Cancel and go back
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
