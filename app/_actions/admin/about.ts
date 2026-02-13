'use server'

import { revalidatePath } from 'next/cache'

import cloudinary from '@/lib/cloudinary'
import { AppLocale, toDatabaseLocale } from '@/lib/i18n/config'

import { getAuthorizedAdminClient } from '../common'

import type { Tables, TablesInsert, TablesUpdate } from '@/types/database.types'

// -- Types --

export type SocialLink = Tables<'social_links'>
export type AboutProfile = Tables<'about_profiles'>

export type AdminAboutPageData = {
  profiles: AboutProfile[]
  socialLinks: SocialLink[]
}

// -- Fetch Data --

export async function getAdminAboutPageData(): Promise<AdminAboutPageData> {
  const supabase = await getAuthorizedAdminClient()

  // Fetch all profiles (for all locales)
  const { data: profiles, error: profilesError } = await supabase
    .from('about_profiles')
    .select('*')

  if (profilesError) {
    console.error('Error fetching about profiles:', profilesError)
    throw new Error('Failed to fetch about profiles')
  }

  // Fetch all social links
  const { data: socialLinks, error: linksError } = await supabase
    .from('social_links')
    .select('*')
    .order('sort_order', { ascending: true })

  if (linksError) {
    console.error('Error fetching social links:', linksError)
    throw new Error('Failed to fetch social links')
  }

  return {
    profiles: profiles || [],
    socialLinks: socialLinks || []
  }
}

// -- About Profile Actions --

export async function updateAboutProfile(locale: AppLocale, formData: FormData) {
  const supabase = await getAuthorizedAdminClient()
  const bio = formData.get('bio') as string
  const imageFile = formData.get('profile_image') as File | null
  
  const dbLocale = toDatabaseLocale(locale)

  let profileImageUrl = formData.get('existing_profile_image_url') as string
  
  // Handle Image Upload if provided
  if (imageFile && imageFile.size > 0) {
    try {
      const arrayBuffer = await imageFile.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      const uploadResult: any = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: 'about_profile' },
          (error, result) => {
            if (error) reject(error)
            else resolve(result)
          }
        ).end(buffer)
      })

      profileImageUrl = uploadResult.secure_url
    } catch (error) {
      console.error('Image upload failed:', error)
      return { success: false, error: 'Failed to upload image' }
    }
  }

  // Upsert profile based on locale
  const upsertData: TablesInsert<'about_profiles'> = {
    locale: dbLocale,
    bio,
    profile_image_url: profileImageUrl,
    updated_at: new Date().toISOString()
  }
  const { error } = await supabase
    .from('about_profiles')
    .upsert(upsertData, { onConflict: 'locale' })

  if (error) {
    console.error('Profile update failed:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/about')
  revalidatePath('/about') // Revalidate public page too
  return { success: true }
}

// -- Social Link Actions --

export async function createSocialLink(formData: FormData) {
  const supabase = await getAuthorizedAdminClient()
  const label = formData.get('label') as string
  const url = formData.get('url') as string
  const file = formData.get('logo') as File

  if (!label || !url || !file) {
    return { success: false, error: 'Missing required fields' }
  }

  // Upload Logo
  let logoUrl = ''
  try {
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    
    const uploadResult: any = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: 'social_icons' },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }
      ).end(buffer)
    })
    
    logoUrl = uploadResult.secure_url
  } catch (error) {
    console.error('Logo upload failed:', error)
    return { success: false, error: 'Failed to upload logo' }
  }

  // Get max sort order to append to end
  const { data: maxOrderData } = await supabase
    .from('social_links')
    .select('sort_order')
    .order('sort_order', { ascending: false })
    .limit(1)
    .single()

  const nextOrder = (maxOrderData?.sort_order ?? 0) + 1

  const insertData: TablesInsert<'social_links'> = {
    label,
    url,
    logo_url: logoUrl,
    sort_order: nextOrder,
    is_active: true
  }
  const { error } = await supabase
    .from('social_links')
    .insert(insertData)

  if (error) {
    console.error('Create social link failed:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/about')
  revalidatePath('/about')
  return { success: true }
}

export async function updateSocialLink(id: string, formData: FormData) {
  const supabase = await getAuthorizedAdminClient()
  const label = formData.get('label') as string
  const url = formData.get('url') as string
  const file = formData.get('logo') as File | null
  
  const updates: TablesUpdate<'social_links'> = { label, url }

  if (file && file.size > 0) {
    try {
      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      
      const uploadResult: any = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: 'social_icons' },
          (error, result) => {
            if (error) reject(error)
            else resolve(result)
          }
        ).end(buffer)
      })
      
      updates.logo_url = uploadResult.secure_url
    } catch (error) {
      return { success: false, error: 'Failed to upload logo' }
    }
  }

  const { error } = await supabase
    .from('social_links')
    .update(updates)
    .eq('id', id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/about')
  revalidatePath('/about')
  return { success: true }
}

export async function deleteSocialLink(id: string) {
  const supabase = await getAuthorizedAdminClient()
  const { error } = await supabase
    .from('social_links')
    .delete()
    .eq('id', id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/about')
  revalidatePath('/about')
  return { success: true }
}

export async function toggleSocialLinkActive(id: string, isActive: boolean) {
  const supabase = await getAuthorizedAdminClient()
  const { error } = await supabase
    .from('social_links')
    .update({ is_active: isActive })
    .eq('id', id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/about')
  revalidatePath('/about')
  return { success: true }
}

export async function updateSocialLinksOrder(items: { id: string; sort_order: number }[]) {
  const supabase = await getAuthorizedAdminClient()
  
  const updates = items.map(item => 
    supabase
      .from('social_links')
      .update({ sort_order: item.sort_order })
      .eq('id', item.id)
  )

  await Promise.all(updates)

  revalidatePath('/admin/about')
  revalidatePath('/about')
  return { success: true }
}
