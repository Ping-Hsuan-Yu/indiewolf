import { notFound } from 'next/navigation'
import { Suspense } from 'react'

import { getMangaDetail, getMangaYearsAction } from '@/app/_actions/admin/manga'

import { MangaDetailForm } from './MangaDetailForm'

export const dynamic = 'force-dynamic'

export default async function MangaDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [works, years] = await Promise.all([getMangaDetail(id), getMangaYearsAction()])

  if (!works) {
    notFound()
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MangaDetailForm manga={works} years={years} />
    </Suspense>
  )
}
