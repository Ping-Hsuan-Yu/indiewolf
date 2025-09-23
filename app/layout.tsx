import type { Metadata } from 'next';
import './globals.css';
import TransitionManager from '@/components/transition/TransitionManager';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Lin ChaoYu',
  description: '插畫修行。',
  icons: {
    icon: '/assets/logo.svg'
  }
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-Hant">
      <body className="bg-white text-black">
        <TransitionManager />
        <div className="mx-4 md:mx-8 max-w-5xl lg:mx-auto lg:px-8 min-h-dvh flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
