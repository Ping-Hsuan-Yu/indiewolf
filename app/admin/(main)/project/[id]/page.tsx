import { notFound } from 'next/navigation'
import { Suspense } from 'react'

import { getProjectDetail } from '@/app/_actions/admin/project'

import { ProjectDetailForm } from '@/app/admin/(main)/project/ProjectDetailForm'

export const dynamic = 'force-dynamic'

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const project = await getProjectDetail(id)

  if (!project) {
    notFound()
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProjectDetailForm project={project} />
    </Suspense>
  )
}
