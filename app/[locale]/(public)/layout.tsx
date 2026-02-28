import { ReactNode } from 'react'

import GlobalImageProtection from '@/components/public/GlobalImageProtection'

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-4 flex min-h-dvh max-w-5xl flex-col md:mx-8 lg:mx-auto lg:px-8">
      <GlobalImageProtection />
      {children}
    </div>
  )
}
