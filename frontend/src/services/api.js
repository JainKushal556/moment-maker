import { auth } from '../config/firebase'

const BASE_URL = import.meta.env.VITE_API_BASE_URL

/**
 * Waits for Firebase Auth to finish initializing and returns the current user.
 * Prevents the race condition where auth.currentUser is null right after page load
 * even when the user is actually logged in (Firebase hasn't hydrated yet).
 */
function waitForAuthUser() {
    if (auth.currentUser) return Promise.resolve(auth.currentUser)
    return new Promise((resolve) => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            unsubscribe()
            resolve(user)
        })
    })
}

/**
 * Core fetch wrapper — automatically attaches the Firebase ID token
 * as a Bearer token to every request.
 */
async function apiFetch(path, options = {}) {
    const user = await waitForAuthUser()
    const token = user ? await user.getIdToken() : null

    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
    }

    const res = await fetch(`${BASE_URL}${path}`, { ...options, headers })

    if (!res.ok) {
        const errorBody = await res.json().catch(() => ({}))
        const message = errorBody?.detail || `API error: ${res.status}`
        throw new Error(message)
    }

    // 204 No Content — nothing to parse
    if (res.status === 204) return null

    return res.json()
}

// ─── Moments API ────────────────────────────────────────────────

/** Fetch all moments for the authenticated user */
export const getMoments = () => apiFetch('/moments')

/** Save a new moment */
export const saveMoment = (data) =>
    apiFetch('/moments', {
        method: 'POST',
        body: JSON.stringify(data),
    })

/** Update an existing moment's customization */
export const updateMoment = (id, data) =>
    apiFetch(`/moments/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
    })

/** Delete a moment by its ID */
export const deleteMoment = (id) =>
    apiFetch(`/moments/${id}`, { method: 'DELETE' })

/** Fetch a public moment for the share recipient view (auth not required for this endpoint, but apiFetch handles it gracefully if token is null) */
export const getPublicMoment = (id, visitorId) => {
    const query = visitorId ? `?visitorId=${visitorId}` : '';
    return apiFetch(`/moments/public/${id}${query}`);
}

/** Reactivate an expired moment */
export const reactivateMoment = (id) =>
    apiFetch(`/moments/${id}/reactivate`, { method: 'POST' })
// ─── Users API ────────────────────────────────────────────────

/** Fetch user's favorite templates */
export const getFavorites = () => apiFetch('/moments/favorites')

/** Toggle a template in user's favorites */
export const toggleFavorite = (templateId) => 
    apiFetch(`/moments/favorites/${templateId}`, { method: 'POST' })

// ─── Templates API ─────────────────────────────────────────────

/** Fetch all aggregated template stats */
export const getAllTemplateStats = () =>
    apiFetch(`/moments/templates/stats`)

/** Fetch user's rating for a specific template */
export const getTemplateRating = (templateId) => 
    apiFetch(`/moments/templates/${templateId}/rating`)

/** Submit or update a rating for a template */
export const rateTemplate = (templateId, rating) => 
    apiFetch(`/moments/templates/${templateId}/rate`, {
        method: 'POST',
        body: JSON.stringify({ rating }),
    })
