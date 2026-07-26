'use server'

import { revalidatePath } from 'next/cache'

import cloudinary, { deleteCloudinaryImage } from '@/lib/cloudinary'
import { createClient } from '@/utils/supabase/server'

import { getAuthorizedAdminClient } from '../common'

import type { Tables, TablesInsert, TablesUpdate } from '@/types/database.types'

function revalidateWebtoon(id?: string) {
  if (id) revalidatePath(`/admin/webtoon/${id}`)
  revalidatePath('/admin/webtoon')
  revalidatePath('/[locale]/(public)/manga', 'layout')
}

export async function createWebtoon(formData: FormData) {
  const supabase = await getAuthorizedAdminClient()
  const title_zh = formData.get('title_zh') as string
  const title_en = formData.get('title_en') as string
  const summary_zh = formData.get('summary_zh') as string
  const summary_en = formData.get('summary_en') as string
  const external_url = formData.get('external_url') as string
  const file = formData.get('cover') as File

  if (!file || !external_url) {
    throw new Error('Missing required fields')
  }

  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  const uploadResult = await new Promise<any>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder: 'indiewolf/webtoon' }, (error, result) => {
        if (error) reject(error)
        else resolve(result)
      })
      .end(buffer)
  })

  const insertData: TablesInsert<'webtoon_works'> = {
    cover_url: uploadResult.secure_url,
    title_zh: title_zh || '',
    title_en: title_en || '',
    summary_zh: summary_zh || '',
    summary_en: summary_en || '',
    external_url,
    width: uploadResult.width,
    height: uploadResult.height,
    order_index: 0,
  }
  const { error } = await supabase.from('webtoon_works').insert(insertData)

  if (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to create webtoon')
  }

  revalidateWebtoon()
  return { success: true }
}

export async function getWebtoonsAction(): Promise<Tables<'webtoon_works'>[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('webtoon_works')
    .select('*')
    .order('order_index', { ascending: true })

  return (data || []) as Tables<'webtoon_works'>[]
}

export async function getWebtoonDetail(
  id: string
): Promise<Tables<'webtoon_works'> | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('webtoon_works')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Fetch Webtoon Detail Error:', error)
    return null
  }

  return data as Tables<'webtoon_works'>
}

export async function updateWebtoonDetail(id: string, formData: FormData) {
  const supabase = await getAuthorizedAdminClient()

  const external_url = ((formData.get('external_url') as string) || '').trim()
  if (!external_url) {
    return { success: false, error: '外部連結為必填' }
  }

  const updateData: TablesUpdate<'webtoon_works'> = {
    title_zh: formData.get('title_zh') as string,
    title_en: formData.get('title_en') as string,
    summary_zh: formData.get('summary_zh') as string,
    summary_en: formData.get('summary_en') as string,
    external_url,
  }
  const { error } = await supabase
    .from('webtoon_works')
    .update(updateData)
    .eq('id', id)

  if (error) {
    console.error('Update Webtoon Detail Error:', error)
    return { success: false, error: error.message }
  }

  revalidateWebtoon(id)
  return { success: true }
}

export async function updateWebtoonCover(id: string, formData: FormData) {
  const supabase = await getAuthorizedAdminClient()
  const file = formData.get('cover') as File

  if (!file) {
    return { success: false, error: 'No file provided' }
  }

  try {
    const { data: oldWork } = await supabase
      .from('webtoon_works')
      .select('cover_url')
      .eq('id', id)
      .single()

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const uploadResult = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: 'indiewolf/webtoon' }, (error, result) => {
          if (error) reject(error)
          else resolve(result)
        })
        .end(buffer)
    })

    const { error } = await supabase
      .from('webtoon_works')
      .update({
        cover_url: uploadResult.secure_url,
        width: uploadResult.width,
        height: uploadResult.height,
      })
      .eq('id', id)

    if (error) {
      console.error('Update Webtoon Cover Error:', error)
      return { success: false, error: error.message }
    }

    if (oldWork?.cover_url) {
      await deleteCloudinaryImage(oldWork.cover_url)
    }

    revalidateWebtoon(id)
    return { success: true }
  } catch (error) {
    console.error('Update Webtoon Cover Error:', error)
    return { success: false, error: 'Upload failed' }
  }
}

export async function toggleWebtoonActive(id: string, isActive: boolean) {
  const supabase = await getAuthorizedAdminClient()
  const { error } = await supabase
    .from('webtoon_works')
    .update({ is_active: isActive })
    .eq('id', id)

  if (error) {
    console.error('Toggle Active Error:', error)
    return { success: false, error: error.message }
  }

  revalidateWebtoon()
  return { success: true }
}

export async function deleteWebtoonWork(id: string) {
  const supabaseAdmin = await getAuthorizedAdminClient()

  const { data: work } = await supabaseAdmin
    .from('webtoon_works')
    .select('cover_url')
    .eq('id', id)
    .single()

  const { error } = await supabaseAdmin
    .from('webtoon_works')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Delete Error:', error)
    return { success: false, error: error.message }
  }

  if (work?.cover_url) {
    await deleteCloudinaryImage(work.cover_url)
  }

  revalidateWebtoon()
  return { success: true }
}

export async function updateWebtoonOrder(
  items: { id: string; order_index: number }[]
) {
  const supabaseAdmin = await getAuthorizedAdminClient()

  const updates = items.map((item) =>
    supabaseAdmin
      .from('webtoon_works')
      .update({ order_index: item.order_index })
      .eq('id', item.id)
  )

  const results = await Promise.all(updates)
  const errors = results.filter((r) => r.error)

  if (errors.length > 0) {
    console.error('Batch Update Errors:', errors)
    return { success: false, error: 'Some updates failed' }
  }

  revalidateWebtoon()
  return { success: true }
}
