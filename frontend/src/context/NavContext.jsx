import { createContext, useState, useRef, useCallback, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { auth } from '../config/firebase'

export const NavbarContext = createContext(null)
export const NavbarColorContext = createContext(null)
export const ViewContext = createContext(null)

const SAFE_VIEWS_TO_RESTORE = ['landing', 'categories', 'gallery', 'moments', 'about', 'share', 'settings', 'copyright', 'preview', 'wallet', 'refer']
const getInitialView = () => {
    const saved = sessionStorage.getItem('currentView')
    if (saved === 'editor') return 'moments'
    if (saved && SAFE_VIEWS_TO_RESTORE.includes(saved)) {
        return saved
    }
    return 'landing'
}

const getInitialSharedMomentId = () => {
    return sessionStorage.getItem('sharedMomentId') || null
}

export const NavProvider = ({ children }) => {
    const [navOpen, setNavOpen] = useState(false)
    const [navColor, setNavColor] = useState('white')
    const [currentView, setCurrentView] = useState(getInitialView()) // 'landing' | 'categories' | 'preview' | 'editor' | 'share' | 'about' | 'moments' | 'settings'
    const [selectedTemplate, setSelectedTemplate] = useState(null)
    const [templateCustomization, setTemplateCustomization] = useState({})
    const [sharedMomentId, setSharedMomentId] = useState(getInitialSharedMomentId())
    const [editingMomentId, setEditingMomentId] = useState(null)
    const [selectedIntroId, setSelectedIntroId] = useState('glass-card')

    const { currentUser, openAuthModal, loading } = useAuth()
    const PROTECTED_VIEWS = ['editor', 'moments', 'settings', 'share', 'wallet', 'refer']

    useEffect(() => {
        const isAuth = auth.currentUser && auth.currentUser.emailVerified
        
        // 1. Kick out unauthenticated users from protected views
        if (PROTECTED_VIEWS.includes(currentView) && !isAuth && !loading) {
            setCurrentView('landing')
            window.history.replaceState({ view: 'landing' }, '', '')
        }

        // 2. Auto-redirect logged-in users to 'My Moments' on initial site visit
        if (isAuth && currentView === 'landing' && !sessionStorage.getItem('initialAuthRedirectDone')) {
            sessionStorage.setItem('initialAuthRedirectDone', 'true')
            const saved = sessionStorage.getItem('currentView')
            
            // If they didn't have a specific saved view (or their saved view was landing), send to moments
            if (!saved || saved === 'landing') {
                setCurrentView('moments')
                window.history.replaceState({ view: 'moments' }, '', '')
            }
        }
    }, [currentUser, currentView, loading])

    // Ref that App.jsx will attach SvgTransition to
    const transitionRef = useRef(null)
    const isTransitioning = useRef(false)

    // Save safe views to sessionStorage whenever they change
    useEffect(() => {
        if (SAFE_VIEWS_TO_RESTORE.includes(currentView) || currentView === 'editor') {
            sessionStorage.setItem('currentView', currentView)
        }
    }, [currentView])

    useEffect(() => {
        if (sharedMomentId) {
            sessionStorage.setItem('sharedMomentId', sharedMomentId)
        } else {
            sessionStorage.removeItem('sharedMomentId')
        }
    }, [sharedMomentId])

    // 1. Initialize history state on mount
    useEffect(() => {
        if (!window.history.state) {
            window.history.replaceState({ view: currentView }, '', '');
        }
    }, []);

    // 2. Transition-aware navigation — plays SVG transition then swaps view at midpoint
    const navigateTo = useCallback((nextView, shouldPush = true) => {
        const isAuth = auth.currentUser && auth.currentUser.emailVerified
        if (PROTECTED_VIEWS.includes(nextView) && !isAuth && !loading) {
            setCurrentView('landing')
            openAuthModal()
            window.history.replaceState({ view: 'landing' }, '', '')
            return
        }

        // If already transitioning or same view, just set directly
        if (isTransitioning.current || nextView === currentView) {
            setCurrentView(nextView)
            return
        }

        // Push to history if requested (default behavior for UI clicks)
        if (shouldPush) {
            window.history.pushState({ view: nextView }, '', '');
        }

        const transition = transitionRef.current

        if (!transition) {
            setCurrentView(nextView)
            return
        }

        isTransitioning.current = true

        if (currentView === 'landing' && nextView !== 'landing') {
            window.releaseLandingScrollLocks?.()
        }

        // playPromise resolves at the midpoint of the SVG animation
        transition.play(nextView).then(() => {
            if (currentView === 'landing' && nextView !== 'landing') {
                window.releaseLandingScrollLocks?.()
            }
            if (window.lenis) {
                window.lenis.start()
                window.lenis.scrollTo(0, { immediate: true, force: true })
            } else {
                window.scrollTo(0, 0)
            }
            document.body.style.overflow = ''
            document.documentElement.style.overflow = ''
            document.body.style.touchAction = ''
            setCurrentView(nextView)
            // Faster lock time (1.5s) as recently tuned
            setTimeout(() => { isTransitioning.current = false }, 1500)
        })
    }, [currentView])

    // 3. Listen for popstate (back/forward buttons)
    useEffect(() => {
        const handlePopState = (event) => {
            if (event.state && event.state.view) {
                // Navigate without pushing state again to avoid history loops
                navigateTo(event.state.view, false);
            }
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, [navigateTo]);

    return (
        <ViewContext.Provider value={[currentView, navigateTo, selectedTemplate, setSelectedTemplate, templateCustomization, setTemplateCustomization, transitionRef, sharedMomentId, setSharedMomentId, editingMomentId, setEditingMomentId, selectedIntroId, setSelectedIntroId, setCurrentView]}>
            <NavbarColorContext.Provider value={[navColor, setNavColor]}>
                <NavbarContext.Provider value={[navOpen, setNavOpen]}>
                    {children}
                </NavbarContext.Provider>
            </NavbarColorContext.Provider>
        </ViewContext.Provider>
    )
}
