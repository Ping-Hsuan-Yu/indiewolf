'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

import { createIllustration } from '@/app/_actions/admin/illustration'

import { Plus, Upload, Loader2 } from 'lucide-react'

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
  SheetFooter,
  SheetClose,
} from '@/components/admin/ui/sheet'

import { CreatableSelect } from './CreatableSelect'

interface AddIllustrationSheetProps {
  years: string[]
  onUploadSuccess?: (year: string) => void
}

export function AddIllustrationSheet({
  years,
  onUploadSuccess,
}: AddIllustrationSheetProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [year, setYear] = useState(
    years[0] || new Date().getFullYear().toString()
  )
  const [alt, setAlt] = useState('')
  const [file, setFile] = useState<File | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file || !year) return

    setLoading(true)
    const formData = new FormData()
    formData.append('image', file)
    formData.append('year', year)
    formData.append('alt', alt)

    try {
      const res = await createIllustration(formData)
      if (!res.success) {
        toast.error('上傳失敗，請稍後再試')
        return
      }
      toast.success('上傳成功')
      setOpen(false)
      setAlt('')
      setFile(null)
      // Call component-level callback first to switch tabs immediately if needed
      onUploadSuccess?.(year)
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
          <Plus className="mr-2 h-4 w-4" /> 新增插畫
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>新增插畫</SheetTitle>
          <SheetDescription>上傳新的插畫作品。</SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="year">年份</Label>
            <CreatableSelect
              options={years}
              value={year}
              onChange={setYear}
              placeholder="選擇或輸入年份"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="alt">描述 (Alt)</Label>
            <Input
              id="alt"
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
              placeholder="圖片描述"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="image">圖片</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              required
            />
          </div>
          <SheetFooter>
            <Button type="submit" disabled={loading || !file}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
