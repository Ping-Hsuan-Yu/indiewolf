import { ReactNode } from 'react'

import Footer from '@/components/public/Footer'
import PublicNavbar from '@/components/public/PublicNavbar'

export default function ProjectLayout({ children }: { children: ReactNode }) {
  return (
    <div className='flex min-h-dvh flex-col gap-8'>
      <PublicNavbar />
      <main className='flex flex-col gap-8'>{children}</main>
      <Footer />
    </div>
  )
}
