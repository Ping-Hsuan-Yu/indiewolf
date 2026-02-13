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
  rectSortingStrategy
} from '@dnd-kit/sortable'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { updateIllustrationOrder } from '@/app/_actions/admin/illustration'

import { IllustrationItem } from './IllustrationItem'

interface IllustrationGridProps {
  works: any[]
  onDelete: (id: string) => void
  isReorderMode?: boolean
  onReorder?: (newWorks: any[]) => void
}

export function IllustrationGrid({
  works,
  onDelete,
  isReorderMode = false,
  onReorder
}: IllustrationGridProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )
  const router = useRouter()

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      if (!onReorder) return

      const oldIndex = works.findIndex(item => item.id === active.id)
      const newIndex = works.findIndex(item => item.id === over.id)

      const newWorks = arrayMove(works, oldIndex, newIndex)
      onReorder(newWorks)

      // Update server
      const updates = newWorks.map((work, index) => ({
        id: work.id,
        order_index: index
      }))

      updateIllustrationOrder(updates).then(res => {
        if (!res.success) {
          console.error('Failed to update order', res.error)
          toast.error('排序更新失敗')
          // Force refresh to revert UI
          router.refresh()
        } else {
          toast.success('排序更新成功')
        }
      })
    }
  }

  if (works.length === 0) {
    return (
      <div className='flex h-40 items-center justify-center rounded-lg border border-dashed text-muted-foreground'>
        No illustrations found for this year.
      </div>
    )
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      // Disable drag if not in reorder mode
      id='illustration-dnd-context'>
      <SortableContext items={works.map(w => w.id)} strategy={rectSortingStrategy}>
        <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'>
          {works.map(work => (
            <IllustrationItem
              key={work.id}
              work={work}
              onDelete={onDelete}
              isReorderMode={isReorderMode}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}
