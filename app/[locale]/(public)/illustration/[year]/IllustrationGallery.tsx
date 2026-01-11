'use client'

import NextJsImage from '@/components/public/NextJsImage'
import Image from 'next/image'
import { useState } from 'react'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'

type GalleryItem = {
  id: string
  img: string
  imgThumb: string
  width: number
  height: number
}

type GalleryGroup = {
  year: string
  items: GalleryItem[]
}

type IllustrationGalleryProps = {
  group: GalleryGroup
}

export default function IllustrationGallery({ group }: IllustrationGalleryProps) {
  const [index, setIndex] = useState(-1)

  const slides = group.items.map(item => ({
    src: item.img,
    width: item.width,
    height: item.height
  }))

  return (
    <>
      <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4'>
        {group.items.map((item, i) => {
          return (
            <div
              key={item.id}
              className='gallery-item shadow flex items-center justify-center cursor-pointer relative overflow-hidden group'
              onClick={() => setIndex(i)}>
              <Image
                src={item.imgThumb}
                alt={group.year}
                width={item.width}
                height={item.height}
                className='w-full h-auto transition-transform duration-300 group-hover:scale-105'
                sizes='(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw'
                style={{ objectFit: 'cover' }}
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
        render={{ slide: NextJsImage }}
      />
    </>
  )
}
