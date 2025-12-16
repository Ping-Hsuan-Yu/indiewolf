import { supabase } from '@/lib/supabase'

export type ProjectWork = {
  id: string
  slug: string
  title_zh: string | null
  title_en: string | null
  subtitle_zh: string | null
  subtitle_en: string | null
  summary_zh: string | null
  summary_en: string | null
  description_zh: string | null
  description_en: string | null
  cover_url: string | null
  order_index: number
  images?: ProjectImage[]
}

export type ProjectImage = {
  id: string
  url: string
  order_index: number
}

export async function getProjects(): Promise<ProjectWork[]> {
  const { data, error } = await supabase
    .from('project_works')
    .select('*')
    .eq('is_active', true)
    .order('order_index', { ascending: true })

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
      images:project_images(id, url, order_index)
    `
    )
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (data?.images) {
    // Ensure images are sorted by order_index
    data.images.sort((a: ProjectImage, b: ProjectImage) => a.order_index - b.order_index)
  }

  return data as ProjectWork | null
}
