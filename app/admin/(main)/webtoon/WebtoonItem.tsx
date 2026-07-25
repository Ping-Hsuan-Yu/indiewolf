'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { toast } from 'sonner'

import {
  deleteWebtoonWork,
  toggleWebtoonActive,
} from '@/app/_actions/admin/webtoon'
import { Tables } from '@/types/database.types'

import { Trash2 } from 'lucide-react'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/admin/ui/alert-dialog'
import { Button } from '@/components/admin/ui/button'
import { Spinner } from '@/components/admin/ui/spinner'
import { Switch } from '@/components/admin/ui/switch'

interface WebtoonItemProps {
  work: Tables<'webtoon_works'>
  onDelete: (id: string) => void
  isReorderMode?: boolean
}

export function WebtoonItem({ work, onDelete, isReorderMode }: WebtoonItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: work.id,
    disabled: !isReorderMode,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isActive, setIsActive] = useState(work.is_active ?? false)
  const [isUpdatingActive, setIsUpdatingActive] = useState(false)

  const handleToggleActive = async (checked: boolean) => {
    setIsActive(checked)
    setIsUpdatingActive(true)
    try {
      const result = await toggleWebtoonActive(work.id, checked)
      if (result.success) {
        toast.success(checked ? '已啟用' : '已停用')
      } else {
        setIsActive(!checked)
        toast.error('更動狀態失敗')
      }
    } catch (error) {
      setIsActive(!checked)
      toast.error('更動狀態失敗')
    } finally {
      setIsUpdatingActive(false)
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const result = await deleteWebtoonWork(work.id)
      if (result.success) {
        setDeleteDialogOpen(false)
        toast.success('刪除成功')
        onDelete(work.id)
      } else {
        toast.error(result.error || 'Failed to delete webtoon.')
      }
    } catch (error) {
      toast.error('An unexpected error occurred.')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`group relative ${isReorderMode ? 'cursor-move touch-none' : ''}`}
    >
      <Link
        href={`/admin/webtoon/${work.id}`}
        className={`block space-y-2 ${isReorderMode ? 'pointer-events-none select-none' : ''}`}
        onClick={(e) => {
          if (isReorderMode) {
            e.preventDefault()
          }
        }}
      >
        <div className="bg-muted relative aspect-square overflow-hidden rounded-md border">
          <Image
            src={work.cover_url}
            alt={work.title_zh || 'Webtoon Cover'}
            fill
            className="object-contain transition-all hover:scale-105"
            sizes="(max-width: 768px) 50vw, 33vw"
          />
        </div>

        <div className="hover:bg-muted/50 h-12 overflow-hidden rounded px-1 transition-colors">
          <p className="truncate text-sm font-medium">
            {work.title_zh || 'Untitled'}
          </p>
          <p className="text-muted-foreground truncate text-xs">
            {work.title_en || 'Untitled'}
          </p>
        </div>
      </Link>

      {!isReorderMode && (
        <div
          className="absolute top-4 left-2 z-10 opacity-50 transition-opacity group-hover:opacity-100"
          onPointerDown={(e) => e.stopPropagation()}
        >
          <Switch
            checked={isActive}
            onCheckedChange={handleToggleActive}
            isLoading={isUpdatingActive}
            withIcon
          />
        </div>
      )}

      {!isReorderMode && (
        <div className="absolute top-2 right-2 opacity-0 transition-opacity group-hover:opacity-100">
          <Button
            size="icon"
            destructive
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation()
              setDeleteDialogOpen(true)
            }}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>確定要刪除這部 webtoon 嗎？</AlertDialogTitle>
            <AlertDialogDescription>
              此動作無法復原。這部 webtoon 將會從列表移除。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isDeleting}
              className="bg-muted text-muted-foreground hover:bg-muted/80"
            >
              取消
            </AlertDialogAction>
            <Button
              variant="default"
              destructive
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? <Spinner className="mr-2" /> : null}
              確認刪除
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
