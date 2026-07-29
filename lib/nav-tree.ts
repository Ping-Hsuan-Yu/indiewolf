import type { Tables } from '@/types/database.types'

export type NavItem = Omit<
  Tables<'nav_items'>,
  'parent_id' | 'is_active' | 'created_at' | 'updated_at'
> & {
  children?: NavItem[]
}

// Builds a two-level nav tree from flat nav_items rows. Extracted from nav.ts (a
// 'use server' module, which can only export async functions) so it can be unit-tested
// (MAINT-4). Children whose parent_id points at a missing/inactive item are dropped.
export function buildTree(items: any[]): NavItem[] {
  const itemMap = new Map<string, NavItem>()
  const rootItems: NavItem[] = []

  // First pass: create all items
  items.forEach((item) => {
    itemMap.set(item.id, {
      id: item.id,
      key: item.key,
      href: item.href,
      order_index: item.order_index,
      children: [],
    })
  })

  // Second pass: build tree
  items.forEach((item) => {
    const navItem = itemMap.get(item.id)!

    if (item.parent_id) {
      // Is a child item
      const parent = itemMap.get(item.parent_id)
      if (parent) {
        parent.children!.push(navItem)
      }
    } else {
      // Is a root item
      rootItems.push(navItem)
    }
  })

  // Sort children by order_index
  rootItems.forEach((item) => {
    if (item.children && item.children.length > 0) {
      item.children.sort((a, b) => a.order_index - b.order_index)
    }
  })

  return rootItems.sort((a, b) => a.order_index - b.order_index)
}
