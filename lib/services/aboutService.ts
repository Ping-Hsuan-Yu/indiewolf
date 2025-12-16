import { supabase } from '@/lib/supabase'
import { toDatabaseLocale, AppLocale } from '@/lib/i18n/config'

export type SocialLink = {
  id: string
  label: string
  url: string
  logo: string
  sortOrder: number
}

export type AboutPageData = {
  bio: string
  profileImage: string
  contactLinks: SocialLink[]
}

export const AboutService = {
  async getPageData(locale: AppLocale): Promise<AboutPageData> {
    const dbLocale = toDatabaseLocale(locale)

    // 1. Fetch Profile for Locale
    const { data: profile } = await supabase
      .from('about_profiles')
      .select('bio, profile_image_url')
      .eq('locale', dbLocale)
      .single()

    // 2. Fetch Social Links (shared across all locales for now)
    const { data: links } = await supabase
      .from('social_links')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })

    return {
      bio: profile?.bio || '',
      profileImage: profile?.profile_image_url || '/assets/about.jpg',
      contactLinks: (links || []).map(link => ({
        id: link.id,
        label: link.label,
        url: link.url,
        logo: link.logo_url,
        sortOrder: link.sort_order
      }))
    }
  }
}
