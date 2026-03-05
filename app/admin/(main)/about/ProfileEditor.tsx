'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { AboutProfile, updateAboutProfile } from '@/app/_actions/admin/about'
import { APP_LOCALES, AppLocale } from '@/lib/i18n/config'

import { Loader2 } from 'lucide-react'

import { Button } from '@/components/admin/ui/button'
import { Input } from '@/components/admin/ui/input'
import { Label } from '@/components/admin/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/admin/ui/select'
import { Textarea } from '@/components/admin/ui/textarea'

interface ProfileEditorProps {
  profiles: AboutProfile[]
}

export function ProfileEditor({ profiles }: ProfileEditorProps) {
  const [selectedLocale, setSelectedLocale] = useState<AppLocale>('zh')
  const [loading, setLoading] = useState(false)
  const [bio, setBio] = useState('')
  const [currentImageUrl, setCurrentImageUrl] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)

  // Initialize form when locale changes
  useEffect(() => {
    // Attempt to match by exact locale string or map from DB locale
    // DB stores 'zh-TW', 'en-US'. APP_LOCALES are 'zh', 'en'.
    // We need a helper or just exact match if we stored it that way.
    // Wait, the action uses `toDatabaseLocale`. So DB has 'zh-TW'.
    // We should find the profile that matches `toDatabaseLocale(selectedLocale)`.

    // BUT `toDatabaseLocale` is server-side probably (or shared).
    // Let's import it or just manually map here if it's simple since we imported it.
    // Actually `toDatabaseLocale` is in `lib/i18n/config` which is shared.

    // We need to match logic.
    // `lib/i18n/config.ts`:
    // zh -> zh-TW
    // en -> en-US

    const dbLocaleTarget = selectedLocale === 'zh' ? 'zh-TW' : 'en-US'
    const profile = profiles.find((p) => p.locale === dbLocaleTarget)

    setBio(profile?.bio || '')
    setImageUrl(profile?.profile_image_url || '')
    setImageFile(null)
  }, [selectedLocale, profiles])

  const setImageUrl = (url: string) => {
    setCurrentImageUrl(url)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      // Preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImageUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData()
    formData.append('bio', bio)
    if (imageFile) {
      formData.append('profile_image', imageFile)
    }
    formData.append('existing_profile_image_url', currentImageUrl) // Helper to keep url if no new file

    try {
      const result = await updateAboutProfile(selectedLocale, formData)
      if (result.success) {
        toast.success('個人檔案更新成功')
      } else {
        toast.error('更新失敗: ' + result.error)
      }
    } catch (error) {
      console.error(error)
      toast.error('發生錯誤')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Label>選擇語言版本:</Label>
        <Select
          value={selectedLocale}
          onValueChange={(v) => setSelectedLocale(v as AppLocale)}
        >
          <SelectTrigger className="w-45">
            <SelectValue placeholder="Language" />
          </SelectTrigger>
          <SelectContent>
            {APP_LOCALES.map((locale) => (
              <SelectItem key={locale} value={locale}>
                {locale === 'zh' ? '繁體中文 (zh)' : 'English (en)'}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-md border p-4">
        <div className="grid gap-3">
          <Label htmlFor="bio">個人簡介 ({selectedLocale})</Label>
          <Textarea
            id="bio"
            rows={6}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="輸入個人簡介..."
          />
        </div>

        <div className="grid gap-3">
          <Label>大頭貼照</Label>
          <div className="flex items-start gap-4">
            {currentImageUrl && (
              <div className="relative h-32 w-32 overflow-hidden rounded-full border">
                <Image
                  src={currentImageUrl}
                  alt="Profile"
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="space-y-2">
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              <p className="text-muted-foreground text-xs">
                支援 JPG, PNG, WEBP
              </p>
            </div>
          </div>
        </div>

        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          儲存變更
        </Button>
      </form>
    </div>
  )
}
