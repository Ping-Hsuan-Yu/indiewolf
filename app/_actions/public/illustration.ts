'use server'

import { supabase } from '@/lib/supabase'

import type { Tables } from '@/types/database.types'

export type IllustrationWork = Tables<'illustration_works'>

export async function getIllustrationYears(): Promise<string[]> {
  const { data } = await supabase.rpc('get_distinct_years')
  return (data || []).map((item: { year: string }) => item.year)
}

export async function getIllustrationWorks(year: string): Promise<IllustrationWork[]> {
  const { data } = await supabase
    .from('illustration_works')
    .select('*, src:public_id')
    .eq('year', year)
    .eq('is_active', true)
    .order('order_index', { ascending: true })
  console.log(data)
  return data || []
}
