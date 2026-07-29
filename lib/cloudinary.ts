import { v2 as cloudinary, type UploadApiResponse } from 'cloudinary'

import { extractCloudinaryPublicId } from './cloudinary-url'

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// SEC-3: single validated upload path shared by all admin actions (was duplicated
// verbatim in 9 places). Keep MAX in sync with serverActions.bodySizeLimit.
const MAX_UPLOAD_BYTES = 15 * 1024 * 1024 // 15MB
const ALLOWED_UPLOAD_MIME = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
  'image/svg+xml',
]

export async function uploadToCloudinary(
  file: File,
  folder: string
): Promise<UploadApiResponse> {
  if (!file || file.size === 0) {
    throw new Error('Empty or missing upload file')
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error(
      `File too large: ${(file.size / 1024 / 1024).toFixed(1)}MB (max 15MB)`
    )
  }
  if (!ALLOWED_UPLOAD_MIME.includes(file.type)) {
    throw new Error(`Unsupported file type: ${file.type || 'unknown'}`)
  }

  const buffer = Buffer.from(await file.arrayBuffer())

  return new Promise<UploadApiResponse>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder }, (error, result) => {
        if (error || !result) {
          reject(error ?? new Error('Cloudinary upload returned no result'))
        } else {
          resolve(result)
        }
      })
      .end(buffer)
  })
}

export async function deleteCloudinaryImage(url: string) {
  const publicId = extractCloudinaryPublicId(url)
  if (!publicId) return

  try {
    await cloudinary.uploader.destroy(publicId)
  } catch (error) {
    console.error('Failed to delete Cloudinary image:', error)
  }
}

export default cloudinary
