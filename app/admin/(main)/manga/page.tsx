import { Suspense } from 'react'
import { getMangaYearsAction, getMangaWorksAction } from '@/app/_actions/admin/manga'
import { ClientPage } from './ClientPage'
import { Separator } from '@/components/admin/ui/separator'
import { MangaGridSkeleton } from './MangaGridSkeleton'

export const dynamic = 'force-dynamic'

export default async function MangaPage() {
  const years = await getMangaYearsAction()
  // Ensure we sort descending as number
  const sortedYears = years.sort((a: string, b: string) => parseInt(b) - parseInt(a))
  const initialYear = sortedYears[0] || new Date().getFullYear().toString()
  const works = await getMangaWorksAction(initialYear)

  return (
    <div className='space-y-6'>
      <div>
        <h3 className='text-lg font-medium'>Manga 管理</h3>
        <p className='text-sm text-muted-foreground'>編輯管理漫畫內容與順序</p>
      </div>
      <Separator />
      <Suspense fallback={<MangaGridSkeleton />}>
        <ClientPage years={sortedYears} initialWorks={works} initialYear={initialYear} />
      </Suspense>
    </div>
  )
}
