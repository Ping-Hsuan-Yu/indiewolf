import { Suspense } from 'react'

import { getWebtoonsAction } from '@/app/_actions/admin/webtoon'

import { Separator } from '@/components/admin/ui/separator'

import { ClientPage } from './ClientPage'
import { WebtoonGridSkeleton } from './WebtoonGridSkeleton'

export const dynamic = 'force-dynamic'

export default async function WebtoonPage() {
  const initialWorks = await getWebtoonsAction()

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Webtoon 管理</h3>
        <p className="text-muted-foreground text-sm">編輯管理 webtoon 內容與順序</p>
      </div>
      <Separator />
      <Suspense fallback={<WebtoonGridSkeleton />}>
        <ClientPage initialWorks={initialWorks} />
      </Suspense>
    </div>
  )
}
