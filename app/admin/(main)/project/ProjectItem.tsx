'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { toast } from 'sonner'

import {
  deleteProject,
  toggleProjectActive,
} from '@/app/_actions/admin/project'

import { GripVertical, Pencil, Trash2, Eye, EyeOff } from 'lucide-react'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/admin/ui/alert-dialog'
import { Button } from '@/components/admin/ui/button'
import { Card, CardContent } from '@/components/admin/ui/card'
import { Switch } from '@/components/admin/ui/switch'

interface ProjectItemProps {
  project: any
}

export function ProjectItem({ project }: ProjectItemProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: project.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const result = await deleteProject(project.id)
      if (result.success) {
        toast.success('專案已刪除')
      } else {
        toast.error(result.error || '刪除失敗')
      }
    } catch (error) {
      toast.error('刪除時發生錯誤')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleToggleActive = async (value: boolean) => {
    try {
      const result = await toggleProjectActive(project.id, value)
      console.log(result)
      if (result.success) {
        toast.success(value ? '專案已顯示' : '專案已隱藏')
      } else {
        toast.error('狀態更新失敗')
      }
    } catch (error) {
      toast.error('更新時發生錯誤')
    }
  }

  return (
    <Card ref={setNodeRef} style={style} className="bg-card">
      <CardContent className="flex items-center gap-4 p-4">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab p-1 active:cursor-grabbing"
        >
          <GripVertical className="text-muted-foreground h-5 w-5" />
        </button>

        <div className="bg-muted relative h-16 w-24 shrink-0 overflow-hidden rounded">
          {project.cover_url && (
            <Image
              src={project.cover_url}
              alt={project.title_zh || 'Project Cover'}
              fill
              className="object-cover"
            />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h4 className="truncate font-medium">
              {project.title_zh || '(無標題)'}
            </h4>
            <span className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs">
              {project.slug}
            </span>
          </div>
          <p className="text-muted-foreground truncate text-sm">
            {project.title_en}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch
              checked={project.is_active}
              onCheckedChange={handleToggleActive}
              aria-label="Toggle active"
            />
            <span className="text-muted-foreground w-12 text-center text-sm">
              {project.is_active ? '顯示' : '隱藏'}
            </span>
          </div>

          <Link href={`/admin/project/${project.id}`}>
            <Button variant="outline" size="icon">
              <Pencil className="h-4 w-4" />
            </Button>
          </Link>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button destructive size="icon" disabled={isDeleting}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>確定要刪除嗎？</AlertDialogTitle>
                <AlertDialogDescription>
                  此動作無法復原。這將永久刪除此專案及其所有相關資料與圖片。
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>取消</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {isDeleting ? '刪除中...' : '確認刪除'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  )
}
