import IllustrationGallery from '@/components/public/gallery/IllustrationGallery'
import { normalizeLocale } from '@/lib/i18n/config'
import { getIllustrationYears, getIllustrationWorks } from '@/lib/services/illustrationService'

export const dynamicParams = false
export const dynamic = 'force-dynamic'

export async function generateStaticParams() {
  try {
    const years = await getIllustrationYears()
    return years.map(year => ({ year }))
  } catch {
    // 在 build 階段無法連 DB 時避免中止建置
    return []
  }
}

type IllustrationYearPageProps = {
  params: {
    locale: string
    year: string
  }
}

export default async function IllustrationYearPage({ params }: IllustrationYearPageProps) {
  const locale = normalizeLocale(params.locale)
  const works = await getIllustrationWorks(params.year)

  // If strict checking is needed, we could check if works.length === 0,
  // but generateStaticParams handles the valid paths.
  // However, dynamicParams = false handles it too.

  if (!works || works.length === 0) {
    return <section className='py-12 text-center text-gray-500'>Not Found</section>
  }

  // 轉換成 IllustrationGallery 需要的格式
  const group = {
    year: params.year,
    items: works.map(work => ({
      id: work.id,
      img: work.url,
      imgThumb: work.url // Cloudinary resize params can be added here if needed
    }))
  }

  return (
    <section className='flex flex-col gap-4'>
      <IllustrationGallery group={group} locale={locale} />
    </section>
  )
}
