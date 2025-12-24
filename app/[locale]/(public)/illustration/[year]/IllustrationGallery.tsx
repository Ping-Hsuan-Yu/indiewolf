'use client'

import { useState } from 'react'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'

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
}

export default function IllustrationGallery({ group }: IllustrationGalleryProps) {
  const [index, setIndex] = useState(-1)

  const slides = group.items.map(item => ({
    src: item.img,
  }))

  return (
    <>
      <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4'>
        {group.items.map((item, i) => {
          return (
            <div
              key={item.id}
              className='gallery-item shadow flex items-center justify-center cursor-pointer'
              onClick={() => setIndex(i)}
            >
              <img className='img-responsive' src={item.imgThumb} alt={group.year} />
            </div>
          )
        })}
      </div>

      <Lightbox
        index={index}
        open={index >= 0}
        close={() => setIndex(-1)}
        slides={slides}
      />
    </>
  )
}
