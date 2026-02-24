import { CldImage } from 'next-cloudinary'
import {
  isImageFitCover,
  isImageSlide,
  useLightboxProps,
  useLightboxState
} from 'yet-another-react-lightbox'

export default function OptimizedImage4Lightbox({ slide, offset, rect }) {
  const {
    on: { click },
    carousel: { imageFit }
  } = useLightboxProps()

  const { currentIndex } = useLightboxState()

  const cover = isImageSlide(slide) && isImageFitCover(slide, imageFit)

  const width = !cover
    ? Math.round(Math.min(rect.width, (rect.height / slide.height) * slide.width))
    : rect.width

  const height = !cover
    ? Math.round(Math.min(rect.height, (rect.width / slide.width) * slide.height))
    : rect.height

  return (
      <CldImage
        width={width}
        height={height}
        alt={slide.alt ?? ""}
        src={slide.src}
        loading='eager'
        draggable={false}
        style={{
          objectFit: cover ? 'cover' : 'contain',
          cursor: click ? 'pointer' : undefined
        }}
        onClick={offset === 0 ? () => click?.({ index: currentIndex }) : undefined}
      />
  )
}
