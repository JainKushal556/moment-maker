import { auth } from '../config/firebase'

const BASE_URL = import.meta.env.VITE_API_BASE_URL
const MAX_UPLOAD_PX = 1920   // max width or height
const JPEG_QUALITY   = 0.85  // 85 % — good balance of size vs quality

/**
 * Compresses an image File using the Canvas API.
 * Resizes to maxPx on the longest edge and re-encodes as JPEG.
 */
function compressImage(file, maxPx, quality) {
    return new Promise((resolve) => {
        const img = new Image()
        const objectUrl = URL.createObjectURL(file)
        img.onload = () => {
            URL.revokeObjectURL(objectUrl)
            let { width, height } = img
            if (width > maxPx || height > maxPx) {
                if (width >= height) {
                    height = Math.round((height / width) * maxPx)
                    width = maxPx
                } else {
                    width = Math.round((width / height) * maxPx)
                    height = maxPx
                }
            }
            const canvas = document.createElement('canvas')
            canvas.width = width
            canvas.height = height
            canvas.getContext('2d').drawImage(img, 0, 0, width, height)
            canvas.toBlob(
                (blob) => resolve(new File([blob], file.name, { type: 'image/jpeg' })),
                'image/jpeg',
                quality
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
    if (auth.currentUser) return auth.currentUser.getIdToken()
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
 * @param {number} maxPx - Max width/height
 * @param {number} quality - JPEG quality (0.0 to 1.0)
 * @param {string} folder - Destination folder in Cloudinary
 * @returns {Promise<string>} - The secure Cloudinary URL of the uploaded image
 */
export async function uploadImage(file, preFetchedToken = null, maxPx = MAX_UPLOAD_PX, quality = JPEG_QUALITY, folder = 'moment-crafter/user-moments') {
    const token = preFetchedToken ?? await getFirebaseToken()

    // Compress before upload
    const compressed = await compressImage(file, maxPx, quality)

    const formData = new FormData()
    formData.append('file', compressed)

    const response = await fetch(`${BASE_URL}/upload/image?folder=${encodeURIComponent(folder)}`, {
        method: 'POST',
        headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
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

/**
 * Requests the backend to delete an image from Cloudinary using its URL.
 * @param {string} url - The full Cloudinary URL to delete
 */
export async function deleteImage(url) {
    if (!url) return;
    const token = await getFirebaseToken();
    
    try {
        const response = await fetch(`${BASE_URL}/upload/image?url=${encodeURIComponent(url)}`, {
            method: 'DELETE',
            headers: {
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
        });
        
        if (!response.ok) {
            console.warn("Failed to delete old image from Cloudinary:", response.status);
        }
    } catch (error) {
        console.error("Error calling delete image endpoint:", error);
    }
}
