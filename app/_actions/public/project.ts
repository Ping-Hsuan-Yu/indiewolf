'use server'

import { supabase } from '@/lib/supabase'
import type { Tables } from '@/types/database.types'

export type ProjectWork = Tables<'project_works'> & {
  images?: ProjectImage[]
}

export type ProjectImage = Tables<'project_images'>

export async function getProjects(): Promise<ProjectWork[]> {
  const { data, error } = await supabase
    .from('project_works')
    .select('*')
    .eq('is_active', true)
    .order('order_index', { ascending: false })

  if (error) {
    console.error('getProjects error:', error)
    return []
  }

  console.log('Projects fetched:', data?.length)
  return (data || []) as ProjectWork[]
}

export async function getProjectBySlug(slug: string): Promise<ProjectWork | null> {
  const { data } = await supabase
    .from('project_works')
    .select(
      `
      *,
      images:project_images(id, url, order_index, width, height)
    `
    )
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (data?.images) {
    // Ensure images are sorted by order_index
    data.images.sort((a: ProjectImage, b: ProjectImage) => (a.order_index || 0) - (b.order_index || 0))
  }

  return data as ProjectWork | null
}
