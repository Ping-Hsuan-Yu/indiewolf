import { supabase } from '@/lib/supabase'

export type BookWork = {
  id: string
  year: string
  title_zh: string | null
  title_en: string | null
  summary_zh: string | null
  summary_en: string | null
  cover_url: string
  width: number | null
  height: number | null
  order_index: number
}

export async function getBooksWorks(): Promise<BookWork[]> {
  const { data } = await supabase
    .from('books_works')
    .select('*')
    .eq('is_active', true)
    .order('year', { ascending: false })
    .order('order_index', { ascending: true })

  return (data || []) as BookWork[]
}
