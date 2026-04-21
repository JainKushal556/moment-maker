import { auth } from '../config/firebase'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

/**
 * Core fetch wrapper — automatically attaches the Firebase ID token
 * as a Bearer token to every request.
 */
async function apiFetch(path, options = {}) {
    const user = auth.currentUser
    const token = user ? await user.getIdToken(true) : null

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
export const getPublicMoment = (id) =>
    apiFetch(`/moments/public/${id}`)

