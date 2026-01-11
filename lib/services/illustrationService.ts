import { supabase } from '@/lib/supabase'

export type IllustrationWork = {
  id: string
  url: string
  alt: string | null
  year: string
  order_index: number
  width: number
  height: number
}

// 可能沒用
export async function getIllustrationYears(): Promise<string[]> {
  const { data } = await supabase.rpc('get_distinct_years')
  return (data || []).map((item: { year: string }) => item.year)
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
