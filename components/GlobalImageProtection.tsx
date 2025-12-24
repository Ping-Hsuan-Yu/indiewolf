'use client';

import { usePreventImageActions } from '@/hooks/usePreventImageActions';

export default function GlobalImageProtection() {
  usePreventImageActions();
  return null;
}
