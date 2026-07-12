import { notFound } from 'next/navigation'

import { getMangaWorksByStatus } from '@/app/_actions/public/manga'
import { normalizeLocale } from '@/lib/i18n/config'

import MangaGallery from '@/app/[locale]/(public)/manga/[status]/MangaGallery'

const VALID_STATUSES = ['ongoing', 'completed'] as const
type MangaStatus = (typeof VALID_STATUSES)[number]

export const dynamicParams = true

export function generateStaticParams() {
  return VALID_STATUSES.map((status) => ({ status }))
}

type MangaStatusPageProps = {
  params: Promise<{
    locale: string
    status: string
  }>
}

export default async function MangaStatusPage({
  params,
}: MangaStatusPageProps) {
  const { locale: rawLocale, status } = await params

  if (!VALID_STATUSES.includes(status as MangaStatus)) {
    notFound()
  }

  const locale = normalizeLocale(rawLocale)
  const works = await getMangaWorksByStatus(status as MangaStatus)

  const isZh = locale === 'zh'

  const entries = works.map((work) => {
    const title = isZh ? work.title_zh : work.title_en

    return {
      ...work,
      title: title ?? work.title_zh ?? '',
      description: (isZh ? work.summary_zh : work.summary_en) ?? undefined,
    }
  })

  return <MangaGallery entries={entries} locale={locale} />
}
