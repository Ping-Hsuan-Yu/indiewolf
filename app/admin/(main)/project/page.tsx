import { Suspense } from 'react'

import { getProjectsAction } from '@/app/_actions/admin/project'

import { Separator } from '@/components/admin/ui/separator'

import { ClientProjectPage } from './ClientProjectPage'

export const dynamic = 'force-dynamic'

export default async function ProjectPage() {
  const projects = await getProjectsAction()

  return (
    <div className='space-y-6'>
      <div>
        <h3 className='text-lg font-medium'>Project 專案管理</h3>
        <p className='text-sm text-muted-foreground'>編輯管理專案內容與順序</p>
      </div>
      <Separator />
      <Suspense fallback={<div>Loading...</div>}>
        <ClientProjectPage initialProjects={projects} />
      </Suspense>
    </div>
  )
}
