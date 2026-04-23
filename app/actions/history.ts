'use server'

import { revalidatePath } from 'next/cache'
import { createClient, requireAdminUser } from '@/lib/supabase/server'

interface ActionResult {
  success: boolean
  error?: string
}

const HISTORY_BUCKET = 'gallery'

function extractStoragePath(publicUrl: string) {
  const bucketUrlPart = `/storage/v1/object/public/${HISTORY_BUCKET}/`
  const pathIndex = publicUrl.indexOf(bucketUrlPart)

  if (pathIndex === -1) {
    return null
  }

  return publicUrl.substring(pathIndex + bucketUrlPart.length)
}

async function uploadHistoryImage(file: File, folder: 'founders' | 'presidents') {
  const supabase = createClient()
  const fileExt = file.name.split('.').pop() ?? 'bin'
  const fileName = `${folder}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}.${fileExt}`
  const filePath = `history/${folder}/${fileName}`

  const { error: uploadError } = await supabase.storage
    .from(HISTORY_BUCKET)
    .upload(filePath, file)

  if (uploadError) {
    throw new Error(`Upload failed: ${uploadError.message}`)
  }

  const { data: publicUrlData } = supabase.storage.from(HISTORY_BUCKET).getPublicUrl(filePath)
  return publicUrlData.publicUrl
}

async function deleteHistoryImage(publicUrl: string | null | undefined) {
  if (!publicUrl) {
    return
  }

  const filePath = extractStoragePath(publicUrl)

  if (!filePath) {
    return
  }

  const supabase = createClient()
  const { error } = await supabase.storage.from(HISTORY_BUCKET).remove([filePath])

  if (error) {
    console.error('Failed to delete history image from storage', error)
  }
}

function revalidateHistoryPaths() {
  revalidatePath('/admin/histoire')
  revalidatePath('/fr/histoire')
  revalidatePath('/en/histoire')
}

// ─── TIMELINE EVENTS ────────────────────────────────────────────────────────

export async function createTimelineEvent(formData: FormData): Promise<ActionResult> {
  try {
    await requireAdminUser()
    const supabase = createClient()

    const { error } = await supabase.from('timeline_events').insert({
      period: (formData.get('period') as string).trim(),
      title_fr: (formData.get('title_fr') as string).trim(),
      title_en: ((formData.get('title_en') as string) || '').trim() || null,
      description_fr: (formData.get('description_fr') as string).trim(),
      description_en: ((formData.get('description_en') as string) || '').trim() || null,
      color: (formData.get('color') as string) || 'green',
      sort_order: parseInt((formData.get('sort_order') as string) || '0', 10)
    })

    if (error) throw new Error(error.message)
    revalidateHistoryPaths()
    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Erreur inattendue' }
  }
}

export async function updateTimelineEvent(id: string, formData: FormData): Promise<ActionResult> {
  try {
    await requireAdminUser()
    const supabase = createClient()

    const { error } = await supabase.from('timeline_events').update({
      period: (formData.get('period') as string).trim(),
      title_fr: (formData.get('title_fr') as string).trim(),
      title_en: ((formData.get('title_en') as string) || '').trim() || null,
      description_fr: (formData.get('description_fr') as string).trim(),
      description_en: ((formData.get('description_en') as string) || '').trim() || null,
      color: (formData.get('color') as string) || 'green',
      sort_order: parseInt((formData.get('sort_order') as string) || '0', 10)
    }).eq('id', id)

    if (error) throw new Error(error.message)
    revalidateHistoryPaths()
    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Erreur inattendue' }
  }
}

export async function deleteTimelineEvent(id: string): Promise<void> {
  await requireAdminUser()
  const supabase = createClient()
  const { error } = await supabase.from('timeline_events').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidateHistoryPaths()
}

// ─── FOUNDERS ───────────────────────────────────────────────────────────────

export async function createFounder(formData: FormData): Promise<ActionResult> {
  try {
    await requireAdminUser()
    const supabase = createClient()
    const image = formData.get('image')
    let imageUrl: string | null = null

    if (image instanceof File && image.size > 0) {
      imageUrl = await uploadHistoryImage(image, 'founders')
    }

    const { error } = await supabase.from('founders').insert({
      full_name: (formData.get('full_name') as string).trim(),
      role_fr: ((formData.get('role_fr') as string) || '').trim() || null,
      role_en: ((formData.get('role_en') as string) || '').trim() || null,
      image_url: imageUrl,
      in_memoriam: formData.get('in_memoriam') === 'true',
      sort_order: parseInt((formData.get('sort_order') as string) || '0', 10)
    })

    if (error) {
      await deleteHistoryImage(imageUrl)
      throw new Error(error.message)
    }
    revalidateHistoryPaths()
    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Erreur inattendue' }
  }
}

export async function updateFounder(id: string, formData: FormData): Promise<ActionResult> {
  try {
    await requireAdminUser()
    const supabase = createClient()
    const existingFounder = await supabase
      .from('founders')
      .select('image_url')
      .eq('id', id)
      .single()

    if (existingFounder.error) {
      throw new Error(existingFounder.error.message)
    }

    const previousImageUrl = existingFounder.data.image_url
    const removeImage = formData.get('remove_image') === 'true'
    const image = formData.get('image')
    let nextImageUrl = previousImageUrl

    if (image instanceof File && image.size > 0) {
      nextImageUrl = await uploadHistoryImage(image, 'founders')
    } else if (removeImage) {
      nextImageUrl = null
    }

    const { error } = await supabase.from('founders').update({
      full_name: (formData.get('full_name') as string).trim(),
      role_fr: ((formData.get('role_fr') as string) || '').trim() || null,
      role_en: ((formData.get('role_en') as string) || '').trim() || null,
      image_url: nextImageUrl,
      in_memoriam: formData.get('in_memoriam') === 'true',
      sort_order: parseInt((formData.get('sort_order') as string) || '0', 10)
    }).eq('id', id)

    if (error) {
      if (nextImageUrl && nextImageUrl !== previousImageUrl) {
        await deleteHistoryImage(nextImageUrl)
      }
      throw new Error(error.message)
    }

    if (nextImageUrl !== previousImageUrl) {
      await deleteHistoryImage(previousImageUrl)
    }
    revalidateHistoryPaths()
    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Erreur inattendue' }
  }
}

export async function deleteFounder(id: string): Promise<void> {
  await requireAdminUser()
  const supabase = createClient()
  const existingFounder = await supabase
    .from('founders')
    .select('image_url')
    .eq('id', id)
    .single()
  const { error } = await supabase.from('founders').delete().eq('id', id)
  if (error) throw new Error(error.message)
  await deleteHistoryImage(existingFounder.data?.image_url)
  revalidateHistoryPaths()
}

// ─── PRESIDENTS ─────────────────────────────────────────────────────────────

export async function createPresident(formData: FormData): Promise<ActionResult> {
  try {
    await requireAdminUser()
    const supabase = createClient()
    const image = formData.get('image')
    let imageUrl: string | null = null

    if (image instanceof File && image.size > 0) {
      imageUrl = await uploadHistoryImage(image, 'presidents')
    }

    const { error } = await supabase.from('presidents').insert({
      full_name: (formData.get('full_name') as string).trim(),
      year_start: parseInt(formData.get('year_start') as string, 10),
      year_end: formData.get('year_end') ? parseInt(formData.get('year_end') as string, 10) : null,
      city: ((formData.get('city') as string) || '').trim() || null,
      image_url: imageUrl,
      sort_order: parseInt((formData.get('sort_order') as string) || '0', 10)
    })

    if (error) {
      await deleteHistoryImage(imageUrl)
      throw new Error(error.message)
    }
    revalidateHistoryPaths()
    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Erreur inattendue' }
  }
}

export async function updatePresident(id: string, formData: FormData): Promise<ActionResult> {
  try {
    await requireAdminUser()
    const supabase = createClient()
    const existingPresident = await supabase
      .from('presidents')
      .select('image_url')
      .eq('id', id)
      .single()

    if (existingPresident.error) {
      throw new Error(existingPresident.error.message)
    }

    const previousImageUrl = existingPresident.data.image_url
    const removeImage = formData.get('remove_image') === 'true'
    const image = formData.get('image')
    let nextImageUrl = previousImageUrl

    if (image instanceof File && image.size > 0) {
      nextImageUrl = await uploadHistoryImage(image, 'presidents')
    } else if (removeImage) {
      nextImageUrl = null
    }

    const { error } = await supabase.from('presidents').update({
      full_name: (formData.get('full_name') as string).trim(),
      year_start: parseInt(formData.get('year_start') as string, 10),
      year_end: formData.get('year_end') ? parseInt(formData.get('year_end') as string, 10) : null,
      city: ((formData.get('city') as string) || '').trim() || null,
      image_url: nextImageUrl,
      sort_order: parseInt((formData.get('sort_order') as string) || '0', 10)
    }).eq('id', id)

    if (error) {
      if (nextImageUrl && nextImageUrl !== previousImageUrl) {
        await deleteHistoryImage(nextImageUrl)
      }
      throw new Error(error.message)
    }

    if (nextImageUrl !== previousImageUrl) {
      await deleteHistoryImage(previousImageUrl)
    }
    revalidateHistoryPaths()
    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Erreur inattendue' }
  }
}

export async function deletePresident(id: string): Promise<void> {
  await requireAdminUser()
  const supabase = createClient()
  const existingPresident = await supabase
    .from('presidents')
    .select('image_url')
    .eq('id', id)
    .single()
  const { error } = await supabase.from('presidents').delete().eq('id', id)
  if (error) throw new Error(error.message)
  await deleteHistoryImage(existingPresident.data?.image_url)
  revalidateHistoryPaths()
}
