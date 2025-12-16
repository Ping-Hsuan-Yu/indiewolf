import { supabase } from '@/lib/supabase'

export type MangaWork = {
  id: string
  year: string
  title_zh: string | null
  title_en: string | null
  summary_zh: string | null
  summary_en: string | null
  cover_url: string | null
  order_index: number
  images?: MangaImage[]
}

export type MangaImage = {
  id: string
  url: string
  order_index: number
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
      images:manga_images(id, url, order_index)
    `
    )
    .eq('year', year)
    .eq('is_active', true)
    .order('order_index', { ascending: true })
    .order('order_index', { foreignTable: 'manga_images', ascending: true }) // Ensure images are sorted

  return (data || []) as MangaWork[]
}
