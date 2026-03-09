'use server'

import { revalidatePath } from 'next/cache'

import cloudinary, { deleteCloudinaryImage } from '@/lib/cloudinary'
import { createClient } from '@/utils/supabase/server'

import { getAuthorizedAdminClient } from '../common'

import type { Tables, TablesInsert, TablesUpdate } from '@/types/database.types'

export async function createManga(formData: FormData) {
  const supabase = await getAuthorizedAdminClient()
  const year = formData.get('year') as string
  const title_zh = formData.get('title_zh') as string
  const title_en = formData.get('title_en') as string
  const summary_zh = formData.get('summary_zh') as string
  const summary_en = formData.get('summary_en') as string
  const file = formData.get('cover') as File

  if (!file || !year) {
    throw new Error('Missing required fields')
  }

  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  const uploadResult = await new Promise<any>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder: 'indiewolf/manga' }, (error, result) => {
        if (error) reject(error)
        else resolve(result)
      })
      .end(buffer)
  })

  const insertData: TablesInsert<'manga_works'> = {
    cover_url: uploadResult.secure_url,
    title_zh: title_zh || '',
    title_en: title_en || '',
    summary_zh: summary_zh || '',
    summary_en: summary_en || '',
    year,
    width: uploadResult.width,
    height: uploadResult.height,
    order_index: 0,
    is_completed: false,
  }
  const { error } = await supabase.from('manga_works').insert(insertData)

  if (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to create manga')
  }

  revalidatePath('/admin/manga')
  revalidatePath('/[locale]/(public)/manga', 'layout')
  return { success: true }
}

export async function deleteMangaWork(id: string) {
  const supabaseAdmin = await getAuthorizedAdminClient()

  const { data: manga } = await supabaseAdmin
    .from('manga_works')
    .select('cover_url')
    .eq('id', id)
    .single()

  const { data: images } = await supabaseAdmin
    .from('manga_images')
    .select('url')
    .eq('manga_id', id)

  const { error } = await supabaseAdmin
    .from('manga_works')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Delete Error:', error)
    return { success: false, error: error.message }
  }

  if (manga?.cover_url) {
    await deleteCloudinaryImage(manga.cover_url)
  }

  if (images && images.length > 0) {
    await Promise.all(images.map((img) => deleteCloudinaryImage(img.url)))
  }

  revalidatePath('/admin/manga')
  revalidatePath('/[locale]/(public)/manga', 'layout')
  return { success: true }
}

export async function toggleMangaActive(id: string, isActive: boolean) {
  const supabaseAdmin = await getAuthorizedAdminClient()
  const { error } = await supabaseAdmin
    .from('manga_works')
    .update({ is_active: isActive })
    .eq('id', id)

  if (error) {
    console.error('Toggle Active Error:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/manga')
  revalidatePath('/[locale]/(public)/manga', 'layout')
  return { success: true }
}

export async function updateMangaOrder(
  items: { id: string; order_index: number }[]
) {
  const supabaseAdmin = await getAuthorizedAdminClient()

  const updates = items.map((item) =>
    supabaseAdmin
      .from('manga_works')
      .update({ order_index: item.order_index })
      .eq('id', item.id)
  )

  const results = await Promise.all(updates)
  const errors = results.filter((r) => r.error)

  if (errors.length > 0) {
    console.error('Batch Update Errors:', errors)
    return { success: false, error: 'Some updates failed' }
  }

  revalidatePath('/admin/manga')
  revalidatePath('/[locale]/(public)/manga', 'layout')
  return { success: true }
}

export async function getMangaWorksAction(
  year: string
): Promise<Tables<'manga_works'>[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('manga_works')
    .select('*')
    .eq('year', year)
    .order('order_index', { ascending: true })

  return (data || []) as Tables<'manga_works'>[]
}

export async function getMangaWorksByStatusAction(
  isCompleted: boolean
): Promise<Tables<'manga_works'>[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('manga_works')
    .select('*')
    .eq('is_completed', isCompleted)
    .order('order_index', { ascending: true })

  return (data || []) as Tables<'manga_works'>[]
}

export async function getMangaYearsAction() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('manga_works')
    .select('year')
    .order('year', { ascending: false })

  const years = Array.from(
    new Set((data || []).map((item: { year: string }) => item.year))
  )
  return years.sort((a, b) => parseInt(b) - parseInt(a))
}

export async function getMangaDetail(id: string): Promise<
  | (Tables<'manga_works'> & {
      images: Tables<'manga_images'>[]
    })
  | null
> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('manga_works')
    .select(
      `
      *,
      images:manga_images(id, url, width, height, order_index, locale)
    `
    )
    .eq('id', id)
    .single()

  if (error) {
    console.error('Fetch Manga Detail Error:', error)
    return null
  }

  if (data.images) {
    data.images.sort((a: any, b: any) => a.order_index - b.order_index)
  }

  return data as Tables<'manga_works'> & {
    images: Tables<'manga_images'>[]
  }
}

export async function updateMangaDetail(id: string, formData: FormData) {
  const supabase = await getAuthorizedAdminClient()

  const title_zh = formData.get('title_zh') as string
  const title_en = formData.get('title_en') as string
  const summary_zh = formData.get('summary_zh') as string
  const summary_en = formData.get('summary_en') as string
  const year = formData.get('year') as string
  const is_completed = formData.get('is_completed') === 'true'

  const updateData: TablesUpdate<'manga_works'> = {
    title_zh,
    title_en,
    summary_zh,
    summary_en,
    year,
    is_completed,
  }
  const { error } = await supabase
    .from('manga_works')
    .update(updateData)
    .eq('id', id)

  if (error) {
    console.error('Update Manga Detail Error:', error)
    return { success: false, error: error.message }
  }

  revalidatePath(`/admin/manga/${id}`)
  revalidatePath('/admin/manga')
  revalidatePath('/[locale]/(public)/manga', 'layout')
  return { success: true }
}

export async function uploadMangaImages(mangaId: string, formData: FormData) {
  const supabase = await getAuthorizedAdminClient()
  const locale = formData.get('locale') as string
  const files = formData.getAll('images') as File[]

  if (!files || files.length === 0) {
    return { success: false, error: 'No files provided' }
  }

  try {
    const results: any[] = []
    const CONCURRENCY = 3

    for (let i = 0; i < files.length; i += CONCURRENCY) {
      const batch = files.slice(i, i + CONCURRENCY)
      const batchPromises = batch.map(async (file) => {
        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        return new Promise<any>((resolve, reject) => {
          cloudinary.uploader
            .upload_stream({ folder: 'indiewolf/manga_pages' }, (error, result) => {
              if (error) reject(error)
              else resolve(result)
            })
            .end(buffer)
        })
      })

      const batchResults = await Promise.all(batchPromises)
      results.push(...batchResults)
    }

    // Get current max order_index
    const { data: maxOrderData } = await supabase
      .from('manga_images')
      .select('order_index')
      .eq('manga_id', mangaId)
      .order('order_index', { ascending: false })
      .limit(1)
      .single()

    const currentMaxOrder = maxOrderData?.order_index || 0

    const inserts: TablesInsert<'manga_images'>[] = results.map(
      (result, index) => ({
        manga_id: mangaId,
        url: result.secure_url,
        width: result.width,
        height: result.height,
        locale: locale || null,
        order_index: currentMaxOrder + index + 1,
      })
    )

    const { error } = await supabase.from('manga_images').insert(inserts)

    if (error) {
      console.error('Batch Insert Error:', error)
      return { success: false, error: error.message }
    }

    revalidatePath(`/admin/manga/${mangaId}`)
    revalidatePath('/[locale]/(public)/manga', 'layout')
    return { success: true }
  } catch (error) {
    console.error('Upload Error:', error)
    return { success: false, error: 'Failed to upload images' }
  }
}

export async function deleteMangaImage(id: string) {
  const supabase = await getAuthorizedAdminClient()

  const { data: existingImage } = await supabase
    .from('manga_images')
    .select('url')
    .eq('id', id)
    .single()

  const { error } = await supabase.from('manga_images').delete().eq('id', id)

  if (error) {
    return { success: false, error: error.message }
  }

  if (existingImage?.url) {
    await deleteCloudinaryImage(existingImage.url)
  }

  revalidatePath('/admin/manga')
  revalidatePath('/[locale]/(public)/manga', 'layout')
  return { success: true }
}

export async function updateMangaImagesOrder(
  items: { id: string; order_index: number }[]
) {
  const supabaseAdmin = await getAuthorizedAdminClient()

  const updates = items.map((item) =>
    supabaseAdmin
      .from('manga_images')
      .update({ order_index: item.order_index })
      .eq('id', item.id)
  )

  const results = await Promise.all(updates)
  const errors = results.filter((r) => r.error)

  if (errors.length > 0) {
    console.error('Batch Update Errors:', errors)
    return { success: false, error: 'Some updates failed' }
  }

  revalidatePath('/admin/manga')
  revalidatePath('/[locale]/(public)/manga', 'layout')
  return { success: true }
}

export async function updateMangaCover(id: string, formData: FormData) {
  const supabase = await getAuthorizedAdminClient()
  const file = formData.get('cover') as File

  if (!file) {
    return { success: false, error: 'No file provided' }
  }

  try {
    const { data: oldManga } = await supabase
      .from('manga_works')
      .select('cover_url')
      .eq('id', id)
      .single()

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const uploadResult = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: 'indiewolf/manga' }, (error, result) => {
          if (error) reject(error)
          else resolve(result)
        })
        .end(buffer)
    })

    const { error } = await supabase
      .from('manga_works')
      .update({
        cover_url: uploadResult.secure_url,
        width: uploadResult.width,
        height: uploadResult.height,
      })
      .eq('id', id)

    if (error) {
      console.error('Update Manga Cover Error:', error)
      return { success: false, error: error.message }
    }

    if (oldManga?.cover_url) {
      await deleteCloudinaryImage(oldManga.cover_url)
    }

    revalidatePath(`/admin/manga/${id}`)
    revalidatePath('/admin/manga')
    revalidatePath('/[locale]/(public)/manga', 'layout')
    return { success: true }
  } catch (error) {
    console.error('Upload manga cover error:', error)
    return { success: false, error: 'Failed to upload cover' }
  }
}
