'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

import {
  updateWebtoonCover,
  updateWebtoonDetail,
} from '@/app/_actions/admin/webtoon'
import { Tables } from '@/types/database.types'

import { Loader2, ChevronLeft, ImagePlus } from 'lucide-react'

import { Button } from '@/components/admin/ui/button'
import { Input } from '@/components/admin/ui/input'
import { Label } from '@/components/admin/ui/label'
import { Textarea } from '@/components/admin/ui/textarea'

interface WebtoonDetailFormProps {
  webtoon: Tables<'webtoon_works'>
}

export function WebtoonDetailForm({ webtoon }: WebtoonDetailFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [isUploadingCover, setIsUploadingCover] = useState(false)

  const [formData, setFormData] = useState({
    title_zh: webtoon.title_zh || '',
    title_en: webtoon.title_en || '',
    summary_zh: webtoon.summary_zh || '',
    summary_en: webtoon.summary_en || '',
    external_url: webtoon.external_url || '',
  })

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploadingCover(true)
    const toastId = toast.loading('上傳新首圖中...')

    const data = new FormData()
    data.append('cover', file)

    const res = await updateWebtoonCover(webtoon.id, data)

    if (res.success) {
      toast.success('首圖更換成功', { id: toastId })
      router.refresh()
    } else {
      toast.error(`更換失敗: ${res.error}`, { id: toastId })
    }

    setIsUploadingCover(false)
    e.target.value = ''
  }

  const handleSave = async () => {
    setLoading(true)
    const data = new FormData()
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value.toString())
    })

    const res = await updateWebtoonDetail(webtoon.id, data)
    setLoading(false)

    if (res.success) {
      toast.success('儲存成功')
    } else {
      toast.error('儲存失敗')
    }
  }

  return (
    <div className="space-y-8 pb-10">
      <div className="flex items-center justify-between">
        <Button variant="secondary" onClick={() => router.back()}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          返回
        </Button>
        <Button onClick={handleSave} disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          儲存
        </Button>
      </div>

      <div className="grid gap-8 md:grid-cols-[300px_1fr]">
        <div className="space-y-2">
          <div className="bg-muted group relative aspect-square overflow-hidden rounded-lg border">
            <Image
              src={webtoon.cover_url}
              alt="Cover"
              fill
              className="object-contain"
            />
            <label className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
              {isUploadingCover ? (
                <Loader2 className="h-8 w-8 animate-spin text-white" />
              ) : (
                <div className="flex flex-col items-center text-white">
                  <ImagePlus className="mb-2 h-8 w-8" />
                  <span className="text-sm font-medium">更換首圖</span>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={isUploadingCover}
                onChange={handleCoverUpload}
              />
            </label>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="flex flex-col gap-4">
            <div className="space-y-2">
              <Label>標題 (中文)</Label>
              <Input
                value={formData.title_zh}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title_zh: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Title (English)</Label>
              <Input
                value={formData.title_en}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title_en: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label>外部連結</Label>
              <Input
                type="url"
                value={formData.external_url}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    external_url: e.target.value,
                  }))
                }
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="space-y-2">
              <Label>簡介 (中文)</Label>
              <Textarea
                className="min-h-30"
                value={formData.summary_zh}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    summary_zh: e.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Summary (English)</Label>
              <Textarea
                className="min-h-30"
                value={formData.summary_en}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    summary_en: e.target.value,
                  }))
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
