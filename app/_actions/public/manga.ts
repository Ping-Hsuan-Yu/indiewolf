'use server'

import { supabase } from '@/lib/supabase'

import type { Tables } from '@/types/database.types'

export type MangaWork = Tables<'manga_works'> & {
  images: MangaImage[]
}

export type MangaImage = Tables<'manga_images'>

export async function getMangaYears(): Promise<string[]> {
  const { data, error } = await supabase
    .from('manga_works')
    .select('year')
    .eq('is_active', true)
    .order('year', { ascending: false })

  if (error) {
    console.error('getMangaYears error:', error)
    throw new Error(`Failed to load manga years: ${error.message}`)
  }

  // Deduplicate years and sort descending
  const years = Array.from(new Set((data || []).map((item) => item.year)))
  return years.sort((a, b) => Number(b) - Number(a))
}

export async function getMangaWorks(year: string): Promise<MangaWork[]> {
  const { data, error } = await supabase
    .from('manga_works')
    .select(
      `
      *,
      src:public_id,
      images:manga_images(id, url, locale, order_index, width, height, src:public_id)
    `
    )
    .eq('year', year)
    .eq('is_active', true)
    .order('order_index', { ascending: true })
    .order('order_index', { referencedTable: 'manga_images', ascending: true })

  if (error) {
    console.error('getMangaWorks error:', error)
    throw new Error(`Failed to load manga works: ${error.message}`)
  }

  // ponytail: cast needed — `src:public_id` is a PostgREST computed column backed by
  // a DB function not present in the generated types (DATA-1). Drop the cast once
  // types are regenerated from prod (BUILD-3).
  return (data ?? []) as unknown as MangaWork[]
}

export async function getMangaWorksByStatus(
  status: 'ongoing' | 'completed'
): Promise<MangaWork[]> {
  const isCompleted = status === 'completed'

  const { data, error } = await supabase
    .from('manga_works')
    .select(
      `
      *,
      src:public_id,
      images:manga_images(id, url, locale, order_index, width, height, src:public_id)
    `
    )
    .eq('is_completed', isCompleted)
    .eq('is_active', true)
    .order('order_index', { ascending: true })
    .order('order_index', { referencedTable: 'manga_images', ascending: true })

  if (error) {
    console.error('getMangaWorksByStatus error:', error)
    throw new Error(`Failed to load manga works: ${error.message}`)
  }

  return (data ?? []) as unknown as MangaWork[]
}
