import { notFound } from 'next/navigation'

import { getMangaWorksByStatus } from '@/app/_actions/public/manga'
import { getWebtoons } from '@/app/_actions/public/webtoon'
import { normalizeLocale } from '@/lib/i18n/config'

import MangaGallery from '@/app/[locale]/(public)/manga/[status]/MangaGallery'
import WebtoonGallery from '@/app/[locale]/(public)/manga/[status]/WebtoonGallery'

const VALID_STATUSES = ['ongoing', 'completed', 'webtoon'] as const
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
  const isZh = locale === 'zh'

  if (status === 'webtoon') {
    const webtoons = await getWebtoons()
    const entries = webtoons.map((work) => ({
      ...work,
      title: (isZh ? work.title_zh : work.title_en) ?? work.title_zh ?? '',
      description: (isZh ? work.summary_zh : work.summary_en) ?? undefined,
    }))
    return <WebtoonGallery entries={entries} />
  }

  const works = await getMangaWorksByStatus(status as 'ongoing' | 'completed')

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
