'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { endPageTransition, resetPageTransition } from './pageTransition';

export default function TransitionManager() {
  const pathname = usePathname();
  const previousPath = useRef<string | null>(null);

  useEffect(() => {
    // Ensure the transition overlay is hidden on initial render.
    resetPageTransition();
  }, []);

  useEffect(() => {
    if (previousPath.current !== null && previousPath.current !== pathname) {
      endPageTransition();
    }
    previousPath.current = pathname;
  }, [pathname]);

  return null;
}
