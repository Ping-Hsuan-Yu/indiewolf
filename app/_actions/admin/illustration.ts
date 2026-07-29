'use server'

import { revalidatePath } from 'next/cache'

import { deleteCloudinaryImage, uploadToCloudinary } from '@/lib/cloudinary'
import { createClient } from '@/utils/supabase/server'

import { getAuthorizedAdminClient } from '../common'

import type { TablesInsert, TablesUpdate } from '@/types/database.types'

export async function createIllustration(formData: FormData) {
  const year = formData.get('year') as string
  const alt = formData.get('alt') as string
  const file = formData.get('image') as File

  if (!file || !year) {
    return { success: false, error: 'Missing required fields' }
  }

  // MAINT-3: report failure via { success, error } (not throw) for a consistent
  // call-site contract; upload/auth errors are caught here too.
  try {
    const supabase = await getAuthorizedAdminClient()
    const uploadResult = await uploadToCloudinary(file, 'indiewolf/illustration')

    const insertData: TablesInsert<'illustration_works'> = {
      url: uploadResult.secure_url,
      alt: alt || '',
      year,
      width: uploadResult.width,
      height: uploadResult.height,
      order_index: 0,
    }
    const { error } = await supabase
      .from('illustration_works')
      .insert(insertData)

    if (error) {
      console.error('Database Error:', error)
      return { success: false, error: 'Failed to create illustration' }
    }

    revalidatePath('/admin/illustration')
    revalidatePath('/[locale]/(public)/illustration', 'layout')
    return { success: true }
  } catch (error) {
    console.error('Create illustration error:', error)
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to create illustration',
    }
  }
}

export async function updateIllustrationAlt(id: string, alt: string) {
  const supabaseAdmin = await getAuthorizedAdminClient()
  const updateData: TablesUpdate<'illustration_works'> = { alt }
  const { data, error } = await supabaseAdmin
    .from('illustration_works')
    .update(updateData)
    .eq('id', id)
    .select()

  if (error) {
    console.error('Update Error:', error)
    return { success: false, error: error.message }
  }

  // Optional: check if data is empty, meaning no row was updated (id mismatch?)
  if (!data || data.length === 0) {
    return { success: false, error: 'Illustration not found or update failed.' }
  }

  revalidatePath('/admin/illustration')
  revalidatePath('/[locale]/(public)/illustration', 'layout')
  return { success: true }
}

export async function deleteIllustrationWork(id: string) {
  const supabaseAdmin = await getAuthorizedAdminClient()

  const { data: existingData } = await supabaseAdmin
    .from('illustration_works')
    .select('url')
    .eq('id', id)
    .single()

  const { error } = await supabaseAdmin
    .from('illustration_works')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Delete Error:', error)
    return { success: false, error: error.message }
  }

  if (existingData?.url) {
    await deleteCloudinaryImage(existingData.url)
  }

  revalidatePath('/admin/illustration')
  revalidatePath('/[locale]/(public)/illustration', 'layout')
  return { success: true }
}

export async function toggleIllustrationActive(id: string, isActive: boolean) {
  const supabaseAdmin = await getAuthorizedAdminClient()
  const { error } = await supabaseAdmin
    .from('illustration_works')
    .update({ is_active: isActive })
    .eq('id', id)

  if (error) {
    console.error('Toggle Active Error:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/illustration')
  revalidatePath('/[locale]/(public)/illustration', 'layout')
  return { success: true }
}

export async function updateIllustrationOrder(
  items: { id: string; order_index: number }[]
) {
  const supabaseAdmin = await getAuthorizedAdminClient()

  const updates = items.map((item) =>
    supabaseAdmin
      .from('illustration_works')
      .update({ order_index: item.order_index })
      .eq('id', item.id)
  )

  const results = await Promise.all(updates)
  const errors = results.filter((r) => r.error)

  if (errors.length > 0) {
    console.error('Batch Update Errors:', errors)
    return { success: false, error: 'Some updates failed' }
  }

  revalidatePath('/admin/illustration')
  revalidatePath('/[locale]/(public)/illustration', 'layout')
  return { success: true }
}

export async function getIllustrationWorksAction(year: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('illustration_works')
    .select('*')
    .select('*')
    .eq('year', year)
    .order('order_index', { ascending: true })

  return data || []
}

export async function getIllustrationYearsAction() {
  const supabase = await createClient()
  const { data } = await supabase.rpc('get_distinct_years')
  return (data || []).map((item: { year: string }) => item.year)
}
