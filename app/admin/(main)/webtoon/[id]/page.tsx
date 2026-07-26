import { notFound } from 'next/navigation'
import { Suspense } from 'react'

import { getWebtoonDetail } from '@/app/_actions/admin/webtoon'

import { WebtoonDetailForm } from './WebtoonDetailForm'

export const dynamic = 'force-dynamic'

export default async function WebtoonDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const webtoon = await getWebtoonDetail(id)

  if (!webtoon) {
    notFound()
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <WebtoonDetailForm webtoon={webtoon} />
    </Suspense>
  )
}
