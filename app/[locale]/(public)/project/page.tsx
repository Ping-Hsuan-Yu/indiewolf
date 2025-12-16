import Link from 'next/link'
import { normalizeLocale } from '@/lib/i18n/config'
import { getProjects } from '@/lib/services/projectService'

type ProjectListPageProps = {
  params: {
    locale: string
  }
}

export const dynamic = 'force-dynamic'

export default async function ProjectListPage({ params }: ProjectListPageProps) {
  const locale = normalizeLocale(params.locale)
  const items = await getProjects()
  const isZh = locale === 'zh'

  return (
    <div className='flex flex-col gap-4'>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
        {items.map(project => {
          // Use bilingual fields
          const title = isZh
            ? project.title_zh || project.title_en
            : project.title_en || project.title_zh
          const subtitle = isZh
            ? project.subtitle_zh || project.subtitle_en
            : project.subtitle_en || project.subtitle_zh

          return (
            <div key={project.id} className='flex flex-col gap-4 md:flex-row'>
              <Link href={`/${params.locale}/project/${project.slug}`} className='basis-1/2'>
                {project.cover_url ? (
                  <img src={project.cover_url} alt={title || ''} className='w-full object-cover' />
                ) : (
                  <div className='flex h-full min-h-[280px] w-full items-center justify-center bg-gray-100 text-gray-400'>
                    圖片準備中
                  </div>
                )}
              </Link>
              <div className='basis-1/2'>
                <p className='font-bold'>{title}</p>
                <p className='text-sm whitespace-pre-line'>{subtitle}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
