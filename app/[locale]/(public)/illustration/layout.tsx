import PublicNavbar from '@/components/public/PublicNavbar';
import Footer from '@/components/public/Footer';
import { ReactNode } from 'react';

export default function IllustrationLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col gap-8">
      <PublicNavbar />
      <main className="flex flex-col gap-4">{children}</main>
      <Footer />
    </div>
  );
}
