import { Suspense } from 'react'

import { getIllustrationYearsAction, getIllustrationWorksAction } from '@/app/_actions/admin/illustration'

import { Separator } from '@/components/admin/ui/separator'

import { ClientPage } from './ClientPage'
import { IllustrationGridSkeleton } from './IllustrationGridSkeleton'

export const dynamic = 'force-dynamic'

export default async function IllustrationPage() {
  const years = await getIllustrationYearsAction()
  const sortedYears = years.sort((a: string, b: string) => parseInt(b) - parseInt(a))
  const initialYear = sortedYears[0] || new Date().getFullYear().toString()
  const works = await getIllustrationWorksAction(initialYear)

  return (
    <div className='space-y-6'>
      <div>
        <h3 className='text-lg font-medium'>Illustration 管理</h3>
        <p className='text-sm text-muted-foreground'>編輯管理插畫內容與順序</p>
      </div>
      <Separator />
      <Suspense fallback={<IllustrationGridSkeleton />}>
        <ClientPage years={sortedYears} initialWorks={works} initialYear={initialYear} />
      </Suspense>
    </div>
  )
}
