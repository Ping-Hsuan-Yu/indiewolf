'use client'

import { useEffect, useRef } from 'react'
import 'lightgallery/css/lightgallery.css'
import 'lightgallery/css/lg-thumbnail.css'

type GalleryItem = {
  id: string
  img: string
  imgThumb: string
}

type GalleryGroup = {
  year: string
  items: GalleryItem[]
}

type IllustrationGalleryProps = {
  group: GalleryGroup
  locale: string
}

export default function IllustrationGallery({ group, locale }: IllustrationGalleryProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    let instance: any
    let cancelled = false

    async function init() {
      if (!containerRef.current) return
      const [{ default: lightGallery }] = await Promise.all([import('lightgallery')])
      if (!containerRef.current || cancelled) return
      instance = lightGallery(containerRef.current, {
        selector: '.gallery-item',
        download: false
      })
    }

    init()

    return () => {
      cancelled = true
      instance?.destroy(true)
    }
  }, [group, locale])

  if (!group.items.length) {
    return <p className='text-center text-sm text-gray-500'>暫無作品</p>
  }

  return (
    <div
      key={`${locale}-${group.year}`}
      ref={containerRef}
      className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4'>
      {group.items.map(item => {
        return (
          <div
            key={item.id}
            className='gallery-item shadow flex items-center justify-center'
            data-src={item.img}>
            <img className='img-responsive' src={item.imgThumb} alt={group.year} />
          </div>
        )
      })}
    </div>
  )
}
