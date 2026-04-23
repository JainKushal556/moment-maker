import { createContext, useState, useRef, useCallback } from 'react'

export const NavbarContext = createContext(null)
export const NavbarColorContext = createContext(null)
export const ViewContext = createContext(null)

export const NavProvider = ({ children }) => {
    const [navOpen, setNavOpen] = useState(false)
    const [navColor, setNavColor] = useState('white')
    const [currentView, setCurrentView] = useState('landing') // 'landing' | 'categories' | 'preview' | 'editor' | 'share' | 'about'
    const [selectedTemplate, setSelectedTemplate] = useState(null)
    const [templateCustomization, setTemplateCustomization] = useState({})
    const [sharedMomentId, setSharedMomentId] = useState(null)
    const [editingMomentId, setEditingMomentId] = useState(null) // ID of moment being edited from MyCreations

    // Ref that App.jsx will attach SvgTransition to
    const transitionRef = useRef(null)
    const isTransitioning = useRef(false)

    // Routes that already have their own custom animations — skip SVG transition for these
    const SKIP_TRANSITION = [
        ['landing', 'categories'],
        ['categories', 'landing'],
    ]

    // Transition-aware navigation — plays SVG transition then swaps view at midpoint
    const navigateTo = useCallback((nextView) => {
        // If already transitioning or same view, just set directly
        if (isTransitioning.current || nextView === currentView) {
            setCurrentView(nextView)
            return
        }

        // Check if this route should skip the SVG transition
        const shouldSkip = SKIP_TRANSITION.some(
            ([from, to]) => from === currentView && to === nextView
        )

        const transition = transitionRef.current
        if (shouldSkip || !transition) {
            // Use existing animation or fallback to instant swap
            setCurrentView(nextView)
            return
        }

        isTransitioning.current = true
        transition.play(nextView).then(() => {
            setCurrentView(nextView)
            // Small delay to let exit animation play out before allowing next transition
            setTimeout(() => { isTransitioning.current = false }, 400)
        })
    }, [currentView])

    return (
        <ViewContext.Provider value={[currentView, navigateTo, selectedTemplate, setSelectedTemplate, templateCustomization, setTemplateCustomization, transitionRef, sharedMomentId, setSharedMomentId, editingMomentId, setEditingMomentId]}>
            <NavbarColorContext.Provider value={[navColor, setNavColor]}>
                <NavbarContext.Provider value={[navOpen, setNavOpen]}>
                    {children}
                </NavbarContext.Provider>
            </NavbarColorContext.Provider>
        </ViewContext.Provider>
    )
}
