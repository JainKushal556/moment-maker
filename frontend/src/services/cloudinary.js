import { auth } from '../config/firebase'

const BASE_URL = import.meta.env.VITE_API_BASE_URL
const MAX_UPLOAD_PX = 1920   // max width or height
const JPEG_QUALITY   = 0.85  // 85 % — good balance of size vs quality

/**
 * Compresses an image File using the Canvas API.
 * Resizes to MAX_UPLOAD_PX on the longest edge and re-encodes as JPEG.
 * A typical 10 MB phone photo becomes ~200–600 KB.
 */
function compressImage(file) {
    return new Promise((resolve) => {
        const img = new Image()
        const objectUrl = URL.createObjectURL(file)
        img.onload = () => {
            URL.revokeObjectURL(objectUrl)
            let { width, height } = img
            if (width > MAX_UPLOAD_PX || height > MAX_UPLOAD_PX) {
                if (width >= height) {
                    height = Math.round((height / width) * MAX_UPLOAD_PX)
                    width = MAX_UPLOAD_PX
                } else {
                    width = Math.round((width / height) * MAX_UPLOAD_PX)
                    height = MAX_UPLOAD_PX
                }
            }
            const canvas = document.createElement('canvas')
            canvas.width = width
            canvas.height = height
            canvas.getContext('2d').drawImage(img, 0, 0, width, height)
            canvas.toBlob(
                (blob) => resolve(new File([blob], file.name, { type: 'image/jpeg' })),
                'image/jpeg',
                JPEG_QUALITY
            )
        }
        img.src = objectUrl
    })
}

/**
 * Waits for Firebase Auth to be ready and returns the current ID token.
 * Export this so callers can fetch the token ONCE and reuse it for multiple uploads.
 */
export async function getFirebaseToken() {
    return new Promise((resolve) => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            unsubscribe()
            if (user) {
                const token = await user.getIdToken()
                resolve(token)
            } else {
                resolve(null)
            }
        })
    })
}

/**
 * Uploads an image File to our FastAPI backend, which then uploads it
 * to Cloudinary server-side. Cloudinary credentials never touch the browser.
 *
 * @param {File} file - The image file selected by the user
 * @param {string|null} preFetchedToken - Optional pre-fetched Firebase token.
 *   Pass this when doing multiple uploads to avoid fetching a new token each time.
 * @returns {Promise<string>} - The secure Cloudinary URL of the uploaded image
 */
export async function uploadImage(file, preFetchedToken = null) {
    const token = preFetchedToken ?? await getFirebaseToken()

    // Compress before upload — resizes large phone photos to max 1920px JPEG
    // so they always stay well under the backend's 5 MB limit
    const compressed = await compressImage(file)

    const formData = new FormData()
    formData.append('file', compressed)

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
