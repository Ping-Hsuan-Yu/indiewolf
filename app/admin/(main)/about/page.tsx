import { Suspense } from 'react'

import { getAdminAboutPageData } from '@/app/_actions/admin/about'

import { Skeleton } from '@/components/admin/ui/skeleton'

import { ClientPage } from './ClientPage'

export const dynamic = 'force-dynamic'

export default async function AboutPage() {
  const data = await getAdminAboutPageData()

  return (
    <div className='flex flex-col gap-6 p-6'>
      <div>
        <h1 className='text-3xl font-bold tracking-tight'>關於頁面管理</h1>
        <p className='text-muted-foreground'>管理關於頁面的個人檔案與社群連結</p>
      </div>

      <Suspense fallback={<AboutPageSkeleton />}>
        <ClientPage initialData={data} />
      </Suspense>
    </div>
  )
}

function AboutPageSkeleton() {
  return (
    <div className='space-y-6'>
      <Skeleton className='h-100 w-full' />
      <Skeleton className='h-75 w-full' />
    </div>
  )
}
