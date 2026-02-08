import { getMangaWorks, getMangaYears } from '@/app/_actions/public/manga'
import { normalizeLocale } from '@/lib/i18n/config'

import MangaGallery from '@/app/[locale]/(public)/manga/[year]/MangaGallery'

export const dynamicParams = true

export async function generateStaticParams() {
  try {
    const years = await getMangaYears()
    return years.map(year => ({ year }))
  } catch {
    // avoid build error if DB is unreachable
    return []
  }
}

type MangaYearPageProps = {
  params: Promise<{
    locale: string
    year: string
  }>
}

export default async function MangaYearPage({ params }: MangaYearPageProps) {
  const { locale: rawLocale, year } = await params
  const locale = normalizeLocale(rawLocale)
  const works = await getMangaWorks(year)

  if (!works || works.length === 0) {
    return <section className='py-12 text-center text-gray-500'>Not Found</section>
  }

  const isZh = locale === 'zh'

  const entries = works.map(work => {
    const title = isZh ? work.title_zh : work.title_en
    const description = isZh ? work.summary_zh : work.summary_en

    return {
      ...work,
      title: title ?? '',
      description: description ?? undefined
    }
  })

  return <MangaGallery entries={entries} locale={locale} />
}
