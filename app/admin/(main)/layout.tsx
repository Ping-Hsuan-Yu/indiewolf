import { AppSidebar } from '@/app/admin/(main)/AppSidebar'
import { notoSans, chocolateClassicalSans } from '@/app/font'
import { SidebarProvider, SidebarTrigger } from '@/components/admin/ui/sidebar'
import { Toaster } from '@/components/admin/ui/sonner'

import '../globals.css'

import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import type { Metadata } from 'next'

export const metadata = {
  title: 'LinChaoYu 後台管理',
  description: 'LinChaoYu 後台管理',
  icons: {
    icon: '/assets/logo.svg'
  }
}

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  return (
    <html lang='zh-TW' className={`${notoSans.variable} ${chocolateClassicalSans.variable}`}>
      <body className='bg-background text-foreground min-h-screen flex'>
        <SidebarProvider>
          <AppSidebar />
          <main className='flex-1 p-8 w-full'>
            <div className='flex items-center gap-4 mb-4 md:hidden'>
              <SidebarTrigger />
              <h1 className='text-2xl font-bold'>Admin</h1>
            </div>
            <div className='hidden md:block'>
              <SidebarTrigger className='mb-4' />
            </div>
            {children}
          </main>
          <Toaster />
        </SidebarProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
