'use client'

import { useState } from 'react'
import { toast } from 'sonner'

import { createSocialLink } from '@/app/_actions/admin/about'

import { Loader2, Plus } from 'lucide-react'

import { Button } from '@/components/admin/ui/button'
import { Input } from '@/components/admin/ui/input'
import { Label } from '@/components/admin/ui/label'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/admin/ui/sheet'

export function AddSocialLinkSheet() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [label, setLabel] = useState('')
  const [url, setUrl] = useState('')
  const [file, setFile] = useState<File | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file || !label || !url) return

    setLoading(true)
    const formData = new FormData()
    formData.append('label', label)
    formData.append('url', url)
    formData.append('logo', file)

    try {
      const res = await createSocialLink(formData)
      if (res.success) {
        toast.success('新增成功')
        setOpen(false)
        setLabel('')
        setUrl('')
        setFile(null)
      } else {
        toast.error('新增失敗: ' + res.error)
      }
    } catch (error) {
      console.error(error)
      toast.error('發生錯誤')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button>
          <Plus className='mr-2 h-4 w-4' /> 新增連結
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>新增社群連結</SheetTitle>
          <SheetDescription>新增一個外部連結（如 Instagram, Twitter 等）。</SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className='grid gap-4 py-4'>
          <div className='grid gap-2'>
            <Label htmlFor='label'>標籤 (Label)</Label>
            <Input
              id='label'
              value={label}
              onChange={e => setLabel(e.target.value)}
              placeholder='e.g. Instagram'
              required
            />
          </div>
          <div className='grid gap-2'>
            <Label htmlFor='url'>網址 (URL)</Label>
            <Input
              id='url'
              type='url'
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder='https://...'
              required
            />
          </div>
          <div className='grid gap-2'>
            <Label htmlFor='logo'>圖示 (Logo)</Label>
            <Input
              id='logo'
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
                  儲存中
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
