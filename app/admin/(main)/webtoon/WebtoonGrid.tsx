import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { updateWebtoonOrder } from '@/app/_actions/admin/webtoon'
import { Tables } from '@/types/database.types'

import { WebtoonItem } from './WebtoonItem'

interface WebtoonGridProps {
  works: Tables<'webtoon_works'>[]
  onDelete: (id: string) => void
  isReorderMode?: boolean
  onReorder?: (newWorks: Tables<'webtoon_works'>[]) => void
}

export function WebtoonGrid({
  works,
  onDelete,
  isReorderMode = false,
  onReorder,
}: WebtoonGridProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )
  const router = useRouter()

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      if (!onReorder) return

      const oldIndex = works.findIndex((item) => item.id === active.id)
      const newIndex = works.findIndex((item) => item.id === over.id)

      const newWorks = arrayMove(works, oldIndex, newIndex)
      onReorder(newWorks)

      const updates = newWorks.map((work, index) => ({
        id: work.id,
        order_index: index,
      }))

      updateWebtoonOrder(updates).then((res) => {
        if (!res.success) {
          console.error('Failed to update order', res.error)
          toast.error('排序更新失敗')
          router.refresh()
        } else {
          toast.success('排序更新成功')
        }
      })
    }
  }

  if (works.length === 0) {
    return (
      <div className="text-muted-foreground flex h-40 items-center justify-center rounded-lg border border-dashed">
        目前沒有 webtoon。
      </div>
    )
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      id="webtoon-dnd-context"
    >
      <SortableContext
        items={works.map((w) => w.id)}
        strategy={rectSortingStrategy}
      >
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {works.map((work) => (
            <WebtoonItem
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
