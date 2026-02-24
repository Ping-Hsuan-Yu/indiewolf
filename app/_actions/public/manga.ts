'use server'

import { supabase } from '@/lib/supabase'

import type { Tables } from '@/types/database.types'

export type MangaWork = Tables<'manga_works'> & {
  images: MangaImage[]
}

export type MangaImage = Tables<'manga_images'>

export async function getMangaYears(): Promise<string[]> {
  const { data } = await supabase
    .from('manga_works')
    .select('year')
    .eq('is_active', true)
    .order('year', { ascending: false })

  // Deduplicate years and sort descending
  const years = Array.from(new Set((data || []).map(item => item.year)))
  return years.sort((a, b) => Number(b) - Number(a))
}

export async function getMangaWorks(year: string): Promise<MangaWork[]> {
  const { data } = await supabase
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

  console.log(data)

  return (data || []) as MangaWork[]
}

export async function getMangaWorksByStatus(status: 'ongoing' | 'completed'): Promise<MangaWork[]> {
  const isCompleted = status === 'completed'

  const { data } = await supabase
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

  return (data || []) as MangaWork[]
}
