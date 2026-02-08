import '../globals.css'
import type { Metadata } from 'next'
import { SidebarProvider, SidebarTrigger } from '@/components/admin/ui/sidebar'
import { AppSidebar } from '@/app/admin/(main)/AppSidebar'
import { Toaster } from '@/components/admin/ui/sonner'
import { notoSans, chocolateClassicalSans } from '@/app/font'


export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'Admin dashboard for Lin ChaoYu'
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
      </body>
    </html>
  )
}
