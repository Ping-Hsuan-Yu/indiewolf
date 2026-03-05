'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import Image from 'next/image'
import { useState } from 'react'
import { toast } from 'sonner'

import {
  deleteIllustrationWork,
  toggleIllustrationActive,
  updateIllustrationAlt,
} from '@/app/_actions/admin/illustration'

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
import { Input } from '@/components/admin/ui/input'
import { Spinner } from '@/components/admin/ui/spinner'
import { Switch } from '@/components/admin/ui/switch'

interface IllustrationItemProps {
  work: {
    id: string
    url: string
    alt: string | null
    width: number
    height: number
    is_active: boolean
  }
  onDelete: (id: string) => void
  isReorderMode?: boolean
}

export function IllustrationItem({
  work,
  onDelete,
  isReorderMode,
}: IllustrationItemProps) {
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

  const [alt, setAlt] = useState(work.alt || '')
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorOpen, setErrorOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isActive, setIsActive] = useState(work.is_active)
  const [isUpdatingActive, setIsUpdatingActive] = useState(false)

  const handleToggleActive = async (checked: boolean) => {
    // Optimistic update
    setIsActive(checked)
    setIsUpdatingActive(true)
    try {
      const result = await toggleIllustrationActive(work.id, checked)
      if (result.success) {
        toast.success(checked ? '已啟用' : '已停用')
      } else {
        // Revert on failure
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

  const handleSave = async () => {
    if (alt === work.alt) {
      setIsEditing(false)
      return
    }

    setLoading(true)
    try {
      const result = await updateIllustrationAlt(work.id, alt)
      if (result.success) {
        setIsEditing(false)
        toast.success('變更成功')
      } else {
        setErrorMessage(result.error || 'Failed to update alt text.')
        setErrorOpen(true)
      }
    } catch (error) {
      setErrorMessage('An unexpected error occurred.')
      setErrorOpen(true)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const result = await deleteIllustrationWork(work.id)
      if (result.success) {
        setDeleteDialogOpen(false)
        toast.success('刪除成功')
        onDelete(work.id)
      } else {
        setErrorMessage(result.error || 'Failed to delete illustration.')
        setErrorOpen(true)
      }
    } catch (error) {
      setErrorMessage('An unexpected error occurred.')
      setErrorOpen(true)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave()
    } else if (e.key === 'Escape') {
      setAlt(work.alt || '')
      setIsEditing(false)
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`group space-y-2 ${isReorderMode ? 'cursor-move touch-none' : ''}`}
    >
      <div className="bg-muted relative aspect-square overflow-hidden rounded-md border">
        <Image
          src={work.url}
          alt={work.alt || 'Illustration'}
          fill
          className="object-contain transition-all hover:scale-105"
          sizes="(max-width: 768px) 50vw, 33vw"
        />
        {!isReorderMode && (
          <div
            className="absolute top-4 left-2 z-10 opacity-50 transition-opacity group-hover:opacity-100"
            onPointerDown={(e) => e.stopPropagation()} // Prevent drag
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
                e.stopPropagation() // Prevent drag start
                setDeleteDialogOpen(true)
              }}
              onPointerDown={(e) => e.stopPropagation()} // Prevent drag start on pointer down
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
      <div className="h-8">
        {isEditing ? (
          <div className="flex items-center gap-2">
            <Input
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
              onBlur={handleSave}
              onKeyDown={handleKeyDown}
              disabled={loading}
              autoFocus
              className="h-8 text-xs"
              onPointerDown={(e) => e.stopPropagation()} // Allow text selection
            />
            {loading && <Spinner className="text-muted-foreground" />}
          </div>
        ) : (
          <p
            onClick={() => setIsEditing(true)}
            className="text-muted-foreground hover:text-foreground cursor-pointer truncate text-sm hover:underline"
            title={alt || 'No description'}
          >
            {alt || <span className="italic opacity-50">No description</span>}
          </p>
        )}
      </div>

      <AlertDialog open={errorOpen} onOpenChange={setErrorOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Error</AlertDialogTitle>
            <AlertDialogDescription>{errorMessage}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setErrorOpen(false)}>
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>確定要刪除這張圖片嗎？</AlertDialogTitle>
            <AlertDialogDescription>
              此動作無法復原。這張圖片將會從列表移除。
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
