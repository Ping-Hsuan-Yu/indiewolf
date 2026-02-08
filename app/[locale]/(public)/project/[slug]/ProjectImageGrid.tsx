'use client'

import { useState } from 'react'

import { ProjectImage } from '@/app/_actions/public/project'

import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'

import NextJsImage from '@/components/public/NextJsImage'
import OptimizedImage from '@/components/public/OptimizedImage'

type ProjectImageGridProps = {
  images: ProjectImage[]
  title: string
}

export default function ProjectImageGrid({ images, title }: ProjectImageGridProps) {
  const [index, setIndex] = useState(-1)

  const slides = images.map(item => ({
    src: item.url,
    width: item.width,
    height: item.height,
    alt: title
  }))

  return (
    <>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4'>
        {images.map((asset, i) => (
          <div
            key={asset.id}
            className='cursor-pointer relative group overflow-hidden'
            onClick={() => setIndex(i)}>
            <OptimizedImage
              src={asset.url}
              url={asset.url}
              alt={title || ''}
              width={asset.width}
              height={asset.height}
              className='w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105'
              sizes='(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw'
            />
          </div>
        ))}
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
