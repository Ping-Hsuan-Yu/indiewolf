'use client';

import { useEffect, useRef, useState } from 'react';
import NavbarHoverDropdown from '@/components/Navbar';
import Main from '@/components/Main';
import Footer from '@/components/Footer';

const frames = [
  '/assets/index/frame-1.webp',
  '/assets/index/frame-2.webp',
  '/assets/index/frame-3.webp',
  '/assets/index/frame-4.webp',
  '/assets/index/frame-5.webp',
  '/assets/index/frame-6.webp',
  '/assets/index/frame-7.webp',
  '/assets/index/frame-8.webp'
];

export default function HomePage() {
  const [currentFrame, setCurrentFrame] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startAnimation = () => {
    if (intervalRef.current) return;
    intervalRef.current = setInterval(() => {
      setCurrentFrame((prev) => (prev + 1) % frames.length);
    }, 150);
  };

  const stopAnimation = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    startAnimation();
    return stopAnimation;
  }, []);

  return (
    <div className="h-dvh flex flex-col justify-between">
      <NavbarHoverDropdown />
      <Main className="flex m-auto">
        <div className="m-auto max-w-lg">
          <img
            src={frames[currentFrame]}
            alt="Gallery frame"
            className="cursor-pointer"
            onMouseEnter={stopAnimation}
            onMouseLeave={startAnimation}
          />
        </div>
      </Main>
      <Footer />
    </div>
  );
}
