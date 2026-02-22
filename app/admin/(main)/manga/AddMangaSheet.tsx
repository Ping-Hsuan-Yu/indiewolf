'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

import { createManga } from '@/app/_actions/admin/manga'

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

import { CreatableSelect } from './CreatableSelect'

interface AddMangaSheetProps {
  years: string[]
  onUploadSuccess?: () => void
}

export function AddMangaSheet({ years, onUploadSuccess }: AddMangaSheetProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [year, setYear] = useState(years[0] || new Date().getFullYear().toString())

  // Fields based on screenshot and schema
  const [titleZh, setTitleZh] = useState('')
  const [titleEn, setTitleEn] = useState('')
  const [summaryZh, setSummaryZh] = useState('')
  const [summaryEn, setSummaryEn] = useState('')
  const [file, setFile] = useState<File | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file || !year) return

    setLoading(true)
    const formData = new FormData()
    formData.append('cover', file)
    formData.append('year', year)
    formData.append('title_zh', titleZh)
    formData.append('title_en', titleEn)
    formData.append('summary_zh', summaryZh)
    formData.append('summary_en', summaryEn)

    try {
      await createManga(formData)
      toast.success('上傳成功')
      setOpen(false)
      // Reset form
      setTitleZh('')
      setTitleEn('')
      setSummaryZh('')
      setSummaryEn('')
      setFile(null)

      // Call component-level callback first to switch tabs immediately if needed
      onUploadSuccess?.()
      // Then refresh route data
      router.refresh()
    } catch (error) {
      console.error(error)
      toast.error('上傳失敗，請稍後再試')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button>
          <Plus className='mr-2 h-4 w-4' /> 新增漫畫
        </Button>
      </SheetTrigger>
      <SheetContent className='w-100 sm:w-135 overflow-y-auto'>
        <SheetHeader>
          <SheetTitle>新增漫畫</SheetTitle>
          <SheetDescription>上傳新的漫畫作品。</SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className='grid gap-4 py-4'>
          <div className='grid gap-2'>
            <Label htmlFor='year'>年份</Label>
            <CreatableSelect
              options={years}
              value={year}
              onChange={setYear}
              placeholder='選擇或輸入年份'
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
            <Label htmlFor='summary_zh'>簡介 (中文)</Label>
            <Textarea
              id='summary_zh'
              value={summaryZh}
              onChange={e => setSummaryZh(e.target.value)}
              placeholder='輸入中文簡介'
            />
          </div>
          <div className='grid gap-2'>
            <Label htmlFor='summary_en'>Summary (English)</Label>
            <Textarea
              id='summary_en'
              value={summaryEn}
              onChange={e => setSummaryEn(e.target.value)}
              placeholder='Enter English Summary'
            />
          </div>
          <div className='grid gap-2'>
            <Label htmlFor='cover'>首圖 (Cover)</Label>
            <Input
              id='cover'
              type='file'
              accept='image/*'
              onChange={e => setFile(e.target.files?.[0] || null)}
              required
            />
          </div>
          <SheetFooter>
            <Button type='submit' disabled={loading || !file}>
              {loading ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  上傳中
                </>
              ) : (
                '儲存'
              )}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
