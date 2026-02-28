'use client'

import { useState } from 'react'

import { getMangaWorksByStatusAction } from '@/app/_actions/admin/manga'
import { Tables } from '@/types/database.types'

import { Button } from '@/components/admin/ui/button'
import { Label } from '@/components/admin/ui/label'
import { Switch } from '@/components/admin/ui/switch'

import { AddMangaSheet } from './AddMangaSheet'
import { MangaGrid } from './MangaGrid'
import { MangaGridSkeleton } from './MangaGridSkeleton'

type MangaStatus = 'ongoing' | 'completed'

const STATUS_OPTIONS: { value: MangaStatus; label: string }[] = [
  { value: 'ongoing', label: '連載中' },
  { value: 'completed', label: '連載結束' },
]

interface ClientPageProps {
  years: string[]
  initialWorks: Tables<'manga_works'>[]
}

export function ClientPage({ years, initialWorks }: ClientPageProps) {
  const [selectedStatus, setSelectedStatus] = useState<MangaStatus>('ongoing')
  const [works, setWorks] = useState<Tables<'manga_works'>[]>(initialWorks)
  const [loading, setLoading] = useState(false)
  const [isReorderMode, setIsReorderMode] = useState(false)

  const handleStatusChange = async (status: MangaStatus) => {
    setSelectedStatus(status)
    setLoading(true)
    try {
      const newWorks = await getMangaWorksByStatusAction(status === 'completed')
      setWorks(newWorks)
    } catch (error) {
      console.error(error)
      alert('Failed to fetch works')
    } finally {
      setLoading(false)
    }
  }

  const handleUploadSuccess = async () => {
    // Refresh current tab data
    const refreshed = await getMangaWorksByStatusAction(
      selectedStatus === 'completed'
    )
    setWorks(refreshed)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {STATUS_OPTIONS.map((option) => (
            <Button
              key={option.value}
              variant={selectedStatus === option.value ? 'default' : 'outline'}
              onClick={() => handleStatusChange(option.value)}
              className="min-w-16"
            >
              {option.label}
            </Button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="reorder-mode"
              checked={isReorderMode}
              onCheckedChange={setIsReorderMode}
            />
            <Label htmlFor="reorder-mode">排序模式</Label>
          </div>
          <AddMangaSheet years={years} onUploadSuccess={handleUploadSuccess} />
        </div>
      </div>

      {loading ? (
        <MangaGridSkeleton />
      ) : (
        <MangaGrid
          works={works}
          onDelete={(id) => setWorks((prev) => prev.filter((w) => w.id !== id))}
          isReorderMode={isReorderMode}
          onReorder={setWorks}
        />
      )}
    </div>
  )
}
