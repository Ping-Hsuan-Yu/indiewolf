import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function deleteCloudinaryImage(url: string) {
  if (!url) return

  try {
    const parts = url.split('/upload/')
    if (parts.length < 2) return

    let path = parts[1]
    if (path.match(/^v\d+\//)) {
      path = path.replace(/^v\d+\//, '')
    }

    const publicId = path.split('.').slice(0, -1).join('.') || path
    await cloudinary.uploader.destroy(publicId)
  } catch (error) {
    console.error('Failed to delete Cloudinary image:', error)
  }
}

export default cloudinary
