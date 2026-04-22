import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { getFavorites, toggleFavorite } from '../services/api'
import {
    onAuthStateChanged,
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    updateProfile,
    signOut,
    sendPasswordResetEmail,
} from 'firebase/auth'
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { auth, googleProvider } from '../config/firebase'

const db = getFirestore()

export const AuthContext = createContext(null)

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) throw new Error('useAuth must be used within an AuthProvider')
    return context
}

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [authModalOpen, setAuthModalOpen] = useState(false)
    const [authCallback, setAuthCallback] = useState(null)
    const [favorites, setFavorites] = useState([])

    // Call this from anywhere to open the login modal.
    // Pass an optional callback to run after successful login.
    const openAuthModal = useCallback((onSuccess) => {
        setAuthCallback(() => onSuccess || null)
        setAuthModalOpen(true)
    }, [])

    const closeAuthModal = useCallback(() => {
        setAuthModalOpen(false)
        setAuthCallback(null)
    }, [])

    const onAuthSuccess = useCallback(() => {
        setAuthModalOpen(false)
        authCallback?.()
        setAuthCallback(null)
    }, [authCallback])

    // Create (or update) a user profile document in Firestore
    const createUserDoc = async (user) => {
        if (!user) return
        const userRef = doc(db, 'users', user.uid)
        await setDoc(userRef, {
            uid:         user.uid,
            displayName: user.displayName || '',
            email:       user.email || '',
            photoURL:    user.photoURL || '',
            updatedAt:   serverTimestamp(),
        }, { merge: true }) // merge:true — won't overwrite existing fields like createdAt
    }

    // Track Firebase auth state changes globally
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                // Upsert Firestore user document on every login
                await createUserDoc(user).catch(console.error)
                // Fetch favorites
                try {
                    const res = await getFavorites()
                    if (res && res.favorites) setFavorites(res.favorites)
                } catch(e) {
                    console.error("Error fetching favorites", e)
                }
            } else {
                setFavorites([])
            }
            setCurrentUser(user)
            setLoading(false)
        })
        return unsubscribe
    }, [])

    const signInWithGoogle = () => {
        return signInWithPopup(auth, googleProvider)
    }

    const signInWithEmail = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password)
    }

    const signUpWithEmail = async (email, password, displayName) => {
        const result = await createUserWithEmailAndPassword(auth, email, password)
        // Immediately update display name after signup
        if (displayName) {
            await updateProfile(result.user, { displayName })
        }
        return result
    }

    const resetPassword = (email) => {
        return sendPasswordResetEmail(auth, email)
    }

    const logout = () => {
        return signOut(auth)
    }

    // Expose a helper to get a fresh JWT for backend API calls
    const getIdToken = async () => {
        if (!currentUser) return null
        return currentUser.getIdToken(/* forceRefresh */ true)
    }

    const handleToggleFavorite = async (templateId) => {
        if (!currentUser) {
            openAuthModal()
            return false
        }
        try {
            const res = await toggleFavorite(templateId)
            if (res && res.favorites) {
                setFavorites(res.favorites)
                return true
            }
        } catch (e) {
            console.error("Failed to toggle favorite", e)
        }
        return false
    }

    const value = {
        currentUser,
        loading,
        authModalOpen,
        openAuthModal,
        closeAuthModal,
        onAuthSuccess,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        resetPassword,
        logout,
        getIdToken,
        favorites,
        handleToggleFavorite,
    }

    // Don't render children until we know auth state, prevents flash of wrong UI
    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}
