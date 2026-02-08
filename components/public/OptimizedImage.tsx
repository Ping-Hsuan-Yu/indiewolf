'use client'

import { CldImage } from 'next-cloudinary'

type OptimizedImageProps = {
  src: string,
  url: string,
  alt: string | null
  width: number
  height: number
  className?: string
  sizes: string
  eager?: boolean
}

/**
 * 優化的 Cloudinary 圖片元件
 * - 統一使用 CldImage 進行 Cloudinary 優化
 */

export default function OptimizedImage({
  src,
  url,
  alt,
  className = '',
  sizes,
  width,
  height,
  eager = false
}: OptimizedImageProps) {
  return (
    <CldImage
      src={src}
      alt={alt ?? ''}
      className={className}
      sizes={sizes}
      width={width}
      height={height}
      format='auto'
      quality='auto'
      placeholder='blur'
      blurDataURL={url.replace('/upload/', '/upload/w_10,e_blur:1000,q_1/')}
      loading={eager ? 'eager' : 'lazy'}
    />
  )
}
