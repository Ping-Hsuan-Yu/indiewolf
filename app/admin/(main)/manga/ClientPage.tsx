'use client'

import { useState } from 'react'
import { getMangaWorksAction } from '@/app/_actions/admin/manga'
import { Button } from '@/components/admin/ui/button'
import { AddMangaSheet } from './AddMangaSheet'
import { Switch } from '@/components/admin/ui/switch'
import { Label } from '@/components/admin/ui/label'
import { MangaGrid } from './MangaGrid'
import { MangaWork } from '@/app/_actions/public/manga'
import { MangaGridSkeleton } from './MangaGridSkeleton'

interface ClientPageProps {
  years: string[]
  initialWorks: MangaWork[]
  initialYear: string
}

export function ClientPage({ years, initialWorks, initialYear }: ClientPageProps) {
  const [selectedYear, setSelectedYear] = useState(initialYear)
  const [works, setWorks] = useState<MangaWork[]>(initialWorks)
  const [loading, setLoading] = useState(false)
  const [isReorderMode, setIsReorderMode] = useState(false)

  const handleYearChange = async (year: string) => {
    setSelectedYear(year)
    setLoading(true)
    try {
      const newWorks = await getMangaWorksAction(year)
      setWorks(newWorks)
    } catch (error) {
      console.error(error)
      alert('Failed to fetch works')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='space-y-6'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div className='flex flex-wrap gap-2'>
          {years.map(year => (
            <Button
              key={year}
              variant={selectedYear === year ? 'default' : 'outline'}
              onClick={() => handleYearChange(year)}
              className='min-w-16'>
              {year}
            </Button>
          ))}
        </div>

        <div className='flex items-center gap-4'>
          <div className='flex items-center space-x-2'>
            <Switch id='reorder-mode' checked={isReorderMode} onCheckedChange={setIsReorderMode} />
            <Label htmlFor='reorder-mode'>排序模式</Label>
          </div>
          <AddMangaSheet years={years} onUploadSuccess={year => handleYearChange(year)} />
        </div>
      </div>

      {loading ? (
        <MangaGridSkeleton />
      ) : (
        <MangaGrid
          works={works}
          onDelete={id => setWorks(prev => prev.filter(w => w.id !== id))}
          isReorderMode={isReorderMode}
          onReorder={setWorks}
        />
      )}
    </div>
  )
}
