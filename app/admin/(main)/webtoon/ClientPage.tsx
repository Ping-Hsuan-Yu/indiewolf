'use client'

import { useState } from 'react'

import { getWebtoonsAction } from '@/app/_actions/admin/webtoon'
import { Tables } from '@/types/database.types'

import { Label } from '@/components/admin/ui/label'
import { Switch } from '@/components/admin/ui/switch'

import { AddWebtoonSheet } from './AddWebtoonSheet'
import { WebtoonGrid } from './WebtoonGrid'

interface ClientPageProps {
  initialWorks: Tables<'webtoon_works'>[]
}

export function ClientPage({ initialWorks }: ClientPageProps) {
  const [works, setWorks] = useState<Tables<'webtoon_works'>[]>(initialWorks)
  const [isReorderMode, setIsReorderMode] = useState(false)

  const handleUploadSuccess = async () => {
    const refreshed = await getWebtoonsAction()
    setWorks(refreshed)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="reorder-mode"
              checked={isReorderMode}
              onCheckedChange={setIsReorderMode}
            />
            <Label htmlFor="reorder-mode">排序模式</Label>
          </div>
          <AddWebtoonSheet onUploadSuccess={handleUploadSuccess} />
        </div>
      </div>

      <WebtoonGrid
        works={works}
        onDelete={(id) => setWorks((prev) => prev.filter((w) => w.id !== id))}
        isReorderMode={isReorderMode}
        onReorder={setWorks}
      />
    </div>
  )
}
