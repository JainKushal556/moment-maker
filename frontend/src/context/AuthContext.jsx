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
    sendEmailVerification,
    linkWithPopup,
    EmailAuthProvider,
    reauthenticateWithCredential,
    updatePassword,
} from 'firebase/auth'
import { getFirestore, doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { auth, googleProvider, storage } from '../config/firebase'

import { uploadImage, deleteImage } from '../services/cloudinary'

const db = getFirestore()

export const AuthContext = createContext(null)

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) throw new Error('useAuth must be used within an AuthProvider')
    return context
}

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null)
    const [unverifiedUser, setUnverifiedUser] = useState(null)
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
        
        // Find photo from providers if not on main object (important for linked accounts)
        const googlePhoto = user.providerData?.find(p => p.providerId === 'google.com')?.photoURL
        const photoURL = user.photoURL || googlePhoto || ''
        
        const userRef = doc(db, 'users', user.uid)
        const data = {
            uid: user.uid,
            displayName: user.displayName || '',
            email: user.email || '',
            photoURL: photoURL,
            updatedAt: serverTimestamp(),
        }
        await setDoc(userRef, data, { merge: true })
        return data
    }

    const mapUserObject = (user, profileData = {}) => {
        if (!user) return null
        return {
            uid: user.uid,
            email: user.email,
            displayName: profileData.displayName || user.displayName,
            photoURL: profileData.photoURL || user.photoURL,
            emailVerified: user.emailVerified,
            providerData: user.providerData,
            getIdToken: (...args) => user.getIdToken(...args),
            reload: (...args) => user.reload(...args),
        }
    }

    // Track Firebase auth state changes globally
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                if (!user.emailVerified) {
                    setUnverifiedUser(user)
                    setCurrentUser(null)
                    setFavorites([])
                    setLoading(false)
                    return
                }

                // 1. Set initial user from Auth immediately
                setCurrentUser(mapUserObject(user))
                setUnverifiedUser(null)
                setLoading(false)

                // 2. Sync with Firestore
                try {
                    const userRef = doc(db, 'users', user.uid)
                    let docSnap = await getDoc(userRef)
                    
                    let profileData;
                    if (!docSnap.exists()) {
                        profileData = await createUserDoc(user)
                    } else {
                        profileData = docSnap.data()
                    }

                    // 3. Update with full merged data
                    setCurrentUser(mapUserObject(user, profileData))

                    // 4. Fetch favorites
                    const res = await getFavorites()
                    if (res && res.favorites) setFavorites(res.favorites)
                } catch (e) {
                    console.error("Auth sync error:", e)
                }
            } else {
                setFavorites([])
                setCurrentUser(null)
                setUnverifiedUser(null)
                setLoading(false)
            }
        })
        return unsubscribe
    }, [])

    const signInWithGoogle = () => {
        return signInWithPopup(auth, googleProvider)
    }

    const connectGoogle = async () => {
        if (!auth.currentUser) return
        const result = await linkWithPopup(auth.currentUser, googleProvider)
        // Sync the updated user info (like photoURL if it was missing)
        const profileData = await createUserDoc(result.user)
        setCurrentUser(mapUserObject(result.user, profileData))
        return result
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
        await sendEmailVerification(result.user)
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

    const updateUserProfile = async (updates) => {
        if (!auth.currentUser) return
        await updateProfile(auth.currentUser, updates)
        
        // Sync with Firestore first to ensure photo/name are in DB
        const profileData = await createUserDoc(auth.currentUser)
        
        // Refresh local state using the reliable mapping helper
        setCurrentUser(mapUserObject(auth.currentUser, profileData))
    }

    const changeUserPassword = async (currentPassword, newPassword) => {
        const user = auth.currentUser
        if (!user || !user.email) return
        
        // 1. Re-authenticate
        const credential = EmailAuthProvider.credential(user.email, currentPassword)
        await reauthenticateWithCredential(user, credential)
        
        // 2. Update Password
        await updatePassword(user, newPassword)
    }

    const uploadProfilePicture = async (file) => {
        if (!auth.currentUser) return
        
        const oldPhotoURL = auth.currentUser.photoURL
        
        // Avatars only need to be small. 250px @ 60% quality results in ~10-15KB.
        const photoURL = await uploadImage(file, null, 250, 0.6, 'moment-crafter/profile')
        await updateUserProfile({ photoURL })

        // Clean up old Cloudinary photo if it exists
        if (oldPhotoURL && oldPhotoURL.includes('cloudinary.com')) {
            deleteImage(oldPhotoURL).catch(err => console.warn("Failed to delete old avatar:", err))
        }

        return photoURL
    }

    const resendVerificationEmail = () => {
        if (auth.currentUser && !auth.currentUser.emailVerified) {
            return sendEmailVerification(auth.currentUser)
        }
    }

    const checkEmailVerification = async () => {
        if (auth.currentUser) {
            await auth.currentUser.reload()
            if (auth.currentUser.emailVerified) {
                // If verified now, trigger the state update manually
                setUnverifiedUser(null)
                setCurrentUser({ ...auth.currentUser })
                
                await createUserDoc(auth.currentUser).catch(console.error)
                try {
                    const res = await getFavorites()
                    if (res && res.favorites) setFavorites(res.favorites)
                } catch (e) {
                    console.error("Error fetching favorites", e)
                }
                return true
            }
        }
        return false
    }

    const value = {
        currentUser,
        unverifiedUser,
        loading,
        authModalOpen,
        openAuthModal,
        closeAuthModal,
        onAuthSuccess,
        signInWithGoogle,
        connectGoogle,
        signInWithEmail,
        signUpWithEmail,
        resetPassword,
        logout,
        getIdToken,
        favorites,
        handleToggleFavorite,
        resendVerificationEmail,
        checkEmailVerification,
        updateUserProfile,
        changeUserPassword,
        uploadProfilePicture,
    }

    // Don't render children until we know auth state, prevents flash of wrong UI
    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}
