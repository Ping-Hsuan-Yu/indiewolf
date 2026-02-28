import Link from 'next/link'

import { getProjects } from '@/app/_actions/public/project'
import { normalizeLocale } from '@/lib/i18n/config'

type ProjectListPageProps = {
  params: Promise<{
    locale: string
  }>
}

export const dynamic = 'force-dynamic'

export default async function ProjectListPage({
  params,
}: ProjectListPageProps) {
  const { locale: rawLocale } = await params
  const locale = normalizeLocale(rawLocale)
  const items = await getProjects()
  const isZh = locale === 'zh'

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {items.map((project) => {
          // Use bilingual fields
          const title = isZh
            ? project.title_zh || project.title_en
            : project.title_en || project.title_zh
          const subtitle = isZh
            ? project.subtitle_zh || project.subtitle_en
            : project.subtitle_en || project.subtitle_zh

          return (
            <div key={project.id} className="flex flex-col gap-4 md:flex-row">
              <Link
                href={`/${locale}/project/${project.slug}`}
                className="group relative overflow-hidden md:basis-1/2"
              >
                <img
                  src={project.cover_url || ''}
                  alt={title || ''}
                  className="w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </Link>
              <div className="md:basis-1/2">
                <p className="font-bold">{title}</p>
                <p className="text-sm whitespace-pre-line">{subtitle}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
