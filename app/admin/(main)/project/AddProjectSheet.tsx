'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

import { createProject } from '@/app/_actions/admin/project'

import { Plus, Loader2 } from 'lucide-react'

import { Button } from '@/components/admin/ui/button'
import { Input } from '@/components/admin/ui/input'
import { Label } from '@/components/admin/ui/label'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter
} from '@/components/admin/ui/sheet'
import { Textarea } from '@/components/admin/ui/textarea'

export function AddProjectSheet() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const [slug, setSlug] = useState('')
  const [titleZh, setTitleZh] = useState('')
  const [titleEn, setTitleEn] = useState('')
  const [subtitleZh, setSubtitleZh] = useState('')
  const [subtitleEn, setSubtitleEn] = useState('')
  const [descriptionZh, setDescriptionZh] = useState('')
  const [descriptionEn, setDescriptionEn] = useState('')
  const [file, setFile] = useState<File | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file || !slug) return

    setLoading(true)
    const formData = new FormData()
    formData.append('cover', file)
    formData.append('slug', slug)
    formData.append('title_zh', titleZh)
    formData.append('title_en', titleEn)
    formData.append('subtitle_zh', subtitleZh)
    formData.append('subtitle_en', subtitleEn)
    formData.append('description_zh', descriptionZh)
    formData.append('description_en', descriptionEn)

    try {
      await createProject(formData)
      toast.success('專案新增成功')
      setOpen(false)
      // Reset form
      setSlug('')
      setTitleZh('')
      setTitleEn('')
      setSubtitleZh('')
      setSubtitleEn('')
      setDescriptionZh('')
      setDescriptionEn('')
      setFile(null)

      router.refresh()
    } catch (error) {
      console.error(error)
      toast.error('新增失敗，請稍後再試')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button>
          <Plus className='mr-2 h-4 w-4' /> 新增專案
        </Button>
      </SheetTrigger>
      <SheetContent className='w-100 sm:w-135 overflow-y-auto'>
        <SheetHeader>
          <SheetTitle>新增專案</SheetTitle>
          <SheetDescription>建立新的專案並設定初始內容。建立後可再上傳更多圖片。</SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className='grid gap-4 py-4'>
          <div className='grid gap-2'>
            <Label htmlFor='slug'>Slug (網址代稱)</Label>
            <Input
              id='slug'
              value={slug}
              onChange={e => setSlug(e.target.value)}
              placeholder='e.g., my-project-name'
              required
            />
          </div>
          
          <div className='grid gap-2'>
            <Label htmlFor='cover'>專案封面 (Main Cover)</Label>
            <Input
              id='cover'
              type='file'
              accept='image/*'
              onChange={e => setFile(e.target.files?.[0] || null)}
              required
            />
          </div>

          <div className='grid gap-2'>
            <Label htmlFor='title_zh'>標題 (中文)</Label>
            <Input
              id='title_zh'
              value={titleZh}
              onChange={e => setTitleZh(e.target.value)}
              placeholder='輸入中文標題'
            />
          </div>
          <div className='grid gap-2'>
            <Label htmlFor='title_en'>Title (English)</Label>
            <Input
              id='title_en'
              value={titleEn}
              onChange={e => setTitleEn(e.target.value)}
              placeholder='Enter English Title'
            />
          </div>

          <div className='grid gap-2'>
            <Label htmlFor='subtitle_zh'>副標題 (中文)</Label>
            <Input
              id='subtitle_zh'
              value={subtitleZh}
              onChange={e => setSubtitleZh(e.target.value)}
              placeholder='輸入中文副標題'
            />
          </div>
          <div className='grid gap-2'>
            <Label htmlFor='subtitle_en'>Subtitle (English)</Label>
            <Input
              id='subtitle_en'
              value={subtitleEn}
              onChange={e => setSubtitleEn(e.target.value)}
              placeholder='Enter English Subtitle'
            />
          </div>

          <div className='grid gap-2'>
            <Label htmlFor='description_zh'>說明 (中文)</Label>
            <Textarea
              id='description_zh'
              value={descriptionZh}
              onChange={e => setDescriptionZh(e.target.value)}
              placeholder='輸入中文說明'
            />
          </div>
          <div className='grid gap-2'>
            <Label htmlFor='description_en'>Description (English)</Label>
            <Textarea
              id='description_en'
              value={descriptionEn}
              onChange={e => setDescriptionEn(e.target.value)}
              placeholder='Enter English Description'
            />
          </div>

          <SheetFooter>
            <Button type='submit' disabled={loading || !file || !slug}>
              {loading ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  處理中
                </>
              ) : (
                '建立專案'
              )}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
