'use server'

import { revalidatePath } from 'next/cache'
import cloudinary from '@/lib/cloudinary'
import { createClient } from '@/utils/supabase/server'
import { getAuthorizedAdminClient } from '../common'
import { syncIllustrationNav } from '@/utils/supabase/sync-nav'
import type { TablesInsert, TablesUpdate } from '@/types/database.types'

export async function createIllustration(formData: FormData) {
  const supabase = await getAuthorizedAdminClient()
  const year = formData.get('year') as string
  const alt = formData.get('alt') as string
  const file = formData.get('image') as File

  if (!file || !year) {
    throw new Error('Missing required fields')
  }

  // Upload to Cloudinary
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  const uploadResult = await new Promise<any>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder: 'illustration' }, (error, result) => {
        if (error) reject(error)
        else resolve(result)
      })
      .end(buffer)
  })

  // Insert into Supabase
  const insertData: TablesInsert<'illustration_works'> = {
    url: uploadResult.secure_url,
    alt: alt || '',
    year,
    width: uploadResult.width,
    height: uploadResult.height,
    order_index: 0
  }
  const { error } = await supabase.from('illustration_works').insert(insertData)

  if (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to create illustration')
  }

  // 同步 nav items
  await syncIllustrationNav()

  revalidatePath('/admin/illustration')
  revalidatePath('/[locale]/illustration/[year]', 'page')
  return { success: true }
}

export async function updateIllustrationAlt(id: string, alt: string) {
  const supabaseAdmin = await getAuthorizedAdminClient()
  console.log(id, alt)
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
  revalidatePath('/[locale]/illustration/[year]', 'page')
  return { success: true }
}

export async function deleteIllustrationWork(id: string) {
  const supabaseAdmin = await getAuthorizedAdminClient()
  const { error } = await supabaseAdmin.from('illustration_works').delete().eq('id', id)

  if (error) {
    console.error('Delete Error:', error)
    return { success: false, error: error.message }
  }

  // 同步 nav items（因為刪除可能影響年份列表）
  await syncIllustrationNav()

  revalidatePath('/admin/illustration')
  revalidatePath('/[locale]/illustration/[year]', 'page')
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

  // 同步 nav items（切換 active 可能影響年份列表）
  await syncIllustrationNav()

  revalidatePath('/admin/illustration')
  revalidatePath('/[locale]/illustration/[year]', 'page')
  return { success: true }
}

export async function updateIllustrationOrder(items: { id: string; order_index: number }[]) {
  const supabaseAdmin = await getAuthorizedAdminClient()

  const updates = items.map(item =>
    supabaseAdmin
      .from('illustration_works')
      .update({ order_index: item.order_index })
      .eq('id', item.id)
  )

  const results = await Promise.all(updates)
  const errors = results.filter(r => r.error)

  if (errors.length > 0) {
    console.error('Batch Update Errors:', errors)
    return { success: false, error: 'Some updates failed' }
  }

  revalidatePath('/admin/illustration')
  revalidatePath('/[locale]/illustration/[year]', 'page')
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
