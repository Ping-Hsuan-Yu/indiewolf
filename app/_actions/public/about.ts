'use server'

import { toDatabaseLocale, AppLocale } from '@/lib/i18n/config'
import { supabase } from '@/lib/supabase'

import type { Tables } from '@/types/database.types'

export type SocialLink = {
  id: string
  label: string
  url: string
  logo: string
  sortOrder: number
}

export type AboutProfile = Tables<'about_profiles'>

export type AboutPageData = {
  bio: string
  profileImage: string
  contactLinks: SocialLink[]
}

export async function getAboutPageData(locale: AppLocale): Promise<AboutPageData> {
  const dbLocale = toDatabaseLocale(locale)

  const { data: profile } = await supabase
    .from('about_profiles')
    .select('bio, profile_image_url')
    .eq('locale', dbLocale)
    .single()

  const { data: links } = await supabase
    .from('social_links')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  return {
    bio: profile?.bio || '',
    profileImage: profile?.profile_image_url,
    contactLinks: (links || []).map(link => ({
      id: link.id,
      label: link.label,
      url: link.url,
      logo: link.logo_url,
      sortOrder: link.sort_order
    }))
  }
}
