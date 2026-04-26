import { createContext, useState, useRef, useCallback, useEffect } from 'react'

export const NavbarContext = createContext(null)
export const NavbarColorContext = createContext(null)
export const ViewContext = createContext(null)

const SAFE_VIEWS_TO_RESTORE = ['landing', 'categories', 'moments', 'about', 'share']
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
    const [currentView, setCurrentView] = useState(getInitialView()) // 'landing' | 'categories' | 'preview' | 'editor' | 'share' | 'about' | 'moments'
    const [selectedTemplate, setSelectedTemplate] = useState(null)
    const [templateCustomization, setTemplateCustomization] = useState({})
    const [sharedMomentId, setSharedMomentId] = useState(getInitialSharedMomentId())
    const [editingMomentId, setEditingMomentId] = useState(null)
    const [selectedIntroId, setSelectedIntroId] = useState('glass-card')

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

    // Transition-aware navigation — plays SVG transition then swaps view at midpoint
    const navigateTo = useCallback((nextView) => {
        // If already transitioning or same view, just set directly
        if (isTransitioning.current || nextView === currentView) {
            setCurrentView(nextView)
            return
        }

        const transition = transitionRef.current

        if (!transition) {
            setCurrentView(nextView)
            return
        }

        isTransitioning.current = true

        // playPromise resolves at the midpoint of the SVG animation
        transition.play(nextView).then(() => {
            setCurrentView(nextView)
            // Faster lock time (1.5s) as recently tuned
            setTimeout(() => { isTransitioning.current = false }, 1500)
        })
    }, [currentView])

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
