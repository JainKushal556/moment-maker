import { useEffect, useState, useRef } from 'react'
import { applyActionCode } from 'firebase/auth'
import { auth } from '../../config/firebase'
import './auth.css'

export default function VerifyEmail({ oobCode }) {
    const [status, setStatus] = useState('verifying')
    const [message, setMessage] = useState('Verifying your email address...')
    const hasAttempted = useRef(false)

    useEffect(() => {
        document.body.style.overflow = 'hidden'
        if (window.lenis) window.lenis.stop()

        return () => {
            document.body.style.overflow = ''
            if (window.lenis) window.lenis.start()
        }
    }, [])

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
        window.location.href = '/'
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
                        {status === 'verifying' && 'Verifying...'}
                        {status === 'success' && 'Email Verified'}
                        {status === 'error' && 'Verification Failed'}
                    </h1>
                    <p className="auth-subtitle">
                        {status === 'verifying' 
                            ? 'Hold on, we are securing your account...' 
                            : message}
                    </p>
                </div>

                <div className="auth-card" style={{ marginTop: '2rem' }}>
                    <div className="auth-form">
                        {status === 'verifying' ? (
                            <div className="flex items-center justify-center p-8">
                                <span className="auth-spinner" style={{ width: '40px', height: '40px' }} />
                            </div>
                        ) : (
                            <>
                                {status === 'success' ? (
                                    <div className="auth-banner auth-banner--success">
                                        Your account is now ready to use!
                                    </div>
                                ) : (
                                    <div className="auth-banner auth-banner--error">
                                        {message}
                                    </div>
                                )}
                                <button className="auth-submit-btn" onClick={handleContinue} style={{ marginTop: '1rem' }}>
                                    Start Crafting
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
