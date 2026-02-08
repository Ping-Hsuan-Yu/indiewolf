'use client'

import { useState } from 'react'

import { MangaWork } from '@/app/_actions/public/manga'

import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'

import NextJsImage from '@/components/public/NextJsImage'
import OptimizedImage from '@/components/public/OptimizedImage'

type MangaEntry = MangaWork & {
  title: string
  description?: string
}

type MangaGalleryProps = {
  entries: MangaEntry[]
  locale: string
}

export default function MangaGallery({ entries, locale }: MangaGalleryProps) {
  const [index, setIndex] = useState(-1)
  const [currentEntry, setCurrentEntry] = useState<MangaEntry | null>(null)

  const openGallery = (entry: MangaEntry) => {
    setCurrentEntry(entry)
    setIndex(0)
  }

  const closeGallery = () => {
    setIndex(-1)
    setTimeout(() => setCurrentEntry(null), 300) // Delay cleanup to avoid flickering during close animation
  }

  if (entries.length === 0) {
    return <p className='text-center text-sm text-gray-500'>漫畫內容整理中。</p>
  }

  const slides = currentEntry
    ? currentEntry.images.map(item => ({
        src: item.src,
        width: item.width,
        height: item.height
      }))
    : []

  return (
    <>
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
        {entries.map(item => (
          <div key={item.id} className='flex flex-col gap-4 md:flex-row md:items-end'>
            <button
              type='button'
              className='basis-1/2 cursor-pointer overflow-hidden rounded shadow focus:outline-none relative aspect-3/4 group'
              onClick={() => openGallery(item)}>
              <OptimizedImage
                src={item.cover_url}
                url={item.cover_url}
                alt={item.title}
                width={item.width}
                height={item.height}
                className='object-cover transition-transform duration-300 group-hover:scale-105'
                sizes='(max-width: 768px) 100vw, 50vw'
              />
            </button>
            <div className='basis-1/2'>
              <p
                className={`text-center md:text-start font-bold${
                  locale === 'zh' ? ' text-sm' : ''
                }`}>
                {item.title}
              </p>
              {item.description && <p className='text-sm'>{item.description}</p>}
            </div>
          </div>
        ))}
      </div>

      <Lightbox
        index={index}
        open={index >= 0}
        close={closeGallery}
        slides={slides}
        render={{ slide: NextJsImage }}
      />
    </>
  )
}
