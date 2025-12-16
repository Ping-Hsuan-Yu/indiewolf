import { supabase } from '@/lib/supabase';

export type NavItem = {
    id: string;
    key: string;
    href: string | null;
    order_index: number;
    children?: NavItem[];
};

export const NavService = {
    async getNavItems(): Promise<NavItem[]> {
        const { data, error } = await supabase
            .from('nav_items')
            .select('*')
            .eq('is_active', true)
            .order('order_index');

        if (error) {
            console.error('Error fetching nav items:', error);
            return [];
        }

        // Build tree structure from flat list
        return buildTree(data || []);
    }
};

function buildTree(items: any[]): NavItem[] {
    const itemMap = new Map<string, NavItem>();
    const rootItems: NavItem[] = [];

    // First pass: create all items
    items.forEach(item => {
        itemMap.set(item.id, {
            id: item.id,
            key: item.key,
            href: item.href,
            order_index: item.order_index,
            children: []
        });
    });

    // Second pass: build tree
    items.forEach(item => {
        const navItem = itemMap.get(item.id)!;

        if (item.parent_id) {
            // Is a child item
            const parent = itemMap.get(item.parent_id);
            if (parent) {
                parent.children!.push(navItem);
            }
        } else {
            // Is a root item
            rootItems.push(navItem);
        }
    });

    // Sort children by order_index
    rootItems.forEach(item => {
        if (item.children && item.children.length > 0) {
            item.children.sort((a, b) => a.order_index - b.order_index);
        }
    });

    return rootItems.sort((a, b) => a.order_index - b.order_index);
}
