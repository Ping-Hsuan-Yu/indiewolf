'use client'

import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { SocialLink, updateSocialLinksOrder } from '@/app/_actions/admin/about'

import { AddSocialLinkSheet } from './AddSocialLinkSheet'
import { SocialLinkItem } from './SocialLinkItem'

interface SocialLinksManagerProps {
  initialLinks: SocialLink[]
}

export function SocialLinksManager({ initialLinks }: SocialLinksManagerProps) {
  const [links, setLinks] = useState(initialLinks)
  const router = useRouter()

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  useEffect(() => {
    setLinks(initialLinks)
  }, [initialLinks])

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = links.findIndex((item) => item.id === active.id)
      const newIndex = links.findIndex((item) => item.id === over.id)

      const newLinks = arrayMove(links, oldIndex, newIndex)
      setLinks(newLinks)

      // Update server
      const updates = newLinks.map((link, index) => ({
        id: link.id,
        sort_order: index,
      }))

      try {
        const res = await updateSocialLinksOrder(updates)
        if (!res.success) {
          toast.error('排序更新失敗')
          router.refresh()
        } else {
          toast.success('排序已更新')
        }
      } catch (error) {
        toast.error('發生錯誤')
        router.refresh()
      }
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <AddSocialLinkSheet />
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={links.map((l) => l.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="flex flex-col gap-2">
            {links.map((link) => (
              <SocialLinkItem key={link.id} link={link} />
            ))}
            {links.length === 0 && (
              <div className="text-muted-foreground rounded-lg border border-dashed py-12 text-center">
                尚未新增任何連結
              </div>
            )}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  )
}
