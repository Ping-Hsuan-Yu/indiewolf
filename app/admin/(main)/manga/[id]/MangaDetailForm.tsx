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
  rectSortingStrategy,
  useSortable
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

import {
  updateMangaDetail,
  uploadMangaImages,
  deleteMangaImage,
  updateMangaImagesOrder
} from '@/app/_actions/admin/manga'
import { Tables } from '@/types/database.types'

import { Loader2, Plus, Trash2, ChevronLeft } from 'lucide-react'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/admin/ui/alert-dialog'
import { Button } from '@/components/admin/ui/button'
import { Input } from '@/components/admin/ui/input'
import { Label } from '@/components/admin/ui/label'
import { Separator } from '@/components/admin/ui/separator'
import { ToggleGroup, ToggleGroupItem } from '@/components/admin/ui/toggle-group'
import { Textarea } from '@/components/admin/ui/textarea'

import { CreatableSelect } from '../CreatableSelect'

type MangaDetail = Tables<'manga_works'> & {
  images: Tables<'manga_images'>[]
}

interface MangaDetailFormProps {
  manga: MangaDetail
  years: string[]
}

// Sortable Image Item Component
function SortableImageItem({
  image,
  onDelete
}: {
  image: Tables<'manga_images'>
  onDelete: (id: string) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: image.id
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  }

  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const handleConfirmDelete = async () => {
    setIsDeleting(true)
    await onDelete(image.id)
    setIsDeleting(false)
    setDeleteDialogOpen(false)
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className='group relative aspect-square cursor-move! overflow-hidden rounded-md border bg-muted touch-none'>
      <Image
        src={image.url}
        alt='Manga Page'
        fill
        className='object-contain'
        sizes='(max-width: 768px) 33vw, 20vw'
      />
      <div className='absolute right-1 top-1 opacity-0 transition-opacity group-hover:opacity-100'>
        <Button
          size='icon'
          variant='ghost'
          destructive
          onClick={e => {
            e.stopPropagation()
            setDeleteDialogOpen(true)
          }}
          disabled={isDeleting}
          onPointerDown={e => e.stopPropagation()} // Prevent drag
        >
          {isDeleting ? (
            <Loader2 className='h-3 w-3 animate-spin' />
          ) : (
            <Trash2 className='h-3 w-3' />
          )}
        </Button>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>確定要刪除這張圖片嗎？</AlertDialogTitle>
            <AlertDialogDescription>此動作無法復原。</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isDeleting}
              className='bg-muted text-muted-foreground hover:bg-muted/80'>
              取消
            </AlertDialogAction>
            <Button
              variant='default'
              destructive
              onClick={e => {
                e.stopPropagation()
                handleConfirmDelete()
              }}
              disabled={isDeleting}>
              {isDeleting ? <Loader2 className='mr-2 h-4 w-4 animate-spin' /> : null}
              確認刪除
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

// Image Grid Component with Drag and Drop
function ImageGrid({
  images,
  locale,
  mangaId,
  onUpdate
}: {
  images: Tables<'manga_images'>[]
  locale: 'zh' | 'en'
  mangaId: string
  onUpdate: () => void
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )
  const [isUploading, setIsUploading] = useState(false)

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const oldIndex = images.findIndex(img => img.id === active.id)
      const newIndex = images.findIndex(img => img.id === over.id)

      const newImages = arrayMove(images, oldIndex, newIndex)

      // Optimistic Update handled by parent re-render? No, strictly strictly we should notify parent.
      // But DndKit works with local state. To avoid flicker, we assume parent updates via revalidate.
      // Actually, we should update server and force refresh.

      const updates = newImages.map((img, idx) => ({
        id: img.id,
        order_index: idx
      }))

      await updateMangaImagesOrder(updates)
      onUpdate()
    }
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)
    const formData = new FormData()
    formData.append('locale', locale)
    Array.from(files).forEach(file => {
      formData.append('images', file)
    })

    const res = await uploadMangaImages(mangaId, formData)
    setIsUploading(false)

    if (res.success) {
      toast.success('圖片上傳成功')
      onUpdate()
    } else {
      toast.error('上傳失敗: ' + res.error)
    }

    // Reset input
    e.target.value = ''
  }

  const handleDelete = async (id: string) => {
    const res = await deleteMangaImage(id)
    if (res.success) {
      toast.success('刪除成功')
      onUpdate()
    } else {
      toast.error('刪除失敗')
    }
  }

  return (
    <div className='space-y-4 rounded-lg border p-4 bg-card'>
      <h4 className='font-medium'>{locale === 'zh' ? '中文內頁' : 'English'}</h4>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        id={`dnd-${locale}`}>
        <SortableContext items={images.map(i => i.id)} strategy={rectSortingStrategy}>
          <div className='grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5'>
            {images.map(img => (
              <SortableImageItem key={img.id} image={img} onDelete={handleDelete} />
            ))}
            {/* Upload Trigger Button */}
            <div className='aspect-square'>
              <label className='flex h-full w-full cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 hover:bg-muted/50 transition-colors'>
                {isUploading ? (
                  <Loader2 className='h-6 w-6 animate-spin text-muted-foreground' />
                ) : (
                  <>
                    <Plus className='h-6 w-6 text-muted-foreground' />
                    <span className='mt-2 text-xs text-muted-foreground'>
                      {isUploading ? 'Uploading...' : 'Add Images'}
                    </span>
                  </>
                )}
                <input
                  type='file'
                  multiple
                  accept='image/*'
                  className='hidden'
                  onChange={handleUpload}
                  disabled={isUploading}
                />
              </label>
            </div>
          </div>
        </SortableContext>
      </DndContext>
    </div>
  )
}

export function MangaDetailForm({ manga, years }: MangaDetailFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  // Form State
  const [formData, setFormData] = useState({
    year: manga.year,
    title_zh: manga.title_zh || '',
    title_en: manga.title_en || '',
    summary_zh: manga.summary_zh || '',
    summary_en: manga.summary_en || '',
    is_completed: manga.is_completed ?? false
  })

  // Filter images by locale
  const zhImages = manga.images?.filter(img => img.locale === 'zh' || !img.locale) || []
  const enImages = manga.images?.filter(img => img.locale === 'en') || []

  const refreshData = () => {
    router.refresh()
  }

  const handleSave = async () => {
    setLoading(true)
    const data = new FormData()
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value.toString())
    })

    const res = await updateMangaDetail(manga.id, data)
    setLoading(false)

    if (res.success) {
      toast.success('儲存成功')
    } else {
      toast.error('儲存失敗')
    }
  }

  return (
    <div className='space-y-8 pb-10'>
      {/* Header Actions */}
      <div className='flex items-center justify-between'>
        <Button variant='secondary' onClick={() => router.back()}>
          <ChevronLeft className='mr-2 h-4 w-4' />
          返回
        </Button>
        <Button onClick={handleSave} disabled={loading}>
          {loading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
          儲存
        </Button>
      </div>

      {/* Top Section: Info & Cover */}
      <div className='grid gap-8 md:grid-cols-[300px_1fr]'>
        {/* Cover Image - Read Only for now based on actions, creation sets cover */}
        <div className='space-y-2'>
          <div className='relative aspect-square overflow-hidden rounded-lg border bg-muted'>
            <Image src={manga.cover_url} alt='Cover' fill className='object-contain' />
          </div>
        </div>

        {/* Fields */}
        <div className='grid gap-6 md:grid-cols-2'>
          {/* Left Column (Desktop) */}
          <div className='flex flex-col gap-4'>
            <div className='space-y-2'>
              <Label>年份</Label>
              <CreatableSelect
                options={years}
                value={formData.year}
                onChange={val => setFormData(prev => ({ ...prev, year: val }))}
              />
            </div>
            <div className='space-y-2'>
              <Label>連載狀態</Label>
              <ToggleGroup
                type='single'
                value={formData.is_completed ? 'completed' : 'ongoing'}
                onValueChange={val => {
                  if (val) setFormData(prev => ({ ...prev, is_completed: val === 'completed' }))
                }}
                variant='outline'
                className='justify-start gap-0'>
                <ToggleGroupItem value='ongoing' className='rounded-r-none border-r-0'>
                  連載中
                </ToggleGroupItem>
                <ToggleGroupItem value='completed' className='rounded-l-none'>
                  連載結束
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
            <div className='space-y-2'>
              <Label>標題 (中文)</Label>
              <Input
                value={formData.title_zh}
                onChange={e => setFormData(prev => ({ ...prev, title_zh: e.target.value }))}
              />
            </div>
            <div className='space-y-2'>
              <Label>Title (English)</Label>
              <Input
                value={formData.title_en}
                onChange={e => setFormData(prev => ({ ...prev, title_en: e.target.value }))}
              />
            </div>
          </div>

          {/* Right Column (Desktop) */}
          <div className='flex flex-col gap-4'>
            <div className='space-y-2'>
              <Label>簡介 (中文)</Label>
              <Textarea
                className='min-h-30'
                value={formData.summary_zh}
                onChange={e => setFormData(prev => ({ ...prev, summary_zh: e.target.value }))}
              />
            </div>
            <div className='space-y-2'>
              <Label>Summary (English)</Label>
              <Textarea
                className='min-h-30'
                value={formData.summary_en}
                onChange={e => setFormData(prev => ({ ...prev, summary_en: e.target.value }))}
              />
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Image Sections */}
      <ImageGrid mangaId={manga.id} locale='zh' images={zhImages} onUpdate={refreshData} />

      <div className='border-t my-6' />

      <ImageGrid mangaId={manga.id} locale='en' images={enImages} onUpdate={refreshData} />
    </div>
  )
}
