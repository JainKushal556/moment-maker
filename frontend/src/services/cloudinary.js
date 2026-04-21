import { auth } from '../config/firebase'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

/**
 * Uploads an image File to our FastAPI backend, which then uploads it
 * to Cloudinary server-side. Cloudinary credentials never touch the browser.
 *
 * @param {File} file - The image file selected by the user
 * @returns {Promise<string>} - The secure Cloudinary URL of the uploaded image
 */
export async function uploadImage(file) {
    const user = auth.currentUser
    const token = user ? await user.getIdToken(true) : null

    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch(`${BASE_URL}/upload/image`, {
        method: 'POST',
        headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            // Do NOT set Content-Type — the browser sets it automatically
            // with the correct multipart boundary when using FormData
        },
        body: formData,
    })

    if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}))
        throw new Error(errorBody?.detail || `Upload failed: ${response.status}`)
    }

    const data = await response.json()
    return data.url
}

/**
 * Helper to convert a Base64 data URL into a standard JavaScript File object.
 * @param {string} dataurl - The base64 string (e.g. data:image/png;base64,iVBORw0KGgo...)
 * @param {string} filename - The desired filename.
 * @returns {File}
 */
export function base64ToFile(dataurl, filename) {
    var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[arr.length - 1]), 
        n = bstr.length, 
        u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime});
}
