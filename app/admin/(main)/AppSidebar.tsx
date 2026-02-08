import { BookOpen, FileText, FolderKanban, Image, Users } from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/admin/ui/sidebar'

import { LogoutButton } from './LogoutButton'

const navData = [
  {
    title: '內容管理',
    items: [
      {
        title: 'Illustration',
        url: '/admin/illustration',
        icon: Image
      },
      {
        title: 'Manga',
        url: '/admin/manga',
        icon: BookOpen
      },
      {
        title: 'Project',
        url: '/admin/project',
        icon: FolderKanban
      },
      {
        title: 'About',
        url: '/admin/about',
        icon: FileText
      }
    ]
  },
  {
    title: '會員管理',
    items: [
      {
        title: '帳號管理',
        url: '/admin/users',
        icon: Users
      }
    ]
  }
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <h2 className='text-xl font-bold p-2'>Lin ChaoYu Admin</h2>
      </SidebarHeader>
      <SidebarContent>
        {navData.map(group => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map(item => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <LogoutButton />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
