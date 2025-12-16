'use client'

import { useEffect, useRef } from 'react'
import 'lightgallery/css/lightgallery.css'
import 'lightgallery/css/lg-thumbnail.css'

type BookEntry = {
  src: string
  thumb: string
  titleZh: string
  titleEn: string
  description: string
}

type BookGroup = {
  year: string
  entries: BookEntry[]
}

type BooksGalleryProps = {
  groups: BookGroup[]
  locale?: string
}

export default function BooksGallery({ groups, locale = 'en' }: BooksGalleryProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!groups.length) {
      return
    }

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
  }, [groups])

  return (
    <div ref={containerRef} className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4'>
      {groups.map(group => (
        <section key={group.year} className='contents'>
          <p className='text-lg col-span-full -mb-4' data-lg-ignore='true'>
            {group.year}
          </p>
          {group.entries.map(entry => (
            <GalleryItem key={entry.src} {...entry} locale={locale} />
          ))}
        </section>
      ))}
    </div>
  )
}

type GalleryItemProps = {
  src: string
  thumb: string
  titleZh: string
  titleEn: string
  description: string
  locale: string
}

function GalleryItem({ src, thumb, titleZh, titleEn, description, locale }: GalleryItemProps) {
  const isEn = locale === 'en'
  const displayTitle = (isEn ? titleEn : titleZh) || (isEn ? titleZh : titleEn)

  return (
    <div className='gallery-item' data-src={src} data-sub-html={description}>
      <div className='shadow'>
        <img className='img-responsive' src={thumb} alt={displayTitle} />
      </div>
      <p data-lg-ignore='true' className='mt-1 text-center font-bold'>
        {displayTitle}
      </p>
    </div>
  )
}
