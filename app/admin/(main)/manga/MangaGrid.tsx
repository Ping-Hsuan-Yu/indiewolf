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
import { updateMangaOrder } from '@/app/_actions/admin/manga'
import { MangaItem } from './MangaItem'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { MangaWork } from '@/app/_actions/public/manga'

interface MangaGridProps {
  works: MangaWork[]
  onDelete: (id: string) => void
  isReorderMode?: boolean
  onReorder?: (newWorks: MangaWork[]) => void
}

export function MangaGrid({ works, onDelete, isReorderMode = false, onReorder }: MangaGridProps) {
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

      updateMangaOrder(updates).then(res => {
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
        No manga found for this year.
      </div>
    )
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      id='manga-dnd-context'>
      <SortableContext items={works.map(w => w.id)} strategy={rectSortingStrategy}>
        <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'>
          {works.map(work => (
            <MangaItem
              key={work.id}
              work={work as any}
              onDelete={onDelete}
              isReorderMode={isReorderMode}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}
