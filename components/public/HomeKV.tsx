'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

type HomeKVProps = {
  frames: string[]
  alt?: string
  intervalMs?: number
  pauseOnHover?: boolean
}

export default function HomeKV({
  frames,
  alt = 'Gallery frame',
  intervalMs = 150,
  pauseOnHover = true
}: HomeKVProps) {
  const [currentFrame, setCurrentFrame] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Enforce minimum interval to prevent crashes/excessive calls
  const frameInterval = Math.max(intervalMs, 30)

  // Reset if frames change
  useEffect(() => {
    setCurrentFrame(0)
  }, [frames])

  const startAnimation = useCallback(() => {
    if (intervalRef.current || frames.length === 0) return
    intervalRef.current = setInterval(() => {
      setCurrentFrame(prev => (prev + 1) % frames.length)
    }, frameInterval)
  }, [frames.length, frameInterval])

  const stopAnimation = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  // Auto-start
  useEffect(() => {
    startAnimation()
    return () => {
      stopAnimation()
    }
  }, [startAnimation, stopAnimation])

  if (frames.length === 0) {
    return null
  }

  return (
    <div
      className='relative w-full inline-block select-none'
      onMouseEnter={pauseOnHover ? stopAnimation : undefined}
      onMouseLeave={pauseOnHover ? startAnimation : undefined}>
      {/* Spacer to reserve height based on aspect ratio of the first image */}
      <img
        src={frames[0]}
        alt={alt}
        className='invisible opacity-0 w-full h-auto'
        aria-hidden='true'
      />

      {/* Stacked Frames */}
      {frames.map((src, index) => (
        <img
          key={`${src}-${index}`}
          src={src}
          alt={index === 0 ? alt : ''}
          className={`absolute top-0 left-0 w-full h-full object-contain transition-opacity duration-0 ${
            index === currentFrame ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
          loading={index === 0 ? 'eager' : undefined}
        />
      ))}
    </div>
  )
}
