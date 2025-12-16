import { supabase } from '@/lib/supabase'

export type IllustrationWork = {
  id: string
  url: string
  alt: string | null
  year: string
  width: number | null
  height: number | null
  order_index: number
}

export async function getIllustrationYears(): Promise<string[]> {
  const { data } = await supabase
    .from('illustration_works')
    .select('year')
    .eq('is_active', true)
    .order('year', { ascending: false })

  // Deduplicate years
  const years = Array.from(new Set((data || []).map(item => item.year)))
  return years
}

export async function getIllustrationWorks(year: string): Promise<IllustrationWork[]> {
  const { data } = await supabase
    .from('illustration_works')
    .select('*')
    .eq('year', year)
    .eq('is_active', true)
    .order('order_index', { ascending: true })

  return (data || []) as IllustrationWork[]
}
