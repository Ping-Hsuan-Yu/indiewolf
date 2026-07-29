'use client'

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
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'

import {
  updateProject,
  uploadProjectImages,
  setProjectCover,
  updateProjectImagesOrder,
  deleteProjectImage,
} from '@/app/_actions/admin/project'

import {
  Loader2,
  ArrowLeft,
  Upload,
  GripVertical,
  Trash2,
  CheckCircle2,
  Star,
} from 'lucide-react'

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
import { Badge } from '@/components/admin/ui/badge'
import { Button } from '@/components/admin/ui/button'
import { Card, CardContent } from '@/components/admin/ui/card'
import { Input } from '@/components/admin/ui/input'
import { Label } from '@/components/admin/ui/label'
import { Textarea } from '@/components/admin/ui/textarea'

interface ProjectDetailFormProps {
  project: any
}

function SortableImageItem({
  id,
  url,
  isMain,
  onSetMain,
  onDelete,
}: {
  id: string
  url: string
  isMain: boolean
  onSetMain: () => void
  onDelete: () => Promise<boolean>
}) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className="group relative overflow-hidden"
    >
      <CardContent className="relative aspect-square p-0">
        <Image src={url} alt="Project Image" fill className="object-cover" />

        {/* Is Main Indicator */}
        {isMain && (
          <div className="absolute top-2 left-2 z-10">
            <Badge className="bg-green-600 hover:bg-green-700">
              <Star className="mr-1 h-3 w-3 fill-current" /> 主圖
            </Badge>
          </div>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/50 p-2 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            {...attributes}
            {...listeners}
            className="absolute top-2 right-2 cursor-grab rounded bg-white/10 p-1 text-white hover:bg-white/20 active:cursor-grabbing"
          >
            <GripVertical className="h-5 w-5" />
          </button>

          {!isMain && (
            <Button
              size="sm"
              variant="secondary"
              className="w-full text-xs"
              onClick={onSetMain}
            >
              設為主圖
            </Button>
          )}

          <AlertDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
          >
            <AlertDialogTrigger asChild>
              <Button size="sm" destructive className="w-full text-xs">
                <Trash2 className="mr-1 h-3 w-3" /> 刪除
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>確定要刪除這張圖片嗎？</AlertDialogTitle>
                <AlertDialogDescription>
                  此動作無法復原。
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogAction
                  onClick={(e) => {
                    e.preventDefault()
                    setDeleteDialogOpen(false)
                  }}
                  disabled={isDeleting}
                  className="bg-muted text-muted-foreground hover:bg-muted/80"
                >
                  取消
                </AlertDialogAction>
                <Button
                  variant="default"
                  destructive
                  onClick={async (e) => {
                    e.stopPropagation()
                    setIsDeleting(true)
                    const success = await onDelete()
                    if (!success) {
                      setIsDeleting(false)
                    }
                  }}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  確認刪除
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  )
}

export function ProjectDetailForm({ project }: ProjectDetailFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState(project.images || [])
  const [coverUrl, setCoverUrl] = useState(project.cover_url)

  useEffect(() => {
    if (project.images) {
      setImages(project.images)
    }
  }, [project.images])

  // Form State
  const [slug, setSlug] = useState(project.slug || '')
  const [titleZh, setTitleZh] = useState(project.title_zh || '')
  const [titleEn, setTitleEn] = useState(project.title_en || '')
  const [subtitleZh, setSubtitleZh] = useState(project.subtitle_zh || '')
  const [subtitleEn, setSubtitleEn] = useState(project.subtitle_en || '')
  const [descriptionZh, setDescriptionZh] = useState(
    project.description_zh || ''
  )
  const [descriptionEn, setDescriptionEn] = useState(
    project.description_en || ''
  )

  const handleUpdateText = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData()
    formData.append('slug', slug)
    formData.append('title_zh', titleZh)
    formData.append('title_en', titleEn)
    formData.append('subtitle_zh', subtitleZh)
    formData.append('subtitle_en', subtitleEn)
    formData.append('description_zh', descriptionZh)
    formData.append('description_en', descriptionEn)

    try {
      const result = await updateProject(project.id, formData)
      if (result.success) {
        toast.success('更新成功')
      } else {
        toast.error('更新失敗: ' + result.error)
      }
    } catch (error) {
      toast.error('更新時發生錯誤')
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setLoading(true)
    const total = files.length
    let completed = 0

    const getProgressToastContent = (comp: number, tot: number) => (
      <div className="w-full min-w-50 space-y-2">
        <div className="text-sm font-medium">
          已完成 {comp} 張，共 {tot} 張
        </div>
        <div className="bg-secondary h-2 w-full overflow-hidden rounded-full">
          <div
            className="bg-primary h-full transition-all duration-300"
            style={{ width: `${(comp / tot) * 100}%` }}
          />
        </div>
      </div>
    )

    const toastId = toast.loading('上傳進度...', {
      classNames: { content: 'w-full' },
      position: 'bottom-right',
      description: getProgressToastContent(0, total),
    })

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const formData = new FormData()
        formData.append('images', file)

        const res = await uploadProjectImages(project.id, formData)

        if (!res.success) {
          toast.error(`上傳失敗: 檔案 ${file.name} 發生錯誤 (${res.error})`, {
            id: toastId,
            position: 'bottom-right',
            duration: 5000,
            closeButton: true,
          })
          setLoading(false)
          e.target.value = ''
          return
        }

        completed++

        toast.loading('上傳進度...', {
          classNames: { content: 'w-full' },
          id: toastId,
          position: 'bottom-right',
          description: getProgressToastContent(completed, total),
        })

        // Refresh progressively
        router.refresh()
      }

      toast.success('上傳完成', {
        id: toastId,
        position: 'bottom-right',
        classNames: { content: 'w-full' },
        duration: 5000,
        closeButton: true,
        description: getProgressToastContent(total, total),
      })
    } catch (error) {
      toast.error('上傳錯誤', { id: toastId })
    } finally {
      setLoading(false)
      // Reset input
      e.target.value = ''
    }
  }

  const handleSetMain = async (imageUrl: string) => {
    try {
      const result = await setProjectCover(project.id, imageUrl)
      if (result.success) {
        setCoverUrl(imageUrl)
        toast.success('已設為主圖')
      } else {
        toast.error('設定失敗')
      }
    } catch (error) {
      toast.error('設定時發生錯誤')
    }
  }

  const handleDeleteImage = async (id: string) => {
    try {
      const result = await deleteProjectImage(id)
      if (result.success) {
        setImages(images.filter((img: any) => img.id !== id))
        toast.success('圖片已刪除')
        return true
      } else {
        toast.error('刪除失敗')
        return false
      }
    } catch (error) {
      toast.error('刪除錯誤')
      return false
    }
  }

  // DND implementation
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      setImages((items: any[]) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })

      // Update backend
      const oldIndex = images.findIndex((item: any) => item.id === active.id)
      const newIndex = images.findIndex((item: any) => item.id === over.id)
      const reordered = arrayMove(images, oldIndex, newIndex)

      const updates = reordered.map((item: any, index: number) => ({
        id: item.id,
        order_index: index + 1,
      }))

      try {
        const res = await updateProjectImagesOrder(updates)
        if (!res.success) {
          toast.error('排序更新失敗')
          router.refresh()
        }
      } catch (error) {
        toast.error('排序更新失敗')
        router.refresh()
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()} size="sm">
          <ArrowLeft className="mr-2 h-4 w-4" /> 返回列表
        </Button>
        <h2 className="text-2xl font-bold">編輯專案: {titleZh || slug}</h2>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Left Column: Text Edit */}
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleUpdateText} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>標題 (中文)</Label>
                  <Input
                    value={titleZh}
                    onChange={(e) => setTitleZh(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Title (English)</Label>
                  <Input
                    value={titleEn}
                    onChange={(e) => setTitleEn(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>副標題 (中文)</Label>
                  <Textarea
                    value={subtitleZh}
                    onChange={(e) => setSubtitleZh(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Subtitle (English)</Label>
                  <Textarea
                    value={subtitleEn}
                    onChange={(e) => setSubtitleEn(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>說明 (中文)</Label>
                <Textarea
                  value={descriptionZh}
                  onChange={(e) => setDescriptionZh(e.target.value)}
                  className="min-h-25"
                />
              </div>

              <div className="space-y-2">
                <Label>Description (English)</Label>
                <Textarea
                  value={descriptionEn}
                  onChange={(e) => setDescriptionEn(e.target.value)}
                  className="min-h-25"
                />
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  儲存變更
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Right Column: Images */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">專案圖片</h3>
            <div className="flex items-center gap-2">
              <Label htmlFor="upload-images" className="cursor-pointer">
                <div className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors">
                  <Upload className="h-4 w-4" /> 上傳圖片
                </div>
                <Input
                  id="upload-images"
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={loading}
                />
              </Label>
            </div>
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={images.map((img: any) => img.id)}
              strategy={rectSortingStrategy}
            >
              <div className="grid grid-cols-3 gap-4">
                {images.map((image: any) => (
                  <SortableImageItem
                    key={image.id}
                    id={image.id}
                    url={image.url}
                    isMain={image.url === coverUrl}
                    onSetMain={() => handleSetMain(image.url)}
                    onDelete={() => handleDeleteImage(image.id)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          {images.length === 0 && (
            <div className="text-muted-foreground bg-muted/50 rounded-lg border border-dashed py-12 text-center">
              尚無其他圖片，請上傳
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
