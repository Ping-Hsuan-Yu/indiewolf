import { ReactNode } from 'react';
import GlobalImageProtection from '@/components/GlobalImageProtection';

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-4 md:mx-8 max-w-5xl lg:mx-auto lg:px-8 min-h-dvh flex flex-col">
      <GlobalImageProtection />
      {children}
    </div>
  );
}
