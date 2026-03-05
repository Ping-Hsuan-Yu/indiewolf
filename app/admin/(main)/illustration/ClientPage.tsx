'use client'

import { useState } from 'react'

import { getIllustrationWorksAction } from '@/app/_actions/admin/illustration'
import { IllustrationWork } from '@/app/_actions/public/illustration'

import { Button } from '@/components/admin/ui/button'
import { Label } from '@/components/admin/ui/label'
import { Switch } from '@/components/admin/ui/switch'

import { AddIllustrationSheet } from './AddIllustrationSheet'
import { IllustrationGrid } from './IllustrationGrid'
import { IllustrationGridSkeleton } from './IllustrationGridSkeleton'

interface ClientPageProps {
  years: string[]
  initialWorks: IllustrationWork[]
  initialYear: string
}

export function ClientPage({
  years,
  initialWorks,
  initialYear,
}: ClientPageProps) {
  const [selectedYear, setSelectedYear] = useState(initialYear)
  const [works, setWorks] = useState<IllustrationWork[]>(initialWorks)
  const [loading, setLoading] = useState(false)
  const [isReorderMode, setIsReorderMode] = useState(false)

  const handleYearChange = async (year: string) => {
    setSelectedYear(year)
    setLoading(true)
    try {
      const newWorks = await getIllustrationWorksAction(year)
      setWorks(newWorks)
    } catch (error) {
      console.error(error)
      alert('Failed to fetch works')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {years.map((year) => (
            <Button
              key={year}
              variant={selectedYear === year ? 'default' : 'outline'}
              onClick={() => handleYearChange(year)}
              className="min-w-16"
            >
              {year}
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
          <AddIllustrationSheet
            years={years}
            onUploadSuccess={(year) => handleYearChange(year)}
          />
        </div>
      </div>

      {loading ? (
        <IllustrationGridSkeleton />
      ) : (
        <IllustrationGrid
          works={works}
          onDelete={(id) => setWorks((prev) => prev.filter((w) => w.id !== id))}
          isReorderMode={isReorderMode}
          onReorder={setWorks}
        />
      )}
    </div>
  )
}
