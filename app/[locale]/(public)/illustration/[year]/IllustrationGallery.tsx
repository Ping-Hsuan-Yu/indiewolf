'use client'

import { useState } from 'react'
import Lightbox from 'yet-another-react-lightbox'

import { IllustrationWork } from '@/app/_actions/public/illustration'

import 'yet-another-react-lightbox/styles.css'

import OptimizedImage from '@/components/public/OptimizedImage'
import OptimizedImage4Lightbox from '@/components/public/OptimizedImage4Lightbox'

type GalleryGroup = {
  year: string
  items: IllustrationWork[]
}

type IllustrationGalleryProps = {
  group: GalleryGroup
}

export default function IllustrationGallery({
  group,
}: IllustrationGalleryProps) {
  const [index, setIndex] = useState(-1)

  const slides = group.items.map((item) => ({
    src: item.url,
    alt: item.alt ?? '',
    width: item.width ?? 0,
    height: item.height ?? 0,
  }))

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {group.items.map((item, i) => {
          return (
            <div
              key={item.id}
              className="gallery-item group relative flex cursor-pointer items-center justify-center overflow-hidden shadow"
              onClick={() => setIndex(i)}
            >
              <OptimizedImage
                url={item.url}
                alt={item.alt}
                width={item.width}
                height={item.height}
                className="h-auto w-full transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
              />
            </div>
          )
        })}
      </div>

      <Lightbox
        index={index}
        open={index >= 0}
        close={() => setIndex(-1)}
        slides={slides}
        render={{ slide: OptimizedImage4Lightbox }}
      />
    </>
  )
}
