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

    const res = await fetch(`${BASE_URL}${path}`, { 
        ...options, 
        headers,
        cache: 'no-store'
    })

    if (!res.ok) {
        const errorBody = await res.json().catch(() => ({}))
        const message = errorBody?.detail || `API error: ${res.status}`
        throw new Error(message)
    }

    // 204 No Content — nothing to parse
    if (res.status === 204) return null

    const data = await res.json();
    
    // If the response follows the {success, data, message} pattern
    if (data && typeof data === 'object' && 'success' in data) {
        if (!data.success) {
            throw new Error(data.message || 'API operation failed');
        }
        return data.data; // Return the actual data payload
    }

    return data;
}

// ─── Moments API ────────────────────────────────────────────────

/** Fetch all moments for the authenticated user */
export const getMoments = () => apiFetch('/moments')

/** Fetch a single moment for the authenticated user */
export const getMoment = (id) => apiFetch(`/moments/${id}`)

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

/** Initialize authenticated user's profile with optional referral code */
export const initializeUser = (referralCode = null) => 
    apiFetch('/users/initialize', {
        method: 'POST',
        body: JSON.stringify({ referralCode })
    })

/** Unlock a premium template using Wishbits */
export const unlockTemplate = (templateId) =>
    apiFetch('/users/unlock', {
        method: 'POST',
        body: JSON.stringify({ templateId })
    })

/** Fetch authenticated user's Wishbit profile (wishbits, referralCode, etc) */
export const getUserProfile = () => apiFetch('/users/me')

/** Claim a specific daily login reward day */
export const claimDailyReward = (day) =>
    apiFetch('/users/daily-claim', { 
        method: 'POST',
        body: JSON.stringify({ day_to_claim: day })
    })

/** Claim a one-time reward (WELCOME_BONUS, REFERRAL_SIGNUP) */
export const claimOneTimeReward = (rewardType) =>
    apiFetch('/users/claim-one-time', {
        method: 'POST',
        body: JSON.stringify({ reward_type: rewardType })
    })

/** Fetch user's favorite templates */
export const getFavorites = () => apiFetch('/moments/favorites')

/** Toggle a template in user's favorites */
export const toggleFavorite = (templateId) => 
    apiFetch(`/moments/favorites/${templateId}`, { method: 'POST' })

export const claimReferralReward = (friendUid) =>
    apiFetch('/users/claim-referral', {
        method: 'POST',
        body: JSON.stringify({ friend_uid: friendUid })
    })

/** Claim a milestone reward */
export const claimMilestoneReward = (count) =>
    apiFetch('/users/claim-milestone', {
        method: 'POST',
        body: JSON.stringify({ count })
    })

export const getTransactionHistory = (limit = 5, lastId = null) => {
    let url = `/users/me/transactions?limit=${limit}`;
    if (lastId) url += `&last_id=${lastId}`;
    return apiFetch(url);
};

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
