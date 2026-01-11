import IllustrationGallery from '@/app/[locale]/(public)/illustration/[year]/IllustrationGallery'
import { getIllustrationWorks } from '@/lib/services/illustrationService'

type IllustrationYearPageProps = {
  params: {
    locale: string
    year: string
  }
}

export default async function IllustrationYearPage({ params }: IllustrationYearPageProps) {
  const works = await getIllustrationWorks(params.year)
  const group = {
    year: params.year,
    items: works.map(work => ({
      id: work.id,
      img: work.url,
      imgThumb: work.url,
      width: work.width,
      height: work.height
    }))
  }

  return (
    <section className='flex flex-col gap-4'>
      <IllustrationGallery group={group} />
    </section>
  )
}
