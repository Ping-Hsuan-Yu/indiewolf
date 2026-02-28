import {
  getIllustrationWorks,
  getIllustrationYears,
} from '@/app/_actions/public/illustration'

import IllustrationGallery from '@/app/[locale]/(public)/illustration/[year]/IllustrationGallery'

export async function generateStaticParams() {
  const years = await getIllustrationYears()
  return years.map((year) => ({ year }))
}

type IllustrationYearPageProps = {
  params: Promise<{
    locale: string
    year: string
  }>
}

export default async function IllustrationYearPage({
  params,
}: IllustrationYearPageProps) {
  const { year } = await params
  const works = await getIllustrationWorks(year)
  const group = {
    year,
    items: works,
  }

  return (
    <section className="flex flex-col gap-4">
      <IllustrationGallery group={group} />
    </section>
  )
}
