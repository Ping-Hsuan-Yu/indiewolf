'use server'

import { supabase } from '@/lib/supabase'

import type { Tables } from '@/types/database.types'

export type Webtoon = Tables<'webtoon_works'>

export async function getWebtoons(): Promise<Webtoon[]> {
  const { data } = await supabase
    .from('webtoon_works')
    .select('*')
    .eq('is_active', true)
    .order('order_index', { ascending: true })

  return (data || []) as Webtoon[]
}
