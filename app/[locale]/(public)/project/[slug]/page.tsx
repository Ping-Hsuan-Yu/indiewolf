import { normalizeLocale } from '@/lib/i18n/config'
import { getProjectBySlug, getProjects } from '@/lib/services/projectService'

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
  params: {
    locale: string
    slug: string
  }
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const locale = normalizeLocale(params.locale)
  const project = await getProjectBySlug(params.slug)

  if (!project) {
    return <section className='py-12 text-center text-gray-500'>Not Found</section>
  }

  const isZh = locale === 'zh'
  // Use bilingual fields
  const title = isZh ? project.title_zh || project.title_en : project.title_en || project.title_zh
  const subtitle = isZh
    ? project.subtitle_zh || project.subtitle_en
    : project.subtitle_en || project.subtitle_zh
  const summary = isZh
    ? project.summary_zh || project.summary_en
    : project.summary_en || project.summary_zh
  const description = isZh
    ? project.description_zh || project.description_en
    : project.description_en || project.description_zh

  // Filter out images that are same as cover if desired, or just show all
  // The original implementation filtered out primary asset from gallery.
  // Here project.images are all related images.
  // Assuming cover_url is one of the images or separate?
  // In migration, cover_url was picked from images[0].
  // So we might want to skip the first image if it's identical to cover.

  const additionalImages = (project.images || []).filter(img => img.url !== project.cover_url)

  return (
    <>
      <div className='flex flex-col gap-4 md:flex-row'>
        <div className='basis-1/3'>
          <img
            src={project.cover_url || undefined}
            alt={title || ''}
            className='w-full object-cover'
          />
        </div>
        <div className='basis-2/3'>
          <p className='font-bold'>{title}</p>
          <p className='text-sm whitespace-pre-line'>{subtitle}</p>
          <br />
          <p className='text-sm whitespace-pre-line'>{description}</p>
        </div>
      </div>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4'>
        {additionalImages.map(asset => (
          <img key={asset.id} src={asset.url} alt={title || ''} className='w-full object-cover' />
        ))}
      </div>
    </>
  )
}
