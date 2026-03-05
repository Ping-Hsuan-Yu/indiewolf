import { ReactNode } from 'react'

import Footer from '@/components/public/Footer'
import PublicNavbar from '@/components/public/PublicNavbar'

import MangaStatusNav from './MangaStatusNav'

export default function MangaLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col gap-8">
      <PublicNavbar />
      <main className="flex flex-col gap-4">
        <MangaStatusNav />
        {children}
      </main>
      <Footer />
    </div>
  )
}
