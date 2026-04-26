import { useEffect, useState, useRef } from 'react'
import { applyActionCode } from 'firebase/auth'
import { auth } from '../../config/firebase'
import './auth.css'

export default function VerifyEmail({ oobCode }) {
    const [status, setStatus] = useState('verifying')
    const [message, setMessage] = useState('Verifying your email address...')
    const hasAttempted = useRef(false)

    useEffect(() => {
        if (!oobCode) {
            setStatus('error')
            setMessage('Invalid verification link.')
            return
        }

        if (hasAttempted.current) return
        hasAttempted.current = true

        const verify = async () => {
            try {
                await applyActionCode(auth, oobCode)
                setStatus('success')
                setMessage('Your email has been successfully verified! You can now log in.')
            } catch (error) {
                setStatus('error')
                switch (error.code) {
                    case 'auth/expired-action-code':
                        setMessage('The verification link has expired. Please log in to resend the link.')
                        break
                    case 'auth/invalid-action-code':
                        setMessage('The verification link is invalid or has already been used.')
                        break
                    default:
                        setMessage('An error occurred during verification. Please try again.')
                }
            }
        }

        verify()
    }, [oobCode])

    const handleContinue = () => {
        // Redirect to home page to reload the app normally
        window.location.href = '/'
    }

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
                        <h2>
                            {status === 'verifying' && 'Verifying...'}
                            {status === 'success' && 'Email Verified'}
                            {status === 'error' && 'Verification Failed'}
                        </h2>
                        <p style={{ marginTop: '0.5rem', marginBottom: '1.5rem', color: 'rgba(255,255,255,0.7)' }}>{message}</p>
                    </div>

                    {status !== 'verifying' && (
                        <div className="auth-form" style={{ marginTop: '1rem' }}>
                            <button className="auth-submit-btn" onClick={handleContinue}>
                                Continue to App
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
