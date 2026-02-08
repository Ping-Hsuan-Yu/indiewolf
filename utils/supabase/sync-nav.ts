import { createClient } from '@/utils/supabase/server'

/**
 * 同步 illustration 年份到 nav_items
 */
export async function syncIllustrationNav() {
  const supabase = await createClient()
  const { error } = await supabase.rpc('sync_illustration_nav')
  if (error) {
    console.error('Failed to sync illustration nav:', error)
    throw error
  }
}

/**
 * 同步 manga 年份到 nav_items
 */
export async function syncMangaNav() {
  const supabase = await createClient()
  const { error } = await supabase.rpc('sync_manga_nav')
  if (error) {
    console.error('Failed to sync manga nav:', error)
    throw error
  }
}

/**
 * 同步 project slugs 到 nav_items
 */
export async function syncProjectNav() {
  const supabase = await createClient()
  const { error } = await supabase.rpc('sync_project_nav')
  if (error) {
    console.error('Failed to sync project nav:', error)
    throw error
  }
}

/**
 * 一次同步所有 nav items (illustration + manga + project)
 */
export async function syncAllNavItems() {
  const supabase = await createClient()
  const { error } = await supabase.rpc('sync_all_nav_items')
  if (error) {
    console.error('Failed to sync all nav items:', error)
    throw error
  }
}
