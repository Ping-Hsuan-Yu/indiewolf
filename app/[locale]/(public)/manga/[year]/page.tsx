import MangaGallery from '@/components/public/gallery/MangaGallery'
import { normalizeLocale } from '@/lib/i18n/config'
import { getMangaYears, getMangaWorks } from '@/lib/services/mangaService'

export const dynamicParams = false
export const dynamic = 'force-dynamic'

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
  params: {
    locale: string
    year: string
  }
}

export default async function MangaYearPage({ params }: MangaYearPageProps) {
  const locale = normalizeLocale(params.locale)
  const works = await getMangaWorks(params.year)

  if (!works || works.length === 0) {
    return <section className='py-12 text-center text-gray-500'>Not Found</section>
  }

  const isZh = locale === 'zh'

  const entries = works.map(work => {
    // Use bilingual fields
    const title = isZh ? work.title_zh || work.title_en : work.title_en || work.title_zh
    const description = isZh
      ? work.summary_zh || work.summary_en
      : work.summary_en || work.summary_zh

    // Sort images by order_index (service should already do this, but safe to ensure)
    const sortedImages = (work.images || []).sort((a, b) => a.order_index - b.order_index)

    return {
      id: work.id,
      title: title || '',
      description: description,
      primaryImage: work.cover_url,
      gallery: sortedImages.map(img => ({
        src: img.url,
        alt: title || undefined // LightGallery uses this for captions
      }))
    }
  })

  return <MangaGallery entries={entries} locale={locale} />
}
