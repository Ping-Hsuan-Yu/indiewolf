'use client'

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from '@dnd-kit/sortable'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'

import { updateProjectOrder } from '@/app/_actions/admin/project'

import { AddProjectSheet } from './AddProjectSheet'
import { ProjectItem } from './ProjectItem'

interface ClientProjectPageProps {
  initialProjects: any[]
}

export function ClientProjectPage({ initialProjects }: ClientProjectPageProps) {
  const [projects, setProjects] = useState(initialProjects)

  // Sync state with props when data updates
  useEffect(() => {
    setProjects(initialProjects)
  }, [initialProjects])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setProjects(items => {
        const oldIndex = items.findIndex(item => item.id === active.id)
        const newIndex = items.findIndex(item => item.id === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })

      const oldIndex = projects.findIndex(item => item.id === active.id)
      const newIndex = projects.findIndex(item => item.id === over.id)
      const reordered = arrayMove(projects, oldIndex, newIndex)

      const updates = reordered.map((item, index) => ({
        id: item.id,
        order_index: index + 1
      }))

      try {
        const result = await updateProjectOrder(updates)
        if (result.success) {
          toast.success('順序已更新')
        } else {
          toast.error(result.error || '更新順序失敗')
        }
      } catch (error) {
        toast.error('更新順序失敗')
        // Revert on error would be ideal but refreshing is simpler for MVP
      }
    }
  }

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <div className='text-sm text-muted-foreground'>共 {projects.length} 個專案</div>
        <AddProjectSheet />
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={projects.map(p => p.id)} strategy={verticalListSortingStrategy}>
          <div className='space-y-3'>
            {projects.map(project => (
              <ProjectItem key={project.id} project={project} />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {projects.length === 0 && (
        <div className='text-center py-12 text-muted-foreground border border-dashed rounded-lg'>
          尚無專案，請新增專案
        </div>
      )}
    </div>
  )
}
