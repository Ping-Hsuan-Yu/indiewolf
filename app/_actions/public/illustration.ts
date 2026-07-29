'use server'

import { supabase } from '@/lib/supabase'

import type { Tables } from '@/types/database.types'

export type IllustrationWork = Tables<'illustration_works'>

export async function getIllustrationYears(): Promise<string[]> {
  const { data, error } = await supabase.rpc('get_distinct_years')
  if (error) {
    console.error('getIllustrationYears error:', error)
    throw new Error(`Failed to load illustration years: ${error.message}`)
  }
  return (data || []).map((item: { year: string }) => item.year)
}

export async function getIllustrationWorks(
  year: string
): Promise<IllustrationWork[]> {
  const { data, error } = await supabase
    .from('illustration_works')
    .select('*, src:public_id')
    .eq('year', year)
    .eq('is_active', true)
    .order('order_index', { ascending: true })
  if (error) {
    console.error('getIllustrationWorks error:', error)
    throw new Error(`Failed to load illustration works: ${error.message}`)
  }
  // ponytail: cast needed — `src:public_id` is a PostgREST computed column backed by
  // a DB function not present in the generated types (DATA-1). Drop the cast once
  // types are regenerated from prod (BUILD-3).
  return (data ?? []) as unknown as IllustrationWork[]
}
