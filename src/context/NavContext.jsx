import { createContext, useState } from 'react'

export const NavbarContext = createContext(null)
export const NavbarColorContext = createContext(null)
export const ViewContext = createContext(null)

export const NavProvider = ({ children }) => {
    const [navOpen, setNavOpen] = useState(false)
    const [navColor, setNavColor] = useState('white')
    const [currentView, setCurrentView] = useState('landing') // 'landing' | 'categories'

    return (
        <ViewContext.Provider value={[currentView, setCurrentView]}>
            <NavbarColorContext.Provider value={[navColor, setNavColor]}>
                <NavbarContext.Provider value={[navOpen, setNavOpen]}>
                    {children}
                </NavbarContext.Provider>
            </NavbarColorContext.Provider>
        </ViewContext.Provider>
    )
}
