import { useEffect, useRef } from 'react'
import { useAuth } from '../../context/AuthContext'

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

export default function GoogleOneTap() {
    const { signInWithGoogleCredential, onAuthSuccess } = useAuth()
    const initialized = useRef(false)

    useEffect(() => {
        // Don't run twice (StrictMode) or if already dismissed this session
        if (initialized.current) return
        if (sessionStorage.getItem('one_tap_dismissed')) return
        if (sessionStorage.getItem('referral_modal_shown')) return
        if (!CLIENT_ID) return

        // Wait for the Google SDK to be ready, then show after a short delay
        // so the landing page hero animation has time to complete
        const showOneTap = () => {
            if (!window.google?.accounts?.id) return

            initialized.current = true

            window.google.accounts.id.initialize({
                client_id: CLIENT_ID,
                callback: handleCredentialResponse,
                auto_select: false,
                cancel_on_tap_outside: false, // keep it visible unless user explicitly dismisses
                itp_support: true, // support Safari Intelligent Tracking Prevention
            })

            window.google.accounts.id.prompt((notification) => {
                if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
                    // One Tap couldn't show (browser blocked, user opted out previously, etc.)
                    console.log('Google One Tap not displayed:', notification.getNotDisplayedReason?.() || notification.getSkippedReason?.())
                }
                if (notification.isDismissedMoment()) {
                    // User dismissed — don't show again this session
                    sessionStorage.setItem('one_tap_dismissed', 'true')
                }
            })
        }

        const handleCredentialResponse = async (response) => {
            try {
                await signInWithGoogleCredential(response.credential)
                onAuthSuccess?.()
                // Clean up the dismissed flag if they successfully signed in
                sessionStorage.removeItem('one_tap_dismissed')
            } catch (err) {
                console.error('Google One Tap sign-in failed:', err)
            }
        }

        // 3-second delay: lets the preloader finish and landing hero animate in
        const timer = setTimeout(showOneTap, 3000)

        return () => {
            clearTimeout(timer)
            // Cancel One Tap when component unmounts (user navigated away)
            window.google?.accounts?.id?.cancel?.()
        }
    }, [signInWithGoogleCredential, onAuthSuccess])

    // This component renders nothing visible — Google renders its own iframe
    // We inject a tiny CSS override to push the One Tap popup below the navbar
    return (
        <style>{`
            #credential_picker_container {
                top: 52px !important;
            }
            @media (min-width: 1024px) {
                #credential_picker_container {
                    top: 60px !important;
                }
            }
        `}</style>
    )
}
