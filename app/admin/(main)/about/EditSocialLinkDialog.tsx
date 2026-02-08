'use client'

import { useState } from 'react'

import { SocialLink, updateSocialLink } from '@/app/_actions/admin/about'

import { Loader2, Pencil } from 'lucide-react'
import Image from 'next/image'
import { toast } from 'sonner'

import { Button } from '@/components/admin/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/admin/ui/dialog'
import { Input } from '@/components/admin/ui/input'
import { Label } from '@/components/admin/ui/label'

interface EditSocialLinkDialogProps {
  link: SocialLink
}

export function EditSocialLinkDialog({ link }: EditSocialLinkDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [label, setLabel] = useState(link.label)
  const [url, setUrl] = useState(link.url)
  const [file, setFile] = useState<File | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData()
    formData.append('label', label)
    formData.append('url', url)
    if (file) {
      formData.append('logo', file)
    }

    try {
      const res = await updateSocialLink(link.id, formData)
      if (res.success) {
        toast.success('更新成功')
        setOpen(false)
      } else {
        toast.error('更新失敗: ' + res.error)
      }
    } catch (error) {
      console.error(error)
      toast.error('發生錯誤')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size='icon' variant='outline'>
          <Pencil className='h-4 w-4' />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>編輯社群連結</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className='grid gap-4 py-4'>
          <div className='grid gap-2'>
            <Label htmlFor={`edit-label-${link.id}`}>標籤</Label>
            <Input
              id={`edit-label-${link.id}`}
              value={label}
              onChange={e => setLabel(e.target.value)}
            />
          </div>
          <div className='grid gap-2'>
            <Label htmlFor={`edit-url-${link.id}`}>網址</Label>
            <Input id={`edit-url-${link.id}`} value={url} onChange={e => setUrl(e.target.value)} />
          </div>
          <div className='grid gap-2'>
            <Label htmlFor={`edit-logo-${link.id}`}>圖示 (選填，更換用)</Label>
            <div className='flex items-center gap-4'>
              {link.logo_url && !file && (
                <div className='relative h-10 w-10 overflow-hidden rounded-md border'>
                  <Image src={link.logo_url} alt={link.label} fill className='object-cover' />
                </div>
              )}
              <Input
                id={`edit-logo-${link.id}`}
                type='file'
                accept='image/*'
                onChange={e => setFile(e.target.files?.[0] || null)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type='submit' disabled={loading}>
              {loading ? <Loader2 className='mr-2 h-4 w-4 animate-spin' /> : '儲存變更'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
