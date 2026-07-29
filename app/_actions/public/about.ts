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

export async function getAboutPageData(
  locale: AppLocale
): Promise<AboutPageData> {
  const dbLocale = toDatabaseLocale(locale)

  const { data: profile, error: profileError } = await supabase
    .from('about_profiles')
    .select('bio, profile_image_url')
    .eq('locale', dbLocale)
    .single()

  // PGRST116 = no matching row (a legitimate empty state); anything else is a real
  // query failure that should surface to the error boundary (AVAIL-2).
  if (profileError && profileError.code !== 'PGRST116') {
    console.error('getAboutPageData profile error:', profileError)
    throw new Error(`Failed to load about profile: ${profileError.message}`)
  }

  const { data: links, error: linksError } = await supabase
    .from('social_links')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  if (linksError) {
    console.error('getAboutPageData links error:', linksError)
    throw new Error(`Failed to load social links: ${linksError.message}`)
  }

  return {
    bio: profile?.bio || '',
    profileImage: profile?.profile_image_url ?? '',
    contactLinks: (links || []).map((link) => ({
      id: link.id,
      label: link.label,
      url: link.url,
      logo: link.logo_url,
      sortOrder: link.sort_order ?? 0,
    })),
  }
}
