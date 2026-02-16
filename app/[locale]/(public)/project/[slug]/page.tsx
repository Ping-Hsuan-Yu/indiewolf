import Image from 'next/image'

import { getProjectBySlug, getProjects } from '@/app/_actions/public/project'
import { normalizeLocale } from '@/lib/i18n/config'

import ProjectImageGrid from '@/app/[locale]/(public)/project/[slug]/ProjectImageGrid'

export const dynamic = 'force-dynamic'

export async function generateStaticParams() {
  try {
    const projects = await getProjects()
    return projects.map(project => ({ slug: project.slug }))
  } catch {
    // avoid build error if DB is unreachable
    return []
  }
}

type ProjectDetailPageProps = {
  params: Promise<{
    locale: string
    slug: string
  }>
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { locale: rawLocale, slug } = await params
  const locale = normalizeLocale(rawLocale)
  const project = await getProjectBySlug(slug)

  if (!project) {
    return <section className='py-12 text-center text-gray-500'>Not Found</section>
  }

  const isZh = locale === 'zh'
  // Use bilingual fields
  const title = isZh ? project.title_zh || project.title_en : project.title_en || project.title_zh
  const subtitle = isZh
    ? project.subtitle_zh || project.subtitle_en
    : project.subtitle_en || project.subtitle_zh
  const description = isZh
    ? project.description_zh || project.description_en
    : project.description_en || project.description_zh

  // Try to find cover image in images list to get dimensions
  const coverObj = (project.images || []).find(img => img.url === project.cover_url)
  const coverWidth = coverObj?.width || 1200
  const coverHeight = coverObj?.height || 800

  return (
    <>
      <div className='flex flex-col gap-4 md:flex-row'>
        <div className='basis-1/3'>
          {project.cover_url && (
            <Image
              src={project.cover_url}
              alt={title || ''}
              width={coverWidth}
              height={coverHeight}
              priority
              className='w-full h-auto object-cover'
              sizes='(max-width: 768px) 100vw, 33vw'
            />
          )}
        </div>
        <div className='basis-2/3'>
          <p className='font-bold'>{title}</p>
          <p className='text-sm whitespace-pre-line'>{subtitle}</p>
          <br />
          <p className='text-sm whitespace-pre-line'>{description}</p>
        </div>
      </div>
      <ProjectImageGrid images={project.images || []} title={title || ''} />
    </>
  )
}
