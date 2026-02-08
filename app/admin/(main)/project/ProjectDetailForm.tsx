'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { toast } from 'sonner'
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
import { Loader2, ArrowLeft, Upload, GripVertical, Trash2, CheckCircle2, Star } from 'lucide-react'

import { Button } from '@/components/admin/ui/button'
import { Input } from '@/components/admin/ui/input'
import { Label } from '@/components/admin/ui/label'
import { Textarea } from '@/components/admin/ui/textarea'
import { Card, CardContent } from '@/components/admin/ui/card'
import { Badge } from '@/components/admin/ui/badge'

import { 
  updateProject, 
  uploadProjectImages, 
  setProjectCover, 
  updateProjectImagesOrder,
  deleteProjectImage
} from '@/app/_actions/admin/project'

interface ProjectDetailFormProps {
  project: any
}

function SortableImageItem({ id, url, isMain, onSetMain, onDelete }: { 
  id: string, 
  url: string, 
  isMain: boolean, 
  onSetMain: () => void,
  onDelete: () => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  }

  return (
    <Card ref={setNodeRef} style={style} className='overflow-hidden group relative'>
      <CardContent className='p-0 aspect-square relative'>
        <Image 
          src={url} 
          alt="Project Image" 
          fill 
          className='object-cover'
        />
        
        {/* Is Main Indicator */}
        {isMain && (
          <div className='absolute top-2 left-2 z-10'>
            <Badge className='bg-green-600 hover:bg-green-700'>
              <Star className='w-3 h-3 mr-1 fill-current' /> 主圖
            </Badge>
          </div>
        )}

        {/* Hover Overlay */}
        <div className='absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2'>
          <button 
            {...attributes} 
            {...listeners} 
            className='absolute top-2 right-2 p-1 bg-white/10 rounded hover:bg-white/20 cursor-grab active:cursor-grabbing text-white'
          >
            <GripVertical className='w-5 h-5' />
          </button>

          {!isMain && (
            <Button 
              size='sm' 
              variant='secondary' 
              className='w-full text-xs'
              onClick={onSetMain}
            >
              設為主圖
            </Button>
          )}

          <Button 
            size='sm' 
            destructive
            className='w-full text-xs'
            onClick={onDelete}
          >
            <Trash2 className='w-3 h-3 mr-1' /> 刪除
          </Button>
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
  
  // Form State
  const [slug, setSlug] = useState(project.slug || '')
  const [titleZh, setTitleZh] = useState(project.title_zh || '')
  const [titleEn, setTitleEn] = useState(project.title_en || '')
  const [subtitleZh, setSubtitleZh] = useState(project.subtitle_zh || '')
  const [subtitleEn, setSubtitleEn] = useState(project.subtitle_en || '')
  const [descriptionZh, setDescriptionZh] = useState(project.description_zh || '')
  const [descriptionEn, setDescriptionEn] = useState(project.description_en || '')

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
    const formData = new FormData()
    Array.from(files).forEach(file => {
      formData.append('images', file)
    })

    try {
      const result = await uploadProjectImages(project.id, formData)
      if (result.success) {
        toast.success('圖片上傳成功')
        router.refresh()
      } else {
        toast.error('上傳失敗')
      }
    } catch (error) {
      toast.error('上傳錯誤')
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
    if (!confirm('確定要刪除這張圖片嗎？')) return

    try {
      const result = await deleteProjectImage(id)
      if (result.success) {
        setImages(images.filter((img: any) => img.id !== id))
        toast.success('圖片已刪除')
      } else {
        toast.error('刪除失敗')
      }
    } catch (error) {
      toast.error('刪除錯誤')
    }
  }

  // DND implementation
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
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
        order_index: index + 1
      }))

      try {
        await updateProjectImagesOrder(updates)
      } catch (error) {
        toast.error('排序更新失敗')
      }
    }
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center gap-4'>
        <Button variant='ghost' onClick={() => router.back()} size='sm'>
          <ArrowLeft className='w-4 h-4 mr-2' /> 返回列表
        </Button>
        <h2 className='text-2xl font-bold'>編輯專案: {titleZh || slug}</h2>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
        {/* Left Column: Text Edit */}
        <Card>
          <CardContent className='pt-6'>
            <form onSubmit={handleUpdateText} className='space-y-4'>
              <div className='grid gap-2'>
                <Label htmlFor='slug'>Slug</Label>
                <Input id='slug' value={slug} onChange={e => setSlug(e.target.value)} required />
              </div>
              
              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Label>標題 (中文)</Label>
                  <Input value={titleZh} onChange={e => setTitleZh(e.target.value)} />
                </div>
                <div className='space-y-2'>
                  <Label>Title (English)</Label>
                  <Input value={titleEn} onChange={e => setTitleEn(e.target.value)} />
                </div>
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Label>副標題 (中文)</Label>
                  <Input value={subtitleZh} onChange={e => setSubtitleZh(e.target.value)} />
                </div>
                <div className='space-y-2'>
                  <Label>Subtitle (English)</Label>
                  <Input value={subtitleEn} onChange={e => setSubtitleEn(e.target.value)} />
                </div>
              </div>

              <div className='space-y-2'>
                <Label>說明 (中文)</Label>
                <Textarea 
                  value={descriptionZh} 
                  onChange={e => setDescriptionZh(e.target.value)} 
                  className='min-h-[100px]' 
                />
              </div>

              <div className='space-y-2'>
                <Label>Description (English)</Label>
                <Textarea 
                  value={descriptionEn} 
                  onChange={e => setDescriptionEn(e.target.value)} 
                  className='min-h-[100px]' 
                />
              </div>

              <div className='flex justify-end'>
                  <Button type='submit' disabled={loading}>
                    {loading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                    儲存變更
                  </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Right Column: Images */}
        <div className='space-y-6'>
          <div className='flex items-center justify-between'>
            <h3 className='text-lg font-medium'>專案圖片</h3>
            <div className='flex items-center gap-2'>
              <Label htmlFor='upload-images' className='cursor-pointer'>
                <div className='flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm font-medium'>
                  <Upload className='w-4 h-4' /> 上傳圖片
                </div>
                <Input 
                  id='upload-images' 
                  type='file' 
                  multiple 
                  accept='image/*' 
                  className='hidden' 
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
              <div className='grid grid-cols-3 gap-4'>
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
            <div className='text-center py-12 text-muted-foreground border border-dashed rounded-lg bg-muted/50'>
              尚無其他圖片，請上傳
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
