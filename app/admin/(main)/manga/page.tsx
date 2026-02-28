import { Suspense } from 'react'

import {
  getMangaWorksByStatusAction,
  getMangaYearsAction,
} from '@/app/_actions/admin/manga'

import { Separator } from '@/components/admin/ui/separator'

import { ClientPage } from './ClientPage'
import { MangaGridSkeleton } from './MangaGridSkeleton'

export const dynamic = 'force-dynamic'

export default async function MangaPage() {
  const years = await getMangaYearsAction()
  const sortedYears = years.sort(
    (a: string, b: string) => parseInt(b) - parseInt(a)
  )
  const initialWorks = await getMangaWorksByStatusAction(false)

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Manga 管理</h3>
        <p className="text-muted-foreground text-sm">編輯管理漫畫內容與順序</p>
      </div>
      <Separator />
      <Suspense fallback={<MangaGridSkeleton />}>
        <ClientPage years={sortedYears} initialWorks={initialWorks} />
      </Suspense>
    </div>
  )
}
