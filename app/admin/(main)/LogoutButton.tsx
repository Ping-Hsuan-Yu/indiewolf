'use client'

import { useRouter } from 'next/navigation'

import { createClient } from '@/utils/supabase/client'

import { LogOut } from 'lucide-react'

import { SidebarMenuButton } from '@/components/admin/ui/sidebar'

export function LogoutButton() {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.refresh() // Clear server session cache
    router.replace('/admin/login')
  }

  return (
    <SidebarMenuButton
      onClick={handleLogout}
      className='text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer'>
      <LogOut />
      <span>Log out</span>
    </SidebarMenuButton>
  )
}
