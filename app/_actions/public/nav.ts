'use server'

import { supabase } from '@/lib/supabase'
import { buildTree } from '@/lib/nav-tree'

export type { NavItem } from '@/lib/nav-tree'

export async function getNavItems() {
  const { data, error } = await supabase
    .from('nav_items')
    .select('*')
    .eq('is_active', true)
    .order('order_index')

  if (error) {
    console.error('Error fetching nav items:', error)
    throw new Error(`Failed to load nav items: ${error.message}`)
  }

  return buildTree(data || [])
}
