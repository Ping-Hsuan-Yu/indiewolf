'use server'

import { supabase } from '@/lib/supabase'
import type { Tables } from '@/types/database.types'

export type MangaWork = Tables<'manga_works'> & {
  images: MangaImage[]
  src: string
}

export type MangaImage = Tables<'manga_images'> & {
  src: string
}

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
      images:manga_images(id, url, order_index, width, height, src:public_id)
    `
    )
    .eq('year', year)
    .eq('is_active', true)
    .order('order_index', { ascending: true })

  console.log(data)

  return (data || []) as MangaWork[]
}
