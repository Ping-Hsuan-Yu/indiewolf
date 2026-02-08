'use client'

import { CSS } from '@dnd-kit/utilities'
import { useSortable } from '@dnd-kit/sortable'

import { deleteSocialLink, SocialLink, toggleSocialLinkActive } from '@/app/_actions/admin/about'

import { ExternalLink, GripVertical, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { toast } from 'sonner'

import { Button } from '@/components/admin/ui/button'
import { Switch } from '@/components/admin/ui/switch'

import { EditSocialLinkDialog } from './EditSocialLinkDialog'

interface SocialLinkItemProps {
  link: SocialLink
}

export function SocialLinkItem({ link }: SocialLinkItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: link.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  const handleDelete = async () => {
    if (!confirm('確定要刪除此連結嗎？')) return

    try {
      const res = await deleteSocialLink(link.id)
      if (res.success) {
        toast.success('刪除成功')
      } else {
        toast.error('刪除失敗: ' + res.error)
      }
    } catch (error) {
      toast.error('發生錯誤')
    }
  }

  const handleToggle = async (checked: boolean) => {
    try {
      const res = await toggleSocialLinkActive(link.id, checked)
      if (res.success) {
        toast.success(checked ? '已啟用' : '已停用')
      } else {
        toast.error('更新失敗')
      }
    } catch (error) {
      toast.error('發生錯誤')
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className='flex items-center gap-4 border p-4 rounded-md bg-white dark:bg-zinc-950'>
      <div
        {...attributes}
        {...listeners}
        className='cursor-grab text-muted-foreground hover:text-foreground'>
        <GripVertical className='h-5 w-5' />
      </div>

      <div className='flex items-center gap-3'>
        {link.logo_url && (
          <div className='relative h-10 w-10 overflow-hidden rounded-md border'>
            <Image src={link.logo_url} alt={link.label} fill className='object-cover' />
          </div>
        )}
      </div>

      <div className='flex-1 grid gap-1'>
        <div className='font-medium flex items-center gap-2'>{link.label}</div>
        <div className='text-sm text-muted-foreground truncate max-w-75'>
          <a
            href={link.url}
            target='_blank'
            rel='noopener noreferrer'
            className='hover:underline flex items-center gap-1'>
            {link.url}
            <ExternalLink className='h-3 w-3' />
          </a>
        </div>
      </div>

      <div className='flex items-center gap-4'>
        <div className='flex items-center gap-2'>
          <span className='text-sm text-muted-foreground'>{link.is_active ? '啟用' : '停用'}</span>
          <Switch checked={link.is_active ?? false} onCheckedChange={handleToggle} />
        </div>

        <EditSocialLinkDialog link={link} />

        <Button size='icon' destructive onClick={handleDelete}>
          <Trash2 className='h-4 w-4' />
        </Button>
      </div>
    </div>
  )
}
